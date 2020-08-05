/**
 * /localization/ekf_twist
 * The current/Actual speed of the vehicle is in: /localization/ekf_twist/twist/linear/x
 */
function subscribeToLocalizationEKFTwist()
{
    var listener = new ROSLIB.Topic({
        ros: g_ros,
        name: '/localization/ekf_twist',
        messageType: 'geometry_msgs/TwistStamped'
    });
    listener.subscribe(function(message)
    {
        //Check ROSBridge connection before subscribe a topic
        IsROSBridgeConnected();
        
        if(message!=null && message.twist !=null && message.twist.linear != null)
        {
            updateCurrentSpeed(message.twist.linear.x);            
        }
    });
}
