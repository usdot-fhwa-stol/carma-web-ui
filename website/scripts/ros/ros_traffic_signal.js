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
            if(Array.isArray(message.intersections.intersection_state_list)){
                message.intersections.intersection_state_list.forEach(element=>{
                    element.states.movement_list.forEach(inner_ele=>{
                        inner_ele.state_time_speed.movement_event_list.forEach(event_ele=>{
                            let signal_state = event_ele.event_state.movement_phase_state;
                            let remaining_time = event_ele.timing.min_end_time;
                            //Prevent repeating the same state
                            if(signalState !=signal_state)
                            {
                                signalState = signal_state;
                                    switch(signalState)
                                    {
                                        case TRAFFIC_SIGNAL_PHASE_STATE.protected_movement_allowed:
                                            $('.traffic-signal-col').append(updateTrafficSignal('green',remaining_time));
                                            break;
                                        case TRAFFIC_SIGNAL_PHASE_STATE.stop_and_remain:
                                            $('.traffic-signal-col').append(updateTrafficSignal('red',remaining_time));
                                            break;
                                        case TRAFFIC_SIGNAL_PHASE_STATE.protected_clearance:
                                            $('.traffic-signal-col').append(updateTrafficSignal('yellow',remaining_time));
                                            break;
                                        case TRAFFIC_SIGNAL_PHASE_STATE.permissive_movement_allowed:
                                            $('.traffic-signal-col').append(updateTrafficSignal('flash_green',remaining_time));
                                            break;
                                        case TRAFFIC_SIGNAL_PHASE_STATE.permissive_clearance:
                                            $('.traffic-signal-col').append(updateTrafficSignal('flash_yellow',remaining_time));
                                            break;
                                        case TRAFFIC_SIGNAL_PHASE_STATE.stop_then_proceed:
                                            $('.traffic-signal-col').append(updateTrafficSignal('flash_red',remaining_time));
                                            break;
                                        default:
                                            $('.traffic-signal-col').html('');
                                            $('.traffic-signal-col').append(updateTrafficSignal('',''));
                                            console.error("Traffic signal state is invalid");
                                            break;
                                    } 
                                    //set back to black after 5 seconds.
                                    if(!isTimeerSet)
                                    {
                                        isTimeerSet=true;
                                        setTimeout(function(){
                                            $('.traffic-signal-col').html('');
                                            $('.traffic-signal-col').append(updateTrafficSignal('',''));
                                            isTimeerSet=false;
                                            signalState = null;
                                        }, 5000);
                                    }
                            }
                        });
                    });
                });
            }
         }catch(error){
            console.error(error);
         }  
    });
}