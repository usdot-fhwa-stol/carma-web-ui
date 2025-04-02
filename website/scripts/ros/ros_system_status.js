/*
    Start registering to services and topics to show the status and logs in the UI.
*/
function showStatusandLogs() 
{
    getCARMAVersion();
    //getParamsForSystemStatus(); //getParams(); Commented out for now to only show system alerts on divLog.
    getVehicleInfo();
    showNavSatFix();
    showSpeedAccelInfo();
    showCANSpeeds();
    showActualSpeed();
    showDiagnostics();
    // showControllingPlugins(); //Comment out as the message is not defined
    checkLateralControlDriver();
    mapOtherVehicles(); 
    checkRouteInfo();
   // checkRobotEnabled(); //Comment out as the message is not defined
    showTCRPolygon();
    UpdateHostVehicleMarkerLoc();
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
    Fetch the vehicle parameters Yaml file
*/
async function getVehicleInfo() 
{
    console.log('getVehicleInfo');
    // Get vehicle parameters from Yaml file
    try {
        const response = await fetch('VehicleConfigParams.yaml');
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const yamlText = await response.text();
        const data = jsyaml.load(yamlText);
        showVehicleInfo(data);
    } catch (error) {
        console.error('Error reading YAML file:', error);
    }
}

/*
    Load the parameters data from the vehicle config file.
*/
function showVehicleInfo(yamlData) 
{
    let isHostVehicleInfoDisplayed = false;
    for (const parameter in yamlData) {
        if (parameter.startsWith('vehicle') == true && parameter.indexOf('database_path') < 0) {
            if(!isHostVehicleInfoDisplayed)
            {
                if($('#host_vehicle_info_no_data').length > 0)
                {
                    $('#host_vehicle_info_no_data').remove();
                } 
                $('#host_vehicle_info_body').append('<tr><th scope="col"  >' + toCamelCase(parameter)+'</th>'+
                '<td id="host_vehicle_'+parameter+'">'+yamlData[parameter]+'</td></tr>');
                isHostVehicleInfoDisplayed = true;
            }
            else
            {
                let element = document.getElementById('#host_vehicle_'+parameter);
                if (element) {
                    element.innerHTML = yamlData[parameter];
                }
            }

            /****load host vehicle info to session variables: 
             * brake limit, 
             * acceleration limit, 
             * make, 
             * model
             * ***/
            if(session_hostVehicle != null && parameter.includes('vehicle_make'))
            {
                session_hostVehicle.make = yamlData[parameter];
            }
            else if(session_hostVehicle != null && parameter.includes('vehicle_model'))
            {
                session_hostVehicle.model = yamlData[parameter];
            }
            else if(session_hostVehicle != null && parameter.includes('vehicle_acceleration_limit'))
            {
                session_hostVehicle.accelerationLimit = yamlData[parameter];
            }
            else if(session_hostVehicle != null && parameter.includes('vehicle_deceleration_limit'))
            {
                session_hostVehicle.brakeLimit = yamlData[parameter];
            }
            else if(session_hostVehicle != null && parameter.includes('vehicle_steer_lim_deg'))
            {
                session_hostVehicle.steeringLimit = yamlData[parameter];
            }
            else if(session_hostVehicle != null && parameter.includes('vehicle_steering_gear_ratio'))
            {
                session_hostVehicle.steeringRatio = yamlData[parameter];
            }
        }
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
        name: T_NAV_SAT_FIX, 
        messageType: M_NAV_SAT_FIX
    });

    let buffer_size = 10;
    let count_position = 0;
    let vector_positions = [];
    listenerNavSatFix.subscribe(function (message) 
    {
        if (message.latitude == null || message.longitude == null)
            return;
        // insertNewTableRow('tblFirstA', 'NavSatStatus', message.status.status);
        // insertNewTableRow('tblFirstA', 'Latitude', message.latitude.toFixed(6));
        // insertNewTableRow('tblFirstA', 'Longitude', message.longitude.toFixed(6));
        // insertNewTableRow('tblFirstA', 'Altitude', message.altitude.toFixed(6));

        if($('#important_vehicle_info_no_data').length >0)
        {
            $('#important_vehicle_info_no_data').remove();
        } 

        if($('#StatusNavSatFixStatusId').length < 1)
        {
            $('#important_vehicle_info_body').append('<tr><th scope="col">NavSatStatus</th>'+
            '<td id="StatusNavSatFixStatusId">'+message.status.status+'</td></tr>');
        }
        else
        {
            $('#StatusNavSatFixStatusId').text(message.status.status);
        }

        if( $('#StatusNavSatFixLatitudeId').length < 1)
        {
            $('#important_vehicle_info_body').append('<tr><th scope="col">Latitude</th>'+
            '<td id="StatusNavSatFixLatitudeId">'+message.latitude.toFixed(6) +'</td></tr>');
        }
        else
        {
            $('#StatusNavSatFixLatitudeId').text(message.latitude.toFixed(6));
        }

        if( $('#StatusNavSatFixLongitudeId').length < 1)
        {
            $('#important_vehicle_info_body').append('<tr><th scope="col">Longitude</th>'+
            '<td id="StatusNavSatFixLongitudeId">'+message.longitude.toFixed(6) +'</td></tr>');
        }
        else
        {
            $('#StatusNavSatFixLongitudeId').text(message.longitude.toFixed(6));
        }

        if( $('#StatusNavSatFixAltitudeId').length < 1)
        {
            $('#important_vehicle_info_body').append('<tr><th scope="col">Altitude</th>'+
            '<td id="StatusNavSatFixAltitudeId">'+message.altitude.toFixed(6) +'</td></tr>');
        }
        else
        {
            $('#StatusNavSatFixAltitudeId').text(message.altitude.toFixed(6));
        }   

        //update map
        if (hostmarker != null) 
        {
           let jsonUnit = {};
           jsonUnit.latitude =  message.latitude.toFixed(6);
           jsonUnit.longitude =  message.longitude.toFixed(6);

           if(count_position < buffer_size)
           {
                vector_positions[count_position++] = jsonUnit;
           }
           else
           {
                let avgPosition = AvgHostMarkerGeoPositions( vector_positions, buffer_size );
                count_position= 0;
                vector_positions = [];
                moveMarkerWithTimeout(hostmarker, avgPosition.avgLatitude.toString(), avgPosition.avglongitude.toString(), 0);
           }           
        }
    });
}

function UpdateHostVehicleMarkerLoc()
{   
    var listenerNavSatFix = new ROSLIB.Topic({
        ros: g_ros,
        name: T_GNSS_FIX_FUSED, 
        messageType: M_GPS_COMMON_GPSFIX
    });

    let buffer_size = 10;
    let count_position = 0;
    let vector_positions = [];
    listenerNavSatFix.subscribe(function (message) 
    {
        if (message.latitude == null || message.longitude == null)
            return;
        
        //update map
        if (hostmarker != null) 
        {
           let jsonUnit = {};
           jsonUnit.latitude =  message.latitude.toFixed(6);
           jsonUnit.longitude =  message.longitude.toFixed(6);

           if(count_position < buffer_size)
           {
                vector_positions[count_position++] = jsonUnit;
           }
           else
           {
                let avgPosition = AvgHostMarkerGeoPositions( vector_positions, buffer_size );
                count_position= 0;
                vector_positions = [];
                moveMarkerWithTimeout(hostmarker, avgPosition.avgLatitude.toString(), avgPosition.avglongitude.toString(), 0);
           }           
        }
    });
    window.lastGPSMessageTime = Date.now();
    updateGPSStatusIcon(true);
}

function AvgHostMarkerGeoPositions( vector_positions, buffer_size )
{  
    let returnJson = {};
    let latitude_total = 0;
    let longitude_total = 0;
    vector_positions.forEach((position) =>{
        latitude_total += parseFloat(position.latitude); 
        longitude_total += parseFloat(position.longitude); 
    });
    returnJson.avgLatitude = (latitude_total/buffer_size).toFixed(6);
    returnJson.avglongitude = (longitude_total/buffer_size).toFixed(6);
    return returnJson;
}

/*
    Display the close loop control of speed
*/
function showSpeedAccelInfo() 
{
    var listenerSpeedAccel = new ROSLIB.Topic({
            ros: g_ros,
            name: T_CMD_SPEED, //not published
            messageType: M_SPEED_ACCL
    });

    listenerSpeedAccel.subscribe(function (message) 
    {
        //Check ROSBridge connection before subscribe a topic
        if (!IsROSBridgeConnected())
        {
            return;
        };
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
        name: T_ACC_ENGAGED,	
        messageType: M_BOOL	
    });
    let isACCEngagedDisplayed = false;
    listenerACCEngaged.subscribe(function (message) {
        //Check ROSBridge connection before subscribe a topic
        if (!IsROSBridgeConnected())
        {
            return;
        };
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
        name: T_DIAGNOSTICS, //not published
        messageType: M_DIAGNOSTIC_ARRAY
    });
    let isDiagnosticsDisplayed = false;
    listenerDiagnostics.subscribe(function (messageList) {
        //Check ROSBridge connection before subscribe a topic
        if (!IsROSBridgeConnected())
        {
            return;
        };
        messageList.status.forEach(
            function (myStatus) 
            {
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
                    $('#StatusDiagnosticsNameId').text(myStatus.data);
                    $('#StatusDiagnosticsMessageId').text(myStatus.message);
                    $('#StatusDiagnosticsHardwareId').text(myStatus.hardware_id);
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
	    name: T_CAN_ENGINE_SPEED, 
	    messageType: M_FLOAT64
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
	    name: T_CAN_SPEED,
	    messageType: M_FLOAT64
	});
    let isCANSpeedDisplayed = false;
    listenerCANSpeed.subscribe(function (message) 
    {
        //Check ROSBridge connection before subscribe a topic
        if (!IsROSBridgeConnected())
        {
            return;
        };
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
function showActualSpeed()
{   
    var listenerSFVelocity = new ROSLIB.Topic({
        ros: g_ros,
        name: T_SENSOR_FUSION_FILTERED_VELOCITY, 
        messageType: M_TWIST__COVARIANCE_STAMPED 
    });//'geometry_msgs/TwistStamped'
    let isActualSpeedDisplayed= false;
    listenerSFVelocity.subscribe(function (message) 
    {
         //Check ROSBridge connection before subscribe a topic
         if (!IsROSBridgeConnected())
        {
            return;
        };
        //If nothing on the Twist, skip
        if (message.twist == null || message.twist.twist.linear == null || message.twist.twist.linear.x == null) {
            return;
        }
        var actualSpeedMPH = Math.round(message.twist.twist.linear.x * METER_TO_MPH);
        // insertNewTableRow('tblFirstB', 'SF Velocity (m/s)', message.twist.linear.x);
        // insertNewTableRow('tblFirstB', 'SF Velocity (MPH)', actualSpeedMPH);
        if($('#guidance_info_no_data').length >0)
        {
            $('#guidance_info_no_data').remove();
        } 
        if(!isActualSpeedDisplayed)
        {
            $('#guidance_info_body').append('<tr><th scope="col" >SF Velocity (m/s)</th>'+
            '<td id="StatusVelocityRawId">'+message.twist.twist.linear.x+'</td></tr>');

            $('#guidance_info_body').append('<tr><th scope="col">SF Velocity (MPH)</th>'+
            '<td id="StatusVelocityRawMPHId">'+actualSpeedMPH+'</td></tr>');
            isActualSpeedDisplayed = true;
        }
        else{
            $('#StatusVelocityRawId').text(message.twist.twist.linear.x);
            $('#StatusVelocityRawMPHId').text(actualSpeedMPH);
        }
    });
}

/*
    Show which plugins are controlling the lateral and longitudinal manuevers.
*/
function showControllingPlugins() 
{
    var listenerControllingPlugins = new ROSLIB.Topic({
        ros: g_ros,
        name: T_CONTROLLING_PLUGINS, //not publish
        messageType: M_ACTIVE_MANEUVERS
    });

    listenerControllingPlugins.subscribe(function (message) 
    {
         //Check ROSBridge connection before subscribe a topic
         if (!IsROSBridgeConnected())
        {
            return;
        };
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
        name: T_LATERAL_CONTROL_DRIVER, //not publish
        messageType: M_LATERAL_CONTROL
    });

    listenerLateralControl.subscribe(function (message) {
        //Check ROSBridge connection before subscribe a topic
        if (!IsROSBridgeConnected())
        {
            return;
        };
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
        name: T_INCOMING_BSM,
        messageType: M_BSM
    });
    listenerClient.subscribe(function (message) 
    {
         //Check ROSBridge connection before subscribe a topic
         if (!IsROSBridgeConnected())
        {
            return;
        };
        // console.log(message);
        // insertNewTableRow('tblSecondB', 'BSM Temp ID - ' + message.core_data.id + ': ', message.core_data.id);
        // insertNewTableRow('tblSecondB', 'BSM Latitude - ' + message.core_data.id + ': ', message.core_data.latitude.toFixed(6));
        // insertNewTableRow('tblSecondB', 'BSM Longitude - ' + message.core_data.id + ': ', message.core_data.longitude.toFixed(6));
        if($('#other_vehicles_info_no_data').length >0)
        {
            $('#other_vehicles_info_no_data').remove();
        } 

        if(document.getElementById('BSMTempIdRow_'+message.core_data.id) == null)
        {
            $('#other_vehicles_info_body').append('<tr id="BSMTempIdRow_'+message.core_data.id+'">'+
            '<th scope="col" id="BSMTempKeyId_'+message.core_data.id+'" >BSM Temp ID -' + message.core_data.id+':</th>'+
            '<td id="BSMTempId_'+message.core_data.id+'">'+message.core_data.id+'</td></tr>');
        }
        else
        {
            document.getElementById('BSMTempKeyId_'+message.core_data.id).innerHTML ='BSM Temp ID-' + message.core_data.id;
            document.getElementById('BSMTempId_'+message.core_data.id).innerHTML = message.core_data.id;
           
        }

        if(document.getElementById('BSMLatitudeTitleRow_'+message.core_data.id) == null )
        {
            $('#other_vehicles_info_body').append('<tr id="BSMLatitudeTitleRow_'+message.core_data.id+'"><th scope="col" id="BSMLatitudeTitle_'+message.core_data.id+'">BSM Latitude -'+ message.core_data.id+':</th>'+
            '<td id="BSMLatitudeId_'+message.core_data.id+'">' + message.core_data.latitude.toFixed(6) + '</td></tr>');
        }
        else
        {            
            document.getElementById('BSMLatitudeTitle_'+message.core_data.id).innerHTML ='BSM Latitude-' + message.core_data.id;
            document.getElementById('BSMLatitudeId_'+message.core_data.id).innerHTML = message.core_data.latitude.toFixed(6);
        }

        if(document.getElementById('BSMLogitudeTitleRow_'+message.core_data.id) == null)
        {
            $('#other_vehicles_info_body').append('<tr id="BSMLogitudeTitleRow_'+message.core_data.id+'"><th scope="col" id="BSMLogitudeTitle_'+message.core_data.id+'">BSM Longitude -' + message.core_data.id+':</th>'+
            '<td id="BSMLongitudeId_'+message.core_data.id+'">' + message.core_data.longitude.toFixed(6) + '</td></tr>');
        }
        else
        {  
            document.getElementById('BSMLogitudeTitle_'+message.core_data.id).innerHTML ='BSM Longitude-' + message.core_data.id;
            document.getElementById('BSMLongitudeId_'+message.core_data.id).innerHTML = message.core_data.longitude.toFixed(6)
        }

        //update map
        setOtherVehicleMarkers(message.core_data.id, message.core_data.latitude.toFixed(6), message.core_data.longitude.toFixed(6));        
    });
}

/*
    Watch out for route completed, and display the Route State in the System Status tab.
    Route state are only set and can be shown after Route has been selected.
*/

function checkRouteInfo() 
{
    //Display the lateset route name and timer.
    // var divRouteInfo = document.getElementById('divRouteInfo');
    // if (divRouteInfo != null || divRouteInfo != 'undefined')
    //     divRouteInfo.innerHTML = selectedRoute.name + ' : ' + engaged_timer;
	
    //Get Route Event
    var listenerRouteEvent = new ROSLIB.Topic({
        ros: g_ros,
        name: T_ROUTE_EVENT,
        messageType: M_ROUTE_EVENT
    });
    let isRouteEventDisplayed = false;
    listenerRouteEvent.subscribe(function (message) 
    {
         //Check ROSBridge connection before subscribe a topic
         if (!IsROSBridgeConnected())
        {
            return;
        };
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
            messageTypeFullDescription = 'PLEASE TAKE <strong>MANUAL</strong> CONTROL OF THE VEHICLE.<br/> <br/> ROUTE COMPLETED.  ';
            //If this modal does not exist, create one 
            if( $('#systemAlertModal').length < 1 ) 
            { 
                $('#ModalsArea').append(createSystemAlertModal(
                    '<span style="color:rgb(240, 149, 4)"><i class="fas fa-exclamation-triangle"></i></span>&nbsp;&nbsp;SYSTEM ALERT', 
                    messageTypeFullDescription,
                    true,true
                    ));              
            }
           $('#systemAlertModal').modal({backdrop: 'static', keyboard: false}); 

           //This check to make sure inactive  sound is only played once even when it is been published multiple times in a row
           // It will get reset when status changes back to engage
           if(g_sound_played_once == false || g_play_audio_error==true)
           {
               playSound('audioAlert2', false);
               //make sure play audio does not return any error and successfully played once before update g_sound_played_once value
               if(g_play_audio_error == false){
                     g_sound_played_once = true;
               }
           }
        }

        if (message.event == 4)//LEFT_ROUTE=4
        { 
            messageTypeFullDescription = 'PLEASE TAKE <strong>MANUAL</strong> CONTROL OF THE VEHICLE.<br/> <br/>You have LEFT THE ROUTE.  ';
             //If this modal does not exist, create one 
             if( $('#systemAlertModal').length < 1 ) 
             { 
                 $('#ModalsArea').append(createSystemAlertModal(
                     '<span style="color:red"><i class="fas fa-exclamation-triangle"></i></span>&nbsp;&nbsp;SYSTEM ALERT', 
                     messageTypeFullDescription,
                     true,true
                     ));              
             }
            $('#systemAlertModal').modal({backdrop: 'static', keyboard: false}); 

            //This check to make sure inactive  sound is only played once even when it is been published multiple times in a row
           // It will get reset when status changes back to engage
           if(g_sound_played_once == false || g_play_audio_error==true)
           {
                playSound('audioAlert1', false);
               //make sure play audio does not return any error and successfully played once before update g_sound_played_once value
               if(g_play_audio_error == false){
                     g_sound_played_once = true;
               }
           }
        }

        if (message.event == 5)//ROUTE_ABORTED=5
        {
            messageTypeFullDescription = 'ROUTE ABORTED. <br/> <br/> PLEASE TAKE MANUAL CONTROL OF THE VEHICLE.';
            //If this modal does not exist, create one 
            if( $('#systemAlertModal').length < 1 ) 
            { 
                $('#ModalsArea').append(createSystemAlertModal(
                    '<span style="color:red"><i class="fas fa-exclamation-triangle"></i></span>&nbsp;&nbsp;SYSTEM ALERT', 
                    messageTypeFullDescription,
                    true,true
                    ));              
            }
           $('#systemAlertModal').modal({backdrop: 'static', keyboard: false}); 
           playSound('audioAlert1', true);
        }
    });

    //Get Route State
    var listenerRouteState = new ROSLIB.Topic({
        ros: g_ros,
        name: T_ABBR_ROUTE_STATE,
        messageType: M_ROUTE_STATE
    });

    let isRouteStateDisplayed = false;
    listenerRouteState.subscribe(function (message) 
    {
         //Check ROSBridge connection before subscribe a topic
         if (!IsROSBridgeConnected())
        {
            return;
        };
        // insertNewTableRow('tblSecondA', 'Route ID', message.route_id);
        // insertNewTableRow('tblSecondA', 'Route State', message.state);
        // insertNewTableRow('tblSecondA', 'Cross Track / Down Track', message.cross_track.toFixed(2) + ' / ' + message.down_track.toFixed(2));
        // insertNewTableRow('tblSecondA', 'LaneLet ID', message.lanelet_id);
        // insertNewTableRow('tblSecondA', 'Current LaneLet Downtrack', message.lanelet_downtrack);

        // insertNewTableRow('tblSecondA', 'Current Segment ID', message.current_segment.waypoint.waypoint_id);
        // insertNewTableRow('tblSecondA', 'Current Segment Max Speed', message.current_segment.waypoint.speed_limit);

        if($('#route_info_no_data').length >0)
        {
            $('#route_info_no_data').remove();
        } 
        if(!isRouteStateDisplayed)
        {
            $('#route_info_body').append('<tr><th scope="col" >Route ID</th>'+
            '<td id="StatusRouteStateId">'+message.route_id+'</td></tr>');

            $('#route_info_body').append('<tr><th scope="col" >Route State</th>'+
            '<td id="StatusRouteStateStatusId">'+message.state+'</td></tr>');

            $('#route_info_body').append('<tr><th scope="col" >Cross Track / Down Track</th>'+
            '<td id="StatusRouteStatetrackDivideId">'+message.cross_track.toFixed(2) + ' / ' + message.down_track.toFixed(2)+'</td></tr>');

            $('#route_info_body').append('<tr><th scope="col" >LaneLet ID</th>'+
            '<td id="StatusRouteStateLaneletId">' + message.lanelet_id+'</td></tr>');
            
            $('#route_info_body').append('<tr><th scope="col" >Current LaneLet Downtrack</th>'+
            '<td id="StatusRouteStateLaneletDowntrackId">'+ message.lanelet_downtrack+'</td></tr>');
            
            
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
            $('#StatusRouteStateId').text(message.route_id);
            $('#StatusRouteStateStatusId').text(message.state);
            $('#StatusRouteStatetrackDivideId').text(message.cross_track.toFixed(2) + ' / ' + message.down_track.toFixed(2));
            $('#StatusRouteStateLaneletId').text(message.lanelet_id);
            $('#StatusRouteStateLaneletDowntrackId').text( message.lanelet_downtrack);
        }

    });
}


/*
   (Topic not available): Check for Robot State
    If no longer active, show the Guidance as Yellow. If active, show Guidance as green.
*/
function checkRobotEnabled() {

    var listenerRobotStatus = new ROSLIB.Topic({
            ros: g_ros,
            name: T_ROBOTIC_STATUS,
            messageType: M_ROBOT_ENABLED
     });
     isRobotStatusDisplayed = false;
     listenerRobotStatus.subscribe(function (message) 
     {
            //Check ROSBridge connection before subscribe a topic
            if (!IsROSBridgeConnected())
        {
            return;
        };
            // insertNewTableRow('tblFirstB', 'Robot Active', message.robot_active);
            // insertNewTableRow('tblFirstB', 'Robot Enabled', message.robot_enabled);
            if($('#important_vehicle_info_no_data').length >0)
            {
                $('#important_vehicle_info_no_data').remove();
            } 
            if(!isRobotStatusDisplayed)
            {
                $('#guidance_info_body').append('<tr><th scope="col">Robot Active</th>'+
                '<td id="StatusRobotActiveId">'+ message.robot_active +'</td></tr>');

                $('#guidance_info_body').append('<tr><th scope="col">Robot Enabled</th>'+
                '<td id="StatusRobotEnabledId">'+ message.robot_enabled +'</td></tr>');

                isRobotStatusDisplayed = true;
            }           
            else
            {
                $('#StatusRobotActiveId').text(message.robot_active);
                $('#StatusRobotEnabledId').text(message.robot_enabled);
            } 
     });
}

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
	    ros: g_ros,
	    name: T_CARMA_SYSTEM_VERSION,
	    messageType: 'std_msgs/String'
	});

    var msg = new ROSLIB.Message({
        data: response
    });

	topicCARMASystemVersion.publish(msg);
}

/***
 * 
rostopic pub /environment/tcr_bounding_points cav_msgs/msg/TrafficControlRequestPolygon "polygon_list:
- latitude: 38.955412
  longitude: -77.151418
  elevation: 0.0
  elevation_exists: false 
- latitude: 38.956947
  longitude: -77.150431
  elevation: 0.0
  elevation_exists: false
- latitude: 38.955579
  longitude: -77.147448
  elevation: 0.0
  elevation_exists: false
- latitude: 38.954377 
  longitude: -77.147888
  elevation: 0.0
  elevation_exists: false"
 */
function showTCRPolygon() {
    var listenerTCRBoundingPoints = new ROSLIB.Topic({
        ros: g_ros,
        name: T_TCR_BOUNDING_POINTS,
        messageType: M_TCR_POLYGON
 });

 listenerTCRBoundingPoints.subscribe(function (message) 
 {
    vector_Geo_locations = [];
    let geoLoc = {};

    let dataArray = message.polygon_list;
    if(! Array.isArray(dataArray)|| dataArray.length != 4)
    {
        console.error("TCR bounding points  are not in array or array does not contains 4 geo-loc");
        return;
    }
    
    geoLoc.lat = dataArray[0].latitude;
    geoLoc.lng = dataArray[0].longitude;
    vector_Geo_locations.push(geoLoc);
    geoLoc = {};


    geoLoc.lat = dataArray[1].latitude;
    geoLoc.lng = dataArray[1].longitude;
    vector_Geo_locations.push(geoLoc);
    geoLoc = {};

        
    geoLoc.lat = dataArray[2].latitude;
    geoLoc.lng = dataArray[2].longitude;
    vector_Geo_locations.push(geoLoc);
    geoLoc = {};

        
    geoLoc.lat = dataArray[3].latitude;
    geoLoc.lng = dataArray[3].longitude;
    vector_Geo_locations.push(geoLoc);
    
    drawPolygonsOnMap(g_polygon_type.TCR, vector_Geo_locations);
 });

}