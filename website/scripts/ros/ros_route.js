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
        console.log('available routes are: ' + result.availableRoutes);
        var availableRoutes = result.availableRoutes;
        if(availableRoutes != null && availableRoutes.length > 0){
            $('#route-list-content-no-route-available').html('');
            availableRoutes.forEach(route=>{
                console.log('route name is: ' + route.route_name);
                console.log('route Id is: ' + route.route_id);

                //display route list info in html <div id='route-list-content'>
                $('#route-list-content').append(createRouteSelectionRadio(route.route_id,route.route_name));
            });
        }
        
    });
}