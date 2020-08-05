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
        name: '/hardware_interface/vehicle_cmd',
        messageType: 'autoware_msgs/VehicleCmd'
    });
    listener.subscribe(function(message)
    {
        //Check ROSBridge connection before subscribe a topic
        IsROSBridgeConnected();
        
        if(message!=null && message.ctrl_cmd !=null)
        {
            //Steering wheel
            if(message.ctrl_cmd.steering_angle != null){
                let rad = message.ctrl_cmd.steering_angle;
                let rotateDegree = rad * (180 / Math.PI);
                let degreePercent = (rotateDegree/360) * 100;
                updateSteeringWheel(degreePercent +'%',rotateDegree);
            }            
            //Brake
            if(message.brake_cmd.brake != null && g_brakeCircle != null){
                let max = 100;
                let value = message.brake_cmd.brake;
                updateBrake(g_brakeCircle,max,value);
            }
            //Accelerator
            if(message.ctrl_cmd.linear_acceleration != null && g_acceleratorCircle != null){
                let max = 100;
                let value = message.ctrl_cmd.linear_acceleration;
                updateAccerator(g_acceleratorCircle,max,value);
            }
            //Applied/Command Speed
            if(message.ctrl_cmd.linear_velocity != null){
                let cmdSpeed = message.ctrl_cmd.linear_velocity ;
                updateCmdSpeedCircle(cmdSpeed);
            }
        }
    });
}
