/**
 * subscribe to service /guidance/get_available_routes
 */



 /**
  * definitions
 */
function subscribeToGuidanceAvailaleRoutes ()
{
    var listener = new ROSLIB.Service({
        ros: g_ros,
        name: S_GUIDANCE_AVAILABLE_ROUTES,
        messageType: M_GUIDANCE_AVAILABLE_ROUTES
    });

    // Create a Service Request with no arguments.
    var request = new ROSLIB.ServiceRequest({});

    // Call the service and get back the results in the callback.
    // The result is a ROSLIB.ServiceResponse object.
    listener.callService(request, function (result) 
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
        if(message!=null && message.speed_limit != null){
            if( document.getElementById('speed-limit') != null){
                updateSpeedLimit(message.speed_limit);
            }
            else
            {
                //Create speed limit if not exist in html
                $('.speed-limit-col').append(updateSpeedLimit('2'));
            }
        }
        
    });
}