/*
    script file for index.html
    dependencies: leaflet, jquery

    Open Street Maps tile layer URL template:
    http://{s}.tile.osm.org/{z}/{x}/{y}.png

    attribution:
    '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
*/

$(function() {
    function createMap(loc, zoom) {
        "use strict";
        var map = L.map('map').setView(loc, zoom);

        L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        L.circleMarker(loc).addTo(map);
    }

    //if there is a function called geolocation on the navigator object
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(pos) {
             createMap([pos.coords.latitude, pos.coords.longitude], 16);
        });
    } else {
        createMap([47.6097, -122.3331], 13);
    }
});