var DemoManager = (function() {

    function handleFilter(evt) {
        var markerType = $(evt.currentTarget).data("type");
        markerCluster.clearMarkers();
        for (var i = 0; i < markers.length; i++) {

            if(markerType !== "all") {
                if(markers[i].color !== markerType) {
                    markers[i].setMap(null);
                } else {
                    markers[i].setMap(map);
                    markerCluster.addMarker(markers[i]);
                }
            } else {
                markers[i].setMap(map);
                markerCluster.addMarker(markers[i]);
            }
        }

    }

    function init(opts) {
        map = new google.maps.Map(document.getElementById('map'), {
            center: new google.maps.LatLng(40.6331,-89.3985),
            zoom: 7
        });

        // Create random points
        for (var locale in coords) {
            var iterations = Math.floor(Math.random() * (25 - 14 + 1)) + 14;

            for(var i = 0; i < iterations; i++) {
                var color = Math.floor(Math.random() * (icons.length));
                var lat = coords[locale].lat.min + (Math.random() * (coords[locale].lat.max - coords[locale].lat.min));
                var long = coords[locale].long.min + (Math.random() * (coords[locale].long.max - coords[locale].long.min));

                locations.push({
                    position: {
                        lat: lat,
                        lng: long,
                    },
                    color: color
                });
            }
        }

        markers = locations.map(function(location, i) {
            return new google.maps.Marker({
                position: location.position,
                icon: icons[location.color],
                map: map,
                color: location.color
            });
        });

        markerCluster = new MarkerClusterer(map, markers,
            {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});

        $('body').on('click touch','.filter',handleFilter.bind(this));
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
        coords = {
            champaign: {
                lat: {
                    max: 40.150243,
                    min: 40.060961
                },
                long: {
                    max: -88.192062,
                    min: -88.289566
                }
            },
            bloomington: {
                lat: {
                    max: 40.539602,
                    min: 40.437247
                },
                long: {
                    max: -88.925400,
                    min: -89.035263
                }
            },
            peoria: {
                lat: {
                    max: 40.825988,
                    min: 40.531252
                },
                long: {
                    max: -89.542007,
                    min: -89.666977
                }
            },
            springfield: {
                lat: {
                    max: 39.859912,
                    min: 39.707946
                },
                long: {
                    max: -89.579086,
                    min: -89.719162
                }
            },
            state: {
                lat: {
                    max: 40.870949,
                    min: 39.018117
                },
                long: {
                    max: -87.868652,
                    min: -90.109863
                }
            }
        },

        locations = [],

        publicAPI = {
            init:init
        };

    return publicAPI;
})();

$(window).on('load',function(){
    DemoManager.init();
});
