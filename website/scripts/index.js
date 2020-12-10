var ros = new ROSLIB.Ros();
var g_retry_counter=0;
var g_connection_wait_time = 5000; //5 seconds
var ros_connect_retry = 24;  //24 times attempt

$(document).ready(function () 
{       
    $("#jqxLoader").jqxLoader({width: 150, height: 100, imagePosition: 'center', isModal: true});
    $('#btnOk').on('click', function () 
    {
            //If launching backend platform, call the waitForROSConnection since starting backend service takes time;
            $('#jqxLoader').jqxLoader('open'); 
            waitForROSConnection();
    });
    
    //call backend launch scripts to launch CARMA Platform at the background
    $('form').submit(function(event)
    {
        event.preventDefault();
        $.ajax({
            type:'GET',
            url:'scripts/launchPlatform.php',
            data: {
                'remotelaunch':$('input[name=remotelaunch]').prop('checked'),
                'rosbagrecorder':$('input[name=rosbagrecorder]').prop('checked')
            },
            dataType:'json'
        })
        .done(function(data){
            console.log('form done' + data)
        });
    });
});

/***
 * After click on "START CARMA", waitForROSConnection() defining 
 * the waiting time/attempt counts to connect to ROSBridge
*/
function waitForROSConnection() 
{
    //call a setTimeout when the loop is called
    setTimeout(function () 
    {
        //check ROSBridge connection here
        connectToROS();             
            
        //increment the counter
        g_retry_counter++;       

        //if the counter < defined connection attempts, call the loop function
        if (g_retry_counter < ros_connect_retry) 
        {
            console.log('Awaiting ROS connection status ...attempt: ' + g_retry_counter);
            waitForROSConnection();                     
        }      
        else 
        { 
            if (g_retry_counter >= ros_connect_retry)
            {
                $('#jqxLoader').jqxLoader('close');  
                $('#Carma-connection-fail-alert').css('display','');
                g_retry_counter = 0;
            }                
        }
    },g_connection_wait_time);
}

function connectToROS() 
{
    try
    {
        var ip = CarmaJS.Config.getIP();
        // If there is an error on the backend, an 'error' emit will be emitted.
        ros.on('error', function (error) 
        {
            console.log('ROS bridge error...');
        });       
        ros.on('connection', function () 
        {            
            $('#logs-panel-text-ros-connection').html('<span style="color:rgb(188, 250, 63)">ROS Connection Made.');
            let urlPathname = window.location.pathname;
            let currentPageName = urlPathname.split('/')[urlPathname.split('/').length-1];
            if(currentPageName != "main.html")
                window.location.href = "/main.html";
        });
        ros.on('close', function () 
        {
            console.log('ROS bridge closed...');
        });

        // Create a connection to the rosbridge WebSocket server.
        ros.connect('ws://' + ip + ':9090');
        console.log('connect to ROS bridge...');
    }
    catch (err) {
        console.log(err);  
    }
}