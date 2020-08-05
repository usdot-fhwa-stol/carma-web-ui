/**
 * subscribe to service /guidance/plugins/get_registered_plugins
 */
function subscribeToGuidanceRegisteredPlugins ()
{

    var listener = new ROSLIB.Service({
        ros: g_ros,
        name: S_GUIDANCE_REGISTERED_PLUGINS,
        messageType: M_GUIDANCE_PLUGINLIST
    });

    // Create a Service Request with no arguments.
    var request = new ROSLIB.ServiceRequest({});
    listener.callService(request, function (result) 
    {
        //Check ROSBridge connection before subscribe a topic
        IsROSBridgeConnected();
        console.log('registered plugins are: ' + result.plugins);
        var plugins = result.plugins;
        if(plugins != null && plugins.length > 0){            
                plugins.forEach(pluginItem=>{
                //display registered plugin in html <div id='allPlugins-panel'>
                /**
                 * Plugin Types:
                 * UNKNOWN = 0  STRATEGIC = 1  TACTICAL = 2 CONTROL = 3
                 */
                //Ony show avaiable plugins in the change plugin panel
                    if(pluginItem.available)
                {
                    let isPluginRequired = g_required_plugins.includes((pluginItem.name+"").replace(/\s/g,'').toLowerCase());
                    switch(pluginItem.type){
                        case UNKNOWN: //TODO
                            break;
                        case  STRATEGIC:
                            $('#change-plugins-no-strategic-plugins').html('');
                            $('#strategic-plugins-section').append(createChangePluginSwitch(isPluginRequired,pluginItem.name, STRATEGIC_LABEL+'-plugins',pluginItem.activated));
                            break;
                        case  TACTICAL:
                            $('#change-plugins-no-tactical-plugins').html('');
                            $('#tactical-plugins-section').append(createChangePluginSwitch(isPluginRequired,pluginItem.name, TACTICAL_LABEL+'-plugins',pluginItem.activated));
                            break;
                        case  CONTROL:
                            $('#change-plugins-no-controlling-plugins').html('');
                            $('#controlling-plugins-section').append(createChangePluginSwitch(isPluginRequired,pluginItem.name, CONTROL_LABEL+'-plugins',pluginItem.activated));
                            break;
                    }
                }
            });
        }
        
    });
}

//
/**
 * subscribe to service /guidance/plugins/get_active_plugins
 * NOTE:
 * TODO: Need to look for the current maneuver plan and look at which plug-ins contributed to that, more so than availability
         A plugin could be active, available, but not have its maneuvers selected by arbitrator, 
         in which case it still isn't doing anything to control the vehicle.
         But any plugin in the current maneuver plan definitely has control authority over the vehicle
         Maneuver Plan.msg 
         ManeuverParameters.msg
         cav_msgs/LaneFollowingManeuver lane_following_maneuver
         cav_msgs/LaneChangeManeuver lane_change_maneuver
         cav_msgs/IntersectionTransitStraightManeuver intersection_transit_straight_maneuver
         cav_msgs/IntersectionTransitLeftTurnManeuver intersection_transit_left_turn_maneuver
         cav_msgs/IntersectionTransitRightTurnManeuver intersection_transit_right_turn_maneuver
         cav_msgs/StopAndWaitManeuver stop_and_wait_maneuver
 */

function subscribeToGuidanceActivePlugins ()
{  
    var listener = new ROSLIB.Service({
        ros: g_ros,
        name: S_GUIDANCE_ACTIVE_PLUGINS,
        messageType: M_GUIDANCE_PLUGINLIST
    });
    // Create a Service Request with no arguments.
    var request = new ROSLIB.ServiceRequest({});
    listener.callService(request, function (result) 
    {
        //Check ROSBridge connection before subscribe a topic   
        IsROSBridgeConnected();
        var plugins = result.plugins;
        if(plugins != null && plugins.length > 0){
                plugins.forEach(pluginItem=>{
                //display active plugins info in html <div id='activePlugins-panel'>
                //Ony show (avaiable plus activated) plugins in the change plugin panel
                if(pluginItem.available && pluginItem.activated)
                {
                    $('#no-active-plugins').html('');
                    $('#active-plugins-content').append(createActivePlugin(pluginItem.name,true,true));
                } 
            });
        }
        
    });
}
/**
 * rosparam get /guidance/health_monitor/required_plugins
 */
function getRequiredPluginParam()
{
    var requiredPluginsParam = new ROSLIB.Param({
        ros:g_ros,
        name: P_REQUIRED_PLUGINS
    });
    //get the list of required plugins
    requiredPluginsParam.get((value)=>{
        g_required_plugins = value +"";
        g_required_plugins = g_required_plugins.replace(/\s/g,'').toLowerCase();
    });
}
