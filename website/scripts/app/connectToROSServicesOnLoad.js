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
         * Check System Ready:ros_system_alert.js
         ************************************
         */
        evaluateNextStep();
        
        /****
         * ***********************************
         * subscribe to the services and topics
         * ***********************************
         */        
        //SECTION: Route Area
        subscribeToGuidanceAvailaleRoutes ();        

        /*
        **************************************
        * set inital paramsters that are used 
        * by the topics and services
        * ************************************
        */
       getRequiredPluginParam();
        /***
         * SECTION: Display Status icons 
         */        
        subscribeToDriverDiscovery();//GPS or PinPoint status
        //OBU status
        subscribeToInboundBinary();
        subscribeToOutboundBinary();

        /**
         * SECTION: Display Area
         * **/
        subscribeToLocalizationEKFTwist(); //Current Vehicle Speed
        subscribeToVehicleCMD(); ////Vechile Command; Steering angle; applied speed; brake; accelerator     
        subscribeToGuidanceRouteState(); //Route - Speed Limit        
        TrafficSignalInfoList(); //Traffic Signal 

        /***
         * SECTION: Right Panel Info
         * */         
        subscribeToGuidanceRegisteredPlugins ();//Change plugins panel
        subscribeToGuidanceActivePlugins();//Active plugins panel
        showStatusandLogs(); //system status panel

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
            // console.log('get selectedRouteName: ' + selectedRouteName);
            return selectedRouteName;
        },
        set name(newValue) 
        {
            sessionStorage.setItem('selectedRouteName', newValue);
            // console.log('set selectedRouteName: ' + newValue);
        },
        get id() 
        {
            let selectedRouteId = sessionStorage.getItem('selectedRouteId');
            if (selectedRouteId == 'undefined' || selectedRouteId == null || selectedRouteId.length == 0) 
            {
                selectedRouteId = '';
            }
            // console.log('get selectedRouteId : ' + selectedRouteId);
            return selectedRouteId;
        },
        set id(newValue) 
        {
            sessionStorage.setItem('selectedRouteId', newValue);
            // console.log('set selectedRouteId: ' + newValue);
        },
        remove() 
        {
            sessionStorage.removeItem('selectedRouteId');
            sessionStorage.removeItem('selectedRouteName');
        }
    };

    //system alert variable
    session_isSystemAlert = {
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

     //currently host vehicle session variables
     session_hostVehicle = 
     {
         get make() 
         {
             let vehicleMake = sessionStorage.getItem('vehicleMake');
             if (vehicleMake == 'undefined' || vehicleMake == null || vehicleMake.length == 0) 
             {
                vehicleMake = '';
             }
            //  console.log('get vehicleMake FINAL: ' + vehicleMake);
             return vehicleMake;
         },
         set make(newValue) 
         {
             sessionStorage.setItem('vehicleMake', newValue);
            //  console.log('set vehicleMake: ' + newValue);
         },
         get model() 
         {
             let vehicleModel = sessionStorage.getItem('vehicleModel');
             if (vehicleModel == 'undefined' || vehicleModel == null || vehicleModel.length == 0) 
             {
                vehicleModel = '';
             }
            //  console.log('get vehicleModel FINAL: ' + vehicleModel);
             return vehicleModel;
         },
         set model(newValue) 
         {
             sessionStorage.setItem('vehicleModel', newValue);
            //  console.log('set vehicleModel: ' + newValue);
         },
         get accelerationLimit() 
         {
             let vehicleAccelerationLimit = sessionStorage.getItem('vehicleAccelerationLimit');
             if (vehicleAccelerationLimit == 'undefined' || vehicleAccelerationLimit == null || vehicleAccelerationLimit.length == 0) 
             {
                vehicleAccelerationLimit = '';
             }
             return vehicleAccelerationLimit;
         },
         set accelerationLimit(newValue) 
         {
             sessionStorage.setItem('vehicleAccelerationLimit', newValue);
            //  console.log('set vehicleAccelerationLimit: ' + newValue);
         },
         get brakeLimit() 
         {
             let vehicleDecelerationLimit = sessionStorage.getItem('vehicleDecelerationLimit');
             if (vehicleDecelerationLimit == 'undefined' || vehicleDecelerationLimit == null || vehicleDecelerationLimit.length == 0) 
             {
                vehicleDecelerationLimit = '';
             }
            //  console.log('get vehicleDecelerationLimit(brake) FINAL: ' + vehicleDecelerationLimit);
             return vehicleDecelerationLimit;
         },
         set brakeLimit(newValue) 
         {
             sessionStorage.setItem('vehicleDecelerationLimit', newValue);
            //  console.log('set vehicleDecelerationLimit(brake): ' + newValue);
         },
         remove() 
         {
             sessionStorage.removeItem('vehicleMake');
             sessionStorage.removeItem('vehicleModel');
             sessionStorage.removeItem('vehicleAccelerationLimit');
             sessionStorage.removeItem('vehicleDecelerationLimit');
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
}

function activatePluginLisenter(pluginName,pluginType,pluginVersionId,changeToNewStatus,isRequired)
{
    //call activatePlugin(pluginName,pluginType,pluginVersionId,changeToNewStatus,isRequired) 
    //It is defined in ros_plugins.js
    activatePlugin(pluginName,pluginType,pluginVersionId,changeToNewStatus,isRequired);
}

function activateGuidanceListner(newStatus = true)
{
    //It is defined in ros_guidance.js
    activateGuidance(newStatus);
}

function uncheckAllRoutesListener()
{
    let route_radios = document.getElementsByName('route_radio');
    if(route_radios != null && route_radios.length > 0)
    {
        route_radios.forEach((radioElemenet)=>{
            radioElemenet.checked = false;
        });
    }
    let route_error_msgs = document.getElementsByName('route_error_msg');
    route_error_msgs.forEach((elemenet)=>{
        elemenet.style.display ='none';
    });
}