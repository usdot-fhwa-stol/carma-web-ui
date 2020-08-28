/*
    Check System Alerts from Interface Manager
    uint8   CAUTION = 1
    uint8   WARNING = 2
    uint8   FATAL = 3
    uint8   NOT_READY = 4
    uint8   DRIVERS_READY = 5
    uint8   SHUTDOWN = 6
*/
function checkSystemAlerts() {

    // Subscribing to a Topic
    listenerSystemAlert = new ROSLIB.Topic({
        ros: g_ros,
        name: T_SYSTEM_ALERT,
        messageType: M_SYSTEM_ALERT
    });

    // Then we add a callback to be called every time a message is published on this topic.
    listenerSystemAlert.subscribe(function (message) 
    {
         //Check ROSBridge connection before subscribe a topic
         IsROSBridgeConnected();
        var messageTypeFullDescription = 'NA';
        switch (message.type) 
        {
            case SYSTEM_ALERT_CAUTION:
                session_isSystemAlert.ready = false;
                messageTypeFullDescription = 'System received a CAUTION message. ' + message.description;
                MsgPop.open({
                    Type:			"caution",
                    Content:		message.description,
                    AutoClose:		true,
                    CloseTimer:		30000,
                    ClickAnyClose:	true,
                    ShowIcon:		true,
                    HideCloseBtn:	false});
                break;

            case SYSTEM_ALERT_WARNING:
                session_isSystemAlert.ready = false;
                messageTypeFullDescription = 'System received a WARNING message. ' + message.description;
                MsgPop.open({
                    Type:			"warning",
                    Content:		message.description,
                    AutoClose:		true,
                    CloseTimer:		30000,
                    ClickAnyClose:	true,
                    ShowIcon:		true,
                    HideCloseBtn:	false});
                break;

            case SYSTEM_ALERT_FATAL:
                session_isSystemAlert.ready = false;
                //Show modal popup for Fatal alerts.
                messageTypeFullDescription = 'PLEASE TAKE <strong>MANUAL</strong> CONTROL OF THE VEHICLE.';
                messageTypeFullDescription += '<br/><br/>System received a FATAL message. Please wait for system to shut down. <br/><br/>' + message.description;
                listenerSystemAlert.unsubscribe();
                //If this modal does not exist, create one 
                if( $('#systemAlertModal').length < 1 ) 
                { 
                    $('#ModalsArea').append(createSystemAlertModal(
                        '<span style="color:red"><i class="fas fa-exclamation-triangle"></i></span>&nbsp;&nbsp;SYSTEM ALERT', 
                        messageTypeFullDescription,
                        false,true
                        ));              
                }
                $('#systemAlertModal').modal({backdrop: 'static', keyboard: false}); 
                playSound('audioAlert1', true);
                break;

            case SYSTEM_ALERT_NOT_READY:
                session_isSystemAlert.ready = false;
                messageTypeFullDescription = 'System not ready, please wait and try again. ' + message.description;
                break;

            case SYSTEM_ALERT_DRIVERS_READY: 
                session_isSystemAlert.ready = true;
                messageTypeFullDescription = 'System ready. ' + message.description;
                $('#divCapabilitiesSystemAlert').html('');
                break;

            case SYSTEM_ALERT_SHUTDOWN: 
                session_isSystemAlert.ready = false;
                listenerSystemAlert.unsubscribe();
                //Show modal popup for Fatal alerts.
                messageTypeFullDescription = 'PLEASE TAKE <strong>MANUAL</strong> CONTROL OF THE VEHICLE.';
                messageTypeFullDescription += '<br/><br/>System received a SHUTDOWN message. Please wait for system to shut down. <br/><br/>' + message.description;
                listenerSystemAlert.unsubscribe();
                //If this modal does not exist, create one 
                if( $('#systemAlertModal').length < 1 ) 
                { 
                    $('#ModalsArea').append(createSystemAlertModal(
                        '<span style="color:red"><i class="fas fa-exclamation-triangle"></i></span>&nbsp;&nbsp;SYSTEM ALERT', 
                        messageTypeFullDescription,
                        false,true
                        ));              
                }
                $('#systemAlertModal').modal({backdrop: 'static', keyboard: false}); 
                playSound('audioAlert1', true);
                break;

            default:
                session_isSystemAlert.ready = false;
                messageTypeFullDescription = 'System alert type is unknown. Assuming system it not yet ready.  ' + message.description;
                break;
        }
        let currentTime = new Date().toLocaleTimeString("en-US", {timeZone: "America/New_York"});
        if (g_cnt_log_lines < MAX_LOG_LINES) 
        {
            setTimeout(()=>{
                $('#logs-panel-text-system-alert').append(currentTime+'-'+messageTypeFullDescription + "&#13;&#10;");
                g_cnt_log_lines++;
            },1000);           
        }
        else 
        {
            $('#logs-panel-text-system-alert').html(currentTime+'-'+messageTypeFullDescription + '&#13;&#10;');
            g_cnt_log_lines = 0;
        }
    });
}