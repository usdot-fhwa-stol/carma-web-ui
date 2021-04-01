
function createEventInfo(toHideEventInfo,event_min_gap,event_advisory_speed,event_type,event_reason,value,distance_to_next_geofence,headway)
{
    let divEventInfoWrapper = document.createElement('div');
    divEventInfoWrapper.id='event_info_wrapper';
    if(toHideEventInfo) 
        divEventInfoWrapper.style.display='none';

    let p_event_div = document.createElement('div');

    //Event Type
    let p_event_type = document.createElement("p");
    if(event_type != null)
    {
        p_event_type.innerHTML = "TYPE: " + event_type;
    }
    else
    {
        p_event_type.style.display = "none";
    }       
    p_event_type.id = "event_type_id";
    p_event_div.append(p_event_type);
    
    //Event Speed Advisory OR Max Speed
    let p_event_speed_advisory = document.createElement("p");
    if(event_advisory_speed != null)
        p_event_speed_advisory.innerHTML = "SPEED ADVISORY: " + event_advisory_speed + " MPH";
    else{
        p_event_speed_advisory.style.display = "none";
    } 
    p_event_speed_advisory.id = "event_speed_advisory_id";
    p_event_div.append(p_event_speed_advisory);

     //Event Headway
     let p_event_headway = document.createElement("p");
     if(headway != null)
        p_event_headway.innerHTML = "HEADWAY: " + headway + " METERS";
     else{
        p_event_headway.style.display = "none";
     } 
     p_event_headway.id = "event_headway_id";
     p_event_div.append(p_event_headway);

    //Event Min Gap
    let p_event_min_gap = document.createElement("p");
    if(event_min_gap != null)
        p_event_min_gap.innerHTML = "MIN GAP: " + event_min_gap + " METERS";
    else{
        p_event_min_gap.style.display = "none";
    } 
    p_event_min_gap.id = "event_min_gap_id";
    p_event_div.append(p_event_min_gap);


    //Event Reason
    let p_event_reason = document.createElement("p");
    p_event_reason.id = "event_reason_id";   
    if(event_reason != null)
        p_event_reason.innerHTML = "EVENT REASON: " + event_reason;
    else{
        p_event_reason.style.display = "none";
    } 

    p_event_div.append(p_event_reason);

    //Speed Limit
    let p_event_value = document.createElement("p");
    p_event_value.id = "event_value_id";
    if(value != null)
        p_event_value.innerHTML = "SPEED LIMIT: " + value;
    else{
        p_event_value.style.display = "none";
    } 
    p_event_div.append(p_event_value);

    //distance_to_next_geofence
    let p_event_distance_to_next_event = document.createElement("p");
    if(distance_to_next_geofence != null)
        p_event_distance_to_next_event.innerHTML = "DISTANCE TO NEXT GEOFENCE: "  + distance_to_next_geofence + "METERS";
    else{
        p_event_distance_to_next_event.style.display = "none";
    } 
    p_event_distance_to_next_event.id = "p_event_distance_to_next_event_id";
    p_event_div.append(p_event_distance_to_next_event);

    //
    divEventInfoWrapper.appendChild(p_event_div);

    return divEventInfoWrapper;
}

function updateEventInfo(toHideEventInfo,event_min_gap,event_advisory_speed,event_type,event_reason,value,distance_to_next_geofence,headway)
{    
    if(!toHideEventInfo)
    {
        if(event_type != null){
            document.getElementById('event_type_id').innerHTML = "TYPE: " + event_type;
            document.getElementById('event_type_id').style.display = "";
        }
        else{
            document.getElementById('event_type_id').style.display = "none";
        }

        if(event_reason != null){
            document.getElementById('event_reason_id').innerHTML = "EVENT REASON: " + event_reason;
            document.getElementById('event_reason_id').style.display = "";
        }
        else{
            document.getElementById('event_reason_id').style.display = "none";
        }

        if(event_advisory_speed != null){
            document.getElementById('event_speed_advisory_id').innerHTML =  "SPEED ADVISORY: " + event_advisory_speed + " MPH";
            document.getElementById('event_speed_advisory_id').style.display = "";
        }
        else{
            document.getElementById('event_speed_advisory_id').style.display = "none";
        }

        if(headway != null){
            document.getElementById('event_headway_id').innerHTML =  "HEADWAY: " + headway + " METERS";
            document.getElementById('event_headway_id').style.display = "";
        }
        else{
            document.getElementById('event_headway_id').style.display = "none";
        }

        if(event_min_gap != null){
            document.getElementById('event_min_gap_id').innerHTML = "MIN GAP: " + event_min_gap+ " METERS";
            document.getElementById('event_min_gap_id').style.display = "";

        }
        else{
            document.getElementById('event_min_gap_id').style.display = "none";
        }
        
        if(value != null){
            document.getElementById('event_value_id').innerHTML = "SPEED LIMIT: " + value;
            document.getElementById('event_value_id').style.display = "";
        }
        else{
            document.getElementById('event_value_id').style.display = "none";
        } 

        if(distance_to_next_geofence != null){
            document.getElementById('p_event_distance_to_next_event_id').style.display = "";
            document.getElementById('p_event_distance_to_next_event_id').innerHTML = "DISTANCE TO NEXT GEOFENCE: "  + distance_to_next_geofence + "METERS";
        }
        else{
            document.getElementById('p_event_distance_to_next_event_id').style.display = "none";
        } 
    }
    else
    {
        //clear the event panel content
        document.getElementById('event-info-content').innerHTML="";

        //hide the event panel
        document.getElementById('event-info-panel').style.display = 'none';
    }
}
