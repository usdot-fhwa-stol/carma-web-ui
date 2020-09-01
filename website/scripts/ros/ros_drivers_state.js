/**
 * Subscribe to /hardware_interface/driver_discovery
 * Show driver status for PintPoint
 * enumeration values for status:
    uint8  OFF=0
    uint8  OPERATIONAL=1
    uint8  DEGRADED=2
    uint8  FAULT=3
 */
//Get PinPoint status
function subscribeToDriverDiscovery()
{
    let listener = new ROSLIB.Topic({
        ros:g_ros,
        name: T_DRIVER_DISCOVERY,
        messageType: M_DRIVER_STATUS
    });

    listener.subscribe((message)=>
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
                case GPS_DRIVER_STATUS_OFF: //OFF
                    GPSStatus.style.color = '';//grey
                    break;
                case GPS_DRIVER_STATUS_OPERATIONAL: //OPERATIONAL
                    GPSStatus.style.color = 'rgb(188, 250, 63)'; //Green
                    break;
                case GPS_DRIVER_STATUS_DEGRADED: //DEGRADED
                    GPSStatus.style.color = '#ff6600'; //Orange
                    break;
                case GPS_DRIVER_STATUS_FAULT: //FAULT
                    GPSStatus.style.color = '#b32400'; //Red
                    break;
                default:
                    GPSStatus.style.color = ''; //default to grey
                    break;
            }
        }        
    });
}

//Get Localization status
/**
 * Localization status is at /localization/localization_status of type cav_msgs/LocalizationStatusReport
 rostopic pub -r 10 /localization/localization_status cav_msgs/LocalizationStatusReport "status: 2"

enumeration values for status:
uint8 status
uint8 UNINITIALIZED=0 # Entry state of localization system before any intialization has occured. Should only occur at startup.
uint8 INITIALIZING=1 # State where system is currently initializing.
uint8 OPERATIONAL=2 # State representing that the system is initialized and localization has a good fitness score and publication rate.
uint8 DEGRADED=3 # State representing that the system is initialized, but has a poor fitness score or publication rate.
uint8 DEGRADED_NO_LIDAR_FIX=4 # State representing localization is executing without lidar based localization data. 
uint8 AWAIT_MANUAL_INITIALIZATION=5 # State representing that the system was initialized but localization data can no longer be relied upon. 
*/
function subscribeToLocalizationStatusReport()
{
    let listener = new ROSLIB.Topic({
        ros:g_ros,
        name: T_LOCALIZATION_STATUS,
        messageType: M_LOCALIZATION_REPORT
    });

    listener.subscribe((message)=>
    {
        //Check ROSBridge connection before subscribe a topic
        IsROSBridgeConnected();
        switch(message.status)
        {
            case LOCALIZATION_STATUS_OPERATIONAL:
                $('#localization-status').css('color','rgb(188, 250, 63)');
                break;
            default:
                $('#localization-status').css('color','gray');
                break;
        }
    });
}