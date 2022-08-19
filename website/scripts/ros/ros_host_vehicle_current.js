/**
 * /localization/ekf_twist
 * The current/Actual speed of the vehicle is in: /localization/ekf_twist/twist/linear/x
 */
function subscribeToLocalizationEKFTwist()
{
    var listener = new ROSLIB.Topic({
        ros: g_ros,
        name: T_EKF_TWIST,
        messageType: M_TWIST_STAMPED
    });
    listener.subscribe(function(message)
    {
        //Check ROSBridge connection before subscribe a topic
        if (!IsROSBridgeConnected())
        {
            return;
        };
        
        if(message!=null && message.twist !=null && message.twist.linear != null)
        {
           
            let current_speed = Math.floor(Math.abs(message.twist.linear.x * METER_TO_MPH));
            // console.log(current_speed);
            updateCurrentSpeed(current_speed);            
        }
    });
}
