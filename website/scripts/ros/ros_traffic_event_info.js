function GetTrafficEventInfo()
{
    subscribeToTrafficEventInfo();
}

//subscribe to topic traffic_event_info
/*** 
 * Mockup publish topic
 * rostopic pub -r 10 /traffic_event_info cav_msgs/TrafficEventInfo "event_minimum_gap: 0.0
event_advisory_speed: 0.0
event_type: 0
event_reason: 0"
*/

function subscribeToTrafficEventInfo()
{
    let listener = new ROSLIB.Topic({
        ros: g_ros,
        name: T_TRAFFIC_EVENT_INFO,
        messageType: M_TRAFFIC_EVENT_INFO
    });

    listener.subscribe(function (message) 
    {
        //show event info at the dropdown menu
        $('#statistics-dropdown').css('display','');
        $('#traffic-event-info-btn').css('display','');
        let event_info_wrapper = document.getElementById('event_info_wrapper');
        if(event_info_wrapper !=null && event_info_wrapper!= undefined && event_info_wrapper!= 'undefined')
        {
            updateEventInfo(false,message.event_minimum_gap,message.event_advisory_speed,getEventTypeStrById(message.event_type),getEventReasonStrById(message.event_reason));
        }
        else
        {
            
            event_info_wrapper = createEventInfo(false,message.event_minimum_gap,message.event_advisory_speed,getEventTypeStrById(message.event_type),getEventReasonStrById(message.event_reason));  
            
            //add event wrapper to event content div
            document.getElementById('traffic-event-info-content').appendChild(event_info_wrapper);          
        }
    });
}

function getEventTypeStrById(event_type_id)
{
    let event_types =
    {
        EVENT_LANE_CLOSED: {
            id: 0,
            descrition: "LANE CLOSED"
        }
    }
    
    switch(event_type_id)
    {
        case event_types.EVENT_LANE_CLOSED.id:
            return event_types.EVENT_LANE_CLOSED.descrition;

        default:
            console.error('UNKOWN Event Type');
            return "UNKNOWN ";
    }
    
}


function getEventReasonStrById(event_reason_id)
{
    let event_reasons =
    {
        EVENT_EMERGENCY_VEHICLE: {
            id: 0,
            description: "EMERGENCY VEHICLE"
        }
    } 

    switch(event_reason_id)
    {
        case event_reasons.EVENT_EMERGENCY_VEHICLE.id:
            return event_reasons.EVENT_EMERGENCY_VEHICLE.description;

        default:
            console.error('UNKOWN Event Reason');
            return "EVENT REASON: UNKNOWN ";
    }
}