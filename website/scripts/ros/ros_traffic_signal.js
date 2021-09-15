var unknown_intersection_id = -1; //Integer (0...65535)
var unknown_signal_group = 0; //Integer (0...255). The value 0 shall be used when the ID is not available or not known.
var intersection_signal_group_ids = [unknown_intersection_id,unknown_signal_group];
const RED_COUNT_DOWN_MAX_SEC = 13;
const GREEN_COUNT_DOWN_MAX_SEC= 13;
const YELLOW_COUNT_DOWN_MX_SEC = 3;

function UpdateIntersectionAndSignalGroupIds(){
    listener = new ROSLIB.Topic({
        ros: g_ros,
        name: T_INTERSECTION_SIGNAL_GROUP_IDS,
        messageType: M_MULTI_ARRAY
    });
    listener.subscribe(function(message){
        //Check ROSBridge connection before subscribe a topic
        IsROSBridgeConnected();
        intersection_signal_group_ids[0] = message.data[0];
        intersection_signal_group_ids[1] = message.data[1];
    });
}

UpdateIntersectionAndSignalGroupIds();

function TrafficSignalInfoList(){

    listener = new ROSLIB.Topic({
        ros: g_ros,
        name: T_J2735_SPAT,
        messageType: M_J2735_SPAT
    });

    let signalStateTracking = 0; //0 -> unavailable
    let latest_start_time =  Date.now();
    let remaining_time = 0;
    listener.subscribe(function (message) 
    {
         //Check ROSBridge connection before subscribe a topic
         IsROSBridgeConnected();
         try{
            if(message!=undefined && message.intersections != undefined && Array.isArray(message.intersections.intersection_state_list)){
                message.intersections.intersection_state_list.forEach(element=>{
                    //Checking intersection id
                    if(element.id.id != unknown_intersection_id && element.id.id == intersection_signal_group_ids[0])
                    {
                        element.states.movement_list.forEach(inner_ele=>{
                            //Checking signal group id
                            if(inner_ele.signal_group != unknown_signal_group && inner_ele.signal_group == intersection_signal_group_ids[1])
                            {
                                    latest_start_time = Date.now();
                                    inner_ele.state_time_speed.movement_event_list.forEach(event_ele=>{
                                        let signal_state = event_ele.event_state.movement_phase_state;
                                        if(signalStateTracking != signal_state)
                                        {
                                            is_timer_set = false;
                                        }
                                            signalStateTracking = signal_state;
                                            //set timer to count down ONY for current changed phase
                                            // let current_phase_max_sec = getCurPhaseMaxSecBySpatTiming(element.moy,event_ele.timing.min_end_time);
                                            
                                            // setInterval(()=>{
                                            //     remaining_time = current_phase_max_sec - 1;
                                            // }, 1000);
                                       

                                            //Prevent repeating the same state                                    
                                            switch(signal_state)
                                            {
                                                case TRAFFIC_SIGNAL_PHASE_STATE.protected_movement_allowed:
                                                    current_phase_max_sec = GREEN_COUNT_DOWN_MAX_SEC;
                                                    $('.traffic-signal-col').html(updateTrafficSignal('green',remaining_time));
                                                    break;
                                                case TRAFFIC_SIGNAL_PHASE_STATE.stop_and_remain:
                                                    current_phase_max_sec = RED_COUNT_DOWN_MAX_SEC;
                                                    $('.traffic-signal-col').html(updateTrafficSignal('red',remaining_time));
                                                    break;
                                                case TRAFFIC_SIGNAL_PHASE_STATE.protected_clearance:
                                                    current_phase_max_sec = YELLOW_COUNT_DOWN_MX_SEC;
                                                    $('.traffic-signal-col').html(updateTrafficSignal('yellow',remaining_time));
                                                    break;
                                                case TRAFFIC_SIGNAL_PHASE_STATE.permissive_movement_allowed:
                                                    current_phase_max_sec = GREEN_COUNT_DOWN_MAX_SEC;
                                                    $('.traffic-signal-col').html(updateTrafficSignal('flash_green',remaining_time));
                                                    break;
                                                case TRAFFIC_SIGNAL_PHASE_STATE.permissive_clearance:
                                                case TRAFFIC_SIGNAL_PHASE_STATE.caution_conflicting_traffic:
                                                    current_phase_max_sec = YELLOW_COUNT_DOWN_MX_SEC;
                                                    $('.traffic-signal-col').html(updateTrafficSignal('flash_yellow',remaining_time));
                                                    break;
                                                case TRAFFIC_SIGNAL_PHASE_STATE.stop_then_proceed:
                                                    current_phase_max_sec = RED_COUNT_DOWN_MAX_SEC;
                                                    $('.traffic-signal-col').html(updateTrafficSignal('flash_red',remaining_time));
                                                    break;
                                                default:
                                                    $('.traffic-signal-col').html(updateTrafficSignal('',''));
                                                    console.error("Traffic signal state is invalid");
                                                    break;
                                            } 
                                            if(!is_timer_set){
                                                setInterval(()=>{
                                                    remaining_time = current_phase_max_sec - 1;
                                                    is_timer_set = true;
                                                }, 1000);
                                            }
                                            
                                       
                                        // }
                                    });
                            }
                            
                        });
                    }                    
                });
            }
         }catch(error){
            console.error(error);
         }  

         //set back to black after 1 second.
        setInterval(function()
        {
            let elapsed_time = Date.now() - latest_start_time;
            if(elapsed_time >= 1000)
            {
                    $('.traffic-signal-col').html(updateTrafficSignal('',''));
                    signalState = null;
            }
         }, 1000);
    });
}

/****
 * @brief Given the timing from the icoming spat message, and return the count down for traffic signal phase change
 * @param Input moy (unit of min): Min of current UTC year.
 *              min_end_time (unit of 1/10 sec): Timing data in UTC time stamps for event. Include min end times of phase confidentce and estimated next occurrence
 * @returns current_phase_max_sec: The traffic signal will change phase in number of seconds.
 */
function getCurPhaseMaxSecBySpatTiming(moy, min_end_time )
{
    let current_phase_max_sec = 0; 

    //get current year 
    let current_date = new Date(Date.now());
    let current_year = current_date.getUTCFullYear();
    let current_date_utc = new Date(Date.UTC(current_date.getUTCFullYear(), current_date.getUTCMonth(), current_date.getUTCDate(), current_date.getUTCHours(),current_date.getUTCMinutes(), current_date.getUTCSeconds(),current_date.getUTCMilliseconds()));
    //get current months, days, hours of the year based on moy (in mins)
    //An integer between 0 (January) and 11 (December) representing the month.
    //An integer between 1 and 31 representing the day of the month. 
    //An integer between 0 and 23 representing the hours.
    //An integer between 0 and 59 representing the minutes.
    //An integer between 0 and 59 representing the seconds. 
    let current_year_start = new Date(Date.UTC(current_year,00,01,00,00,00,000));
    let current_year_add_moy = new Date(current_year_start.getTime() + moy*60*1000); 
    let current_year_month_day_hour = new Date(Date.UTC(current_year_add_moy.getUTCFullYear(), current_year_add_moy.getUTCMonth(),current_year_add_moy.getUTCDate(),current_year_add_moy.getUTCHours(),00,00,000));
    
    //get current time in terms of seconds, minutes, hours, day, and year
    let current_year_add_moy_add_min_end_time = new Date(current_year_month_day_hour.getTime() + min_end_time * 100); 
    console.log(current_year_add_moy_add_min_end_time.toUTCString());
    console.log(current_date_utc.toUTCString());
    //console.log(current_date_utc.getTime() - current_year_start.getTime());
    
    current_phase_max_sec = (current_year_add_moy_add_min_end_time.getTime() - current_date_utc.getTime())/1000;
    if(current_phase_max_sec < 0){
        console.error("Signal timing is expired.");
    }
    return current_phase_max_sec.toFixed(0);
}