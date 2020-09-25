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
            // //Steering wheel
            // if(message.ctrl_cmd.steering_angle != null)
            // {
            //     let rad = message.ctrl_cmd.steering_angle;
            //     let rotateDegree = rad % 360; //-35 to +35
            //     // console.log('rotateDegree'+rotateDegree);
            //     let degreePercent = Math.floor(((rotateDegree/360) * 100));
            //     updateSteeringWheel(degreePercent +'%',rotateDegree);
            // }            
            //Brake
            // if(message.brake_cmd.brake != null && g_brakeCircle != null)
            // {
            //     let max, brakeLimit = '';
            //     //set brake  limit to the host vehicle deceleration(brake) limit if exist in session, otherwise default to 6
            //     if(message.brake_cmd.brake>0)
            //         brakeLimit = session_hostVehicle.brakeLimit;
                
            //         max =  brakeLimit != null && brakeLimit.length > 0? brakeLimit: 6;
            //     let value = message.brake_cmd.brake;
            //     updateBrake(g_brakeCircle,max,value);
            // }
            //Accelerator
            if(message.ctrl_cmd.linear_acceleration != null  && g_acceleratorCircle != null)
            {
                let max, accelerationLimit = '';
                //set acceleration limit to the host vehicle acceleration limit if exist in session, otherwise default to 3
                if(message.ctrl_cmd.linear_acceleration > 0)
                   accelerationLimit = session_hostVehicle.accelerationLimit;

                max =  accelerationLimit != null && accelerationLimit.length > 0? accelerationLimit : 3;
                let value = message.ctrl_cmd.linear_acceleration;
                updateAccerator(g_acceleratorCircle,max,value);
            }
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

/**
 * /hardware_interface/speed_pedals
 */
function subscribeToSpeedPedals()
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
function subscribeToSteeringWheel()
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
            let vehicle_steer_lim_deg_rad = session_hostVehicle.steeringLimit * 180/pi;
            let maximum_steering_wheel_angle = session_hostVehicle.steeringRatio * vehicle_steer_lim_deg_rad;
            let steer_percentage = (message.angle / maximum_steering_wheel_angle) * 100;

            //steering degree
            let rotateDegree = message.angle * 180/(Math.PI);
            let rotateDegreeModule = rotateDegree % 360; 

            updateSteeringWheel(steer_percentage+ "%",rotateDegreeModule);
        }  
    });
}