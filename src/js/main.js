var DemoManager = (function() {

    function handleType(evt) {
        currentType = this.value;
        fillSpecialty(this.value);
        currentSpecialty = "all";
        markerCluster.clearMarkers();
        getProviders();
    }

    function handleSpecialty(evt) {
        currentSpecialty = this.value;
        markerCluster.clearMarkers();
        getProviders();
    }

    function createPoints(datas) {
        markers = datas.map(function(data, i) {
            var myLatlng = new google.maps.LatLng(parseFloat(data.lat), parseFloat(data.long));
            var icon = data.specialty.replace(/\//g,"_");
            icon = icon.replace(/ /g,"_");
            icon = icon.toLowerCase();
            var marker = new google.maps.Marker({
                position: myLatlng,
                title: data.full_name,
                type: data.provider_type,
                specialty: data.specialty,
                icon: 'img/'+icon+".png"
            });
            marker.addListener('mouseover', function() {
                infoPanel(this);
            });
            return marker;
        });
        markerCluster.addMarkers(markers);
    }

    function infoPanel(marker) {
        var template = Handlebars.compile($('#location').html());
        var context = {
            name: marker.title,
            type: marker.type,
            specialty: marker.specialty
        };
        $('#loc').html(template(context));
    }

    function populateDropdowns() {

        $.ajax({
            url: "https://askshirley.org/providers/typeDependency/pD5ltovTQHNvhP32e2zQ",
            dataType: 'text'
        }).always(function (datas, status, response) {
            if(response.status === 200) {
                var data = JSON.parse(datas);

                data['results'].forEach(function(column) {
                    if(type[column.type] === undefined) {
                        type[column.type] = new Array();
                    }

                    type[column.type].push(column.specialty);
                });
                fillType();
                fillSpecialty('all');
                getProviders();
            }
        });
    }

    function getProviders() {
        //var bounds = map.getBounds().toJSON();
        //"http://askshirley.local:8080/providers/markers/pD5ltovTQHNvhP32e2zQ/type/all/specialty/all/minlat/"+bounds.south+"/maxlat/"+bounds.north+"/minlong/"+bounds.west+"/maxlong/"+bounds.east,
        $.ajax({
            url: "https://askshirley.org/providers/markers/pD5ltovTQHNvhP32e2zQ",
            dataType: 'text',
            type: 'POST',
            data: {
                type: currentType,
                specialty: currentSpecialty,
                minlat: "all",
                maxlat: "all",
                minlong: "all",
                maxlong: "all"
            }
        }).always(function (datas, status, response) {
            if(response.status === 200) {
                var data = JSON.parse(datas);
                createPoints(data['results']);
            }
        });
    }

    function fillType() {
        for(var option in type) {
            $('#type').append($('<option/>', {
                value: option,
                text : option
            }));
        }
    }

    function fillSpecialty(value) {
        $('#specialty').children('option:not(:first)').remove();

        if(value === 'all') {
            for(var specialty in type) {

                for (i = 0; i < type[specialty].length; i++) {
                    $('#specialty').append($('<option/>', {
                        value: type[specialty][i],
                        text : type[specialty][i]
                    }));
                }
            }
        } else {
            for (i = 0; i < type[value].length; i++) {
                $('#specialty').append($('<option/>', {
                    value: type[value][i],
                    text : type[value][i]
                }));
            }
        }
    }

    function init(opts) {
        map = new google.maps.Map(document.getElementById('map'), {
            center: new google.maps.LatLng(40.1164,-88.2434),
            zoom: 8
        }, populateDropdowns());

        markerCluster = new MarkerClusterer(map, [], {
            imagePath: 'https://cdn.rawgit.com/googlemaps/js-marker-clusterer/gh-pages/images/m',
            maxZoom: 13
        });
        //google.maps.event.addListener(map, 'bounds_changed', function() {
            //getProviders();
        //});

        $('body').on('change','#type',handleType);
        $('body').on('change','#specialty',handleSpecialty);
    }

    var
        iconBase = 'img/',
        icons = [
            iconBase + 'ophthalmologist.png',
            iconBase + 'dentist.png',
            iconBase + 'lung.png',
            iconBase + 'hospital.png'
        ],
        map,
        markers,
        markerCluster,
        currentType = "all",
        currentSpecialty = "all",

        type = [];

        publicAPI = {
            init:init
        };

    return publicAPI;
})();

$(window).on('load',function(){
    DemoManager.init();
});
