/***
     * bottom menu functionalities
     * ***/
$(document).ready(function(){

    $(".bottom-nav-item").click(function(){
        $(this).toggleClass('active');
    });

    //display map panel
    $("#maps-btn").click(function(){
        var mapsPanel = $("#maps-panel");
       var displayMaps = mapsPanel.css('display');
       
       if(displayMaps != "none"){
            mapsPanel.css('display','none');           
       }
       else{
            mapsPanel.css('display','block');
       }
    });

    //display status panel
    $("#status-btn").click(function(){
        var statusPanel = $("#status-panel");
       var displayStatus = statusPanel.css('display');
       console.log(displayStatus);
       if(displayStatus != "none"){
            statusPanel.css('display','none');
       }
       else{
            statusPanel.css('display','block');
       }
    });
        
    //display logs panel
    $("#logs-btn").click(function(){
        var logsPanel = $("#logs-panel");
       var displayLogs = logsPanel.css('display');
       console.log(displayLogs);
       if(displayLogs != "none"){
            logsPanel.css('display','none');
       }
       else{
            logsPanel.css('display','block');
       }
    });

     //display active plugins panel
     $("#activePlugins-btn").click(function(){
       var activePluginsPanel = $("#activePlugins-panel");
       var displayActivePlugins = activePluginsPanel.css('display');
       console.log(displayActivePlugins);
       if(displayActivePlugins != "none"){
            activePluginsPanel.css('display','none');
       }
       else{
            activePluginsPanel.css('display','block');
       }
    });

    //display all plugins advanced panel
    $("#allPlugins-btn").click(function(){
          var allPluginsPanel = $("#allPlugins-panel");
          var displayAllPlugins = allPluginsPanel.css('display');
          console.log(displayAllPlugins);
          if(displayAllPlugins != "none"){
               allPluginsPanel.css('display','none');
          }
          else{
               allPluginsPanel.css('display','block');
          }
     });

     //display platoon info panel
    $("#platoon-info-btn").click(function(){
          var platoonPanel = $("#platoon-info-panel");
          var displayPlatoonPanel = platoonPanel.css('display');
          console.log(displayPlatoonPanel);
          if(displayPlatoonPanel != "none"){
               platoonPanel.css('display','none');
          }
          else{
               platoonPanel.css('display','block');
          }
     });

     //display speed advisory info panel
    $("#speed-advisory-info-btn").click(function(){
          var speedAdvisoryPanel = $("#speed-advisory-info-panel");
          var displaySpeedAdvisoryPanel = speedAdvisoryPanel.css('display');
          console.log(displaySpeedAdvisoryPanel);
          if(displaySpeedAdvisoryPanel != "none"){
               speedAdvisoryPanel.css('display','none');
          }
          else{
               speedAdvisoryPanel.css('display','block');
          }
     });
     //show logout modal
     $("#logout-btn").click(function(){
          $('#disengageModal').modal({backdrop: 'static', keyboard: false});
     });

     //close panel X btns 
     $('#changePluginsCloseBtn').click(function(){
          $("#allPlugins-panel").css('display','none');
     });

     $('#platoonInfoCloseBtn').click(function(){
          $("#platoon-info-panel").css('display','none');
     });

     $('#speedAdvisoryInfoInfoCloseBtn').click(function(){
          $("#speed-advisory-info-panel").css('display','none');
     });

     $('#SystemStatusInfoInfoCloseBtn').click(function(){
          $("#status-panel").css('display','none');
          $("#status-btn").toggleClass('active');
     });

     $('#SystemLogsInfoInfoCloseBtn').click(function(){
          $("#logs-panel").css('display','none');
          $("#logs-btn").toggleClass('active');
     });

     $('#ActivePluginInfoInfoCloseBtn').click(function(){
          $("#activePlugins-panel").css('display','none');
          $("#activePlugins-btn").toggleClass('active');
     });

     $('#MapsInfoInfoCloseBtn').click(function(){
          $("#maps-panel").css('display','none');
          $("#maps-btn").toggleClass('active');
     });
     
     function toggleLoading()
     {
          //open loading
          $('#guidance-loading-status').html('loading...');

          //close loading after 0.5 sec
          setTimeout(function(){
               $('#guidance-loading-status').html('');
          },500);               
     }

     //Click guidance button to enable automation
     $('#CARMA_guidance_icon_png').click(function()
     {
          
          //console.log(session_isGuidance + session_isGuidance.active)
          if(session_isGuidance!= null && session_isGuidance.engaged == true) //already automated guidance-engaged
          {
               toggleLoading();
               $('#disengageModal').modal({backdrop: 'static', keyboard: false});    //change to restart modal           
          }
          else if(session_isGuidance != null && session_isGuidance.active == false) //guidance is currently not active
          {
               toggleLoading();
               activateGuidanceListner();
          }
          else
          {   
               //TODO       
          }
     });
    
});
