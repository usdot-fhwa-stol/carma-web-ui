/**
 * Subscribe to /hardware_interface/driver_discovery
 * Show driver status for PintPoint
 */
function subscribeToDriverDiscovery(){
    let listener = new ROSLIB.Topic({
        ros:g_ros,
        name: T_DRIVER_DISCOVERY,
        messageType: M_DRIVER_STATUS
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
                case GPS_STATUS_OFF: //OFF
                    GPSStatus.style.color = '';//grey
                    break;
                case GPS_STATUS_OPERATIONAL: //OPERATIONAL
                    GPSStatus.style.color = '#87b821'; //Green
                    break;
                case GPS_STATUS_DEGRADED: //DEGRADED
                    GPSStatus.style.color = '#ff6600'; //Orange
                    break;
                case GPS_STATUS_FAULT: //FAULT
                    GPSStatus.style.color = '#b32400'; //Red
                    break;
                default:
                    GPSStatus.style.color = ''; //default to grey
                    break;
            }
        }        
    });
}