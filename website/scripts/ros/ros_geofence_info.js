/***
 * Mock topic: 
rostopic pub -r 10 /environment/active_geofence cav_msgs/CheckActiveGeofence "is_on_active_geofence: false
type: 1
value: 45
distance_to_next_geofence: [1]"
 * /environment/active_geofence topic with a message type cav_msgs::CheckActiveGeofence (edited) 
 */
function subscribeToGeofenceInfo ()
{
    let listener = new ROSLIB.Topic({
        ros: g_ros,
        name: T_GEOFENCE_INFO,
        messageType: M_GEOFENCE_INFO_MSG
    });
    
    listener.subscribe((message)=>
    {
      //Check ROSBridge connection before subscribe a topic
      IsROSBridgeConnected();
      if(document.getElementById('geofence_info_wrapper') != null)
      {
        $('#statistics-dropdown').css('display','');
        $('#geofence-info-btn').css('display','');
        updateGeofenceInfo(message.is_on_active_geofence,
                           message.type,
                           (message.value * METER_TO_MPH).toFixed(2), 
                           message.distance_to_next_geofence.toFixed(2));
      }       
    });


  }
