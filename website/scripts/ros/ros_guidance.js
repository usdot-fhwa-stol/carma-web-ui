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
                btnCAVGuidance.src = "../../images/Xtra_Art/Big-grayREV.svg"; 
                btnCAVGuidance.style.boxShadow = null;

                $('#divCapabilitiesGuidance').html('Guidance is starting up.');
                $('#divCapabilitiesContent').css('display','inline-block');
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
                $('#allPlugins-btn').css('display','block');
                $('input:checkbox').prop("disabled", false);
                $('input:checkbox+.slider').css('cursor','pointer');
                break;
            case ACTIVE:
                 //clear/reset engage elapsed time in session
                //  if(startDateTime != null)
                //     startDateTime.remove();
                session_isGuidance.active = true;
                btnCAVGuidance.src = "../../images/Xtra_Art/Big-greenREV.svg"; 
                btnCAVGuidance.style.boxShadow  = "0px 0px 10px 0px white";              
                
                $('#divCapabilitiesGuidance').html('Guidance is now ACTIVE.');
                $('#divCapabilitiesContent').css('display','inline-block');   
                
                //Disabled Change plugins at guidance Active state
                $('#allPlugins-btn').css('display','none');
                $('input:checkbox').prop("disabled", true);
                $('input:checkbox+.slider').css('cursor','not-allowed');
                break;
            case ENGAGED: 
                session_isGuidance.engaged = true;                
                //start the timer when it first engages.    
                btnCAVGuidance.style.boxShadow = "0px 0px 20px 0px white";
                if (g_timer == null)
                {
                    console.log('*** setInterval & countUpTimer was called.');
                    g_timer = setInterval(countUpTimer, 1000);
                }
                btnCAVGuidance.src = "../../images/Xtra_Art/Big-blueREV.svg"; 

                $('#divCapabilitiesGuidance').html('Guidance is now ENGAGED.' );
                $('#divCapabilitiesContent').css('display','inline-block');
                //hide route area
                $('#clearRoutes').css('display','none'); //remove Clear from route selection
                $("#route-list-area").css('display','none');   //hide route selection area 
                $(".nav-link.route").removeClass('active'); //remove navigation route active style        
                //Show display area:  widgets area and 3D canvas 
                $('.nav-link.display').addClass('active'); //change navigation to display
                $("#widgets-panel").css('display','block'); //show navigation to display
                $("#main-canvas").css('display','block'); //show navigation to display   

                //Disabled Change plugin at guidance Active state
                $('#allPlugins-btn').css('display','none');
                $('input:checkbox').prop("disabled", true);
                $('input:checkbox+.slider').css('cursor','not-allowed');
                break;
            case INACTIVE:
                 //clear/reset engage elapsed time in session
                 if(startDateTime != null)
                     startDateTime.remove();
                //Set based on whatever guidance_state says, regardless if UI has not been engaged yet.
                btnCAVGuidance.src = "../../images/Xtra_Art/Big-redREV.svg"; 
                playSound('audioAlert3', true);
                $('#divCapabilitiesGuidance').html('CAV Guidance is INACTIVE. <br/> To re-engage, double tap the ACC switch downward on the steering wheel.');
                $('#divCapabilitiesContent').css('display','inline-block');
                break;
            case SHUTDOWN:                
                //Show modal popup for Shutdown alerts from Guidance, which is equivalent to Fatal since it cannot restart with this state.
                if(listener != null && listener != 'undefined') 
                    listener.unsubscribe();                     
                //If this modal does not exist, create one 
                if( $('#systemAlertModal').length < 1 ) 
                { 
                    $('#ModalsArea').append(createSystemAlertModal(
                        '<span style="color:red"><i class="fas fa-exclamation-triangle"></i></span>&nbsp;&nbsp;SYSTEM ALERT',
                        'PLEASE TAKE <strong>MANUAL</strong> CONTROL OF THR VEHICLE.' + 
                        '<br/><br/>System received a guidance SHUTDOWN.',
                        false,true
                        ));              
                }
                $('#systemAlertModal').modal({backdrop: 'static', keyboard: false});     
                break;
            default:
                $('#divCapabilitiesSystemAlert').html('System alert type is unknown. Assuming system it not yet ready.'); 
                $('#divCapabilitiesContent').css('display','inline-block');
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
    //Check ROSBridge connection before subscribe a topic
    IsROSBridgeConnected();

    console.log('new guidance'+ newStatus);
    //Call the service to engage guidance.
    var setGuidanceClient = new ROSLIB.Service({
        ros:g_ros,
        name: S_GUIDANCE_ACTIVATED,
        serviceType: M_GUIDANCE_ACTIVATE
    });

    //Setup the request.
    var request = new ROSLIB.ServiceRequest({
        guidance_active: newStatus
    });

    // Call the service and get back the results in the callback.
    setGuidanceClient.callService(request, function (result) 
    {
        //Check ROSBridge connection before subscribe a topic
        IsROSBridgeConnected();
        if (Boolean(result.guidance_status) != newStatus) //NOT SUCCESSFUL.
        {
            $('#divCapabilitiesContent').html('');
            $('#divCapabilitiesContent').html('Guidance failed to set the value, please try again.');
            $('#divCapabilitiesContent').css('display','inline-block');
            return;
        }

        //When active = false, this is equivalent to disengaging guidance. Would not be INACTIVE since inactivity is set by guidance.
        if (newStatus == false)
        {
            //setCAVButtonState('DISENGAGED');
            //This disengage means DRIVERS_READY state
            session_isGuidance.active = false;
            session_isGuidance.engaged = false;
            return;
        }

        if (newStatus == true)
        {
            // openTab(event, 'divDriverView');
            // CarmaJS.WidgetFramework.loadWidgets(); //Just loads the widget
            // checkAvailability(); //Start checking availability (or re-subscribe) if Guidance has been engaged.
            session_isGuidance.active = true;
            session_isGuidance.engaged = false;
            return;
        }
    });
}

