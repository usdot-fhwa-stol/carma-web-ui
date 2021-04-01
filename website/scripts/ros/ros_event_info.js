function GetEventInfo()
{
    subscribeToEventInfo();
}

//subscribe to topic event_info
/*** 
 * Mockup publish topic
 * rostopic pub -r 10 /event_info cav_msgs/EventInfo "event_minimum_gap: 0.0
event_advisory_speed: 0.0
event_type: 0
event_reason: 0"
*/
var event_types = 
{
    EVENT_LANE_CLOSED: {
        id: 0,
        descrition: "LANE CLOSED"
    },
    EVENT_SPEED_LIMIT: {
        id: 1,
        descrition: "SPEED LIMIT"
    },
    EVENT_LANE_OPEN: {
        id: 3,
        descrition: "LANE OPEN"
    }
}

var event_reasons =
{
    EVENT_EMERGENCY_VEHICLE: {
        id: 0,
        description: "EMERGENCY VEHICLE"
    },
    EVENT_WET_PAVEMENT: {
        id: 1,
        description: "WET PAVEMENT"
    }
} 

function subscribeToEventInfo()
{
    let listener = new ROSLIB.Topic({
        ros: g_ros,
        name: T_GEOFENCE_INFO,
        messageType: M_GEOFENCE_INFO_MSG
    });

    let EventActiveStatusDict =
    {
        ACTIVE: {
            IsActive: true,
            description: 'Detected active event.',
            imgPath: "../../images/geofence_warning.png",
            borderClass: 'border-warning'
        },
        INACTIVE: {
            IsActive: false,
            description: 'Exit active event',
            imgPath: "../../images/geofence_exit.png",
            borderClass: 'border-good'
        }

    }

    let LaneChangeStatusEventTypes = {
        EVENT_LANE_CLOSED : {
            id: 0,
            description: " Lane closure ahead"
        }
            
    };

    //Indicator to check Event to active or not - default is NOT active
    let isActive = EventActiveStatusDict.INACTIVE.isActive;
    let isActiveStateDisplayed = false;

    listener.subscribe(function (message) 
    { 
        if(message != null && message.is_on_active_geofence)
        {
                 /**DETECTED Active EVENT: 
                 * **update event status 
                 * */
                isActive = EventActiveStatusDict.ACTIVE.IsActive;

                // update lane change status div area and content to include event detected 
                if(isActive && !isActiveStateDisplayed)
                {    
                    let description = EventActiveStatusDict.ACTIVE.description;
                    switch(message.type)
                    {
                        case LaneChangeStatusEventTypes.EVENT_LANE_CLOSED.id:
                            description += LaneChangeStatusEventTypes.EVENT_LANE_CLOSED.description;
                            break;
                        default:
                            break;
                    }             
                    updateLaneChangeStatusDivByEventInfo(EventActiveStatusDict.ACTIVE.imgPath, 
                        description, 
                        EventActiveStatusDict.ACTIVE.borderClass);

                    //notify UI that an active event is detected
                    isActiveStateDisplayed = true;
                }

                /**** Event Info: 
                 * show event info at the dropdown menu
                 * ***/
                $('#statistics-dropdown').css('display','');
                $('#event-info-btn').css('display','');

                /**** Event Info:
                 * update event info panel
                **/
                let event_info_wrapper = document.getElementById('event_info_wrapper');
                if(event_info_wrapper !=null && event_info_wrapper!= undefined && event_info_wrapper!= 'undefined')
                {
                    createOrUpdateEventInfoByEventType(false,
                                    message.minimum_gap,
                                    message.advisory_speed,
                                    message.type,
                                    message.reason,
                                    message.value,
                                    message.distance_to_next_geofence,
                                    message.headway);
                }
                else
                {            
                    event_info_wrapper = createOrUpdateEventInfoByEventType(true,
                                                        message.minimum_gap,
                                                        message.advisory_speed,
                                                        message.type,
                                                        message.reason,
                                                        message.value,
                                                        message.distance_to_next_geofence,
                                                        message.headway);
                    
                    //add event wrapper to event content div
                    document.getElementById('event-info-content').appendChild(event_info_wrapper);          
                }
        }
       else if(! message.is_on_active_geofence)
       {
            //not publishing required event information, this consider this event is inactive
            isActive = EventActiveStatusDict.INACTIVE.IsActive;
            if(!isActive && isActiveStateDisplayed)
            {
                updateLaneChangeStatusDivByEventInfo(EventActiveStatusDict.INACTIVE.imgPath, 
                    EventActiveStatusDict.INACTIVE.description, 
                    EventActiveStatusDict.INACTIVE.borderClass);

                isActiveStateDisplayed = false;
            }
            //Clear the exit active event UI div after 10 seconds
            setTimeout(()=>{    
                $('#divLaneChangeStatusContent').empty();    
            }, 5000) 
       }
    });
}

function createOrUpdateEventInfoByEventType(isCreateDiv,event_minimum_gap, event_advisory_speed, event_type, event_reason, value, distance_to_next_geofence,headway)
{
    if(event_type == event_types.EVENT_LANE_CLOSED.id && event_reason == event_reasons.EVENT_EMERGENCY_VEHICLE.id)
    {
        //Below variables set to null and will not be displayed
        value = null; 
        distance_to_next_geofence = null;  
        headway = null;  
    }
    else if(event_type == event_types.EVENT_SPEED_LIMIT.id)
    {
        //Below variables set to null and will not be displayed
        event_minimum_gap = null;
        event_advisory_speed = null;    
        event_reason = null;
        headway = null;    
    }
    else if(event_type == event_types.EVENT_LANE_CLOSED.id && event_reason == event_reasons.EVENT_WET_PAVEMENT.id)
    {
        //Below variables set to null and will not be displayed
        value = null; 
        event_minimum_gap = null;
        distance_to_next_geofence = null;
    }
    else
    {
        console.error("Unknown event type and event reason combination");
        //Below variables set to null and will not be displayed
        value = null; 
        distance_to_next_geofence = null;
        event_minimum_gap = null;
        event_advisory_speed = null;
        headway = null;  
    }
    if(isCreateDiv){
        return createEventInfo( false,
            event_minimum_gap,
            event_advisory_speed,
            getEventTypeStrById(event_type),
            getEventReasonStrById(event_reason),
            value,
            distance_to_next_geofence,
            headway);
    }
    else
    {
        updateEventInfo(false,
            event_minimum_gap,
            event_advisory_speed,
            getEventTypeStrById(event_type),
            getEventReasonStrById(event_reason),
            value,
            distance_to_next_geofence,
            headway);
    }
   
}

function updateLaneChangeStatusDivByEventInfo(imgPath, description, borderClass)
{
    let wrapper = document.getElementById('lane_change_status_wrapper');
    let description_dev = document.getElementById('lane_change_status_description_id');
    let status_icon = document.getElementById('img_lane_change_status_icon_id');
    if(wrapper != null && wrapper != 'undefined'
        && description_dev != null && description_dev != 'undefined'
        && status_icon != null && status_icon != 'undefined')
    {   
       
       updateLaneChangeStatus(false, imgPath, description);
    }
    else
    {
        let laneChangeStatusDiv = createLaneChangeStatus(false, imgPath, description);
        $('#divLaneChangeStatusContent').append(laneChangeStatusDiv);        
    }

    $('#lane_change_status_wrapper').removeClass(function(index,css){
        return (css.match(/(^|\s)border-\w*/g) || []).join(' ');
    });
    
    $('#lane_change_status_wrapper').addClass(borderClass);
    $('#divLaneChangeStatusContent').css('display','');
}

function getEventTypeStrById(event_type_id)
{   
    if (event_type_id == null)
        return null;

    switch(event_type_id)
    {
        case event_types.EVENT_LANE_CLOSED.id:
            return event_types.EVENT_LANE_CLOSED.descrition;
        
        case event_types.EVENT_SPEED_LIMIT.id:
            return event_types.EVENT_SPEED_LIMIT.descrition;
        
        case event_types.EVENT_LANE_OPEN.id:
            return event_types.EVENT_LANE_OPEN.descrition;

        default:
            console.error('UNKOWN Event Type');
            return "UNKNOWN ";
    }    
}

function getEventReasonStrById(event_reason_id)
{   
    if (event_reason_id == null)
        return null;
        
    switch(event_reason_id)
    {
        case event_reasons.EVENT_EMERGENCY_VEHICLE.id:
            return event_reasons.EVENT_EMERGENCY_VEHICLE.description;

        case event_reasons.EVENT_WET_PAVEMENT.id:
            return event_reasons.EVENT_WET_PAVEMENT.description;

        default:
            console.error('UNKOWN Event Reason');
            return "UNKNOWN ";
    }
}