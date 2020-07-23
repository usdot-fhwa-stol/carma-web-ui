/**
 * subscribe to service /guidance/plugins/get_registered_plugins
 */
function subscribeToGuidanceRegisteredPlugins ()
{

    var listener = new ROSLIB.Service({
        ros: g_ros,
        name: S_GUIDANCE_REGISTERED_PLUGINS,
        messageType: P_GUIDANCE_PLUGINLIST
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
                    switch(pluginItem.type){
                        case UNKNOWN: //TODO
                            break;
                        case  STRATEGIC:
                            $('#change-plugins-no-strategic-plugins').html('');
                            $('#strategic-plugins-section').append(createChangePluginSwitch(false,pluginItem.name, STRATEGIC_LABEL+'-plugins',pluginItem.activated));
                            break;
                        case  TACTICAL:
                            $('#change-plugins-no-tactical-plugins').html('');
                            $('#tactical-plugins-section').append(createChangePluginSwitch(false,pluginItem.name, TACTICAL_LABEL+'-plugins',pluginItem.activated));
                            break;
                        case  CONTROL:
                            $('#change-plugins-no-controlling-plugins').html('');
                            $('#controlling-plugins-section').append(createChangePluginSwitch(false,pluginItem.name, CONTRO_LABEL+'-plugins',pluginItem.activated));
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
 */

function subscribeToGuidanceActivatedPlugins ()
{  
    var listener = new ROSLIB.Service({
        ros: g_ros,
        name: S_GUIDANCE_ACTIVE_PLUGINS,
        messageType: P_GUIDANCE_PLUGINLIST
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
                //display route list info in html <div id='activePlugins-panel'>
                //Ony show avaiable/activated plugins in the change plugin panel
                    if(pluginItem.available)
                {
                    $('#no-active-plugins').html('');
                    $('#active-plugins-content').append(createActivePlugin(pluginItem.name,true,true));
                } 
            });
        }
        
    });
}