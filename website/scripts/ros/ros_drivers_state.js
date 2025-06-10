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
// TODO: The driver discovery message is no longer used. Currently, the UI updates the status icon
// by checking if GPS messages have been received within the last 0.5 seconds. Eventually we want
// to have a more sophisticated check that displays status options other than on/off
// Story: https://usdot-carma.atlassian.net/browse/CAR-6117
/**
function subscribeToDriverDiscovery()
{
    let listener = new ROSLIB.Topic({
        ros:g_ros,
        name: T_DRIVER_DISCOVERY,
        messageType: M_DRIVER_STATUS
    });

    let isGnssOn = false;
    let isGnssReseted= true;
    listener.subscribe((message)=>
    {
        //Check ROSBridge connection before subscribe a topic
        if (!IsROSBridgeConnected())
        {
            return;
        };

        //Get PinPoint status for now.
        let GPSStatus = document.getElementById('GPS-status');

        if (GPSStatus == null || GPSStatus == 'undefined')
        return;
        //message.gnss is boolean
        if(message.gnss!=null && message.gnss && isGnssReseted)
        {
            isGnssOn = true;
            isGnssReseted = false;

            //reset gnss value in 5 seconds
            if(!isGnssReseted)
            {
                setTimeout(function(){
                    isGnssOn = false;
                    isGnssReseted = true;
                },5000);
            }

        }
        //change pinpoint color
        if(isGnssOn)
        {
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
                    GPSStatus.style.color = '#FF0000'; //Red
                    break;
                default:
                    GPSStatus.style.color = ''; //default to grey
                    break;
            }
        }
        else
        {
            GPSStatus.style.color = ''; //default to grey
        }
    });


}
*/

function checkGPSStatus() {
    if (window.lastGPSMessageTime && (Date.now() - window.lastGPSMessageTime) > 500) {
        updateGPSStatusIcon(false);
    }
}

function updateGPSStatusIcon(status) {
    let GPSStatus = document.getElementById('GPS-status');
    if (GPSStatus) {
        if (status) {
            GPSStatus.style.color = 'rgb(188, 250, 63)'; // Green
        } else {
            GPSStatus.style.color = ''; // Grey
        }
    }
}

//Get Localization status
/**
 * Localization status is at /localization/localization_status of type carma_localization_msgs/msg/LocalizationStatusReport
 rostopic pub -r 10 /localization/localization_status carma_localization_msgs/msg/LocalizationStatusReport "status: 2"

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
        ros: g_ros,
        name: T_LOCALIZATION_STATUS,
        messageType: M_LOCALIZATION_REPORT
    });

    listener.subscribe((message) => {
        //Check ROSBridge connection before subscribe a topic
        if (!IsROSBridgeConnected())
        {
            return;
        };
        switch (message.status) {
            case LOCALIZATION_STATUS_OPERATIONAL:
                $('#localization-status').css('color', 'rgb(188, 250, 63)');
                break;
            case LOCALIZATION_STATUS_DEGRADED:
                $('#localization-status').css('color', '#ffc107');
                break;
            case LOCALIZATION_STATUS_DEGRADED_NO_LIDAR_FIX:
                $('#localization-status').css('color', '#FF0000');
                break;

            default:
                $('#localization-status').css('color', 'gray');
                break;
        }
    });
}
