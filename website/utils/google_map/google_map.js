/*
 * Copyright (C) 2018-2020 LEIDOS.
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
var map_frame = null;  //map iframe 
var map_content_window = null; //map iframe content window
var map_doc = null;

$(document).ready(()=>{
    initMap();
});

function initMap() 
{
    map_frame = document.createElement("iframe");
    map_frame.setAttribute('style',"width: 100%; height: 100%; border:0px; border-bottom-left-radius:10px;border-bottom-right-radius:10px; ");
   
    map_frame.onload = function() 
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
                zoom: 18,
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
        script.type = 'text/javascript';
        script.src = src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCMzV4biqVN0pf3l1lYVWQ4KSWLyoG6OV0&callback=showNewMap";
        
        map_frame.contentDocument.getElementsByTagName('head')[0].appendChild(script);
    };
    document.getElementById('load-map').appendChild(map_frame);
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
