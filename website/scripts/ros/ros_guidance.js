/**
 * subscribe to /guidance/state
 */
function subscribeToGuidanceState ()
{
    let listener = new ROSLIB.Topic({
        ros: g_ros,
        name: T_GUIDANCE_STATE,
        messageType: M_GUIDANCE_STATE
    });

    listener.subscribe(function(message)
    {
        //Check ROSBridge connection before subscribe a topic
        IsROSBridgeConnected();
        // console.log("backend services(2D)/ros_guidance: message = " + message);
        let state = message.state;
        let guidanceStatus = $('#guidance-status');
        if(state == ENGAGED)
        {
            g_is_guidance_automated = true; 
            /**
            console.log("backend services(2D)/ros_guidance: automated");
            guidanceStatus.html('').append('Automated'); 
            $('#Guidace-btn').css({                         
                'color': GREEN_COLOR,
                'border': '2px solid ' + GREEN_COLOR
            });
            $('#Guidace-btn:hover').css('box-shadow',' 1px 1px 5px 1px ' + GREEN_COLOR); 
            $('#Guidace-btn:active').css('box-shadow',' 1px 1px 5px 1px ' + GREEN_COLOR); 
            ***/
        }
        else
        {
            g_is_guidance_automated = false;
            // console.log("backend services(2D)/ros_guidance: Manual");
        /** guidanceStatus.html('').append('Manual'); 
            $('#Guidace-btn').css({                         
                'color': BLUE_COLOR,
                'border': '2px solid ' + BLUE_COLOR
            }); 
            $('#Guidace-btn:hover').css('box-shadow',' 1px 1px 5px 1px ' + BLUE_COLOR); 
            $('#Guidace-btn:active').css('box-shadow',' 1px 1px 5px 1px ' + BLUE_COLOR);   
            */                  
        }
    });
}