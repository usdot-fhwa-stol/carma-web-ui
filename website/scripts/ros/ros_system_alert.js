
/*
    Evaluate next step AFTER connecting
    Scenario1 : Initial Load
    Scenario 2: Refresh on particular STEP
*/
function evaluateNextStep() {

    waitForSystemReady();

    //Issue#1015 MF: Not used Commented out for now until further testing to make sure we don't need this again.
    //if (isDriverTopicsAllAvailable() == false){
    //    //console.log ('evaluateNextStep: calling waitForGetDriversWithCapabilities')
    //    waitForGetDriversWithCapabilities();
    //}

    // if (selectedRoute.name == 'No Route Selected') {
    //     showRouteOptions();
    //     showStatusandLogs();
    //     //enableGuidance(); Should not enable guidance as route has not been selected.

    // }
    // else {
    //     //ELSE route has been selected and so show plugin page.

    //     //Show Plugin
    //     showSubCapabilitiesView2();

    //     //Subscribe to active route to map the segments
    //     showActiveRoute();

    //     //Display the System Status and Logs.
    //     showStatusandLogs();

    //     //Enable the CAV Guidance button regardless plugins are selected
    //     enableGuidance();
    // }

}//evaluateNextStep


/*
    Loop function to
    for System Ready status from interface manager.
*/
function waitForSystemReady() {
    checkSystemAlerts();   //  check here
    g_ready_counter++;       //  increment the counter

    //If system is now ready
    if (session_isSystemAlert.ready == true) {
        return true; //call to evaluate next step after system is ready.
    }
    //  if the counter < 4, call the loop function
    if (g_ready_counter < READY_MAX_TRIAL && session_isSystemAlert.ready == false) {
        waitForSystemReady();             //  ..  again which will trigger another
        //divCapabilitiesMessage.innerHTML = 'Awaiting SYSTEM READY status ...';
    }
    else { //If over max tries
        if (g_ready_counter >= READY_MAX_TRIAL)
            console.log('Sorry, did not receive SYSTEM READY status, please refresh your browser to try again.');
        //divCapabilitiesMessage.innerHTML = 'Sorry, did not receive SYSTEM READY status, please refresh your browser to try again.';
        return false;
    }
}

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
        messageType: 'cav_msgs/SystemAlert'
    });

    // Then we add a callback to be called every time a message is published on this topic.
    listenerSystemAlert.subscribe(function (message) {

        var messageTypeFullDescription = 'NA';

        switch (message.type) 
        {
            case SYSTEM_ALERT_CAUTION:
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
                //Show modal popup for Fatal alerts.
                messageTypeFullDescription = 'System received a FATAL message. Please wait for system to shut down. <br/><br/>' + message.description;
                messageTypeFullDescription += '<br/><br/>PLEASE TAKE MANUAL CONTROL OF THE VEHICLE.';
                listenerSystemAlert.unsubscribe();
                //If this modal does not exist, create one 
                if( $('#systemAlertModal').length < 1 ) 
                { 
                    $('#ModalsArea').append(createSystemAlertModal(
                        '<span style="color:red"><i class="fas fa-bug"></i></span>SYSTEM ALERT', 
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
                break;

            case SYSTEM_ALERT_SHUTDOWN: 
                session_isSystemAlert.ready = false;
                listenerSystemAlert.unsubscribe();
                //Show modal popup for Fatal alerts.
                messageTypeFullDescription = 'System received a SHUTDOWN message. Please wait for system to shut down. <br/><br/>' + message.description;
                messageTypeFullDescription += '<br/><br/>PLEASE TAKE MANUAL CONTROL OF THE VEHICLE.';
                listenerSystemAlert.unsubscribe();
                //If this modal does not exist, create one 
                if( $('#systemAlertModal').length < 1 ) 
                { 
                    $('#ModalsArea').append(createSystemAlertModal(
                        '<span style="color:red"><i class="fas fa-bug"></i></span>SYSTEM ALERT', 
                        messageTypeFullDescription,
                        false,true
                        ));              
                }
                $('#systemAlertModal').modal({backdrop: 'static', keyboard: false}); 
                playSound('audioAlert1', true);
                break;

            default:
                messageTypeFullDescription = 'System alert type is unknown. Assuming system it not yet ready.  ' + message.description;
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