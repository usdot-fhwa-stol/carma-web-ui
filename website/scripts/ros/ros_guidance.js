/**
 * Check Guidance State
 * subscribe to /guidance/state
 */
function subscribeToGuidanceState ()
{
    let listener = new ROSLIB.Topic({
        ros: g_ros,
        name: T_GUIDANCE_STATE,
        messageType: M_GUIDANCE_STATE
    });
    // Then we add a callback to be called every time a message is published on this topic.
    /*
    uint8 STARTUP = 1
    uint8 DRIVERS_READY = 2
    uint8 ACTIVE = 3
    uint8 ENGAGED = 4
    uint8 INACTIVE = 5
    uint8 SHUTDOWN = 0
    */
   let btnCAVGuidance = document.getElementById('CARMA_guidance_icon_png');
    listener.subscribe(function(message)
    {
        //Check ROSBridge connection before subscribe a topic
       IsROSBridgeConnected();
       
       //reset session_isGuidance.engaged/active to false  
       session_isGuidance.engaged = false;
       session_isGuidance.active = false;

       switch (message.state) 
       {
            case STARTUP: 
                btnCAVGuidance.src = "../../images/Xtra_Art/Big-grayREV.svg"; //'Guidance is starting up.';
                btnCAVGuidance.style.boxShadow = null;
                //clear/reset engage elapsed time in session
                if(startDateTime != null)
                    startDateTime.remove();
                break;
            case DRIVERS_READY: 
                 //clear/reset engage elapsed time in session
                //  if(startDateTime != null)
                //     startDateTime.remove();
                btnCAVGuidance.src = "../../images/Xtra_Art/Big-greenREV.svg";
                btnCAVGuidance.style.boxShadow = null;
                break;
            case ACTIVE:
                 //clear/reset engage elapsed time in session
                //  if(startDateTime != null)
                //     startDateTime.remove();
                session_isGuidance.active = true;
                btnCAVGuidance.src = "../../images/Xtra_Art/Big-greenREV.svg"; //'Guidance is now ACTIVE.'
                btnCAVGuidance.style.boxShadow  = "0px 0px 10px 0px white";                          
                break;
            case ENGAGED: 
                session_isGuidance.engaged = true;                
                //start the timer when it first engages.              
                // Start timer after engaging Guidance.
                btnCAVGuidance.style.boxShadow = "0px 0px 20px 0px white";
                if (g_timer == null)
                {
                    console.log('*** setInterval & countUpTimer was called.');
                    g_timer = setInterval(countUpTimer, 1000);
                }
                btnCAVGuidance.src = "../../images/Xtra_Art/Big-blueREV.svg"; //'Guidance is now ENGAGED.'
                break;
            case INACTIVE:
                 //clear/reset engage elapsed time in session
                 if(startDateTime != null)
                     startDateTime.remove();
                //Set based on whatever guidance_state says, regardless if UI has not been engaged yet.
                btnCAVGuidance.src = "../../images/Xtra_Art/Big-redREV.png"; //'CAV Guidance is INACTIVE. <br/> To re-engage, double tap the ACC switch downward on the steering wheel.';
                break;
            case SHUTDOWN:                
                //Show modal popup for Shutdown alerts from Guidance, which is equivalent to Fatal since it cannot restart with this state.
                if(listener != null && listener != 'undefined') 
                    listener.unsubscribe();                     
                //If this modal does not exist, create one 
                if( $('#systemAlertModal').length < 1 ) 
                { 
                    $('#ModalsArea').append(createSystemAlertModal(
                        '<span style="color:red"><i class="fas fa-bug"></i></span>SYSTEM ALERT',
                        'System received a guidance shutdown.' + 
                        '<br/><br/>Please take <strong>MANUAL</strong> control of the vehicle?',
                        false,true
                        ));              
                }
                $('#systemAlertModal').modal({backdrop: 'static', keyboard: false});     
                break;
            default:
                //'System alert type is unknown. Assuming system it not yet ready.  ' + message.description;
                break;
        }
    });
}

/*
    To activate and de-activate guidance.
    NOTE:
    1) Setting active=true is not the same as engaging. Guidance has to issue engage status based on other criteria.
    2) Setting active=false is the same as disengaging.
*/
function activateGuidance(newStatus = true) 
{
     //audio-fix needs to be on an actual button click event on the tablet.
     //loadAudioElements();

    console.log('new guidance'+ newStatus);
    //Call the service to engage guidance.
    var setGuidanceClient = new ROSLIB.Service({
        ros:g_ros,
        name: '/guidance/set_guidance_active',
        serviceType: 'cav_srvs/SetGuidanceActive'
    });

    //Setup the request.
    var request = new ROSLIB.ServiceRequest({
        guidance_active: newStatus
    });

    // Call the service and get back the results in the callback.
    setGuidanceClient.callService(request, function (result) {

        if (Boolean(result.guidance_status) != newStatus) //NOT SUCCESSFUL.
        {
            console.log('Guidance failed to set the value, please try again.');
            alert('Guidance failed to set the value, please try again.');
            return;
        }

        //When active = false, this is equivalent to disengaging guidance. Would not be INACTIVE since inactivity is set by guidance.
        if (newStatus == false)
        {
            //setCAVButtonState('DISENGAGED');
            //TODO: This disengage means DRIVERS_READY state
            session_isGuidance.active = false;
            session_isGuidance.engaged = false;
            return;
        }

        //Open to DriveView tab after activating and show the widget options.
        //checkAvailability will call setCAVButtonState
        if (newStatus == true){
            console.log('new guidance final'+ newStatus);
            // openTab(event, 'divDriverView');
            // CarmaJS.WidgetFramework.loadWidgets(); //Just loads the widget
            // checkAvailability(); //Start checking availability (or re-subscribe) if Guidance has been engaged.
            //checkRobotEnabled(); //Start checking if Robot is active
            session_isGuidance.active = true;
            session_isGuidance.engaged = false;
            return;
        }
    });
}
/*
    TODO (Topic not available): Check for Robot State
    If no longer active, show the Guidance as Yellow. If active, show Guidance as green.
*/
function checkRobotEnabled() {

    var listenerRobotStatus = new ROSLIB.Topic({
            ros: g_ros,
            name: 'controller/robotic_status',
            messageType: 'cav_msgs/RobotEnabled'
     });

     listenerRobotStatus.subscribe(function (message) {
            insertNewTableRow('tblFirstB', 'Robot Active', message.robot_active);
            insertNewTableRow('tblFirstB', 'Robot Enabled', message.robot_enabled);
     });
}
