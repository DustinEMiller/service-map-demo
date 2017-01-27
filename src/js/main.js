var DemoManager = (function() {

    function init(opts) {
        map = new google.maps.Map(document.getElementById('map'), {
            center: new google.maps.LatLng(40.6331,-89.3985),
            zoom: 7
        });

        // Create random points
        for (var locale in coords) {
            var iterations = Math.floor(Math.random() * (25 - 14 + 1)) + 14;

            for(var i = 0; i < iterations; i++) {
                var color = Math.floor(Math.random() * (icons.length - 1));
                var lat = coords[locale].lat.min + (Math.random() * (coords[locale].lat.max - coords[locale].lat.min));
                var long = coords[locale].long.min + (Math.random() * (coords[locale].long.max - coords[locale].long.min));

                locations.push({
                    position: {
                        lat: lat,
                        lng: long,
                    },
                    color: color
                });
                console.log(locations);
            }
        }

        var markers = locations.map(function(location, i) {
            console.log(location);
            return new google.maps.Marker({
                position: location.position,
                icon: icons[location.color],
                map: map
            });
        });

        var markerCluster = new MarkerClusterer(map, markers,
            {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});
    }

    var
        iconBase = 'https://maps.google.com/mapfiles/kml/paddle/',
        icons = [
            iconBase + 'purple-circle-lv.png',
            iconBase + 'grn-circle-lv.png',
            iconBase + 'ylw-circle-lv.png',
            iconBase + 'red-circle-lv.png'
        ],
        map,
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
