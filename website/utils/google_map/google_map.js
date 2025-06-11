/*
 * Copyright (C) 2018-2021 LEIDOS.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */

/***
 This file shall contain Map related functions.
****/


$(document).ready(()=>{
    initMap();
});

// Updated initMap function to handle async API loading
function initMap()
{
    map_frame = document.createElement("iframe");
    map_frame.setAttribute('style',"width: 100%; height: 100%; border:0px; border-bottom-left-radius:10px;border-bottom-right-radius:10px; ");

    map_frame.onload = async function()
    {
        map_doc = map_frame.contentDocument;
        map_content_window = map_frame.contentWindow;

        map_content_window.showNewMap = function()
        {
            var mapContainer =  map_doc.createElement('div');
            mapContainer.setAttribute('style',"width: 100%; height: 100%");
            map_doc.body.setAttribute('style',"width: 100%; height: 100%; padding:0px;margin:0px");
            map_doc.body.appendChild(mapContainer);

            map = new this.google.maps.Map(mapContainer, {
                zoom: 17,
                center: { lat: 38.955097, lng: -77.147190 },
                mapTypeId: 'hybrid',
                disableDefaultUI: true,
                zoomControl: true,
                zoomControlOptions: {
                    position: this.google.maps.ControlPosition.LEFT_CENTER
                    },
                scaleControl: true,
                mapTypeControl: true,
                fullscreenControl: true
            });

            if (sessionStorage.getItem('mapMarkers') != null)
                markers =  sessionStorage.getItem('mapMarkers');

            // Display the route on the map.
            setRouteMap(map);

            // Set the markers for the vehicle(s).
            setHostMarker();
        }
        //reference: http://jsfiddle.net/gS7sZ/1/
        var script = document.createElement('script');

        // Load API key first
        try {
            const api = await loadApiKey();
            script.type = 'text/javascript';
            script.src = `https://maps.googleapis.com/maps/api/js?key=${api}&callback=showNewMap`;
            map_frame.contentDocument.getElementsByTagName('head')[0].appendChild(script);
        } catch (error) {
            console.error('Failed to initialize map:', error);
        }
    };
    document.getElementById('load-map').appendChild(map_frame);
}

// Load API key from environment file
async function loadApiKey() {
    try {
        const apiKey = await getApiKey();
        if (!apiKey || apiKey === 'ERROR_API_KEY') {
            throw new Error('Invalid or missing Google Maps API key');
        }
        console.log('Google Maps API key loaded successfully');
        return apiKey;
    } catch (error) {
        console.error('Failed to load API key:', error);
        throw error;
    }
}

// Get API key from configuration
async function getApiKey() {
    // Try to fetch the env file via HTTP (for browser environment)
    try {
        const response = await fetch('/google_map_api_key.env');
        if (response.ok) {
            const content = await response.text();
            const lines = content.split('\n');
            for (const line of lines) {
                const trimmed = line.trim();
                if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
                    const [key, ...valueParts] = trimmed.split('=');
                    if (key.trim() === 'GOOGLE_MAPS_API_KEY' && valueParts.length > 0) {
                        const apiKey = valueParts.join('=').replace(/^(["'])|(["'])$/g, '');
                        console.log('API key loaded from env file');
                        return apiKey.trim();
                    }
                }
            }
        }
    } catch (error) {
        console.warn('Could not fetch env file via HTTP:', error.message);
    }

    // Check window object for client-side config
    if (typeof window !== 'undefined' && window.GOOGLE_MAPS_API_KEY) {
        console.log('API key loaded from window object');
        return window.GOOGLE_MAPS_API_KEY;
    }

    // Check for global config object
    if (typeof APP_CONFIG !== 'undefined' && APP_CONFIG.GOOGLE_MAPS_API_KEY) {
        console.log('API key loaded from APP_CONFIG');
        return APP_CONFIG.GOOGLE_MAPS_API_KEY;
    }

    console.error('GOOGLE_MAPS_API_KEY not found in any accessible location');
    return 'ERROR_API_KEY';
}

/*
    Draws the route on the map.
*/
function setRouteMap(map){

        //Get the saved route.
        //Parse and loop through the waypoints to get the coordinates.
        var routePlanCoordinates = sessionStorage.getItem('routePlanCoordinates');
        routePlanCoordinates = JSON.parse(routePlanCoordinates);

        if (sessionStorage.getItem('routePlanCoordinates') == null)
        {
            return;
        };

        //Maps the selected route on the map.
        var routePath = new map_content_window.google.maps.Polyline({
          path: routePlanCoordinates,
          geodesic: true,
          strokeColor: '#6495ed', // cornflowerblue
          strokeOpacity: 1.0,
          strokeWeight: 2
        });

        routePath.setMap(map);
}

/*
    Maps the initial DUMMY position of the host vehicle.
*/
function setHostMarker() {

    //Add host vehicle
    var marker = new map_content_window.google.maps.Marker({
        id: 'mHostVehicle',
        position: { lat: 38.95647, lng: -77.15031 },
        map: map,
        icon: 'http://www.google.com/mapfiles/markerH.png',
        title: 'Host Vehicle',
        zIndex: 1
    });

    hostmarker = marker;  //store instance of the host marker
    map.setCenter(hostmarker.getPosition());
}

/*
    To paint the pin a particular color.
*/
function pinSymbol(color) {
  return {
    path: 'M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z',
    fillColor: color,
    fillOpacity: 1,
    strokeColor: '#000',
    strokeWeight: 2,
    scale: 1
  };
}


/*
    Maps other CAV vehicles on the map.
*/
function setOtherVehicleMarkers(id, latitude, longitude) {

    if (markers == null || markers == 'undefined')
    {
         addMarkerForOtherVehicleWithTimeout(id, latitude, longitude, 3000);
         return;
    }

    var targetMarker = findMarker(markers, id);
    if  (targetMarker == null || targetMarker == 'undefined')
    {
        //Vehicle ID is not on the list of markers. Add to the map.
        addMarkerForOtherVehicleWithTimeout(id, latitude, longitude, 3000);
        return;
    }
    else{
        //Vehicle ID has been found. Update the location of the marker.
        moveMarkerWithTimeout(targetMarker, latitude, longitude, 3000);
        return;
    }

    //update markers
    sessionStorage.setItem('mapMarkers', JSON.stringify(markers));
}

/*
    Find and remove the marker from the Array greater than 3 seconds old.
*/
function removeExpiredMarkers(){
    setTimeout(function () {
        var dateNow = new Date();
        for (var i = 0; i < markers.length; i++) {
            if ( ((dateNow.getTime() - markers[i].dateTimeCreated.getTime())/1000) > 3) {
                //Remove the marker from Map
                markers[i].setMap(null);
                //Remove the marker from array.
                markers.splice(i, 1);
                return;
            }
        }
  }, 3000)//  ..  setTimeout()
}

/*
    Move a marker.
*/
function moveMarkerWithTimeout( myMarker, newLat, newLong, timeout) {

    window.setTimeout(function() {

        myMarker.setPosition(new map_content_window.google.maps.LatLng(newLat, newLong));

        if (myMarker.id == 'mHostVehicle')
        {
            //Center map based on the marker that's moving, for now it's the host vehicle.
            map.setCenter(myMarker.getPosition());
        }
    }, timeout); //END setTimeout
}


/***
 * Draw a polygon on the map based on list of geo positions and update map with the polygons
 * input array: vector_Geo_locations
  format:
    let vector_Geo_locations = [
        { lat: 38.954377 , lng: -77.147888},
        { lat: 38.955412, lng:  -77.151418},
        { lat: 38.956947, lng:  -77.150431},
        { lat: 38.955579, lng: -77.147448}
    ];

  */
    function drawPolygonsOnMap(polygon_type,vector_Geo_locations)
    {
        if(! Array.isArray(vector_Geo_locations) || vector_Geo_locations.length != 4)
        {
            console.error("vector_Geo_locations for polygon is not an array or vector_Geo_locations does not contains 4 geo-loc.")
            return;
        }

        if(polygon_type == g_polygon_type.TCR)
        {
            //remove exist tcr_polygon first
            if(tcr_polygon != null){
                tcr_polygon.setMap(null);
                tcr_polygon = null;
            }

            //TCR request bounding box on the google map
            contentStr = "<b>TCR bounding box</b><br> <li>Drawing polygon from position3D list in a clockwise direction.</li>"+
            "<li>Position3D list</li> - latitude:"+vector_Geo_locations[0].lat+", longitude:"+vector_Geo_locations[0].lng+" <br>"
            + "- latitude:"+vector_Geo_locations[1].lat+", longitude:"+vector_Geo_locations[1].lng+" <br>"
            + "- latitude:"+vector_Geo_locations[2].lat+", longitude:"+vector_Geo_locations[2].lng+" <br>"
            + "- latitude:"+vector_Geo_locations[3].lat+", longitude:"+vector_Geo_locations[3].lng+" <br>";
            tcr_polygon = new map_content_window.google.maps.Polygon({
                paths: vector_Geo_locations,
                strokeColor: "#000000",
                strokeOpacity: 1,
                strokeWeight: 2,
                fillColor: "#FFA500",
                fillOpacity: 0.3
            });
            let infoWindow = new map_content_window.google.maps.InfoWindow();

            tcr_polygon.setMap(map);

            tcr_polygon.addListener("click",(event)=>{
                infoWindow.setContent(contentStr);
                infoWindow.setPosition(event.latLng);
                infoWindow.open(map);
            });
        }

    }

/*
    Find a marker.
*/
function findMarker(allMarkers, idToFind)
{
  if (allMarkers == null)
    return;

  for(var i=0; i < allMarkers.length; i++){
        if(allMarkers[i].id == idToFind){
            return allMarkers[i];
        }
   }
}

/*
    Add a marker.
*/
function addMarkerForOtherVehicleWithTimeout(newId, newLat, newLong, timeout) {

    window.setTimeout(function() {

      if (markers == null)
        markers = new Array();

      markers.push(new map_content_window.google.maps.Marker({
        id: newId,
        position: new map_content_window.google.maps.LatLng(newLat, newLong),
        map: map,
        title: newId,
        dateTimeCreated: new Date(),
      }));

    }, timeout);
}

/*
    Add a plain marker.
*/
function addMarkerWithTimeout(position, timeout) {
    window.setTimeout(function() {
      markers.push(new map_content_window.google.maps.Marker({
        position: position,
        map: map,
      }));
    }, timeout);
}

/*
    Delete a marker.
*/
function deleteMarker(allMarkers, idToFind)
{
  for(var i=0; i<allMarkers.length; i++){
        if(allMarkers[i].id === idToFind){
            allMarkers[i].setMap(null);
            break;
        }
   }
}

/*
    Delete a marker by ID and removing from array
*/
function deleteMarker(id) {

    //Find and remove the marker from the Array
    for (var i = 0; i < markers.length; i++) {

        if (markers[i].id == id) {

            //Remove the marker from Map
            markers[i].setMap(null);

            //Remove the marker from array.
            markers.splice(i, 1);
            return;
        }
    }
};
