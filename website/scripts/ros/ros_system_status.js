/*
    Start registering to services and topics to show the status and logs in the UI.
*/
function showStatusandLogs() 
{
    //getParamsForSystemStatus(); //getParams(); Commented out for now to only show system alerts on divLog.
    getVehicleInfo();
    showNavSatFix();
    showSpeedAccelInfo();
    showCANSpeeds();
    showActualSpeed();
    showDiagnostics();
    //showDriverStatus();
    showControllingPlugins();
    checkLateralControlDriver();
    //showUIInstructions();
    mapOtherVehicles();
    checkRouteInfo();
   // showCommStatus(); // Update the signal icon on the status bar based on the binary incoming and outgoing messages.
    //showLightBarStatus(); 
}

/*
    Get all parameters for display.
*/
function getParamsForSystemStatus() {

    g_ros.getParams(function (params) {
        params.forEach(printParam); //Print each param into the log view.
    });
}

/*
 forEach function to print the parameter listing.
*/
function printParam(itemName, index) 
{
    if (itemName.startsWith('/ros') == false) 
    {
        //Sample call to get param.
        var myParam = new ROSLIB.Param({
            ros: g_ros,
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
    Display the Vehicle Info in the System Status tab.
*/
function getVehicleInfo() 
{
    // console.log('getVehicleInfo');
    g_ros.getParams(function (params) {
        params.forEach(showVehicleInfo); //Print each param into the log view.
    });
}

/*
   This called by forEach and doesn't introduce RACE condition compared to using for-in statement.
   Shows only Vehicle related parameters in System Status table.
*/
function showVehicleInfo(itemName, index) 
{
    // if (itemName.startsWith('/saxton_cav/vehicle') == true && itemName.indexOf('database_path') < 0) {
    //     //Sample call to get param.
    //     var myParam = new ROSLIB.Param({
    //         ros: g_ros,
    //         name: itemName
    //     });
    //     // console.log(myParam);
    //     myParam.get(function (myValue) {
    //         //insertNewTableRow('tblSecondB', toCamelCase(itemName), myValue);
    //     });
    // }
    let isHostVehicleInfoDisplayed = false;
    if (itemName.startsWith('/vehicle') == true && itemName.indexOf('database_path') < 0) {
        //Sample call to get param.
        var myParam = new ROSLIB.Param({
            ros: g_ros,
            name: itemName
        });
        // console.log(myParam);
        myParam.get(function (myValue) {        
            //insertNewTableRow('tblSecondB', toCamelCase(itemName), myValue);
            if(!isHostVehicleInfoDisplayed)
            {
                if($('#host_vehicle_info_no_data').length >0)
                {
                    $('#host_vehicle_info_no_data').remove();
                } 
                $('#host_vehicle_info_body').append('<tr><th scope="col"  >' + toCamelCase(itemName)+'</th>'+
                '<td id="host_vehicle_'+itemName+'">'+myValue+'</td></tr>');
                isHostVehicleInfoDisplayed = true;
            }
            else
            {
                document.getElementById('#host_vehicle_'+itemName).innerHTML = myValue;
            }

            /****load host vehicle info to session variables: 
             * brake limit, 
             * acceleration limit, 
             * make, 
             * model
             * ***/
            if(session_hostVehicle != null && itemName.includes('vehicle_make'))
            {
                session_hostVehicle.make = myValue;
            }
            else if(session_hostVehicle != null && itemName.includes('vehicle_model'))
            {
                session_hostVehicle.model = myValue;
            }
            else if(session_hostVehicle != null && itemName.includes('vehicle_acceleration_limit'))
            {
                session_hostVehicle.accelerationLimit = myValue;
            }
            else if(session_hostVehicle != null && itemName.includes('vehicle_deceleration_limit'))
            {
                session_hostVehicle.brakeLimit = myValue;
            }
        });
    }
}

/*
    Changes the string into Camel Case.
*/
function toCamelCase(str) 
{
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
}

/*
    Update the host marker based on the latest NavSatFix position.
*/
function showNavSatFix() 
{
    var listenerNavSatFix = new ROSLIB.Topic({
        ros: g_ros,
        name: t_nav_sat_fix, //not published
        messageType: 'sensor_msgs/NavSatFix'
    });

    listenerNavSatFix.subscribe(function (message) 
    {
        // console.log(message);
        if (message.latitude == null || message.longitude == null)
            return;

        // insertNewTableRow('tblFirstA', 'NavSatStatus', message.status.status);
        // insertNewTableRow('tblFirstA', 'Latitude', message.latitude.toFixed(6));
        // insertNewTableRow('tblFirstA', 'Longitude', message.longitude.toFixed(6));
        // insertNewTableRow('tblFirstA', 'Altitude', message.altitude.toFixed(6));

        if (hostmarker != null) {
            moveMarkerWithTimeout(hostmarker, message.latitude, message.longitude, 0);
        }
    });
}


/*
    Display the close loop control of speed
*/
function showSpeedAccelInfo() 
{
    // console.log('showSpeedAccelInfo');
    var listenerSpeedAccel = new ROSLIB.Topic({
            ros: g_ros,
            name: t_cmd_speed, //not published
            messageType: 'cav_msgs/SpeedAccel'
    });

    listenerSpeedAccel.subscribe(function (message) 
    {

            var cmd_speed_mph = Math.round(message.speed * METER_TO_MPH);
             console.log(message);
            // insertNewTableRow('tblFirstB', 'Cmd Speed (m/s)', message.speed.toFixed(2));
            // insertNewTableRow('tblFirstB', 'Cmd Speed (MPH)', cmd_speed_mph);
            // insertNewTableRow('tblFirstB', 'Max Accel', message.max_accel.toFixed(2));

    });
}
/*
   Log for Diagnostics
*/
function showDiagnostics() 
{
    var listenerACCEngaged = new ROSLIB.Topic({	
        ros: g_ros,	
        name: t_acc_engaged,	
        messageType: 'std_msgs/Bool'	
    });
    let isACCEngagedDisplayed = false;
    listenerACCEngaged.subscribe(function (message) {
        // insertNewTableRow('tblFirstB', 'ACC Engaged', message.data);
        // console.log(message);
        if($('#guidance_info_no_data').length >0)
        {
            $('#guidance_info_no_data').remove();
        } 
        if(!isACCEngagedDisplayed){
            $('#guidance_info_body').append('<tr><th scope="col">ACC Engaged</th>'+
            '<td id="StatusACCEngagedId">'+message.data +'</td></tr>');
            isACCEngagedDisplayed = true;
        }           
        else
        {
            $('#StatusACCEngagedId').text(message.data);
        }    
    });

    var listenerDiagnostics = new ROSLIB.Topic({
        ros: g_ros,
        name: t_diagnostics, //not published
        messageType: 'diagnostic_msgs/DiagnosticArray'
    });
    let isDiagnosticsDisplayed = false;
    listenerDiagnostics.subscribe(function (messageList) {

        messageList.status.forEach(
            function (myStatus) {
                // insertNewTableRow('tblFirstA', 'Diagnostic Name', myStatus.name);
                // insertNewTableRow('tblFirstA', 'Diagnostic Message', myStatus.message);
                // insertNewTableRow('tblFirstA', 'Diagnostic Hardware ID', myStatus.hardware_id);
                if($('#important_vehicle_info_no_data').length >0)
                {
                    $('#important_vehicle_info_no_data').remove();
                } 
                if(!isDiagnosticsDisplayed)
                {
                    $('#guidance_info_body').append('<tr><th scope="col">Diagnostic Name</th>'+
                    '<td id="StatusDiagnosticsNameId">'+ myStatus.name +'</td></tr>');

                    $('#guidance_info_body').append('<tr><th scope="col">Diagnostic Name</th>'+
                    '<td id="StatusDiagnosticsMessageId">'+ myStatus.message +'</td></tr>');

                    $('#guidance_info_body').append('<tr><th scope="col">Diagnostic Name</th>'+
                    '<td id="StatusDiagnosticsHardwareId">'+ myStatus.hardware_id +'</td></tr>');
                    isDiagnosticsDisplayed = true;
                }           
                else
                {
                    $('#StatusDiagnosticsNameId').text(message.data);
                    $('#StatusDiagnosticsMessageId').text(message.message);
                    $('#StatusDiagnosticsHardwareId').text(message.hardware_id);
                } 
                let isStateValueDisplay = false;
                myStatus.values.forEach(
                    function (myValues) {
                        if (myValues.key == 'Primed') {
                            if(!isStateValueDisplay)
                            {
                                $('#guidance_info_body').append('<tr><th scope="col" id="DiagnisticKeys_'+myValues.key+'">'+myValues.key+'</th>'+
                                '<td id="DiagnisticValues_'+myValues.value+'">'+  myValues.value +'</td></tr>');
                            }
                            else
                            {
                                $('#DiagnisticKeys_'+myValues.key).text(myValues.key);
                                $('#DiagnisticValues_'+myValues.value).text(myValues.value);
                            }
                            // insertNewTableRow('tblFirstB', myValues.key, myValues.value);
                           // var imgACCPrimed = document.getElementById('imgACCPrimed');

                            // if (myValues.value == 'True')
                            //     imgACCPrimed.style.backgroundColor = '#4CAF50'; //Green
                            // else
                            //     imgACCPrimed.style.backgroundColor = '#b32400'; //Red
                        }
                        // Commented out since Diagnostics key/value pair can be many and can change. Only subscribe to specific ones.
                        // insertNewTableRow('tblFirstA', myValues.key, myValues.value);
                    }); //foreach
            }
        );//foreach
    });
}

/*
    Display the CAN speeds
*/
function showCANSpeeds() 
{
	var listenerCANEngineSpeed = new ROSLIB.Topic({
	    ros: g_ros,
	    name: t_can_engine_speed, 
	    messageType: 'std_msgs/Float64'
	});
    let isCANEngineSpeedDisplayed= false;
	listenerCANEngineSpeed.subscribe(function (message) {
        // insertNewTableRow('tblFirstB', 'CAN Engine Speed', message.data); 
        if($('#guidance_info_no_data').length >0)
        {
            $('#guidance_info_no_data').remove();
        } 
        if(!isCANEngineSpeedDisplayed)
        {
            $('#guidance_info_body').append('<tr><th scope="col">CAN Engine Speed</th>'+
            '<td id="StatusCANEngineSpeedId">'+message.data.toFixed(2)+'</td></tr>');
            isCANEngineSpeedDisplayed = true;
        }   
        else
        {
            $('#StatusCANEngineSpeedId').text(message.data.toFixed(2));
        }   
	});

	var listenerCANSpeed = new ROSLIB.Topic({
	    ros: g_ros,
	    name: t_can_speed,
	    messageType: 'std_msgs/Float64'
	});
    let isCANSpeedDisplayed = false;
    listenerCANSpeed.subscribe(function (message) 
    {
        var speedMPH = Math.round(message.data.toFixed(2) * METER_TO_MPH);
	    // insertNewTableRow('tblFirstB', 'CAN Speed (m/s)', message.data);
        // insertNewTableRow('tblFirstB', 'CAN Speed (MPH)', speedMPH);
        if($('#guidance_info_no_data').length >0)
        {
            $('#guidance_info_no_data').remove();
        } 
        if(!isCANSpeedDisplayed)
        {
            $('#guidance_info_body').append('<tr><th scope="col" >CAN Speed (m/s)</th>'+
            '<td id="StatusCANSpeedMSId">'+message.data.toFixed(2)+'</td></tr>');

            $('#guidance_info_body').append('<tr><th scope="col">CAN Speed (MPH)</th>'+
            '<td id="StatusCANSpeedMPHId">'+speedMPH+'</td></tr>');
            isCANSpeedDisplayed = true;
        }
        else{
            $('#StatusCANSpeedMSId').text(message.data.toFixed(2));
            $('#StatusCANSpeedMPHId').text(speedMPH);
        }
	});
}


/*
    The Sensor Fusion velocity can be used to derive the actual speed.
*/
function showActualSpeed(){

    var listenerSFVelocity = new ROSLIB.Topic({
        ros: g_ros,
        name: t_sensor_fusion_filtered_velocity, //not published
        messageType: 'geometry_msgs/TwistStamped'
    });
    let isActualSpeedDisplayed= false;
    listenerSFVelocity.subscribe(function (message) {

        //If nothing on the Twist, skip
        if (message.twist == null || message.twist.linear == null || message.twist.linear.x == null) {
            return;
        }
        // console.log(message);

        var actualSpeedMPH = Math.round(message.twist.linear.x * METER_TO_MPH);
        // insertNewTableRow('tblFirstB', 'SF Velocity (m/s)', message.twist.linear.x);
        // insertNewTableRow('tblFirstB', 'SF Velocity (MPH)', actualSpeedMPH);
    });
}

/*
    Show which plugins are controlling the lateral and longitudinal manuevers.
*/
function showControllingPlugins() {
    var listenerControllingPlugins = new ROSLIB.Topic({
        ros: g_ros,
        name: t_controlling_plugins, //not publish
        messageType: 'cav_msgs/ActiveManeuvers'
    });

    listenerControllingPlugins.subscribe(function (message) {
        // insertNewTableRow('tblFirstB', 'Lon Plugin', message.longitudinal_plugin);
        // insertNewTableRow('tblFirstB', 'Lon Manuever', message.longitudinal_maneuver);
        // insertNewTableRow('tblFirstB', 'Lon Start Dist', message.longitudinal_start_dist.toFixed(6));
        // insertNewTableRow('tblFirstB', 'Lon End Dist', message.longitudinal_end_dist.toFixed(6));
        // insertNewTableRow('tblFirstB', 'Lat Plugin', message.lateral_plugin);
        // insertNewTableRow('tblFirstB', 'Lat Maneuver', message.lateral_maneuver);
        // insertNewTableRow('tblFirstB', 'Lat Start Dist', message.lateral_start_dist.toFixed(6));
        // insertNewTableRow('tblFirstB', 'Lat End Dist', message.lateral_end_dist.toFixed(6));
        // console.log(message);
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
function checkLateralControlDriver() 
{
    //Subscription
    var listenerLateralControl = new ROSLIB.Topic({
        ros: g_ros,
        name: t_lateral_control_driver, //not publish
        messageType: 'cav_msgs/LateralControl'
    });

    listenerLateralControl.subscribe(function (message) {
        console.log(message);
        // insertNewTableRow('tblFirstB', 'Lateral Axle Angle', message.axle_angle);
        // insertNewTableRow('tblFirstB', 'Lateral Max Axle Angle Rate', message.max_axle_angle_rate);
        // insertNewTableRow('tblFirstB', 'Lateral Max Accel', message.max_accel);
    });
}


/*
    Subscribe to topic and add each vehicle as a marker on the map.
    If already exist, update the marker with latest long and lat.
*/
function mapOtherVehicles() 
{
    //Subscribe to Topic
    var listenerClient = new ROSLIB.Topic({
        ros: g_ros,
        name: t_incoming_bsm,
        messageType: 'cav_msgs/BSM'
    });
    let isBSMDisplayed = false;
    listenerClient.subscribe(function (message) 
    {
       // console.log(message);
        // insertNewTableRow('tblSecondB', 'BSM Temp ID - ' + message.core_data.id + ': ', message.core_data.id);
        // insertNewTableRow('tblSecondB', 'BSM Latitude - ' + message.core_data.id + ': ', message.core_data.latitude.toFixed(6));
        // insertNewTableRow('tblSecondB', 'BSM Longitude - ' + message.core_data.id + ': ', message.core_data.longitude.toFixed(6));
        //console.log(message);
        //setOtherVehicleMarkers(message.core_data.id, message.core_data.latitude.toFixed(6), message.core_data.longitude.toFixed(6));
        if($('#host_vehicle_info_no_data').length >0)
        {
            $('#host_vehicle_info_no_data').remove();
        } 
        if(document.getElementById('BSMTempIdRow_'+message.core_data.id) == null)
        {
            $('#host_vehicle_info_body').append('<tr id="BSMTempIdRow_'+message.core_data.id+'">'+
            '<th scope="col" id="BSMTempKeyId_'+message.core_data.id+'" >BSM Temp ID -' + message.core_data.id+':</th>'+
            '<td id="BSMTempId_'+message.core_data.id+'">'+message.core_data.id+'</td></tr>');
        }
        else{
            document.getElementById('BSMTempKeyId_'+message.core_data.id).innerHTML ='BSM Temp ID-' + message.core_data.id;
            document.getElementById('BSMTempId_'+message.core_data.id).innerHTML = message.core_data.id;
           
        }
        if(document.getElementById('BSMLatitudeTitleRow_'+message.core_data.id) == null )
        {
            $('#host_vehicle_info_body').append('<tr id="BSMLatitudeTitleRow_'+message.core_data.id+'"><th scope="col" id="BSMLatitudeTitle_'+message.core_data.id+'">BSM Latitude -'+ message.core_data.id+':</th>'+
            '<td id="BSMLatitudeId_'+message.core_data.id+'">' + message.core_data.latitude.toFixed(6) + '</td></tr>');
        }
        else
        {            
            document.getElementById('BSMLatitudeTitle_'+message.core_data.id).innerHTML ='BSM Latitude-' + message.core_data.id;
            document.getElementById('BSMLatitudeId_'+message.core_data.id).innerHTML = message.core_data.latitude.toFixed(6);
        }
        if(document.getElementById('BSMLogitudeTitleRow_'+message.core_data.id) == null)
        {
            $('#host_vehicle_info_body').append('<tr id="BSMLogitudeTitleRow_'+message.core_data.id+'"><th scope="col" id="BSMLogitudeTitle_'+message.core_data.id+'">BSM Longitude -' + message.core_data.id+':</th>'+
            '<td id="BSMLongitudeId_'+message.core_data.id+'">' + message.core_data.longitude.toFixed(6) + '</td></tr>');
        }
        else
        {  
            document.getElementById('BSMLogitudeTitle_'+message.core_data.id).innerHTML ='BSM Longitude-' + message.core_data.id;
            document.getElementById('BSMLongitudeId_'+message.core_data.id).innerHTML = message.core_data.longitude.toFixed(6)
        }
    });
}

/*
    Watch out for route completed, and display the Route State in the System Status tab.
    Route state are only set and can be shown after Route has been selected.
*/

function checkRouteInfo() {
    console.log('check orute');
    //Display the lateset route name and timer.
    // var divRouteInfo = document.getElementById('divRouteInfo');
    // if (divRouteInfo != null || divRouteInfo != 'undefined')
    //     divRouteInfo.innerHTML = selectedRoute.name + ' : ' + engaged_timer;
	
    //Get Route Event
    var listenerRouteEvent = new ROSLIB.Topic({
        ros: g_ros,
        name: t_route_event,
        messageType: 'cav_msgs/RouteEvent'
    });
    let isRouteEventDisplayed = false;
    listenerRouteEvent.subscribe(function (message) {
        //insertNewTableRow('tblSecondA', 'Route Event', message.event);
        if($('#route_info_no_data').length >0)
        {
            $('#route_info_no_data').remove();
        } 
        if(!isRouteEventDisplayed)
        {
            $('#route_info_body').append('<tr><th scope="col" >Route Event</th>'+
            '<td id="StatusRouteEventId">'+message.event+'</td></tr>');
            isRouteEventDisplayed = true;
        }
        else{
            $('#StatusRouteEventId').text(message.event);
        }

        //If completed, then route topic will publish something to guidance to shutdown.
        //For UI purpose, only need to notify the USER and show them that route has completed.
        //Allow user to be notified of route completed/left route even if guidance is not active/engaged.
        let messageTypeFullDescription='';
        if (message.event == 3) //ROUTE_COMPLETED=3
        {
            //showModal(false, 'ROUTE COMPLETED. <br/> <br/> PLEASE TAKE MANUAL CONTROL OF THE VEHICLE.', true);
            messageTypeFullDescription = 'ROUTE COMPLETED. <br/> <br/> PLEASE TAKE <strong>MANUAL</strong> CONTROL OF THE VEHICLE.';
            //If this modal does not exist, create one 
            if( $('#systemAlertModal').length < 1 ) 
            { 
                $('#ModalsArea').append(createSystemAlertModal(
                    '<span style="color:red"><i class="fas fa-bug"></i></span>SYSTEM ALERT', 
                    messageTypeFullDescription,
                    true,true
                    ));              
            }
           $('#systemAlertModal').modal({backdrop: 'static', keyboard: false}); 
        }

        if (message.event == 4)//LEFT_ROUTE=4
        { 
            messageTypeFullDescription = 'You have LEFT THE ROUTE. <br/> <br/> PLEASE TAKE <strong>MANUAL</strong> CONTROL OF THE VEHICLE.';
             //If this modal does not exist, create one 
             if( $('#systemAlertModal').length < 1 ) 
             { 
                 $('#ModalsArea').append(createSystemAlertModal(
                     '<span style="color:red"><i class="fas fa-bug"></i></span>SYSTEM ALERT', 
                     messageTypeFullDescription,
                     true,true
                     ));              
             }
            $('#systemAlertModal').modal({backdrop: 'static', keyboard: false}); 
            //showModal(true, 'You have LEFT THE ROUTE. <br/> <br/> PLEASE TAKE MANUAL CONTROL OF THE VEHICLE.', true);
        }
    });

    //Get Route State
    var listenerRouteState = new ROSLIB.Topic({
        ros: g_ros,
        name: t_route_state,
        messageType: 'cav_msgs/RouteState'
    });

    let isRouteStateDisplayed = false;
    listenerRouteState.subscribe(function (message) {
        // insertNewTableRow('tblSecondA', 'Route ID', message.routeID);
        // insertNewTableRow('tblSecondA', 'Route State', message.state);
        // insertNewTableRow('tblSecondA', 'Cross Track / Down Track', message.cross_track.toFixed(2) + ' / ' + message.down_track.toFixed(2));

        // insertNewTableRow('tblSecondA', 'Current Segment ID', message.current_segment.waypoint.waypoint_id);
        // insertNewTableRow('tblSecondA', 'Current Segment Max Speed', message.current_segment.waypoint.speed_limit);

        // if (message.lane_index != null && message.lane_index != 'undefined') {
        //     insertNewTableRow('tblSecondA', 'Lane Index', message.lane_index);
        // }

        // if (message.current_segment.waypoint.lane_count != null
        //     && message.current_segment.waypoint.lane_count != 'undefined') {
        //     insertNewTableRow('tblSecondA', 'Current Segment Lane Count', message.current_segment.waypoint.lane_count);
        //     insertNewTableRow('tblSecondA', 'Current Segment Req Lane', message.current_segment.waypoint.required_lane_index);
        // }
        if($('#route_info_no_data').length >0)
        {
            $('#route_info_no_data').remove();
        } 
        if(!isRouteStateDisplayed)
        {
            $('#route_info_body').append('<tr><th scope="col" >Route ID</th>'+
            '<td id="StatusRouteStateId">'+message.routeID+'</td></tr>');

            $('#route_info_body').append('<tr><th scope="col" >Route State</th>'+
            '<td id="StatusRouteStateStatusId">'+message.state+'</td></tr>');

            $('#route_info_body').append('<tr><th scope="col" >Cross Track / Down Track</th>'+
            '<td id="StatusRouteStatetrackDivideId">'+message.cross_track.toFixed(2) + ' / ' + message.down_track.toFixed(2)+'</td></tr>');
            
            // if (message.lane_index != null && message.lane_index != 'undefined') {
            //     // insertNewTableRow('tblSecondA', 'Lane Index', message.lane_index);
            //     $('#route_info_body').append('<tr><th scope="col" >Lane Index</th>'+
            //     '<td id="StatusRouteStateLaneIndexId">'+message.lane_index+'</td></tr>');
            // }
            // if (message.current_segment.waypoint.lane_count != null
            //     && message.current_segment.waypoint.lane_count != 'undefined') {
            //     insertNewTableRow('tblSecondA', 'Current Segment Lane Count', message.current_segment.waypoint.lane_count);
            //     insertNewTableRow('tblSecondA', 'Current Segment Req Lane', message.current_segment.waypoint.required_lane_index);
                
            //     $('#route_info_body').append('<tr><th scope="col" >Current Segment Lane Count</th>'+
            //     '<td id="StatusRouteStateLaneIndexId">'+message.current_segment.waypoint.lane_count+'</td></tr>');

            //     $('#route_info_body').append('<tr><th scope="col" >Current Segment Req Lane</th>'+
            //     '<td id="StatusRouteStateLaneIndexId">'+message.current_segment.waypoint.required_lane_index+'</td></tr>');
            // }
            isRouteStateDisplayed = true;
        }
        else
        {
            $('#StatusRouteStateId').text(message.routeID);
            $('#StatusRouteStateStatusId').text(message.state);
            $('#StatusRouteStatetrackDivideId').text(message.cross_track.toFixed(2) + ' / ' + message.down_track.toFixed(2));
        }

    });
}
