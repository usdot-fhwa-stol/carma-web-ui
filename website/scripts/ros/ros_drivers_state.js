/**
 * Subscribe to /hardware_interface/driver_discovery
 * Show driver status for PintPoint
 */
function subscribeToDriverDiscovery(){
    let listener = new ROSLIB.Topic({
        ros:g_ros,
        name: '/hardware_interface/driver_discovery',
        messageType: 'cav_msgs/DriverStatus'
    });

    listener.subscribe(function(message)
    {
        //Check ROSBridge connection before subscribe a topic
        IsROSBridgeConnected();
        
        //Get PinPoint status for now.
        let GPSStatus = document.getElementById('GPS-status');
        
        if (GPSStatus == null || GPSStatus == 'undefined')
        return;

        if(message.name == '/hardware_interface/mock_gnss'){
            switch (message.status) 
            {
                case 0: //OFF
                    GPSStatus.style.color = '';//grey
                    break;
                case 1: //OPERATIONAL
                    GPSStatus.style.color = '#87b821'; //Green
                    break;
                case 2: //DEGRADED
                    GPSStatus.style.color = '#ff6600'; //Orange
                    break;
                case 3: //FAULT
                    GPSStatus.style.color = '#b32400'; //Red
                    break;
                default:
                    break;
            }
        }        
    });
}