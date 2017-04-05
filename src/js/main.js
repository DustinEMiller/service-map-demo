var DemoManager = (function() {

    function handleType(evt) {
        currentType = this.value;
        markerCluster.clearMarkers();
        for (var i = 0; i < markers.length; i++) {

            if(currentType !== "all") {
                if(markers[i].type !== currentType) {
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
        fillSpecialty(this.value);
    }

    function handleSpecialty(evt) {
        var markerType = this.value;
        markerCluster.clearMarkers();
        for (var i = 0; i < markers.length; i++) {

            if(markerType !== "all") {
                if(markers[i].specialty !== markerType) {
                    markers[i].setMap(null);
                } else {
                    markers[i].setMap(map);
                    markerCluster.addMarker(markers[i]);
                }
            } else {
                if(markers[i].type !== currentType) {
                    markers[i].setMap(null);
                } else {
                    markers[i].setMap(map);
                    markerCluster.addMarker(markers[i]);
                }
            }
        }
    }

    function randomProperty(obj) {
        var keys = Object.keys(obj);
        return keys[keys.length * Math.random() << 0];
    }

    function createPoints() {
        for (var locale in coords) {
            var iterations = Math.floor(Math.random() * (coords[locale].max - coords[locale].min + 1)) + coords[locale].min;

            for(var i = 0; i < iterations; i++) {
                var color = Math.floor(Math.random() * (icons.length));
                var thisType = randomProperty(type);
                var thisSpecialty = randomProperty(type[thisType].specialty);
                var lat = coords[locale].lat.min + (Math.random() * (coords[locale].lat.max - coords[locale].lat.min));
                var long = coords[locale].long.min + (Math.random() * (coords[locale].long.max - coords[locale].long.min));

                locations.push({
                    type: thisType,
                    specialty: thisSpecialty,
                    position: {
                        lat: lat,
                        lng: long,
                    }
                });
            }
        }

        markers = locations.map(function(location, i) {
            return new google.maps.Marker({
                position: location.position,
                icon: type[location.type].specialty[location.specialty].icon,
                map: map,
                title: type[location.type].specialty[location.specialty].text,
                type: location.type,
                specialty: location.specialty
            });
        });

    }

    function fillType() {
        for (var option in type) { 
            $('#type').append($('<option/>', { 
                value: option,
                text : type[option].text 
            }));        
        }  
    }

    function fillSpecialty(value) {
        $('#specialty').children('option:not(:first)').remove();

        if(value === 'all') {
            for(var specialty in type) { 
                for(var option in type[specialty].specialty) {
                    $('#specialty').append($('<option/>', { 
                        value: option,
                        text : type[specialty].specialty[option].text
                    })); 
                }       
            }  
        } else {
            for (var opt in type[value].specialty) { 
                console.log(opt);
                $('#specialty').append($('<option/>', { 
                    value: opt,
                    text : type[value].specialty[opt].text 
                }));        
            }     
        }
         
    }

    function init(opts) {
        map = new google.maps.Map(document.getElementById('map'), {
            center: new google.maps.LatLng(40.6331,-89.3985),
            zoom: 7
        });


        fillType();
        createPoints();
        fillSpecialty('all');

        markerCluster = new MarkerClusterer(map, markers,
            {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});

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
        currentType,
        coords = {
            champaign: {
                min: 80,
                max: 170,
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
                min: 50,
                max: 140,
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
                min: 100,
                max: 180,
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
                min: 150,
                max: 200,
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
                min: 120,
                max: 200,
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

        type = {
            facility: {
                text: "Facility/Center/Clinic",
                specialty: {
                    affiliated_hospital: {
                        text: "Affiliated Hospitals",
                        icon: iconBase + 'hospital.png'
                    },
                    ambulance: {
                        text: "Ambulance",
                        icon: iconBase + 'ambulance.png'
                    },
                    audiology: {
                        text: "Audiology",
                        icon: iconBase + 'audiology.png'
                    },
                    transportation: {
                        text: "Transportation",
                        icon: iconBase + 'transportation.png'
                    }
                }
            },
            behavioral: {
                text: "Behavioral",
                specialty: {
                    addictions_counselor: {
                        text: "Addictions Counselor",
                        icon: iconBase + 'addictions_counselor.png'
                    },
                    mental_health: {
                        text: "Mental Health",
                        icon: iconBase + 'mental_health.png'
                    },
                    psychology: {
                        text:"Psychology",
                        icon: iconBase + 'psychology.png'
                    }
                } 
            },
            physicianpc: {
                text: "Physician (Primary Care)",
                specialty: {
                    family_practice: {
                        text: "Family Practice",
                        icon: iconBase + 'family_practice.png'
                    },
                    general_practice: {
                        text: "General Practice",
                        icon: iconBase + 'general_practice.png'
                    },
                    pediatrics: {
                        text:"Pediatrics",
                        icon: iconBase + 'pediatrics.png'
                    },
                    pharmacist: {
                        text:"Pharmacist",
                        icon: iconBase + 'pharmacy.png'
                    }
                }    
            },
            physicians: {
                text: "Physician (Specialty)",
                specialty: {
                    cardiology: {
                        text: "Cardiology",
                        icon: iconBase + 'cardiology.png'
                    },
                    opthalmology: {
                        text:"Opthalmology",
                        icon: iconBase + 'ophthalmologist.png'
                    },
                    oral_surgery: {
                        text: "Oral Surgery",
                        icon: iconBase + 'dentist.png'
                    },
                    sports_medicine: {
                        text:"Sports Medicine",
                        icon: iconBase + 'sports_medicine.png'
                    }
                }    
            }  
        }

        publicAPI = {
            init:init
        };

    return publicAPI;
})();

$(window).on('load',function(){
    DemoManager.init();
});
