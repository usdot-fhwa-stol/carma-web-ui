function createGeofenceInfo(isActive,geofence_type,value,distance_to_next_geofence)
{
    let divPlatoonWrapper = document.createElement('div');
    divPlatoonWrapper.id='geofence_info_wrapper';

    let p_geofence_div = document.createElement('div');
    //Active status
    let p_geofence_status = document.createElement("p");
    p_geofence_status.innerHTML = "STATUS: " + (isActive? "Active": "InActive");
    p_geofence_status.id = "geofence_status_id";
    p_geofence_div.append(p_geofence_status);

    //Speed Limit
    let p_geofence_value = document.createElement("p");
    p_geofence_value.id = "geofence_value_id";
    p_geofence_div.append(p_geofence_value);

    //distance_to_next_geofence
    let p_geofence_distance_to_next_geofence = document.createElement("p");
    p_geofence_distance_to_next_geofence.innerHTML = "DISTANCE TO NEXT GEOFENCE: "  + distance_to_next_geofence;
    p_geofence_distance_to_next_geofence.id = "geofence_distance_to_next_geofence_id";
    p_geofence_div.append(p_geofence_distance_to_next_geofence);

    //
    divPlatoonWrapper.appendChild(p_geofence_div);
    return divPlatoonWrapper;
}

function updateGeofenceInfo(isActive,geofence_type,value,distance_to_next_geofence)
{    
    document.getElementById('geofence_status_id').innerHTML = "STATUS: " + (isActive? "Active": "Not Active");

    if(geofence_type == GEOFENCE_TYPE_SPEED_LIMIT && isActive)
        document.getElementById('geofence_value_id').innerHTML = "SPEED LIMIT: " + value  + " MPH";
    else if(geofence_type == GEOFENCE_TYPE_SPEED_LIMIT && !isActive) 
        document.getElementById('geofence_value_id').innerHTML = "SPEED LIMIT: " + "N/A";
    else if(geofence_type != GEOFENCE_TYPE_SPEED_LIMIT)
        document.getElementById('geofence_value_id').innerHTML = "";
        
    document.getElementById('geofence_distance_to_next_geofence_id').innerHTML = "DISTANCE TO NEXT GEOFENCE: "  + distance_to_next_geofence + " METERS";
}

$(document).ready(function(){
    $('#geofence-info-content').append(createGeofenceInfo(false,'N/A','N/A','N/A'));
});