$(document).ready(function () 
{       
    $("#jqxLoader").jqxLoader({width: 150, height: 100, imagePosition: 'center', isModal: true});
    $('#btnStart').on('click', function () 
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
            type:'POST',
            url:'scripts/launchPlatform.php',
            data: {
                'cbDebugMd':$('input[name=cbDebugMd]').prop('checked'),
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
        if (g_retry_counter < CarmaJS.Config.getRosConnectionRetry()) 
        {
            console.log('Awaiting ROS connection status ...attempt: ' + g_retry_counter);
            waitForROSConnection();                     
        }      
        else 
        { 
            if (g_retry_counter >= CarmaJS.Config.getRosConnectionRetry())
            {
                $('#jqxLoader').jqxLoader('close');  
                $('#Carma-connection-fail-alert').css('display','');
                g_retry_counter = 0;
            }                
        }
    }, CarmaJS.Config.getRosConnectionWaitTime())
}