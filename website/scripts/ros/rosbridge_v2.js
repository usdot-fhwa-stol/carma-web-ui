/***
 * Connect to the ROS network and create listeners for disconnection to notify user
 * 
 * Parameters:
 * g_ros: a global variable defined in global_variables.js
 */
function connectToROS() 
{
    try
    {
        var ip = CarmaJS.Config.getIP();
        // If there is an error on the backend, an 'error' emit will be emitted.
        g_ros.on('error', function (error) 
        {
            $('#logs-panel-text-ros-connection').html('<span style="color:red">ROS Connection Error.</span>');
            //Show Modal Popup
            if( $('#systemAlertModal').length < 1 && (typeof createSystemAlertModal === "function")) 
             { 
                 $('#ModalsArea').append(createSystemAlertModal(
                     '<span style="color:red"><i class="fas fa-exclamation-triangle"></i></span>&nbsp;&nbsp;SYSTEM ALERT', 
                     "PLEASE TAKE <strong>MANUAL</strong> CONTROL OF THE VEHICLE.<br/> <br/> ROS Connection ERROR",
                     false,true
                     ));              
             }
             $('#systemAlertModal').modal({backdrop: 'static', keyboard: false}); 
        });       
        g_ros.on('connection', function () 
        {            
            $('#logs-panel-text-ros-connection').html('<span style="color:rgb(188, 250, 63)">ROS Connection Made.');
            let urlPathname = window.location.pathname;
            let currentPageName = urlPathname.split('/')[urlPathname.split('/').length-1];
            if(currentPageName != "main.html")
                window.location.href = "/main.html";
        });
        g_ros.on('close', function () 
        {
            $('#logs-panel-text-ros-connection').html('<span style="color:red">ROS Connection Close.</span>');
            //Show Modal Popup
            if( $('#systemAlertModal').length < 1 && (typeof createSystemAlertModal === "function")) 
             { 
                 $('#ModalsArea').append(createSystemAlertModal(
                     '<span style="color:red"><i class="fas fa-exclamation-triangle"></i></span>&nbsp;&nbsp;SYSTEM ALERT', 
                     "PLEASE TAKE <strong>MANUAL</strong> CONTROL OF THE VEHICLE.<br/> <br/> ROS Connection CLOSED",
                     false,true
                     ));              
             }
             $('#systemAlertModal').modal({backdrop: 'static', keyboard: false}); 
        });

        // Create a connection to the rosbridge WebSocket server.
        g_ros.connect('ws://' + ip + ':9090');
        console.log('connect to ROS bridge...');
    }
    catch (err) {
        console.log(err);  
    }
}

/**
 * This is called before calling ros services 
 * and after the connectToROS() function is called 
 * because connectToROS() function initializes the ROS connection.
 */ 
function IsROSBridgeConnected() 
{
    return g_ros.isConnected
}
