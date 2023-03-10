/***
 * Subscribe to approaching_erv_status ROS2 topic and display the emerency response vehicle status information
 * Command to publish messages:
 *
ros2 topic pub -r  0.5 /guidance/approaching_erv_status carma_msgs/msg/UIInstructions 'stamp:
  sec: 0
  nanosec: 0
msg: 'HAS_APPROACHING_ERV:0'
type: 0
response_service: '''

ros2 topic pub -r  0.5 /guidance/approaching_e^Crv_status carma_msgs/msg/UIInstructions 'stamp:
  sec: 0
  nanosec: 0
msg: 'HAS_APPROACHING_ERV:1,TIME_UNTIL_PASSING:11.6,EGO_VEHICLE_ACTION:Changing\ lanes\ to\ the\ left.'
type: 0
response_service: '''
 */
const HAS_APPROACHING_ERV = "HAS_APPROACHING_ERV";
const TIME_UNTIL_PASSING = "TIME_UNTIL_PASSING";
const EGO_VEHICLE_ACTION = "EGO_VEHICLE_ACTION";
/***
 * Subscribe ERV approaching status ROS2 topics and display the warning message on the UI if ERV is detected.
 * If not ERV detected, hide the warning message.
 */
function subscribeToERVStatusInfo() {
    console.log("subscribeToERVStatusInfo")
    let imgPath = "../../images/ambulance-orange.svg";
    let listener = new ROSLIB.Topic({
        ros: g_ros,
        name: T_ERV_STATUS,
        messageType: M_ERV_UIInstruction
    });

    listener.subscribe(function (message) {
        if (message.msg !== undefined) {
            let statusMsg = message.msg.split(",");
            let statusMap = {};
            if (statusMsg.length >= 1) {
                statusMap[statusMsg[0].split(":")[0]] = statusMsg[0].split(":")[1];
            }
            if (statusMsg.length >= 2) {
                statusMap[statusMsg[1].split(":")[0]] = statusMsg[1].split(":")[1];
            }
            if (statusMsg.length >= 3) {
                statusMap[statusMsg[2].split(":")[0]] = statusMsg[2].split(":")[1];
            }
            if (statusMap[HAS_APPROACHING_ERV] === "1") {
                updateERVStatusDivByEventInfo(imgPath, "<p>Approaching ERV detected!</p><p>Time until passing (secs):"
                    + " <span style=\'color: rgb(167, 223, 57) !important\'>" +
                    statusMap[TIME_UNTIL_PASSING] + "</p><p> ERV Vehicle Status: " +
                    statusMap[EGO_VEHICLE_ACTION] + "</p>", 'border-warning');
            } else {
                $('#divERVStatusContent').empty();
            }
        } else {
            $('#divERVStatusContent').empty();
        }

    });
}

/***
 * Update the UI element given the input image, description and style
 */
function updateERVStatusDivByEventInfo(imgPath, description, borderClass) {
    let wrapper = document.getElementById('erv_status_wrapper');
    let description_dev = document.getElementById('erv_status_description_id');
    let status_icon = document.getElementById('img_erv_status_icon_id');
    if (wrapper != null && wrapper != 'undefined'
        && description_dev != null && description_dev != 'undefined'
        && status_icon != null && status_icon != 'undefined') {

        updateERVStatus(false, imgPath, description);
    }
    else {
        let ERVStatusDiv = createERVStatus(false, imgPath, description);
        $('#divERVStatusContent').append(ERVStatusDiv);
    }

    $('#erv_status_wrapper').removeClass(function (index, css) {
        return (css.match(/(^|\s)border-\w*/g) || []).join(' ');
    });

    $('#erv_status_wrapper').addClass(borderClass);
    $('#divERVStatusContent').css('display', '');
}
