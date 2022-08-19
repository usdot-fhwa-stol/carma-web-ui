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
    // Check if our global subscription variable is defined already
    if (typeof listenerSystemAlert === 'undefined' || listenerSystemAlert === null) 
    {
        console.log("Subscribing to " + T_SYSTEM_ALERT + " type: " + M_SYSTEM_ALERT);
        
        // Initialize a topic object
        listenerSystemAlert = new ROSLIB.Topic({
            ros: g_ros,
            name: T_SYSTEM_ALERT,
            messageType: M_SYSTEM_ALERT
        });

        // Then we add a callback to be called every time a message is published on this topic.
        systemAlertCallback = function (message) 
        {
            //Check ROSBridge connection before subscribe a topic
            if (!IsROSBridgeConnected())
            {
                return;
            };
            var messageTypeFullDescription = 'NA';
            console.log("system alert type" + message.type);
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
                    messageTypeFullDescription = 'System received a CRITICAL message. ' + message.description;
                    MsgPop.open({
                        Type:           "error",
                        Content:        message.description,
                        AutoClose:      true,
                        ClickAnyClose:  true,
                        ShowIcon:       true,
                        HideCloseBtn:   false
                    });
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
                    playSound('audioAlert1', false);
                    break;

                default:
                    session_isSystemAlert.ready = false;
                    messageTypeFullDescription = 'System alert type is unknown. Assuming system it not yet ready.  ' + message.description;
                    break;
            }
            let currentTime = new Date().toLocaleTimeString("en-US", {timeZone: "America/New_York"});
            let eachElement = currentTime+'-'+messageTypeFullDescription + "&#13;&#10;";
            let eachElementLeight = eachElement.length;
            $('#logs-panel-text-system-alert').prepend( eachElement );        
            let currnettext = $('#logs-panel-text-system-alert').html();
            if ( (currnettext.length / eachElementLeight) > MAX_LOG_LINES) 
            {
                $('#logs-panel-text-system-alert').html( currnettext.substring(0, (currnettext.length - eachElementLeight)) );
            }
        };

    } 
    else // If it was defined, close the existing subscription so it can be reopened
    {
        listenerSystemAlert.unsubscribe(systemAlertCallback)
    }


    

    listenerSystemAlert.subscribe(systemAlertCallback);
}