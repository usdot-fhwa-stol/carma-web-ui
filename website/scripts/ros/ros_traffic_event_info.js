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


    let TrafficEventActiveStatusDict =
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

    let TrafficEventTypes = {
        EVENT_LANE_CLOSED : {
            id: 0,
            description: "Lane closure ahead"
        }
            
    };

    //Indicator to check Event to active or not - default is NOT active
    let isActive = TrafficEventActiveStatusDict.INACTIVE.isActive;
    let isActiveStateDisplayed = false;

    listener.subscribe(function (message) 
    {   
        if(message != null && message.event_advisory_speed != null && message.event_reason != null && 
            message.event_type != null && message.event_minimum_gap != null 
            && parseFloat(message.event_advisory_speed)>0 && parseFloat(message.event_minimum_gap)>0)
            {
                 /**DETECTED Active EVENT: 
                 * **update event status 
                 * */
                isActive = TrafficEventActiveStatusDict.ACTIVE.IsActive;

                console.log(TrafficEventActiveStatusDict.ACTIVE.IsActive);
                // update lane change status div area and content to include event detected 
                if(isActive && !isActiveStateDisplayed)
                {    
                    let description = TrafficEventActiveStatusDict.ACTIVE.description;
                    switch(message.event_type)
                    {
                        case TrafficEventTypes.EVENT_LANE_CLOSED.id:
                            description += TrafficEventTypes.EVENT_LANE_CLOSED.description;
                            break;
                        default:
                            break;
                    }             
                    updateLaneChangeStatusDivByEventInfo(TrafficEventActiveStatusDict.ACTIVE.imgPath, 
                        description, 
                        TrafficEventActiveStatusDict.ACTIVE.borderClass);

                    //notify UI that an active event is detected
                    isActiveStateDisplayed = true;
                }

                //show event info at the dropdown menu
                $('#statistics-dropdown').css('display','');
                $('#traffic-event-info-btn').css('display','');

                //update event info panel
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
            }
       else {
            //not publishing required event information, this consider this event is inactive
            isActive = TrafficEventActiveStatusDict.INACTIVE.IsActive;
            if(!isActive && isActiveStateDisplayed)
            {
                updateLaneChangeStatusDivByEventInfo(TrafficEventActiveStatusDict.INACTIVE.imgPath, 
                    TrafficEventActiveStatusDict.INACTIVE.description, 
                    TrafficEventActiveStatusDict.INACTIVE.borderClass);

                isActiveStateDisplayed = false;
            }
            //Clear the exit active event UI div after 10 seconds
            setTimeout(()=>{    
                $('#divLaneChangeStatusContent').empty();    
            }, 10000) 
       }
    });
}

function updateLaneChangeStatusDivByEventInfo(imgPath, description, borderClass)
{
    console.log('divLaneChangeStatusContent');
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
            return "UNKNOWN ";
    }
}