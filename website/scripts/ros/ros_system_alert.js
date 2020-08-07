
/*
    Evaluate next step AFTER connecting
    Scenario1 : Initial Load
    Scenario 2: Refresh on particular STEP
*/
function evaluateNextStep() {

    if (isSystemAlert.ready == false) {
        waitForSystemReady();
        return;
    }

    //Issue#1015 MF: Not used Commented out for now until further testing to make sure we don't need this again.
    //if (isDriverTopicsAllAvailable() == false){
    //    //console.log ('evaluateNextStep: calling waitForGetDriversWithCapabilities')
    //    waitForGetDriversWithCapabilities();
    //}

    if (selectedRoute.name == 'No Route Selected') {
        showRouteOptions();
        showStatusandLogs();
        //enableGuidance(); Should not enable guidance as route has not been selected.

    }
    else {
        //ELSE route has been selected and so show plugin page.

        //Show Plugin
        showSubCapabilitiesView2();

        //Subscribe to active route to map the segments
        showActiveRoute();

        //Display the System Status and Logs.
        showStatusandLogs();

        //Enable the CAV Guidance button regardless plugins are selected
        enableGuidance();
    }

}//evaluateNextStep


/*
    Loop function to
    for System Ready status from interface manager.
*/
function waitForSystemReady() {

    setTimeout(function () {   //  call a 5s setTimeout when the loop is called
        checkSystemAlerts();   //  check here
        ready_counter++;       //  increment the counter

        //  if the counter < 4, call the loop function
        if (ready_counter < ready_max_trial && isSystemAlert.ready == false) {
            waitForSystemReady();             //  ..  again which will trigger another
            divCapabilitiesMessage.innerHTML = 'Awaiting SYSTEM READY status ...';
        }

        //If system is now ready
        if (isSystemAlert.ready == true) {
            evaluateNextStep(); //call to evaluate next step after system is ready.
        }
        else { //If over max tries
            if (ready_counter >= ready_max_trial)
                divCapabilitiesMessage.innerHTML = 'Sorry, did not receive SYSTEM READY status, please refresh your browser to try again.';
        }
    }, 3000)//  ..  setTimeout()
}

/*
    Check System Alerts from Interface Manager
*/
function checkSystemAlerts() {

    // Subscribing to a Topic
    listenerSystemAlert = new ROSLIB.Topic({
        ros: ros,
        name: t_system_alert,
        messageType: 'cav_msgs/SystemAlert'
    });

    // Then we add a callback to be called every time a message is published on this topic.
    listenerSystemAlert.subscribe(function (message) {

        var messageTypeFullDescription = 'NA';

        switch (message.type) {
            case 1:
                messageTypeFullDescription = 'System received a CAUTION message. ' + message.description;
                break;
            case 2:
                messageTypeFullDescription = 'System received a WARNING message. ' + message.description;
                break;
            case 3:
                //Show modal popup for Fatal alerts.
                messageTypeFullDescription = 'System received a FATAL message. Please wait for system to shut down. <br/><br/>' + message.description;
                messageTypeFullDescription += '<br/><br/>PLEASE TAKE MANUAL CONTROL OF THE VEHICLE.';
                listenerSystemAlert.unsubscribe();
                showModal(true, messageTypeFullDescription, false);
                break;
            case 4:
                isSystemAlert.ready = false;
                messageTypeFullDescription = 'System is not ready, please wait and try again. ' + message.description;
                break;
            case 5:
                isSystemAlert.ready = true;
                messageTypeFullDescription = 'System is ready. ' + message.description;
                break;
            case 6: // SHUTDOWN
                isSystemAlert.ready = false;
                listenerSystemAlert.unsubscribe();
                break;
            default:
                messageTypeFullDescription = 'System alert type is unknown. Assuming system it not yet ready.  ' + message.description;
        }

        if (cnt_log_lines < MAX_LOG_LINES) {
            document.getElementById('divLog').innerHTML += '<br/> ' + messageTypeFullDescription;
            cnt_log_lines++;
        }
        else {
            document.getElementById('divLog').innerHTML = messageTypeFullDescription;
            cnt_log_lines = 0;
        }

        //Show the rest of the system alert messages in the log.
        //Make sure message list is scrolled to the bottom
        var container = document.getElementById('divLog');
        var containerHeight = container.clientHeight;
        var contentHeight = container.scrollHeight;
        container.scrollTop = contentHeight - containerHeight;
    });
}