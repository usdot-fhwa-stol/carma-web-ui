/**
 * /hardware_interface/vehicle_cmd
 * Retrieve information below: 
 * * Steering Wheel angle: use twits/angular/z or ctrl_cmd/steering_angle; Steering angle is in rad: deg = 1rad × 180/π
 * * Brake: vehicle_cmd/brake_cmd/brake
 * * Accelerator: acceleration are zero in ctrl_cmd
 * * Applied Speed: /ctrl_cmd/linear_velocity and command/Applied speed
 *  * 
 */

function subscribeToVehicleCMD()
{
    var listener = new ROSLIB.Topic({
        ros: g_ros,
        name: T_VEHICLE_CMD,
        messageType: M_VEHICLE_CMD
    });
    listener.subscribe(function(message)
    {
        //Check ROSBridge connection before subscribe a topic
        IsROSBridgeConnected();
        
        if(message!=null && message.ctrl_cmd !=null)
        {       
            //Applied/Command Speed
            if(message.ctrl_cmd.linear_velocity != null)
            {
                //convert meter/sec to MPH
                let cmdSpeed =  Math.floor(message.ctrl_cmd.linear_velocity * METER_TO_MPH) ; 
                updateCmdSpeedCircle(cmdSpeed);
            }
        }
    });
}
/**Accelerator Feedback position from ssc_interface package
 * Topic: /hardware_interface/throttle_feedback 
 * Message: automotive_platform_msgs/ThrottleFeedback
            std_msgs/Header header
                uint32 seq
                time stamp
                string frame_id
            float32 throttle_pedal
 */
function sunscribeToThrottleFeedback()
{
    var listener = new ROSLIB.Topic({
        ros:g_ros,
        name: T_THROTTLE_FEEDBACK,
        messageType: M_THROTTLE_FEEDBACK
    });
    listener.subscribe(function(message){
        //Check ROSBridge connection before subscribe a topic
        IsROSBridgeConnected();
        if(message!=null && message.throttle_pedal!=null)
        {
            let value = message.throttle_pedal;
            //Accelerator Progress
            if(g_acceleratorCircle != null)
            {
                updateAccerator(g_acceleratorCircle,1,value);
            }
        }
    });
}

/**brake_feedback from ssc_interface package
 * Topic: /hardware_interface/brake_feedback 
 * Message: automotive_platform_msgs/BrakeFeedback
            std_msgs/Header header
                uint32 seq
                time stamp
                string frame_id
            float32 brake_pedal
 */
function sunscribeToBrakeFeedback()
{
    var listener = new ROSLIB.Topic({
        ros:g_ros,
        name: T_BRAKE_FEEDBACK,
        messageType: M_BRAKE_FEEDBACK
    });
    listener.subscribe(function(message){
        //Check ROSBridge connection before subscribe a topic
        IsROSBridgeConnected();
        if(message!=null && message.brake_pedal!=null)
        {
            let value = message.brake_pedal;
            //Accelerator Progress
            if(g_brakeCircle != null)
            {
                updateBrake(g_brakeCircle,1,value);
            }
        }
    });
}

/**
 * /hardware_interface/speed_pedals
 */
function subscribeToSpeedPedalsOLD()
{
    var listener = new ROSLIB.Topic({
        ros: g_ros,
        name: T_SPEED_PEDALS,
        messageType: M_SPEED_PEDALS
    });
    listener.subscribe(function(message)
    {
        //Check ROSBridge connection before subscribe a topic
        IsROSBridgeConnected();
        if(message!=null && message.brake !=null)
        {
              //Brake(0-1 percent)
              if(message.brake != null && g_brakeCircle != null)
              {
                updateBrake(g_brakeCircle,1,message.brake);
              }
        }
    });
}


/**
 * /hardware_interface/steering_wheel 
 */
function subscribeToSteeringWheelOLD()
{
    var listener = new ROSLIB.Topic({
        ros: g_ros,
        name: T_STEERING_WHEEL,
        messageType: M_STEERING_WHEEL
    });
    listener.subscribe(function(message)
    {
        //Check ROSBridge connection before subscribe a topic
        IsROSBridgeConnected();
        //Steering wheel
        /**
         * compute the maximum_steering_wheel_angle with the following equation.
            vehicle_steer_lim_deg_rad = vehicle_steer_lim_deg * 180/pi
            maximum_steering_wheel_angle  = vehicle_steering_gear_ratio * vehicle_steer_lim_deg_rad
            Your steering percentage is then
            steer_percentage = (message.steer / maximum_steering_wheel_angle) * 100 (edited) 
         */
        if(message.angle != null)
        {
            //steering  percentage
            let vehicle_steer_lim_deg = session_hostVehicle.steeringLimit;
            let vehicle_steering_gear_ratio = session_hostVehicle.steeringRatio;
            let current_steering_angle = message.angle;
            let steer_percentage = Math.abs(((current_steering_angle/(vehicle_steering_gear_ratio*vehicle_steer_lim_deg * DEG2RAD))* 100).toFixed(0));
            //steering degree
            let rotateDegree = message.angle * 180/(Math.PI);
            let rotateDegreeModule = rotateDegree % 360; 

            updateSteeringWheel(steer_percentage+ "%",rotateDegreeModule);
        }  
    });
}


/**steering_feedback from ssc_interface package
 * Topic: /hardware_interface/steering_feedback 
 * Message: automotive_platform_msgs/BrakeFeedback
            std_msgs/Header header
                uint32 seq
                time stamp
                string frame_id
            float32 steering_wheel_angle
 */
function sunscribeToSteeringFeedback()
{
    var listener = new ROSLIB.Topic({
        ros:g_ros,
        name: T_STEERING_WHEEL_FEEDBACK,
        messageType: M_STEERING_FEEDBACK
    });
    listener.subscribe(function(message){
        //Check ROSBridge connection before subscribe a topic
        IsROSBridgeConnected();

        if(message!=null && message.steering_wheel_angle!=null)
        {
            let current_steering_angle, vehicle_steering_gear_ratio,vehicle_steer_lim_deg = '';
            vehicle_steer_lim_deg = session_hostVehicle.steeringLimit;
            vehicle_steering_gear_ratio =session_hostVehicle.steeringRatio;
            current_steering_angle = message.steering_wheel_angle;
            let maximum_steering_wheel_angle_deg = vehicle_steering_gear_ratio * vehicle_steer_lim_deg;

            //current_steering_angle is unit of rad and convert to unit degree before assign to rotate_deg
            let rotate_deg = Math.ceil(current_steering_angle * 180/(Math.PI));

            //steer_percentage is the percentage text displayed at the center of the steering_wheel image
            let steer_percentage = ((current_steering_angle/( maximum_steering_wheel_angle_deg * DEG2RAD ))* 100).toFixed(0);

            //rorate degree Offset is the degree if steering_wheel image rotation. 
            let offset_rotate_deg = - (rotate_deg % maximum_steering_wheel_angle_deg); 

            //let offset_rotate_deg = steer_percentage * 360
            //Accelerator Progress
            updateSteeringWheel(steer_percentage+ "%",offset_rotate_deg);
        }
    });
}