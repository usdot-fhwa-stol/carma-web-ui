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
  
     //Click guidance button to enable automation
     $('#Guidace-btn').click(function(){
          let guidanceStatus = $('#guidance-status');
          console.log(guidanceStatus.val());
          $('#disengageModal').modal('show'); 
          if(g_is_guidance_automated) //already automated guidance
          {                 
               g_is_guidance_automated = false; //chang to manual
               console.log("change to manual");
               guidanceStatus.html('').append('Manual'); 
               guidance_click_count = 0;
              /**
               $('#Guidace-btn').css({                         
                    'color': BLUE_COLOR,
                    'border': '2px solid ' + BLUE_COLOR
               }); 
               $('#Guidace-btn:hover').css('box-shadow',' 1px 1px 5px 1px ' + BLUE_COLOR); 
               $('#Guidace-btn:active').css('box-shadow',' 1px 1px 5px 1px ' + BLUE_COLOR);  
                */                 
          }
          else{
               //change to automated
               g_is_guidance_automated = true;
               console.log("change to automated");
               /**
               guidanceStatus.html('').append('Automated'); 
                    $('#Guidace-btn').css({                         
                         'color': GREEN_COLOR,
                         'border': '2px solid ' + GREEN_COLOR
                    });
                    $('#Guidace-btn:hover').css('box-shadow',' 1px 1px 5px 1px ' + GREEN_COLOR); 
                    $('#Guidace-btn:active').css('box-shadow',' 1px 1px 5px 1px ' + GREEN_COLOR);  
                     */              
          }
     });
    
});
