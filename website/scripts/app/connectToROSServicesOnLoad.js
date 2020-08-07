$(document).ready(function(){
    console.log('window is loaded');
    if (typeof (Storage) !== 'undefined') 
    {
        //Initialize session variables
        initializeSessionVariables();

        /*
        **************************************
        * rosbridge connection 
        * ************************************
        */
        connectToROS();

        /************************************
         * Check System Ready:TODO
         ************************************
         */
       // evaluateNextStep();
        
        /*
        **************************************
        * set inital paramsters that are used 
        * by the topics and services
        * ************************************
        */
        getRequiredPluginParam();

        /****
         * ***********************************
         * subscribe to the services and topics
         * ***********************************
         */        
        //SECTION: Route Area
        subscribeToGuidanceAvailaleRoutes ();        

        /***
         * SECTION: Display Status icons 
         */
        //GPS or PinPoint status
        subscribeToDriverDiscovery();
        //OBU status
        subscribeToInboundBinary();
        subscribeToOutboundBinary();

        /**
         * SECTION: Display Area
         * **/
        //Current Vehicle Speed
        subscribeToLocalizationEKFTwist();        
        //Vechile Command
        //Steering angle; applied speed; brake; accelerator
        subscribeToVehicleCMD();        
        //Route - Speed Limit
        subscribeToGuidanceRouteState();
        //Traffic Signal 
        TrafficSignalInfoList();

        /***
         * SECTION: Right Panel Info
         * */
        //Active plugins & Change plugins
        subscribeToGuidanceRegisteredPlugins ();
        subscribeToGuidanceActivePlugins();

        /***
         * SECTION: Bottom Menu 
         * */
        //guidance button
        subscribeToGuidanceState();       
    } 
    else 
    {
        divCapabilitiesMessage.innerHTML = 'Sorry, cannot proceed unless your browser support HTML Web Storage Objects.' + 
                                           'Please contact your system administrator.';
    }
});

/**
 * ****************** 
 * Session Varibales Definitions
 * ******************
 */
//Getters and Setters for bool and string session variables.
function initializeSessionVariables()
{
    //guidance variable
    session_isGuidance = 
    {
        get active() {
            let isGuidanceActive = sessionStorage.getItem('isGuidanceActive');
            let value = false;

            if (isGuidanceActive != 'undefined' && isGuidanceActive != null && isGuidanceActive != '') 
            {
                if (isGuidanceActive == 'true')
                    value = true;
            }
            return value;
        },
        set active(newValue) 
        {
            sessionStorage.setItem('isGuidanceActive', newValue);
        },
        get engaged() 
        {
            let isGuidanceEngaged = sessionStorage.getItem('isGuidanceEngaged');
            let value = false;

            if (isGuidanceEngaged != 'undefined' && isGuidanceEngaged != null && isGuidanceEngaged != '') 
            {
                if (isGuidanceEngaged == 'true')
                    value = true;
            }
            return value;
        },
        set engaged(newValue) 
        {
            sessionStorage.setItem('isGuidanceEngaged', newValue);
        },
        remove() 
        {
            sessionStorage.removeItem('isGuidanceActive');
            sessionStorage.removeItem('isGuidanceEngaged');
        }
    };

    //currently selected route variables
    session_selectedRoute = 
    {
        get name() 
        {
            let selectedRouteName = sessionStorage.getItem('selectedRouteName');
            if (selectedRouteName == 'undefined' || selectedRouteName == null || selectedRouteName.length == 0) 
            {
                selectedRouteName = '';
            }
            console.log('get selectedRouteName FINAL: ' + selectedRouteName);
            return selectedRouteName;
        },
        set name(newValue) 
        {
            sessionStorage.setItem('selectedRouteName', newValue);
            console.log('set selectedRouteName: ' + newValue);
        },
        remove() 
        {
            sessionStorage.removeItem('selectedRouteName');
        }
    };

}

/***
 * **************************************
 * Definitions: Events and actions taken from UI users 
 * **************************************
 */
function setRouteEventLisenter(routeId)
{
    //TODO: call abort route to abort the current selected route.
    //It is defined in ros_route.js
    // if(session_selectedRoute.name!=null && session_selectedRoute.name.length > 0){
    //     abortRoute(session_selectedRoute.name);
    // }  
    //After the current active route is aborted, call setRoute(routeId) to set a new route. 
    //It is defined in ros_route.js
    setRoute(routeId);
    session_selectedRoute.name = routeId;
}

function activatePluginLisenter(pluginName,pluginType,pluginVersionId,changeToNewStatus,isRequired)
{
    //call activatePlugin(pluginName,pluginType,pluginVersionId,changeToNewStatus,isRequired) 
    //It is defined in ros_plugins.js
    activatePlugin(pluginName,pluginType,pluginVersionId,changeToNewStatus,isRequired);
}

function activateGuidanceListner()
{
    //It is defined in ros_guidance.js
    activateGuidance();
}