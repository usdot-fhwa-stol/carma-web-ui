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
        id: 2,
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
var event_reason_work_zone = "SIG_WZ";


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
            imgPath_WZ: "../../images/work_zone_fence_orange.png",
            borderClass: 'border-warning'
        },
        INACTIVE: {
            IsActive: false,
            description: 'Exit active event',
            imgPath: "../../images/geofence_exit.png",
            imgPath_WZ: "../../images/work_zone_fence_green.png",
            borderClass: 'border-good'
        }

    }

    let EventStatusEventTypes = {
        EVENT_LANE_CLOSED : {
            id: 2,
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
                if(isActive)
                {    
                    let description = EventActiveStatusDict.ACTIVE.description;
                    switch(message.type)
                    {
                        case EventStatusEventTypes.EVENT_LANE_CLOSED.id:
                            description += EventStatusEventTypes.EVENT_LANE_CLOSED.description;
                            break;
                        default:
                            break;
                    }

                    let imgPath = ""; 
                    if(message.reason != null && message.reason.trim().replace(/\s+/g, '').toUpperCase().includes(event_reason_work_zone))
                    {
                        imgPath = EventActiveStatusDict.ACTIVE.imgPath_WZ;
                    }else{
                        imgPath = EventActiveStatusDict.ACTIVE.imgPath;
                    }
                              
                    updateEventStatusDivByEventInfo(imgPath, 
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
                                    message.reason.toUpperCase().includes(event_reason_work_zone)?  "WORK ZONE": message.reason,
                                    message.value,
                                    message.distance_to_next_geofence);
                }
                else
                {            
                    event_info_wrapper = createOrUpdateEventInfoByEventType(true,
                                                        message.minimum_gap,
                                                        message.advisory_speed,
                                                        message.type,
                                                        message.reason.toUpperCase().includes(event_reason_work_zone)?  "WORK ZONE": message.reason,
                                                        message.value,
                                                        message.distance_to_next_geofence);
                    
                    //add event wrapper to event content div
                    document.getElementById('event-info-content').appendChild(event_info_wrapper);          
                }
        }
       else if(! message.is_on_active_geofence && isActiveStateDisplayed)
       {
            //not publishing required event information, this consider this event is inactive
            isActive = EventActiveStatusDict.INACTIVE.IsActive;
            if(!isActive)
            {
                let imgPath = ""; 
                if(message.reason != null && message.reason.trim().replace(/\s+/g, '').toUpperCase().includes(event_reason_work_zone))
                {
                    imgPath = EventActiveStatusDict.INACTIVE.imgPath_WZ; 
                }else{
                    imgPath = EventActiveStatusDict.INACTIVE.imgPath;
                }
                                                
                updateEventStatusDivByEventInfo(imgPath, 
                    EventActiveStatusDict.INACTIVE.description, 
                    EventActiveStatusDict.INACTIVE.borderClass);

            }
            if(isActiveStateDisplayed){
                isActiveStateDisplayed = false;
                //Clear the exit active event UI div after 10 seconds
                setTimeout(()=>{    
                    $('#divEventStatusContent').empty();    
                }, 5000) 
            }
       }
    });
}

function createOrUpdateEventInfoByEventType(isCreateDiv,event_minimum_gap, event_advisory_speed, event_type, event_reason, value, distance_to_next_geofence)
{
    if(event_type == event_types.EVENT_LANE_CLOSED.id)
    {
        //Below variables set to null and will not be displayed
        value = null; 
        distance_to_next_geofence = null; 
    }
    else if(event_type == event_types.EVENT_SPEED_LIMIT.id)
    {
        //Below variables set to null and will not be displayed
        event_minimum_gap = null;
        event_advisory_speed = null;    
        event_reason = null;
    }
    else
    {
        console.error("Unknown event type ");
        //Below variables set to null and will not be displayed
        value = null; 
        distance_to_next_geofence = null;
        event_minimum_gap = null;
        event_advisory_speed = null;
        event_reason = "UNKNOWN";
    }
    if(isCreateDiv){
        return createEventInfo( false,
            event_minimum_gap,
            event_advisory_speed,
            getEventTypeStrById(event_type),
            event_reason,
            value,
            distance_to_next_geofence);
    }
    else
    {
        updateEventInfo(false,
            event_minimum_gap,
            event_advisory_speed,
            getEventTypeStrById(event_type),
            event_reason,
            value,
            distance_to_next_geofence);
    }
   
}

function updateEventStatusDivByEventInfo(imgPath, description, borderClass)
{
    let wrapper = document.getElementById('event_status_wrapper');
    let description_dev = document.getElementById('event_status_description_id');
    let status_icon = document.getElementById('img_event_status_icon_id');
    if(wrapper != null && wrapper != 'undefined'
        && description_dev != null && description_dev != 'undefined'
        && status_icon != null && status_icon != 'undefined')
    {   
       
       updateEventStatus(false, imgPath, description);
    }
    else
    {
        let EventStatusDiv = createEventStatus(false, imgPath, description);
        $('#divEventStatusContent').append(EventStatusDiv);        
    }

    $('#event_status_wrapper').removeClass(function(index,css){
        return (css.match(/(^|\s)border-\w*/g) || []).join(' ');
    });
    
    $('#event_status_wrapper').addClass(borderClass);
    $('#divEventStatusContent').css('display','');
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