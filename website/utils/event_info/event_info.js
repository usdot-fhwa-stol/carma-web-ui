
function createEventInfo(toHideEventInfo,event_min_gap,event_advisory_speed,event_type,event_reason)
{
    let divEventInfoWrapper = document.createElement('div');
    divEventInfoWrapper.id='event_info_wrapper';
    if(toHideEventInfo) 
        divEventInfoWrapper.style.display='none';

    let p_traffic_event_div = document.createElement('div');
    
    //Event Speed Advisory
    let p_event_speed_advisory = document.createElement("p");
    p_event_speed_advisory.innerHTML = "SPEED ADVISORY: " + event_advisory_speed + " MPH";
    p_event_speed_advisory.id = "event_speed_advisory_id";
    p_traffic_event_div.append(p_event_speed_advisory);

    //Event Min Gap
    let p_event_min_gap = document.createElement("p");
    p_event_min_gap.innerHTML = "MIN GAP: " + event_min_gap + " METERS";
    p_event_min_gap.id = "event_min_gap_id";
    p_traffic_event_div.append(p_event_min_gap);

    //Event Type
    let p_event_type = document.createElement("p");
    p_event_type.innerHTML = "TYPE: " + event_reason;
    p_event_type.id = "event_type_id";
    p_traffic_event_div.append(p_event_type);

    //Event Reason
    let p_event_reason = document.createElement("p");
    p_event_reason.id = "event_reason_id";   
    p_event_reason.innerHTML = "EVENT REASON: " + event_reason;

    p_traffic_event_div.append(p_event_reason);

    //
    divEventInfoWrapper.appendChild(p_traffic_event_div);

    return divEventInfoWrapper;
}

function updateEventInfo(toHideEventInfo,event_min_gap,event_advisory_speed,event_type,event_reason)
{    
    if(!toHideEventInfo)
    {
        document.getElementById('event_type_id').innerHTML = "TYPE: " + event_type;
        document.getElementById('event_reason_id').innerHTML = "EVENT REASON: " + event_reason;
        document.getElementById('event_speed_advisory_id').innerHTML = "SPEED ADVISORY: " + event_advisory_speed + " MPH";
        document.getElementById('event_min_gap_id').innerHTML = "MIN GAP: " + event_min_gap+ " METERS";
    }
    else
    {
        //clear the event panel content
        document.getElementById('traffic-event-info-content').innerHTML="";

        //hide the event panel
        document.getElementById('traffic-event-info-panel').style.display = 'none';
    }
}
