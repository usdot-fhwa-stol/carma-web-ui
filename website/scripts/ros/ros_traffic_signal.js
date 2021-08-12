var unknown_intersection_id = -1; //Integer (0...65535)
var unknown_signal_group = 0; //Integer (0...255). The value 0 shall be used when the ID is not available or not known.
var intersection_signal_group_ids = [unknown_intersection_id,unknown_signal_group];

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

    let signalState = null;
    let isTimeerSet = false;

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
                                    inner_ele.state_time_speed.movement_event_list.forEach(event_ele=>{
                                        let signal_state = event_ele.event_state.movement_phase_state;
                                        console.log(signal_state);
                                        let remaining_time = event_ele.timing.min_end_time/10;
                                        //Prevent repeating the same state
                                        if(signalState !=signal_state)
                                        {
                                                switch(signal_state)
                                                {
                                                    case TRAFFIC_SIGNAL_PHASE_STATE.protected_movement_allowed:
                                                        $('.traffic-signal-col').html(updateTrafficSignal('green',remaining_time));
                                                        break;
                                                    case TRAFFIC_SIGNAL_PHASE_STATE.stop_and_remain:
                                                        $('.traffic-signal-col').html(updateTrafficSignal('red',remaining_time));
                                                        break;
                                                    case TRAFFIC_SIGNAL_PHASE_STATE.protected_clearance:
                                                        $('.traffic-signal-col').html(updateTrafficSignal('yellow',remaining_time));
                                                        break;
                                                    case TRAFFIC_SIGNAL_PHASE_STATE.permissive_movement_allowed:
                                                        $('.traffic-signal-col').html(updateTrafficSignal('flash_green',remaining_time));
                                                        break;
                                                    case TRAFFIC_SIGNAL_PHASE_STATE.permissive_clearance:
                                                    case TRAFFIC_SIGNAL_PHASE_STATE.caution_conflicting_traffic:
                                                        $('.traffic-signal-col').html(updateTrafficSignal('flash_yellow',remaining_time));
                                                        break;
                                                    case TRAFFIC_SIGNAL_PHASE_STATE.stop_then_proceed:
                                                        $('.traffic-signal-col').html(updateTrafficSignal('flash_red',remaining_time));
                                                        break;
                                                    default:
                                                        $('.traffic-signal-col').html(updateTrafficSignal('',''));
                                                        console.error("Traffic signal state is invalid");
                                                        break;
                                                } 
                                        }
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
        if(!isTimeerSet)
        {
            isTimeerSet=true;
            setTimeout(function(){
                $('.traffic-signal-col').html(updateTrafficSignal('',''));
                isTimeerSet=false;
                signalState = null;
            }, 1000);
        }
    });
}