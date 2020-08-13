/**
 * subscribe to service /guidance/get_available_routes
 */
function subscribeToGuidanceAvailaleRoutes ()
{
    var service = new ROSLIB.Service({
        ros: g_ros,
        name: S_GUIDANCE_AVAILABLE_ROUTES,
        messageType: M_GUIDANCE_AVAILABLE_ROUTES
    });

    // Create a Service Request with no arguments.
    var request = new ROSLIB.ServiceRequest({});

    // Call the service and get back the results in the callback.
    // The result is a ROSLIB.ServiceResponse object.
    service.callService(request, function (result) 
    {
        //Check ROSBridge connection before subscribe a topic
        IsROSBridgeConnected();
        //console.log('available routes are: ' + result.availableRoutes);
        var availableRoutes = result.availableRoutes;
        if(availableRoutes != null && availableRoutes.length > 0){
            $('#route-list-content-no-route-available').html('');
            availableRoutes.forEach(route=>{
                // console.log('route name is: ' + route.route_name);
                // console.log('route Id is: ' + route.route_id);                
                //display route list info in html <div id='route-list-content'>
                $('#route-list-content').append(createRouteSelectionRadio(route.route_id,route.route_name));
                //check whether the route is already selected in session
                if(session_selectedRoute != null && session_selectedRoute.id != null 
                    && session_selectedRoute.id.length > 0 && session_selectedRoute.id == route.id)
                {
                    let selectedRouteRadio = document.getElementById('route_radio_'+session_selectedRoute.id);
                    if(selectedRouteRadio != null && selectedRouteRadio != 'undefined')
                    {
                        selectedRouteRadio.checked = true;
                        session_selectedRoute.name = route.route_name;
                    }
                }
            });
        }
        
    });
}

/**
 * rostopic pub /guidance/route_state cav_msgs/RouteState "header: {seq: 0, stamp: 1232323,frame_id: '0'}
routeID: 'test route'
state: 0 
cross_track: 0 
lanelet_downtrack: 0 
lanelet_id: 4 
speed_limit: 23"
 */
/**
 * /guidance/route_state
 * The current/Actual speed of the vehicle is in: /guidance/route_state/current_segment/waypoint/speed_limit
 */
function subscribeToGuidanceRouteState()
{
    var listener = new ROSLIB.Topic({
        ros: g_ros,
        name: '/guidance/route_state',
        messageType: 'cav_msgs/RouteState'
    });
    listener.subscribe(function(message)
    {
        //Check ROSBridge connection before subscribe a topic
        IsROSBridgeConnected();
        if(message!=null && message.speed_limit != null)
        {
            let speed_limit_converted = Math.floor(Math.abs(message.speed_limit * METER_TO_MPH));
            if( document.getElementById('speed-limit') != null)            {
                
                updateSpeedLimit(speed_limit_converted);
            }
            else
            {
                //Create speed limit if not exist in html
                $('.speed-limit-col').append(updateSpeedLimit(speed_limit_converted));
            }
        }
        
    });
}


/*
    Set the route once based on user selection.
*/
function setRoute(id) 
{
    // Calling setActiveRoute service
    var service = new ROSLIB.Service({
        ros: g_ros,
        name: '/guidance/set_active_route',
        serviceType: 'cav_srvs/SetActiveRoute'
    });

    var selectedRouteid = id.toString();
    //console.log(selectedRouteid);
    // Create a Service Request.
    var request = new ROSLIB.ServiceRequest({
        routeID: selectedRouteid
    });

    //Selected Route
    var rbRoute = document.getElementById("route_radio_" + id.toString());

    var ErrorStatus = {
        NO_ERROR: { value: 0, text: 'NO_ERROR' },
        NO_ROUTE: { value: 1, text: 'NO_ROUTE' },
    };
    try
    {
        // Call the service and get back the results in the callback.
        service.callService(request, function (result) 
        {
            console.log(result);
            if (result.errorStatus == ErrorStatus.NO_ROUTE.value) 
            {
                console.log('Setting the active route failed (' + ErrorStatus.NO_ROUTE.text + '). <br/> Please try again.');
                //insertNewTableRow('tblSecondA', 'Error Code', result.ErrorStatus.NO_ROUTE.text);
                //Allow user to select it again.
                rbRoute.checked = false;
            }
            else { //Call succeeded
                console.log('call set active route success!');
                //load the selected/active route to session
                session_selectedRoute.id = selectedRouteid;
                //After activating the route, start_active_route.
                //TODO: Discuss if start_active_route can be automatically determined and done by Route Manager in next iteration?
                //      Route selection is done first and set only once.
                //      Once selected, it wouldn't be activated until at least 1 Plugin is selected (based on Route).
                //      Only when a route is selected and at least one plugin is selected, could Guidance be Engaged.
                //startActiveRoute(id);
                //Subscribe to active route to map the segments
                //DANDU : TODO
                //showActiveRoute();
            }
        });
    }
    catch(ex)
    {
        rbRoute.checked = false;
    }

    console.log('result2');
    //Get Route Event
    var listenerRouteEvent = new ROSLIB.Topic({
        ros: g_ros,
        name: t_route_event,
        messageType: 'cav_msgs/RouteEvent'
    });
    listenerRouteEvent.subscribe(function (message) {
        console.log(message.event);
        if(message.event == 6)//ROUTE_GEN_FAIL
        {
            let errorMsgByRouteId = document.getElementById('error_msg_'+selectedRouteid);
            if(errorMsgByRouteId!= null && errorMsgByRouteId != 'undefined')
                errorMsgByRouteId.style.display='block'; //show error mesage fo route generation failed
        }
    });

}
/*
TODO:
    Start Active Route upon user selection
*/
function startActiveRoute(id) 
{

    var ErrorStatus = 
    {
        NO_ERROR: { value: 0, text: 'NO_ERROR' },
        NO_ACTIVE_ROUTE: { value: 1, text: 'NO_ACTIVE_ROUTE' },
        INVALID_STARTING_LOCATION: { value: 2, text: 'INVALID_STARTING_LOCATION' },
        ALREADY_FOLLOWING_ROUTE: { value: 3, text: 'ALREADY_FOLLOWING_ROUTE' },
    };

    // Calling set_active_route service
    var service = new ROSLIB.Service({
        ros: g_ros,
        name: 'start_active_route',
        serviceType: 'cav_srvs/StartActiveRoute'
    });

    // Then we create a Service Request.
    var request = new ROSLIB.ServiceRequest({
    });

    // Call the service and get back the results in the callback.
    service.callService(request, function (result) 
    {
        var errorDescription = '';

        switch (result.errorStatus) 
        {
            case ErrorStatus.NO_ERROR.value:
            case ErrorStatus.ALREADY_FOLLOWING_ROUTE.value:
                showSubCapabilitiesView(id);
                break;
            case ErrorStatus.NO_ACTIVE_ROUTE.value:
                errorDescription = ErrorStatus.ALREADY_FOLLOWING_ROUTE.text;
                break;
            case ErrorStatus.INVALID_STARTING_LOCATION.value:
                errorDescription = ErrorStatus.INVALID_STARTING_LOCATION.text;
                break;
            default: //unexpected value or error
                errorDescription = result.errorStatus; //print the number;
                break;
        }

        if (errorDescription != '') 
        {
            divCapabilitiesMessage.innerHTML = 'Starting the active the route failed (' + errorDescription + '). <br/> Please try again or contact your System Administrator.';
            insertNewTableRow('tblSecondA', 'Error Code', errorDescription);

            //Allow user to select the route again
            var rbRoute = document.getElementById(id.toString());
            rbRoute.checked = false;
        }
    });
}


/* DANDU: TODO
    Watch out for route completed, and display the Route State in the System Status tab.
    Route state are only set and can be shown after Route has been selected.
*/
function showActiveRoute() 
{

    //Get Route State
    var listener = new ROSLIB.Topic({
        ros: g_ros,
        name: 'route',
        messageType: 'cav_msgs/Route'
    });

    listener.subscribe(function (message) 
    {
        //if route hasn't been selected.
        if (selectedRoute.name == 'No Route Selected')
            return;

        //If nothing on the list, set all selected checkboxes back to blue (or active).
        if (message.segments == null || message.segments.length == 0) 
        {
         //   divCapabilitiesMessage.innerHTML += 'There were no segments found the active route.';
            return;
        }

        //Only map the segment one time.
        //alert('routePlanCoordinates: ' + sessionStorage.getItem('routePlanCoordinates') );
        if (sessionStorage.getItem('routePlanCoordinates') == null) 
        {
         //   message.segments.forEach(mapEachRouteSegment);
        }
    });
}
