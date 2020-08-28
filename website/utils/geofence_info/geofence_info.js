function createGeofenceInfo(speed_limit)
{
    let divPlatoonWrapper = document.createElement('div');
    divPlatoonWrapper.id='geofence_info_wrapper';

    let p_geofence_div = document.createElement('div');
    
    let p_geofence_speed_limit = document.createElement("p");
    p_geofence_speed_limit.innerHTML = "SPEED LIMIT: " + speed_limit;
    p_geofence_speed_limit.id = "geofence_speed_limit_id";
    p_geofence_div.append(p_geofence_speed_limit);


    divPlatoonWrapper.appendChild(p_geofence_div);
    return divPlatoonWrapper;
}

function updatePlatooningInfo(speed_limit)
{
   document.getElementById('geofence_speed_limit_id').innerHTML = speed_limit;
}

$(document).ready(function(){
    $('#geofence-info-content').append(createGeofenceInfo('N/A'));
});