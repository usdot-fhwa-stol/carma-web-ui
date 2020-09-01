
/***
 * Mock topic: 
rostopic pub -r 10 /platooning_info cav_msgs/PlatooningInfo "state: 4
platoon_id: '1'
size: 4
size_limit: 2
leader_id: '123'
leader_downtrack_distance: 12.5
leader_cmd_speed: 23
host_platoon_position: 2
host_cmd_speed: 5
desired_gap: 5"

 * uint8    state
    uint8    DISABLED=0
    uint8    SEARCHING=1
    uint8    CONNECTING_TO_NEW_FOLLOWER=2
    uint8    CONNECTING_TO_NEW_LEADER=3
    uint8    LEADING=4
    uint8    FOLLOWING=5
 */

function subscribeToPlatoonInfo ()
{
    let listener = new ROSLIB.Topic({
        ros: g_ros,
        name: T_PLATOON_INFO,
        messageType: M_PLATOON_INFO
    });
    
    listener.subscribe((message)=>
    {
      //Check ROSBridge connection before subscribe a topic
      IsROSBridgeConnected();
      
      if(document.getElementById('platooning_info_wrapper') != null)
      {
        $('#statistics-dropdown').css('display','');
        $('#platoon-info-btn').css('display','');
        let platooning_state = 'N/A';
        switch(message.state)
        {
          case PLATOONING_STATE_DISABLED:
                platooning_state = PLATOONING_STATE_DISABLED_LABEL;
                break;
          case PLATOONING_STATE_SEARCHING:
                platooning_state = PLATOONING_STATE_SEARCHING_LABEL;
                break;
          case PLATOONING_STATE_CONNECTING_TO_NEW_FOLLOWER:
                platooning_state = PLATOONING_STATE_CONNECTING_TO_NEW_FOLLOWER_LABEL;
                break;
          case PLATOONING_STATE_CONNECTING_TO_NEW_LEADER:
                platooning_state = PLATOONING_STATE_CONNECTING_TO_NEW_LEADER_LABEL;
                break;
          case PLATOONING_STATE_LEADING:
                platooning_state = PLATOONING_STATE_LEADING_LABEL;
                break;
          case PLATOONING_STATE_FOLLOWING:
                platooning_state = PLATOONING_STATE_FOLLOWING_LABEL;
                break;
          default:
                platooning_state = 'N/A';
                break;
        }
        updatePlatooningInfo(platooning_state, 
                            message.host_platoon_position + ' out of 4 vehicles', 
                            message.desired_gap,
                            'N/A', //actual gap
                            message.leader_id, //leader_vehicle_id = leader_id
                            message.platoon_id, //platoon_id
                            message.leader_cmd_speed //platoon_applied_speed = leader_cmd_speed
                            );
      }
    });
  }
