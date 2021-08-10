$(document).ready(function(){
    if (typeof (Storage) !== 'undefined') 
    {
        let deferSessionInit = $.Deferred();
        let deferROSConnection = $.Deferred();
        let deferSystemReady = $.Deferred();

        //Initialize session variables
        if( initializeSessionVariables() )
        {
            deferSessionInit.resolve('session variables are initialized');
        }     
        else
        {
            deferSessionInit.reject('session variables are not initialized');
        }

        $.when(deferSessionInit)
         .done((successMessage)=>{
            console.log(successMessage);
            // rosbridge connection: rosbridge_v2.js
            connectToROS();
            if(g_ros != null)
            {
                g_ros.on('connection', function () 
                {
                    deferROSConnection.resolve('ROS bridge connected!');
                });
                g_ros.on('close', function () 
                {
                    deferROSConnection.reject('ROS bridge closed!');
                });
                g_ros.on('error', function () 
                {
                    deferROSConnection.reject('ROS bridge connection error!');
                });
            }
            else
            {
                deferROSConnection.reject('ROS Connection is not initialized');
            }
         })
         .fail((error)=>{
            console.log('deferSessionInit: '+ error);
         });
       
        
        $.when(deferROSConnection)
        .done((successMessage)=>{
            $('#divCapabilitiesSystemAlert').html('Awaiting for system ready...');
            $('#divCapabilitiesContent').css('display','inline-block');
            // Check System Ready:ros_system_alert.js
            let systemAlertInterval = setInterval(()=>{
                checkSystemAlerts();
                if(session_isSystemAlert != null && session_isSystemAlert.ready == true )
                {
                    clearInterval(systemAlertInterval); //stop interval
                    deferSystemReady.resolve('System is in Ready status');
                }
            },500); //Check system alert every half second until READY          
        })
        .fail((error)=>{
            console.log('deferROSConnection: '+ error);
        });     
       
       
        $.when(deferSystemReady)
        .done((successMessage)=>{
            console.log(successMessage);
             /****
             ** NEXT STEP:
            ** After session initialized , ROS connected, and system alert is ready, subscribe to below services and topics.                
            ***/
            
            //SECTION: Route Area
            if(sessionStorage.getItem('selectedRouteName')===null ||
                sessionStorage.getItem('selectedRouteId') ===null ||                
                sessionStorage.getItem('isGuidanceActive') ===null)
            {
                console.log("Calling abort active route.");
                //call abort active route to reinforce route transition to selection state
                abortActiveRoute();
            }

            //Get available routes
            subscribeToGuidanceAvailaleRoutes(); 

            /***
             * SECTION: Display Status icons 
             */        
            subscribeToDriverDiscovery();//GPS or PinPoint status        
            subscribeToInboundBinary(); //OBU status
            subscribeToOutboundBinary(); //OBU status
            subscribeToLocalizationStatusReport(); //Localization Status

            /**
             * SECTION: Display Area
             * **/
            subscribeToLocalizationEKFTwist(); //Current Vehicle Speed
            subscribeToVehicleCMD(); //Vechile Command;  applied speed; 
            sunscribeToSteeringFeedback(); //Steering angle
            sunscribeToBrakeFeedback(); //brake;
            sunscribeToThrottleFeedback(); //accelerator  
            subscribeToGuidanceRouteState(); //Route - Speed Limit        
            TrafficSignalInfoList(); //Traffic Signal 
            subscribeLightBarStatus(); //light bar
            subscribeLaneChangeTopics(); //lane change Info: left/right midles
            GetLaneChangeStatus(); //Lane change status : CLC (Cooperative lane change status)

            /***
             * SECTION: Right Panel Info
             * */
            // set inital paramsters that are used by the topics and services
            let promiseRequiredPluginParam = new Promise((resolve, reject)=>{
                getRequiredPluginParam(); 

                let myIterval= setInterval(() => {
                    if(g_required_plugins!=null && g_required_plugins.length>0){
                        resolve('required plugin param loaded ');
                        clearInterval(myIterval);
                    }
                }, 500);
            });
            promiseRequiredPluginParam.then((successMessage)=>{
                console.log(successMessage);
                subscribeToGuidanceRegisteredPlugins ();//Change plugins panel
            });  

            subscribeToGuidanceActivePlugins();//Active plugins panel
            subscribeToPlatoonInfo(); //show platoon info
            GetEventInfo(); //Show Traffic Event Info
            showStatusandLogs();
            /***
             * SECTION: Bottom Menu 
             * */
            //guidance button
            subscribeToGuidanceState(); 
        })
        .fail((error)=>{
            console.log('deferSystemReady: ' + error);
        });
    } 
    else 
    {
        $('#divCapabilitiesSystemAlert').html('Sorry, cannot proceed unless your browser support HTML Web Storage Objects.' + 
                                           'Please contact your system administrator.');
        $('#divCapabilitiesContent').css('display','inline-block');
    }

    //Enable sound
    enableSound();
});


/**
 * ************************************
 * Session Varibales Definitions
 * ************************************
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
         get steeringLimit() 
         {
             let vehicleSteeringLimit = sessionStorage.getItem('vehicleSteeringLimit');
             if (vehicleSteeringLimit == 'undefined' || vehicleSteeringLimit == null || vehicleSteeringLimit.length == 0) 
             {
                vehicleSteeringLimit = '';
             }
             return vehicleSteeringLimit;
         },
         set steeringLimit(newValue) 
         {
             sessionStorage.setItem('vehicleSteeringLimit', newValue);
         },
         get steeringRatio() 
         {
             let vehicleSteeringRatio = sessionStorage.getItem('vehicleSteeringRatio');
             if (vehicleSteeringRatio == 'undefined' || vehicleSteeringRatio == null || vehicleSteeringRatio.length == 0) 
             {
                vehicleSteeringRatio = '';
             }
             return vehicleSteeringRatio;
         },
         set steeringRatio(newValue) 
         {
             sessionStorage.setItem('vehicleSteeringRatio', newValue);
         },
         remove() 
         {
             sessionStorage.removeItem('vehicleMake');
             sessionStorage.removeItem('vehicleModel');
             sessionStorage.removeItem('vehicleAccelerationLimit');
             sessionStorage.removeItem('vehicleDecelerationLimit');
         }
     };
     return true;
}

/***
 * **************************************
 * Definitions: Events and actions taken from UI users 
 * **************************************
 */
function setRouteEventLisenter(routeId, route_name)
{
    //TODO: call abort route to abort the current selected route.
    //It is defined in ros_route.js
     if(session_selectedRoute!=null && session_selectedRoute.id!=null && session_selectedRoute.id.length > 0)
     {
        //abortRoute(session_selectedRoute.name);
        return;
     }  
    //After the current active route is aborted, call setRoute(routeId) to set a new route. 
    //It is defined in ros_route.js
    setRoute(routeId,route_name);
}

function abortRouteEventListener(){
    console.log("abortRouteEventListener called");
    //abort active route after route has already started
    abortActiveRoute();
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
    $('#divCapabilitiesRoute').html('Please select a route.');
    $('#divCapabilitiesContent').css('display','inline-block');
}