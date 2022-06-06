/*
 * Copyright (C) 2018-2021 LEIDOS.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */

/***
 This file shall contain ROS related function calls.
****/

// *** Global variables ***
// Deployment variables
var ip = CarmaJS.Config.getIP();

// Topics
var t_carma_system_version = "/carma_system_version";

var t_system_alert = 'system_alert';
var t_available_plugins = 'plugins/available_plugins';
var t_controlling_plugins = 'plugins/controlling_plugins';
var t_guidance_instructions = 'ui_instructions';
var t_ui_platoon_vehicle_info = 'ui_platoon_vehicle_info';

var t_route_state = 'route_state';
var t_route_event = 'route_event';
var t_active_route = 'route';

var t_diagnostics = '/diagnostics';

var t_ekf_twist = '/localization/ekf_twist';

var t_guidance_state = 'state';
var t_incoming_bsm = 'bsm';

var t_driver_discovery = 'driver_discovery';
var t_ui_instructions = 'ui_instructions';


var tbn_robot_status = 'control/robot_status';
var tbn_cmd_speed = 'control/cmd_speed';
var tbn_lateral_control_driver = 'control/cmd_lateral';

var tbn_can_engine_speed = 'can/engine_speed';
var tbn_can_speed = 'can/speed';
var tbn_acc_engaged = 'can/acc_engaged';

var tbn_inbound_binary_msg = 'comms/inbound_binary_msg';
var tbn_outbound_binary_msg = 'comms/outbound_binary_msg';


var t_robot_status = 'controller/robotic_status';
var t_cmd_speed = 'controller/vehicle_cmd';
var t_light_bar_status = 'control/light_bar_status'; //02/2019: added to display lightbar on UI

var t_can_engine_speed = 'can/engine_speed';
var t_can_speed = 'can/speed';
var t_acc_engaged = 'can/acc_engaged';

var t_inbound_binary_msg = 'comms/inbound_binary_msg';
var t_outbound_binary_msg = 'comms/outbound_binary_msg';

//Interface manager - getDriverswithCapabilities call are asynchronous so putting logic to wait.
var bGetDriversWithCapCalled = false;
var getDriversWithCap_counter = 0;
var getDriversWithCap_max_trial = 10;

// Services
var s_get_available_routes = 'get_available_routes';
var s_set_active_route = 'set_active_route';
var s_start_active_route = 'start_active_route';
var s_get_registered_plugins = 'plugins/get_registered_plugins';
var s_activate_plugins = 'plugins/activate_plugin';
var s_set_guidance_active = 'set_guidance_active';

// Params
var p_host_instructions = '/saxton_cav/ui/host_instructions';
var p_page_refresh_interval = '/saxton_cav/ui/page_refresh_interval';

// ROS related
var ros = new ROSLIB.Ros();
var listenerPluginAvailability;
var listenerSystemAlert;

// Counters and Flags
var cnt_log_lines = 0;
var ready_counter = 0;
var ready_max_trial = 10;
var sound_counter = 0;
var sound_counter_max = 3; //max # of times the sounds will be repeated.
var sound_played_once = false;
var isModalPopupShowing = false;
var waitingForRouteStateSegmentStartup = false;
var timer;
var engaged_timer = '00h 00m 00s'; //timer starts after vehicle first engages.
var host_instructions = '';

//Elements frequently accessed.
var divCapabilitiesMessage = document.getElementById('divCapabilitiesMessage');
var audioElements = document.getElementsByTagName('audio');

//Constants
var MAX_LOG_LINES = 100;
var METER_TO_MPH = 2.23694;
var METER_TO_MILE = 0.000621371;

//Get the drivers topic from Interface Manager
//var serviceClientForGetDriversWithCap = new ROSLIB.Service({
//  ros: ros,
//  name: t_get_drivers_with_capabilities,
//  serviceType: 'cav_srvs/GetDriversWithCapabilities'
//});

//Getters and Setters for bool and string session variables.
var isGuidance = {
    get active() {
        var isGuidanceActive = sessionStorage.getItem('isGuidanceActive');
        var value = false;

        if (isGuidanceActive != 'undefined' && isGuidanceActive != null && isGuidanceActive != '') {
            if (isGuidanceActive == 'true')
                value = true;
        }
        //console.log('get active - isGuidanceActive: ' + isGuidanceActive + ' ; value: ' + value + ' ; Boolean:' + Boolean(isGuidanceActive));
        return value;
    },
    set active(newValue) {
        sessionStorage.setItem('isGuidanceActive', newValue);
        //console.log('set active: ' + newValue + ' ; Boolean:' + Boolean(newValue));
    },
    get engaged() {
        var isGuidanceEngaged = sessionStorage.getItem('isGuidanceEngaged');
        var value = false;

        if (isGuidanceEngaged != 'undefined' && isGuidanceEngaged != null && isGuidanceEngaged != '') {
            if (isGuidanceEngaged == 'true')
                value = true;
        }
        //console.log('get engaged  - isGuidanceEngaged: ' + isGuidanceEngaged + ' ; value: ' + value + ' ; Boolean:' + Boolean(isGuidanceEngaged));
        return value;
    },
    set engaged(newValue) {
        sessionStorage.setItem('isGuidanceEngaged', newValue);
        //console.log('set engaged: ' + newValue + ' ; Boolean:' + Boolean(newValue));
    },
    remove() {
        sessionStorage.removeItem('isGuidanceActive');
        sessionStorage.removeItem('isGuidanceEngaged');
    }
};

var isSystemAlert = {
    get ready() {
        var isSystemAlert = sessionStorage.getItem('isSystemAlert');
        var value = false;

        //Issue with Boolean returning opposite value, therefore doing manual check.
        if (isSystemAlert != 'undefined' && isSystemAlert != null && isSystemAlert != '') {
            if (isSystemAlert == 'true')
                value = true;
        }
        //console.log('get active - isSystemAlert: ' + isSystemAlert + ' ; value: ' + value + ' ; Boolean:' + Boolean(isSystemAlert));
        return value;
    },
    set ready(newValue) {
        sessionStorage.setItem('isSystemAlert', newValue);
        //console.log('set active: ' + newValue + ' ; Boolean:' + Boolean(newValue));
    },
    remove() {
        sessionStorage.removeItem('isSystemAlert');
    }
};

var startDateTime = {//startDateTime
    get value() {
        var startDateTime = sessionStorage.getItem('startDateTime');
        //console.log('get startDateTime ORIG: ' + startDateTime);
        if (startDateTime == 'undefined' || startDateTime == null || startDateTime == '') {
            this.start();
            startDateTime = sessionStorage.getItem('startDateTime');
        }

        //console.log('get startDateTime FINAL: ' + startDateTime);
        return startDateTime;
    },
    set value(newValue) {
        sessionStorage.setItem('startDateTime', newValue);
        //console.log('set startDateTime: ' + newValue);
    },
    remove() {
        sessionStorage.removeItem('startDateTime');
    },
    start() {
        sessionStorage.setItem('startDateTime', new Date().getTime());
    }
};

var selectedRoute = {
    get name() {
        var selectedRouteName = sessionStorage.getItem('selectedRouteName');

        //console.log('get selectedRouteName INITIAL: ' + selectedRouteName);

        if (selectedRouteName == 'undefined' || selectedRouteName == null || selectedRouteName.length == 0) {
            selectedRouteName = 'No Route Selected';
        }

        //console.log('get selectedRouteName FINAL: ' + selectedRouteName);

        return selectedRouteName;
    },
    set name(newValue) {
        sessionStorage.setItem('selectedRouteName', newValue);
        //console.log('set selectedRouteName: ' + newValue);
    },
    remove() {
        sessionStorage.removeItem('selectedRouteName');
    }
};

/*
* Custom sleep used in enabling guidance
*/
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/*
    Connection to ROS
*/
function connectToROS() {

    var isConnected = false;

    try {
        // If there is an error on the backend, an 'error' emit will be emitted.
        ros.on('error', function (error) {
            addToLogView ('ROS Connection Error.');
            divCapabilitiesMessage.innerHTML = 'Sorry, unable to connect to ROS server, please refresh your page to try again or contact your System Admin.';
            console.log(error);

            document.getElementById('connecting').style.display = 'none';
            document.getElementById('connected').style.display = 'none';
            document.getElementById('closed').style.display = 'none';
            document.getElementById('error').style.display = 'inline';

        });

        // Find out exactly when we made a connection.
        ros.on('connection', function () {
            addToLogView ('ROS Connection Made.');
            document.getElementById('connecting').style.display = 'none';
            document.getElementById('error').style.display = 'none';
            document.getElementById('closed').style.display = 'none';
            document.getElementById('connected').style.display = 'inline';

            //After connecting on first load or refresh, evaluate at what step the user is at.
            evaluateNextStep();
        });

        ros.on('close', function () {
            addToLogView ('ROS Connection Closed.');
            document.getElementById('connecting').style.display = 'none';
            document.getElementById('connected').style.display = 'none';
            document.getElementById('closed').style.display = 'inline';


            //Show modal popup for when ROS connection has been abruptly closed.
            var messageTypeFullDescription = 'ROS Connection Closed.';
            messageTypeFullDescription += '<br/><br/>PLEASE TAKE MANUAL CONTROL OF THE VEHICLE.';
            showModal(true, messageTypeFullDescription, false);


        });

        // Create a connection to the rosbridge WebSocket server.
        ros.connect('ws://' + ip + ':9090');

    }
    catch (err) {
        $('#divCapabilitiesContent').html('Unexpected Error. Sorry, unable to connect to ROS server, please refresh your page to try again or contact your System Admin.');
        console.log(err);
    }
}

/*
    Add the information to Log View.
*/
function addToLogView (logMessage)
{
        //Truncate the log when MAX_LOG_LINES has been reached.
        if (cnt_log_lines < MAX_LOG_LINES) {
            document.getElementById('divLog').innerHTML += '<br/> ' + logMessage;
            cnt_log_lines++;
        }
        else {
            document.getElementById('divLog').innerHTML = logMessage;
            cnt_log_lines = 0;
        }

        //Show the rest of the system alert messages in the log.
        //Make sure message list is scrolled to the bottom
        var container = document.getElementById('divLog');
        var containerHeight = container.clientHeight;
        var contentHeight = container.scrollHeight;
        container.scrollTop = contentHeight - containerHeight;

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
            case 1: //CAUTION
                addToLogView ('CAUTION: ' + message.description);

                MsgPop.open({
                Type:			"caution",
                Content:		message.description,
                AutoClose:		true,
                CloseTimer:		30000,
                ClickAnyClose:	true,
                ShowIcon:		true,
                HideCloseBtn:	false});

                break;
            case 2: //WARNING
                addToLogView ('WARNING: ' + message.description);

                MsgPop.open({
                Type:			"warning",
                Content:		message.description,
                AutoClose:		true,
                CloseTimer:		30000,
                ClickAnyClose:	true,
                ShowIcon:		true,
                HideCloseBtn:	false});
                break;

            case 3: //FATAL - equivalent to CRITICAL "error". Don't use the word FATAL to describe to users.
                addToLogView ('CRITICAL: ' + message.description);

                MsgPop.open({
                Type:			"error",
                Content:		message.description,
                AutoClose:		true,
                CloseTimer:		30000,
                ClickAnyClose:	true,
                ShowIcon:		true,
                HideCloseBtn:	false});
                break;
            case 4://NOT_READY
                isSystemAlert.ready = false;
                messageTypeFullDescription = 'System is not ready, please wait and try again. ' + message.description;
                break;
            case 5://DRIVERS_READY
                isSystemAlert.ready = true;
                messageTypeFullDescription = 'System is ready. ' + message.description;
                break;
            case 6: //SHUTDOWN
                isSystemAlert.ready = false;

                //Show modal popup for Fatal alerts.
                messageTypeFullDescription = 'System is shutting down. <br/><br/>' + message.description;
                messageTypeFullDescription += '<br/><br/>PLEASE TAKE MANUAL CONTROL OF THE VEHICLE.';
                listenerSystemAlert.unsubscribe();
                showModal(true, messageTypeFullDescription, false);

                listenerSystemAlert.unsubscribe();
                break;
            default:
                messageTypeFullDescription = 'System alert type is unknown. Assuming system it not yet ready.  ' + message.description;
        }
    });
}

/*
    Show user the available route options.
*/
function showRouteOptions() {

    divCapabilitiesMessage.innerHTML = 'Awaiting the list of available routes...'

    // Create a Service client with details of the service's name and service type.
    var getAvailableRoutesClient = new ROSLIB.Service({
        ros: ros,
        name: s_get_available_routes,
        serviceType: 'cav_srvs/GetAvailableRoutes'
    });

    // Create a Service Request with no arguments.
    var request = new ROSLIB.ServiceRequest({

    });

    // Call the service and get back the results in the callback.
    // The result is a ROSLIB.ServiceResponse object.
    getAvailableRoutesClient.callService(request, function (result) {

        divCapabilitiesMessage.innerHTML = 'Please select a route.';

        //Reset and Hide the Capabilities section
        var divSubCapabilities = document.getElementById('divSubCapabilities');
        divSubCapabilities.style.display = 'none';
        divSubCapabilities.innerHTML = '';

        //Dispay the Route selection.
        var myRoutes = result.available_routes;
        var divRoutes = document.getElementById('divRoutes');
        divRoutes.innerHTML = '';
        divRoutes.style.display = 'block'; //Show the route section

        for (i = 0; i < myRoutes.length; i++) {
            createRadioElement(divRoutes, myRoutes[i].routeID, myRoutes[i].routeName, myRoutes.length, 'groupRoutes');
        }

        if (myRoutes == null || myRoutes.length == 0) {
            divCapabilitiesMessage.innerHTML = 'Sorry, there are no available routes, and cannot proceed without one. <br/> Please contact your System Admin.';
        }

    });
}

/*
    Set the active route based on user selection.
*/
function setRoute(id) {

    // Calling setActiveRoute service
    var setActiveRouteClient = new ROSLIB.Service({
        ros: ros,
        name: s_set_active_route,
        serviceType: 'cav_srvs/SetActiveRoute'
    });

    var selectedRouteid = id.toString().replace('rb', '');

    // Create a Service Request.
    var request = new ROSLIB.ServiceRequest({
        routeID: selectedRouteid
    });

    //Selected Route
    var rbRoute = document.getElementById(id.toString());

    var ErrorStatus = {
        NO_ERROR: { value: 0, text: 'NO_ERROR' },
        NO_ROUTE: { value: 1, text: 'NO_ROUTE' },
        ALREADY_FOLLOWING_ROUTE: { value: 2, text: 'ALREADY_FOLLOWING_ROUTE' },
        ROUTE_FILE_ERROR: { value: 3, text: 'ROUTE_FILE_ERROR' },
        ROUTING_FAILURE: { value: 4, text: 'ROUTING_FAILURE' },
        TRANSFORM_ERROR: { value: 5, text: 'TRANSFORM_ERROR' },
    };

    // Call the service and get back the results in the callback.
    setActiveRouteClient.callService(request, function (result) {        
        var errorDescription = '';
        switch (result.errorStatus) {
            case ErrorStatus.NO_ERROR.value:
                break;
            case ErrorStatus.NO_ROUTE.value:
                errorDescription = ErrorStatus.NO_ROUTE.text;
                break;
            case ErrorStatus.ALREADY_FOLLOWING_ROUTE.value:
                showSubCapabilitiesView(id);
                break;
            case ErrorStatus.ROUTE_FILE_ERROR.value:
                 errorDescription = ErrorStatus.ROUTE_FILE_ERROR.text;
                 break;
            case ErrorStatus.ROUTING_FAILURE.value:
                 errorDescription = ErrorStatus.ROUTING_FAILURE.text;
                 break;
            case ErrorStatus.TRANSFORM_ERROR.value:
                 errorDescription = ErrorStatus.TRANSFORM_ERROR.text;
                break;
            default: //unexpected value or error
                errorDescription = result.errorStatus; //print the number;
                break;
        }

        if (errorDescription != '') {
            divCapabilitiesMessage.innerHTML = 'Setting the route failed (' + errorDescription + '). <br/> Please try again or contact your System Administrator.';

            //Allow user to select the route again
            var rbRoute = document.getElementById(id.toString());
            rbRoute.checked = false;
        }
        else { //Call succeeded
            //Subscribe to active route to map the segments
            showActiveRoute();
        }
    });
}

/*
    After capabilities is initially selected, store route name and the plugin list.
*/
function showSubCapabilitiesView(id) {

    var labelId = id.toString().replace('rb', 'lbl');
    var lblRoute = document.getElementById(labelId);

    if (lblRoute == null)
        return;

    selectedRoute.name = lblRoute.innerHTML;

    showSubCapabilitiesView2();
}

/*
    If route has been selected, show the Route Info and plugin options.
*/
function showSubCapabilitiesView2() {

    //if route hasn't been selected, skip
    if (selectedRoute.name == 'No Route Selected')
        return;

    divCapabilitiesMessage.innerHTML = 'Selected route is " ' + selectedRoute.name + '". <br/>';

    //Hide the Route selection
    var divRoutes = document.getElementById('divRoutes');
    divRoutes.style.display = 'none';

    //Display the list of Plugins
    var divSubCapabilities = document.getElementById('divSubCapabilities');
    divSubCapabilities.style.display = 'block';

    if (waitingForRouteStateSegmentStartup == false) {
        //Need to wait for route current segment to publish to not get negative total lengths.
        setTimeout(function () {
            checkRouteInfo();
            //console.log('Wait call for checkRouteInfo.');
            waitingForRouteStateSegmentStartup = true;
        }, 5000);
    }
    else {
        checkRouteInfo();
    }

    //console.log('showPluginOptions called.');
    showPluginOptions();
}

/*
 Show user the registered plugins.
*/
function showPluginOptions() {

    divCapabilitiesMessage.innerHTML += 'Please select one or more capabilities to activate. ';

    // Create a Service client with details of the service's name and service type.
    var getRegisteredPluginsClient = new ROSLIB.Service({
        ros: ros,
        name: s_get_registered_plugins,
        serviceType: 'cav_srvs/PluginList'
    });

    // Create a Service Request.
    var request = new ROSLIB.ServiceRequest({});

    // Call the service and get back the results in the callback.
    getRegisteredPluginsClient.callService(request, function (result) {

        var pluginList = result.plugins;
        var divSubCapabilities = document.getElementById('divSubCapabilities');

        for (i = 0; i < pluginList.length; i++) {

            var cbTitle = pluginList[i].name + ' ' + pluginList[i].version_id + ' (' + pluginList[i].name.trim().match(/\b(\w)/g).join('') + ')'; //get abbreviation;
            var cbId = pluginList[i].name.replace(/\s/g, '_') + '&' + pluginList[i].version_id.replace(/\./g, '_');
            var isChecked = pluginList[i].activated;
            var isRequired = pluginList[i].required;

            //Create the checkbox based on the plugin properties.
            createCheckboxElement(divSubCapabilities, cbId, cbTitle, pluginList.length, 'groupPlugins', isChecked, isRequired, 'activatePlugin');

            //Call Carma Widget to activate for selection for required plugins that are pre-checked.
            //if (Boolean(isChecked) == true)
            //{
                CarmaJS.WidgetFramework.activatePlugin(cbId, cbTitle, isChecked);
            //}
        }

        //If no selection available.
        if (pluginList.length == 0) {
            divCapabilitiesMessage.innerHTML = 'Sorry, there are no selection available, and cannot proceed without one. <br/> Please contact your System Admin.';
        }

        //Enable the Guidance button if plugins are selected
        enableGuidance();
    });
}

/*
  Activate the plugin based on user selection.
*/
function activatePlugin(id) {

    var cbCapabilities = document.getElementById(id);
    var lblCapabilities = document.getElementById(id.toString().replace('cb', 'lbl'));

    //NOTE: Already set by browser to have NEW checked value.
    var newStatus = cbCapabilities.checked;

    //If the plugin is required to be on all times, it cannot be deactivated by the user, so need to notify users with a specific message.
    //Regardless, the call to activate plugin will fail.
    if (newStatus == false && lblCapabilities.innerHTML.indexOf('*') > 0) {
        divCapabilitiesMessage.innerHTML = 'Sorry, this capability is required. It cannot be deactivated.';
        //Need to set it back to original value.
        cbCapabilities.checked = !newStatus;
        return;
    }

    // If guidance is engaged, at least 1 plugin must be selected.
    if (isGuidance.engaged == true) {
        var divSubCapabilities = document.getElementById('divSubCapabilities');
        var cntCapabilitiesSelected = getCheckboxesSelected(divSubCapabilities).length;

        if (cntCapabilitiesSelected == 0) {
            divCapabilitiesMessage.innerHTML = 'Sorry, Guidance is engaged and there must be at least one active capability.'
                + '<br/>You can choose to dis-engage to deactivate all capablities.';

            //Need to set it back to original value.
            cbCapabilities.checked = !newStatus;
            return;
        }
    }

    // Calling service
    var activatePluginClient = new ROSLIB.Service({
        ros: ros,
        name: s_activate_plugins,
        serviceType: 'cav_srvs/PluginActivation'
    });

    // Get name and version.
    var splitValue = id.replace('cb', '').split('&');
    var name = splitValue[0].replace(/\_/g, ' ');
    var version = splitValue[1].replace(/\_/g, '.');

    // Setup the request.
    var request = new ROSLIB.ServiceRequest({
        header: {
            seq: 0
            , stamp: Date.now()
            , frame_id: ''
        },
        pluginName: name,
        pluginVersion: version,
        activated: newStatus
    });

    // If it did NOT get into the callService below, need to set it back.
    cbCapabilities.checked = !newStatus;

    // Call the service and get back the results in the callback.
    activatePluginClient.callService(request, function (result) {

        if (result.newState != newStatus) //Failed
        {
            divCapabilitiesMessage.innerHTML = 'Activating the capability failed, please try again.';
        }
        else {
            var divSubCapabilities = document.getElementById('divSubCapabilities');
            divSubCapabilities.style.display = 'block';
            divCapabilitiesMessage.innerHTML = 'Please select one or more capabilities to activate.';
        }

        //Set to new state set by the PluginManager.
        cbCapabilities.checked = result.newState;

        if (cbCapabilities.checked == false) {
            lblCapabilities.style.backgroundColor = 'gray';
        }
        else if (cbCapabilities.checked == true) {
            lblCapabilities.style.backgroundColor = 'cornflowerblue';
        }

        //Call the widget fw to activate for selection.
        var cbTitle = name + ' ' + version;
        var cbId = id.substring(2,id.length);

        //Populate list for Widget Options.
        CarmaJS.WidgetFramework.activatePlugin(cbId, cbTitle, cbCapabilities.checked);

        //Enable the Guidance button if plugins are selected
        enableGuidance();
    });
}

/*
    Enable the Guidance if at least 1 capability is selected.
    NOTE: This should only be called after route has been selected.
*/
function enableGuidance() {

    //Subscribe to guidance/state.
    checkGuidanceState();

    var divSubCapabilities = document.getElementById('divSubCapabilities');
    var cntSelectedPlugins = getCheckboxesSelected(divSubCapabilities).length;
    var cntSelectedWidgets = CarmaJS.WidgetFramework.countSelectedWidgets();

    //If more than on plugin is selected, enable button.
    if (cntSelectedPlugins > 0 && cntSelectedWidgets > 0) {
        //If guidance is engage, leave as green.
        //Else if not engaged, set to blue.
        if (isGuidance.engaged == false) {
            setCAVButtonState('ENABLED');
            divCapabilitiesMessage.innerHTML += '<br/>' + host_instructions;
        }

        //Load Widgets
        //CarmaJS.WidgetFramework.showWidgetOptions();
        //CarmaJS.WidgetFramework.loadWidgets();
    }
    else {//else if no plugins have been selected, disable button.
        setCAVButtonState('DISABLED');

        if (cntSelectedPlugins > 0)
            CarmaJS.WidgetFramework.showWidgetOptions();

        if (cntSelectedWidgets == 0 )
        {
            if (divCapabilitiesMessage.innerHTML.indexOf('Please go to Driver View to select Widgets') == -1)
                divCapabilitiesMessage.innerHTML += '<br/> Please go to Driver View to select Widgets.';
        }
    }
}

/*
    To activate and de-activate guidance.
    NOTE:
    1) Setting active=true is not the same as engaging. Guidance has to issue engage status based on other criteria.
    2) Setting active=false is the same as disengaging.
*/
function activateGuidance() {

    //audio-fix needs to be on an actual button click event on the tablet.
    loadAudioElements();

    ////Sets the new status OPPOSITE to the current value.
    var newStatus = !isGuidance.active;

    //Call the service to engage guidance.
    var setGuidanceClient = new ROSLIB.Service({
        ros: ros,
        name: s_set_guidance_active,
        serviceType: 'cav_srvs/SetGuidanceActive'
    });

    //Setup the request.
    var request = new ROSLIB.ServiceRequest({
        guidance_active: newStatus
    });

    // Call the service and get back the results in the callback.
    setGuidanceClient.callService(request, function (result) {

        if (Boolean(result.guidance_status) != newStatus) //NOT SUCCESSFUL.
        {
            divCapabilitiesMessage.innerHTML = 'Guidance failed to set the value, please try again.';
            return;
        }

        //When active = false, this is equivalent to disengaging guidance. Would not be INACTIVE since inactivity is set by guidance.
        if (newStatus == false)
        {
            setCAVButtonState('DISENGAGED');
            return;
        }

        //Open to DriveView tab after activating and show the widget options.
        //checkAvailability will call setCAVButtonState
        if (newStatus == true){
            openTab(event, 'divDriverView');
            CarmaJS.WidgetFramework.loadWidgets(); //Just loads the widget
            checkAvailability(); //Start checking availability (or re-subscribe) if Guidance has been engaged.
            checkRobotEnabled(); //Start checking if Robot is active
            return;
        }
    });
}

/*
    Change status and format the button
*/
function setCAVButtonState(state) {

    var btnCAVGuidance = document.getElementById('btnCAVGuidance');

    switch (state) {

        case 'ENABLED': // equivalent READY where user has selected 1 route and at least 1 plugin.
            btnCAVGuidance.disabled = false;
            btnCAVGuidance.className = 'button_cav button_enabled'; //color to blue
            btnCAVGuidance.title = 'Start Guidance';
            btnCAVGuidance.innerHTML = 'Guidance - READY <i class="fa fa-thumbs-o-up"></i>';

            isGuidance.active = false;
            isGuidance.engaged = false;

            break;
        case 'DISABLED': // equivalent NOT READY awaiting user selection.
            btnCAVGuidance.disabled = true;
            btnCAVGuidance.className = 'button_cav button_disabled'; //color to gray
            btnCAVGuidance.title = 'Guidance is disabled.';
            btnCAVGuidance.innerHTML = 'Guidance';

            isGuidance.active = false;
            isGuidance.engaged = false;

            break;
        case 'ACTIVE':
            btnCAVGuidance.disabled = false;
            btnCAVGuidance.className = 'button_cav button_active'; //color to purple
            btnCAVGuidance.title = 'Guidance is now active.';
            btnCAVGuidance.innerHTML = 'Guidance - ACTIVE <i class="fa fa-check"></i>';

            isGuidance.active = true;
            isGuidance.engaged = false;

            break;
        case 'INACTIVE':  //robot_active is inactive
            btnCAVGuidance.disabled = false;
            btnCAVGuidance.className = 'button_cav button_inactive'; // color to orange
            btnCAVGuidance.title = 'Guidance status is inactive.';
            btnCAVGuidance.innerHTML = 'Guidance - INACTIVE <i class="fa fa-times-circle-o"></i>';

            isGuidance.active = false;
            //isGuidance.engaged = false; //LEAVE value as-is.

            //This check to make sure inactive sound is only played once even when it's been published multiple times in a row.
            //It will get reset when status changes back to engage.
            if (sound_played_once == false) {
                playSound('audioAlert3', false);
                sound_played_once = true; //sound has already been played once.
            }
            break;
        case 'ENGAGED':
            btnCAVGuidance.disabled = false;
            btnCAVGuidance.className = 'button_cav button_engaged'; // color to green.

            btnCAVGuidance.title = 'Click to Stop Guidance.';
            btnCAVGuidance.innerHTML = 'Guidance - ENGAGED <i class="fa fa-check-circle-o"></i>';

            isGuidance.active = true;
            isGuidance.engaged = true;

            //reset to replay inactive sound if it comes back again.
            sound_played_once = false;

            break;
        case 'DISENGAGED':
            btnCAVGuidance.disabled = false;
            btnCAVGuidance.className = 'button_cav button_disabled';

            //Update the button title
            btnCAVGuidance.title = 'Start Guidance';
            btnCAVGuidance.innerHTML = 'Guidance - DISENGAGED <i class="fa fa-stop-circle-o"></i>';

            isGuidance.active = false;
            isGuidance.engaged = false;

            //When disengaging, mark all selected plugins to gray.
            setCbSelectedBgColor('gray');

            //Unsubscribe from the topic when dis-engaging from guidance.
            if (listenerPluginAvailability != 'undefined' && listenerPluginAvailability != null)
                listenerPluginAvailability.unsubscribe();

            //AFTER dis-engaging, redirect to a page. Guidance is sending all the nodes to stop.
            //Currently, only way to re-engage would be to re-run the roslaunch file.
            //Discussed that UI DOES NOT need to wait to disconnect and redirect to show any shutdown errors from Guidance.
            showModal(true, 'You are disengaging guidance. <br/> <br/> PLEASE TAKE MANUAL CONTROL OF THE VEHICLE.', true);

            break;
        default:
            break;
    }
}

/*
    Check Guidance State
*/
function checkGuidanceState() {

    // Subscribing to a Topic
    listenerGuidanceState = new ROSLIB.Topic({
        ros: ros,
        name: t_guidance_state,
        messageType: 'cav_msgs/GuidanceState'
    });

    // Then we add a callback to be called every time a message is published on this topic.
    /*
    uint8 STARTUP = 1
    uint8 DRIVERS_READY = 2
    uint8 ACTIVE = 3
    uint8 ENGAGED = 4
    uint8 INACTIVE = 5
    uint8 SHUTDOWN = 0
    */
    listenerGuidanceState.subscribe(function (message) {

        var messageTypeFullDescription = divCapabilitiesMessage.innerHTML;

        switch (message.state) {
            case 1: //STARTUP
                messageTypeFullDescription = 'Guidance is starting up.';
                break;
            case 2: //DRIVERS_READY
                break;
            case 3: //ACTIVE
                messageTypeFullDescription = 'Guidance is now ACTIVE.';
                setCAVButtonState('ACTIVE');
                break;
            case 4: //ENGAGED
                //start the timer when it first engages.
                messageTypeFullDescription = 'Guidance is now ENGAGED.';
                startEngagedTimer();
                setCAVButtonState('ENGAGED');
                break;
            case 5: //INACTIVE
                //Set based on whatever guidance_state says, regardless if UI has not been engaged yet.
                messageTypeFullDescription = 'Guidance is INACTIVE. <br/> To re-engage, double tap the ACC switch downward on the steering wheel.';
                setCAVButtonState('INACTIVE');
                break;
            case 0: //SHUTDOWN
                //Show modal popup for Shutdown alerts Health Monitor. Guidance and other nodes may issue FATAL however, SHUTDOWN will only occur when FATAL is received from the nodes are required.
                messageTypeFullDescription = 'System received a SYSTEM SHUTDOWN. <br/><br/>' + message.description;
                messageTypeFullDescription += '<br/><br/>PLEASE TAKE MANUAL CONTROL OF THE VEHICLE.';

                if(listenerSystemAlert != null && listenerSystemAlert != 'undefined')
                    listenerSystemAlert.unsubscribe();

                showModal(true, messageTypeFullDescription, false);
                break;
            default:
                messageTypeFullDescription = 'System alert type is unknown. Assuming system it not yet ready.  ' + message.description;
        }

        divCapabilitiesMessage.innerHTML = messageTypeFullDescription;
    });
}

/*
 Check for availability when Guidance is engaged
*/
function checkAvailability() {
    //Subscribing to a Topic
    listenerPluginAvailability = new ROSLIB.Topic({
        ros: ros,
        name: t_available_plugins,
        messageType: 'cav_msgs/PluginList'
    });

    // Then we add a callback to be called every time a message is published on this topic.
    listenerPluginAvailability.subscribe(function (pluginList) {

        //If nothing on the list, set all selected checkboxes back to blue (or active).
        if (pluginList == null || pluginList.plugins.length == 0) {
            setCbSelectedBgColor('cornflowerblue');
            return;
        }

        pluginList.plugins.forEach(showAvailablePlugin);

    });//listener
}

/*
    Loop through each available plugin
*/
function showAvailablePlugin(plugin) {

    var cbTitle = plugin.name + ' ' + plugin.version_id;
    var cbId = plugin.name.replace(/\s/g, '_') + '&' + plugin.version_id.replace(/\./g, '_');
    var isActivated = plugin.activated;
    var isAvailable = plugin.available;

    //If available, set to green.
    if (isAvailable == true) {
        setCbBgColor(cbId, '#4CAF50');
    }
    else //if not available, go back to blue.
    {
        setCbBgColor(cbId, 'cornflowerblue');
    }
}

/*
    Get all parameters for display.
*/
function getParams() {

    ros.getParams(function (params) {
        params.forEach(printParam); //Print each param into the log view.
    });

}

/*
 forEach function to print the parameter listing.
*/
function printParam(itemName, index) {

    if (itemName.startsWith('/ros') == false) {
        //Sample call to get param.
        var myParam = new ROSLIB.Param({
            ros: ros,
            name: itemName
        });

        myParam.get(function (myValue) {

            //Commented out for now to only show system alerts on divLog.
            //document.getElementById('divLog').innerHTML += '<br/> Param index[' + index + ']: ' + itemName + ': value: ' + myValue + '.';

            if (itemName == p_host_instructions && myValue != null) {
                host_instructions = myValue;
            }
        });
    }
}

/*
    Check for Robot State
    If no longer active, show the Guidance as Yellow. If active, show Guidance as green.
*/
function checkRobotEnabled() {

    var listenerRobotStatus = new ROSLIB.Topic({
            ros: ros,
            name: t_robot_status,
            messageType: 'cav_msgs/RobotEnabled'
     });

     listenerRobotStatus.subscribe(function (message) {
            insertNewTableRow('tblFirstB', 'Robot Active', message.robot_active);
            insertNewTableRow('tblFirstB', 'Robot Enabled', message.robot_enabled);
     });
}

/*
   Log for Diagnostics
*/
function showDiagnostics() {

    var listenerACCEngaged = new ROSLIB.Topic({	
        ros: ros,	
        name: t_acc_engaged,	
        messageType: 'std_msgs/Bool'	
    });

    listenerACCEngaged.subscribe(function (message) {
        insertNewTableRow('tblFirstB', 'ACC Engaged', message.data);
    });

    var listenerDiagnostics = new ROSLIB.Topic({
        ros: ros,
        name: t_diagnostics,
        messageType: 'diagnostic_msgs/DiagnosticArray'
    });

    listenerDiagnostics.subscribe(function (messageList) {

        messageList.status.forEach(
            function (myStatus) {
                insertNewTableRow('tblFirstA', 'Diagnostic Name', myStatus.name);
                insertNewTableRow('tblFirstA', 'Diagnostic Message', myStatus.message);
                insertNewTableRow('tblFirstA', 'Diagnostic Hardware ID', myStatus.hardware_id);

                myStatus.values.forEach(
                    function (myValues) {
                        if (myValues.key == 'Primed') {
                            insertNewTableRow('tblFirstB', myValues.key, myValues.value);
                            var imgACCPrimed = document.getElementById('imgACCPrimed');

                            if (myValues.value == 'True')
                                imgACCPrimed.style.backgroundColor = '#4CAF50'; //Green
                            else
                                imgACCPrimed.style.backgroundColor = '#b32400'; //Red
                        }
                        // Commented out since Diagnostics key/value pair can be many and can change. Only subscribe to specific ones.
                        // insertNewTableRow('tblFirstA', myValues.key, myValues.value);
                    }); //foreach
            }
        );//foreach
    });

}

/*
    Show Drivers Status for PinPoint.
*/
function showDriverStatus() {

    var listenerDriverDiscovery = new ROSLIB.Topic({
        ros: ros,
        name: t_driver_discovery,
        messageType: 'cav_msgs/DriverStatus'
    });

    listenerDriverDiscovery.subscribe(function (message) {

        var targetImg;

        //Get PinPoint status for now.
        if (message.gnss == true) {
            targetImg = document.getElementById('imgPinPoint');
        }

        if (targetImg == null || targetImg == 'undefined')
            return;

        switch (message.status) {
            case 0: //OFF
                targetImg.style.color = '';
                break;
            case 1: //OPERATIONAL
                targetImg.style.color = '#4CAF50'; //Green
                break;
            case 2: //DEGRADED
                targetImg.style.color = '#ff6600'; //Orange
                break;
            case 3: //FAULT
                targetImg.style.color = '#b32400'; //Red
                break;
            default:
                break;
        }
    });
}

/*
    Show which plugins are controlling the lateral and longitudinal manuevers.
*/
function showControllingPlugins() {
        var listenerControllingPlugins = new ROSLIB.Topic({
            ros: ros,
            name: t_controlling_plugins,
            messageType: 'cav_msgs/ActiveManeuvers'
        });

        listenerControllingPlugins.subscribe(function (message) {
            insertNewTableRow('tblFirstB', 'Lon Plugin', message.longitudinal_plugin);
            insertNewTableRow('tblFirstB', 'Lon Manuever', message.longitudinal_maneuver);
            insertNewTableRow('tblFirstB', 'Lon Start Dist', message.longitudinal_start_dist.toFixed(6));
            insertNewTableRow('tblFirstB', 'Lon End Dist', message.longitudinal_end_dist.toFixed(6));
            insertNewTableRow('tblFirstB', 'Lat Plugin', message.lateral_plugin);
            insertNewTableRow('tblFirstB', 'Lat Maneuver', message.lateral_maneuver);
            insertNewTableRow('tblFirstB', 'Lat Start Dist', message.lateral_start_dist.toFixed(6));
            insertNewTableRow('tblFirstB', 'Lat End Dist', message.lateral_end_dist.toFixed(6));

        //Longitudinal Controlling Plugin
        var spanLonPlugin = document.getElementById('spanLonPlugin');

        if (spanLonPlugin != null && spanLonPlugin != 'undefined'){
            if (message.longitudinal_plugin.trim().length > 0) {
                spanLonPlugin.innerHTML = message.longitudinal_plugin.trim().match(/\b(\w)/g).join(''); //abbreviation
            }
            else {
                spanLonPlugin.innerHTML = '';
            }
        }

        //Lateral Controlling Plugin
        var spanLatPlugin = document.getElementById('spanLatPlugin');

        if (spanLatPlugin != null && spanLatPlugin != 'undefined'){
            if (message.lateral_plugin.trim().length > 0) {
                spanLatPlugin.innerHTML = message.lateral_plugin.trim().match(/\b(\w)/g).join(''); //abbreviation
            }else{
                spanLatPlugin.innerHTML = '';
            }
        }
   });
}
/*
    Show the Lateral Control Driver message
*/
function checkLateralControlDriver() {

    //Subscription
    var listenerLateralControl = new ROSLIB.Topic({
        ros: ros,
        name: t_lateral_control_driver,
        messageType: 'cav_msgs/LateralControl'
    });

    listenerLateralControl.subscribe(function (message) {
        insertNewTableRow('tblFirstB', 'Lateral Axle Angle', message.axle_angle);
        insertNewTableRow('tblFirstB', 'Lateral Max Axle Angle Rate', message.max_axle_angle_rate);
        insertNewTableRow('tblFirstB', 'Lateral Max Accel', message.max_accel);
    });
}

/*
    Show UI instructions
    NOTE: Currently UI instructions are handled at the carma level.
    TODO: Future this topic indicator to handle at carma and plugin level to allow plugin specific actions/icons. For now, will remain here.
*/
function showUIInstructions() {

    var UIInstructionsType = {
        INFO: { value: 0, text: 'INFO' }, //Notification of status or state change
        ACK_REQUIRED: { value: 1, text: 'ACK_REQUIRED' }, //A command requiring driver acknowledgement
        NO_ACK_REQUIRED: { value: 2, text: 'NO_ACK_REQUIRED' }, //A command that does not require driver acknowledgement
    };

    // List out the expected commands to handle that applies at the carma level or generic enough.
    var UIExpectedCommands = {
        LEFT_LANE_CHANGE: { value: 0, text: 'LEFT_LANE_CHANGE' }, //From lateral controller driver
        RIGHT_LANE_CHANGE: { value: 1, text: 'RIGHT_LANE_CHANGE' }, //From lateral controller driver
        //Add new ones here.
    };

    var listenerUiInstructions = new ROSLIB.Topic({
        ros: ros,
        name: t_ui_instructions,
        messageType: 'cav_msgs/UIInstructions'
    });

    listenerUiInstructions.subscribe(function (message) {

        if (message.type == UIInstructionsType.INFO.value) {
            divCapabilitiesMessage.innerHTML = message.msg;
        }
        else {
            var msg = '';

            //NOTE: Currently handling lane change for it's icons
            switch (message.msg) {
                case UIExpectedCommands.LEFT_LANE_CHANGE.text:
                    msg = '<i class="fa fa-angle-left faa-flash animated faa-slow" aria-hidden="true" ></i>';
                    break;
                case UIExpectedCommands.RIGHT_LANE_CHANGE.text:
                    msg = '<i class="fa fa-angle-right faa-flash animated faa-slow" aria-hidden="true" ></i>';
                    break;
                default:
                    msg = message.msg; //text display only.
                    break;
            }

            if (message.type == UIInstructionsType.NO_ACK_REQUIRED.value)
                showModalNoAck(msg); // Show the icon or text  for 3 seconds.

            //Implement ACK_REQUIRED logic to call specific service.
            //For now, no custom icons for acknowledgement, simply YES/NO button. Later may have other options.
            if (message.type == UIInstructionsType.ACK_REQUIRED.value)
            {
                //Show popup to user for acknowledgement and send the response over to the specific plugin.
                showModalAck(msg, message.response_service);
            }
        }
    });
}

/*
    Watch out for route completed, and display the Route State in the System Status tab.
    Route state are only set and can be shown after Route has been selected.
*/
function checkRouteInfo() {

    //Display the lateset route name and timer.
    var divRouteInfo = document.getElementById('divRouteInfo');
    if (divRouteInfo != null || divRouteInfo != 'undefined')
        divRouteInfo.innerHTML = selectedRoute.name + ' : ' + engaged_timer;
	
    //Get Route Event
    var listenerRouteEvent = new ROSLIB.Topic({
        ros: ros,
        name: t_route_event,
        messageType: 'cav_msgs/RouteEvent'
    });

    //TODO: update with latest code
    listenerRouteEvent.subscribe(function (message) {
        insertNewTableRow('tblSecondA', 'Route Event', message.event);

        //If completed, then route topic will publish something to guidance to shutdown.
        //For UI purpose, only need to notify the USER and show them that route has completed.
        //Allow user to be notified of route completed/left route even if guidance is not active/engaged.
        if (message.event == 3) //ROUTE_COMPLETED=3
        {
            showModal(false, 'ROUTE COMPLETED. <br/> <br/> PLEASE TAKE MANUAL CONTROL OF THE VEHICLE.', true);
        }
        if (message.event == 4)//ROUTE_DEPARTED=4
        {
            showModal(true, 'ROUTE DEPARTED. <br/> <br/> PLEASE TAKE MANUAL CONTROL OF THE VEHICLE.', true);
        }
        if (message.event == 5)//ROUTE_ABORTED=5
        {
            showModal(true, 'ROUTE ABORTED. <br/> <br/> PLEASE TAKE MANUAL CONTROL OF THE VEHICLE.', true);
        }
        if (message.event == 6)//ROUTE_GEN_FAILED=6
        {
            showModal(true, 'ROUTE GENERATION FAILED. <br/> <br/> PLEASE TAKE MANUAL CONTROL OF THE VEHICLE.', true);
        }
    });

    //Get Route State
    var listenerRouteState = new ROSLIB.Topic({
        ros: ros,
        name: t_route_state,
        messageType: 'cav_msgs/RouteState'
    });

    listenerRouteState.subscribe(function (message) {

        insertNewTableRow('tblSecondA', 'Route ID', message.routeID);
        insertNewTableRow('tblSecondA', 'Route State', message.state);
        insertNewTableRow('tblSecondA', 'Cross Track / Down Track', message.cross_track.toFixed(2) + ' / ' + message.down_track.toFixed(2));

        insertNewTableRow('tblSecondA', 'LaneLet ID', message.lanelet_id);
        insertNewTableRow('tblSecondA', 'Current LaneLet Downtrack', message.lanelet_downtrack);

        //TODO Later: Need to reimplement this using LaneLet.
        //        if (message.current_segment.waypoint.lane_count != null
        //            && message.current_segment.waypoint.lane_count != 'undefined') {
        //            insertNewTableRow('tblSecondA', 'Current Segment Lane Count', message.current_segment.waypoint.lane_count);
        //            insertNewTableRow('tblSecondA', 'Current Segment Req Lane', message.current_segment.waypoint.required_lane_index);
        //        }

    });
}

/*
    Watch out for route completed, and display the Route State in the System Status tab.
    Route state are only set and can be shown after Route has been selected.
*/
function showActiveRoute() {

    //Get Route State
    var listenerRoute = new ROSLIB.Topic({
        ros: ros,
        name: t_active_route,
        messageType: 'cav_msgs/Route'
    });

    //TODO: No longer applicable in terms of the segments. Will hvae to retire the map or need to get the coordinates somehow.

    listenerRoute.subscribe(function (message) {

        //if route hasn't been selected.
        if (selectedRoute.name == 'No Route Selected')
            return;

        //TODO Later: Need to re-implement after more LaneLet info is published
        //If nothing on the list, set all selected checkboxes back to blue (or active).
        //if (message.segments == null || message.segments.length == 0) {
        //    divCapabilitiesMessage.innerHTML += 'There were no segments found the active route.';
        //    return;
        //}

        //Only map the segment one time.
        //alert('routePlanCoordinates: ' + sessionStorage.getItem('routePlanCoordinates') );
        //if (sessionStorage.getItem('routePlanCoordinates') == null) {
        //    message.segments.forEach(mapEachRouteSegment);
        //}
    });
}

/*
    Loop through each available plugin
*/
//TODO Later: Will re-evaluate if this is still needed after more LaneLet info is published
//    Loop through each available plugin
/**
function mapEachRouteSegment(segment) {

    var segmentLat;
    var segmentLon;
    var position;
    var routeCoordinates; //To map the entire route

    //1) To map the route
    //create new list for the mapping of the route
    if (sessionStorage.getItem('routePlanCoordinates') == null) {
        segmentLat = segment.prev_waypoint.latitude;
        segmentLon = segment.prev_waypoint.longitude;
        position = new google.maps.LatLng(segmentLat, segmentLon);

        routeCoordinates = [];
        routeCoordinates.push(position);
        sessionStorage.setItem('routePlanCoordinates', JSON.stringify(routeCoordinates));
    }
    else //add to existing list.
    {
        segmentLat = segment.waypoint.latitude;
        segmentLon = segment.waypoint.longitude;
        position = new google.maps.LatLng(segmentLat, segmentLon);

        routeCoordinates = sessionStorage.getItem('routePlanCoordinates');
        routeCoordinates = JSON.parse(routeCoordinates);
        routeCoordinates.push(position);
        sessionStorage.setItem('routePlanCoordinates', JSON.stringify(routeCoordinates));
    }
}
***/
/*
    Update the host marker based on the latest NavSatFix position.
*/
//TODO Later: Implement this after more info on LaneLet has been provided to update the map
/***
function showNavSatFix() {

    var listenerNavSatFix = new ROSLIB.Topic({
        ros: ros,
        name: t_nav_sat_fix,
        messageType: 'sensor_msgs/NavSatFix'
    });

    listenerNavSatFix.subscribe(function (message) {

        if (message.latitude == null || message.longitude == null)
            return;

        insertNewTableRow('tblFirstA', 'NavSatStatus', message.status.status);
        insertNewTableRow('tblFirstA', 'Latitude', message.latitude.toFixed(6));
        insertNewTableRow('tblFirstA', 'Longitude', message.longitude.toFixed(6));
        insertNewTableRow('tblFirstA', 'Altitude', message.altitude.toFixed(6));

        if (hostmarker != null) {
            moveMarkerWithTimeout(hostmarker, message.latitude, message.longitude, 0);
        }
    });
}
***/

/*
    Display the close loop control of speed
*/
function showSpeedAccelInfo() {

    var listenerSpeedAccel = new ROSLIB.Topic({
            ros: ros,
            name: t_cmd_speed,
            messageType: 'cav_msgs/SpeedAccel'
    });

    listenerSpeedAccel.subscribe(function (message) {

            var cmd_speed_mph = Math.round(message.speed * METER_TO_MPH);

            insertNewTableRow('tblFirstB', 'Cmd Speed (m/s)', message.speed.toFixed(2));
            insertNewTableRow('tblFirstB', 'Cmd Speed (MPH)', cmd_speed_mph);
            insertNewTableRow('tblFirstB', 'Max Accel', message.max_accel.toFixed(2));

    });
}

/*
    Display the CAN speeds
*/
function showCANSpeeds() {

	var listenerCANEngineSpeed = new ROSLIB.Topic({
	    ros: ros,
	    name: t_can_engine_speed,
	    messageType: 'std_msgs/Float64'
	});

	listenerCANEngineSpeed.subscribe(function (message) {
	    insertNewTableRow('tblFirstB', 'CAN Engine Speed', message.data);
	});

	var listenerCANSpeed = new ROSLIB.Topic({
	    ros: ros,
	    name: t_can_speed,
	    messageType: 'std_msgs/Float64'
	});

	listenerCANSpeed.subscribe(function (message) {
	    var speedMPH = Math.round(message.data * METER_TO_MPH);
	    insertNewTableRow('tblFirstB', 'CAN Speed (m/s)', message.data);
	    insertNewTableRow('tblFirstB', 'CAN Speed (MPH)', speedMPH);
	});
}

/*
    The Sensor Fusion velocity can be used to derive the actual speed.
*/
function showActualSpeed(){

    var listenerSFVelocity = new ROSLIB.Topic({
        ros: ros,
        name: t_ekf_twist,
        messageType: 'geometry_msgs/TwistStamped'
    });

    listenerSFVelocity.subscribe(function (message) {

        //If nothing on the Twist, skip
        if (message.twist == null || message.twist.linear == null || message.twist.linear.x == null) {
            return;
        }

        var actualSpeedMPH = Math.round(message.twist.linear.x * METER_TO_MPH);
        insertNewTableRow('tblFirstB', 'SF Velocity (m/s)', message.twist.linear.x);
        insertNewTableRow('tblFirstB', 'SF Velocity (MPH)', actualSpeedMPH);
    });
}

/*
    Display the Vehicle Info in the System Status tab.
*/
function getVehicleInfo() {

    ros.getParams(function (params) {
        params.forEach(showVehicleInfo); //Print each param into the log view.
    });
}

/*
   This called by forEach and doesn't introduce RACE condition compared to using for-in statement.
   Shows only Vehicle related parameters in System Status table.
*/
function showVehicleInfo(itemName, index) {
    if (itemName.startsWith('/vehicle_') == true) { {
        //Sample call to get param.
        var myParam = new ROSLIB.Param({
            ros: ros,
            name: itemName
        });

        myParam.get(function (myValue) {
            insertNewTableRow('tblSecondB', toCamelCase(itemName), myValue);
        });
    }
}

///TODO: Implement later after more info with LaneLet
/*
    Subscribe to topic and add each vehicle as a marker on the map.
    If already exist, update the marker with latest long and lat.
*/
/***
function mapOtherVehicles() {

    //alert('In mapOtherVehicles');

    //Subscribe to Topic
    var listenerClient = new ROSLIB.Topic({
        ros: ros,
        name: t_incoming_bsm,
        messageType: 'cav_msgs/BSM'
    });


    listenerClient.subscribe(function (message) {
        insertNewTableRow('tblSecondB', 'BSM Temp ID - ' + message.core_data.id + ': ', message.core_data.id);
        insertNewTableRow('tblSecondB', 'BSM Latitude - ' + message.core_data.id + ': ', message.core_data.latitude.toFixed(6));
        insertNewTableRow('tblSecondB', 'BSM Longitude - ' + message.core_data.id + ': ', message.core_data.longitude.toFixed(6));

        setOtherVehicleMarkers(message.core_data.id, message.core_data.latitude.toFixed(6), message.core_data.longitude.toFixed(6));
    });
}
****/

/*
    Update the signal icon on the status bar based on the binary incoming and outgoing messages.
*/
function showCommStatus() {

	// Get the Object by ID
	var a = document.getElementById('objOBUBroadcast');
	// Get the SVG document inside the Object tag
	var svgDoc = a.contentDocument;

	if (t_outbound_binary_msg != null && t_outbound_binary_msg != '')
	{
	   //Subscribe to Topic
	   var listenerClientOutboundMsg = new ROSLIB.Topic({
	       ros: ros,
	       name: t_outbound_binary_msg,
	       messageType: 'cav_msgs/ByteArray'
	   });

	   listenerClientOutboundMsg.subscribe(function (message) {

	       // Get one of the SVG items by ID;
	       var svgItem1 = svgDoc.getElementById('signal-right');
	       // Set the colour to something else
	       svgItem1.setAttribute('fill', '#4CAF50'); //green

	       //set back to black after 5 seconds.
	      setTimeout(function(){
		   // Set the colour to something else
		   svgItem1.setAttribute('fill', '#000000'); //black
	      }, 5000);
	   });
	}

	if (t_inbound_binary_msg != null && t_inbound_binary_msg != '')
	{
	   //Subscribe to Topic
	    var listenerClientInboundMsg = new ROSLIB.Topic({
		ros: ros,
		name: t_inbound_binary_msg,
		messageType: 'cav_msgs/ByteArray'
	    });

	    listenerClientInboundMsg.subscribe(function (message) {

	       // Get one of the SVG items by ID;
	       var svgItem2 = svgDoc.getElementById('signal-left');
	       // Set the colour to something else
	       svgItem2.setAttribute('fill', '#4CAF50'); //green

	       //set back to black after 5 seconds.
	       setTimeout(function(){
		   svgItem2.setAttribute('fill', '#000000'); //black
	       }, 5000);

	    });
	}
}

/*
    Changes the string into Camel Case.
*/
function toCamelCase(str) {
    // Lower cases the string
    return str.toLowerCase()
        // Replaces any with /saxton_cav/
        .replace('/saxton_cav/', ' ')
        // Replaces any - or _ characters with a space
        .replace(/[-_]+/g, ' ')
        // Removes any non alphanumeric characters
        .replace(/[^\w\s]/g, '')
        // Uppercases the first character in each group immediately following a space
        // (delimited by spaces)
        .replace(/ (.)/g, function ($1) { return $1.toUpperCase(); })
        // Removes spaces
        .trim();
    //.replace( / /g, '' );
}

//TODO: Re-implement later after the new topic has been implemented.

/*
    Show light bar status
*/
function showLightBarStatus (){

    var listenerLightBarStatus = new ROSLIB.Topic({
        ros: ros,
        name: t_light_bar_status,
        messageType: 'cav_msgs/LightBarStatus'
    });

    //Issue #606 - removed the dependency on UI state on robot_status. Only show on Status tab.
    listenerLightBarStatus.subscribe(function (message) {
        insertNewTableRow('tblFirstB', 'LightBar:left_arrow: ', message.left_arrow);
        insertNewTableRow('tblFirstB', 'LightBar:right_arrow: ', message.right_arrow);

        insertNewTableRow('tblFirstB', 'LightBar:green_solid: ', message.green_solid);
        insertNewTableRow('tblFirstB', 'LightBar:green_flash: ', message.green_flash);

        insertNewTableRow('tblFirstB', 'LightBar:flash: ', message.flash);
        insertNewTableRow('tblFirstB', 'LightBar:takedown: ', message.takedown); //Not used, green and yellow flashing.

        if (!SVG.supported) {
            console.log('SVG not supported. Some images will not be displayed.');
            return;
        }

        var objLightBarStatus = document.getElementById("objLightBarStatus");
        var svgDocLightBar = objLightBarStatus.getSVGDocument();
        var svgLayerLightBar = svgDocLightBar.getElementById("svgLayerLightBar");
        var e_group = svgLayerLightBar.getElementById("e_group");

        //var rgrd_center = svgLayerLightBar.getElementById("rgrd-center");
        var eShapes = e_group.getElementsByTagName('path'); // get child nodes

        //Initialize
        eShapes[0].style.fill = "url(#rgrd-edge)";
        eShapes[1].style.fill = "url(#rgrd-middle)";
        eShapes[2].style.fill = "url(#rgrd-middle)";
        eShapes[3].style.fill = "url(#rgrd-center)";
        eShapes[4].style.fill = "url(#rgrd-center)";
        eShapes[5].style.fill = "url(#rgrd-middle)";
        eShapes[6].style.fill = "url(#rgrd-middle)";
        eShapes[7].style.fill = "url(#rgrd-edge)";

        //#1 Left Arrow - The yellow lights blink alternating towards left.
        if (message.left_arrow == 1)
        {
            eShapes[0].style.fill = "url(#rgrd-gold-blink-8a)";
            eShapes[1].style.fill = "url(#rgrd-gold-blink-7a)";
            eShapes[2].style.fill = "url(#rgrd-gold-blink-6a)";
            eShapes[3].style.fill = "url(#rgrd-gold-blink-5a)";
            eShapes[4].style.fill = "url(#rgrd-gold-blink-4a)";
            eShapes[5].style.fill = "url(#rgrd-gold-blink-3a)";
            eShapes[6].style.fill = "url(#rgrd-gold-blink-2a)";
            eShapes[7].style.fill = "url(#rgrd-gold-blink-1a)";
        }

        //#2 Right Arrow - The yellow lights blink alternating towards right.
        if (message.right_arrow == 1)
        {
            eShapes[0].style.fill = "url(#rgrd-gold-blink-1a)";
            eShapes[1].style.fill = "url(#rgrd-gold-blink-2a)";
            eShapes[2].style.fill = "url(#rgrd-gold-blink-3a)";
            eShapes[3].style.fill = "url(#rgrd-gold-blink-4a)";
            eShapes[4].style.fill = "url(#rgrd-gold-blink-5a)";
            eShapes[5].style.fill = "url(#rgrd-gold-blink-6a)";
            eShapes[6].style.fill = "url(#rgrd-gold-blink-7a)";
            eShapes[7].style.fill = "url(#rgrd-gold-blink-8a)";
        }

        //#3 For Flashing Yellow
        if (message.flash == 1)
        {
            eShapes[0].style.fill = "url(#rgrd-edge-gold-blink)";
            eShapes[1].style.fill = "url(#rgrd-middle-gold-blink)";
            eShapes[2].style.fill = "url(#rgrd-middle-gold-blink-alt)";
            eShapes[3].style.fill = "url(#rgrd-center-gold-blink)";
            eShapes[4].style.fill = "url(#rgrd-center-gold-blink-alt)";
            eShapes[5].style.fill = "url(#rgrd-middle-gold-blink)";
            eShapes[6].style.fill = "url(#rgrd-middle-gold-blink-alt)";
            eShapes[7].style.fill = "url(#rgrd-edge-gold-blink-alt)";
        }

        //#4
        //For Green Solid, only the 2 middle light bars are solid.
        if (message.green_solid == 1)
        {
                //Engaged -- blink
                eShapes[3].style.fill = "url(#rgrd-center-green)";
                eShapes[4].style.fill = "url(#rgrd-center-green)";
        }

        //#5
        //For Green Flash, only the 2 middle light bars are flashing green and alternating.
        if (message.green_flash == 1)
        {
                eShapes[3].style.fill = "url(#rgrd-center-green-blink)";
                eShapes[4].style.fill = "url(#rgrd-center-green-blink-alt)";
        }

        //#6 Evaluate this last.
        //For Green Solid, only the 2 middle light bars are solid.
        if (message.takedown == 1)
        {
            eShapes[0].style.fill = "url(#rgrd-edge-gold-blink)";
            eShapes[1].style.fill = "url(#rgrd-middle-green-blink)";
            eShapes[2].style.fill = "url(#rgrd-middle-gold-blink-alt)";
            eShapes[3].style.fill = "url(#rgrd-center-green-blink)";
            eShapes[4].style.fill = "url(#rgrd-center-green-blink-alt)";
            eShapes[5].style.fill = "url(#rgrd-middle-gold-blink)";
            eShapes[6].style.fill = "url(#rgrd-middle-green-blink-alt)";
            eShapes[7].style.fill = "url(#rgrd-edge-gold-blink-alt)";
        }

    });
}

/*
    Start registering to services and topics to show the status and logs in the UI.
*/
function showStatusandLogs() {
    getParams();
    getVehicleInfo();
   //showNavSatFix(); TODO: Re-implement later
    showSpeedAccelInfo();
    //showCANSpeeds(); //TODO: decide if this is still needed
    showActualSpeed();
    showDiagnostics();
    showDriverStatus();
    //showControllingPlugins(); //TODO: Decide if this needs to be re-implemented by guidance and UI.
    checkLateralControlDriver();
    showUIInstructions();
    //mapOtherVehicles(); //TODO: Re-implement Later
    showCommStatus();
    //showLightBarStatus(); //TODO: Re-implement later after the topic has been created on CARMA3
}

/*
    Start timer after engaging Guidance.
*/
function startEngagedTimer() {
    // Start counter
    if (timer == null && isGuidance.engaged == true)
    {
        timer = setInterval(countUpTimer, 1000);
        //console.log('*** setInterval & countUpTimer was called.');
    }
}

/*
    Loop function to
    for System Ready status from interface manager.
*/
function waitForSystemReady() {

    setTimeout(function () {   //  call a 5s setTimeout when the loop is called

        if (listenerSystemAlert == null) //only listen once
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
    Evaluate next step AFTER connecting
    Scenario1 : Initial Load
    Scenario 2: Refresh on particular STEP
*/
function evaluateNextStep() {

    //if system not ready and listernerSystemAlert is not initialized
    if (isSystemAlert.ready == false || listenerSystemAlert == null) {
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

        //Enable the Guidance button regardless plugins are selected
        enableGuidance();
    }

}//evaluateNextStep

/*
    Get the CARMA version using the PHP script calling the docker container inspect to get the carma-config image version used.
*/
function getCARMAVersion() 
{
	var request = new XMLHttpRequest();
	var url = "scripts/carmaVersion.php";
	request.open("POST", url, true);
	request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	 
	request.onreadystatechange = function() {
		if(request.readyState == 4 && request.status == 200) {
		showCARMAVersion(request.responseText);
		publishCARMAVersion(request.responseText);
		}
	}
	request.send();
}

/*
    Show the CARMA version under the footer tag.
*/
function showCARMAVersion(response) {
	var elemSystemVersion = document.getElementsByClassName('systemversion');
	elemSystemVersion[0].innerHTML = response;
}

/*
    Publish the CARMA version.
    Initially designed for CARMA Messenger truck inspection plugin needing the CARMAPlatform version.
*/
function publishCARMAVersion(response) {

	var topicCARMASystemVersion = new ROSLIB.Topic({
	    ros: ros,
	    name: t_carma_system_version,
	    messageType: 'std_msgs/String'
	});

    var msg = new ROSLIB.Message({
        data: response
    });

	topicCARMASystemVersion.publish(msg);
}

/*
    Onload function that gets called when first loading the page and on page refresh.
*/
window.onload = function () {

    //Check if localStorage/sessionStorage is available.
    if (typeof (Storage) !== 'undefined') {

        if (!SVG.supported) {
            console.log('SVG not supported. Some images will not be displayed.');
        }

        //Refresh widget
        CarmaJS.WidgetFramework.onRefresh();

        // Adding Copyright based on current year
        var elemCopyright = document.getElementsByClassName('copyright');
        elemCopyright[0].innerHTML = '&copy LEIDOS ' + new Date().getFullYear();

        // Adding CARMA Version based on the carma-config docker container version
        getCARMAVersion();

        //Refresh requires connection to ROS.
        connectToROS();

        //TODO: Figure out how to focus to the top when div innerhtml changes. This doesn't seem to work.
        //divCapabilitiesMessage.addListener('change', function (){divCapabilitiesMessage.focus();}, false);


    } else {
        // Sorry! No Web Storage support..
        divCapabilitiesMessage.innerHTML = 'Sorry, cannot proceed unless your browser support HTML Web Storage Objects. Please contact your system administrator.';

    }
}

/* When the user clicks anywhere outside of the modal, close it.
//TODO: Enable this later when lateral controls are implemented. Currently only FATAL, SHUTDOWN and ROUTE COMPLETED are modal popups that requires users acknowledgement to be routed to logout page.
//TODO: Need to queue and hide modal when user has not acknowledged, when new messages come in that are not fatal, shutdown, route completed, or require user acknowlegement.
window.onclick = function (event) {
    var modal = document.getElementById('modalMessageBox');

    if (event.target == modal) {
        modal.style.display = 'none';
    }
}
*/

