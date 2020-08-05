/***
 * rostopic pub -r 10 traffic_signal_info cav_msgs/TrafficSignalInfoList  "traffic_signal_info_list: [{intersection_id: 0, state: 5,remaining_time: 1,lane_id: 0,remaining_distance: 1}]"
 */
function TrafficSignalInfoList(){

    listener = new ROSLIB.Topic({
        ros: g_ros,
        name: '/traffic_signal_info',
        messageType: 'cav_msgs/TrafficSignalInfoList'
    });
    console.log('TrafficSignalInfoList');

    let signalState = null;
    let isTimeerSet = false;
    listener.subscribe(function (message) {
        message.traffic_signal_info_list.forEach(element => {
            /**
             * 
                UNLIT=0
                GREEN=1
                YELLOW=2
                RED=3
                FLASHING_GREEN=4
                FLASHING_YELLOW=5
                FLASHING_RED=6
            */
           //Prevent repeating the same state
           if(signalState != element.state){
                signalState = element.state;
                switch(signalState){
                    case SIGNAL_GREEN_STATE:
                        $('.traffic-signal-col').append(updateTrafficSignal('green',element.remaining_time));
                        break;
                    case SIGNAL_RED_STATE:
                        $('.traffic-signal-col').append(updateTrafficSignal('red',element.remaining_time));
                        break;
                    case SIGNAL_YELLOW_STATE:
                        $('.traffic-signal-col').append(updateTrafficSignal('yellow',element.remaining_time));
                        break;
                    case SIGNAL_FLASHING_GREEN_STATE:
                        $('.traffic-signal-col').append(updateTrafficSignal('flash_green',element.remaining_time));
                        break;
                    case SIGNAL_FLASHING_YELLOW_STATE:
                        $('.traffic-signal-col').append(updateTrafficSignal('flash_yellow',element.remaining_time));
                        break;
                    case SIGNAL_FLASHING_RED_STATE:
                        $('.traffic-signal-col').append(updateTrafficSignal('flash_red',element.remaining_time));
                        break;
                    default:
                        $('.traffic-signal-col').html('');
                        break;
                } 
                //set back to black after 5 seconds.
                if(!isTimeerSet)
                {
                    isTimeerSet=true;
                    setTimeout(function(){
                        $('.traffic-signal-col').html('');
                        isTimeerSet=false;
                        signalState = null;
                    }, 5000);
                }
           }      
        });
            
    });
}