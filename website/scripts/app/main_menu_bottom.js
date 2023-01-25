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
       
       if(displayMaps != "none")
       {
            mapsPanel.css('display','none');           
       }
       else
       {
            mapsPanel.css('display','block');
       }
    });

    //display status panel
    $("#status-btn").click(function(){
        var statusPanel = $("#status-panel");
       var displayStatus = statusPanel.css('display');
       if(displayStatus != "none")
       {
            statusPanel.css('display','none');
       }
       else
       {
            statusPanel.css('display','block');
       }
    });
        
    //display logs panel
    $("#logs-btn").click(function(){
        var logsPanel = $("#logs-panel");
       var displayLogs = logsPanel.css('display');
       console.log(displayLogs);
       if(displayLogs != "none")
       {
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
       if(displayActivePlugins != "none")
       {
            activePluginsPanel.css('display','none');
       }
       else
       {
            activePluginsPanel.css('display','block');
       }
    });

    //display all plugins advanced panel
    $("#allPlugins-btn").click(function(){
          var allPluginsPanel = $("#allPlugins-panel");
          var displayAllPlugins = allPluginsPanel.css('display');
          console.log(displayAllPlugins);
          if(displayAllPlugins != "none")
          {
               allPluginsPanel.css('display','none');
               this.style.backgroundColor='black';
               this.style.color='white';
          }
          else
          {
               allPluginsPanel.css('display','block');
               this.style.backgroundColor='rgb(167, 223, 57)';
               this.style.color='black';
          }
     });


     //display platoon info panel
    $("#platoon-info-btn").click(function(){
          var platoonPanel = $("#platoon-info-panel");
          var displayPlatoonPanel = platoonPanel.css('display');
          if(displayPlatoonPanel != "none"){
               platoonPanel.css('display','none');
               this.style.backgroundColor='black';
               this.style.color='white';
          }
          else{
               platoonPanel.css('display','block');
               this.style.backgroundColor='rgb(167, 223, 57)';
               this.style.color='black';
          }
     });

     //display speed advisory info panel
    $("#geofence-info-btn").click(function(){
          var speedAdvisoryPanel = $("#speed-advisory-info-panel");
          var displaySpeedAdvisoryPanel = speedAdvisoryPanel.css('display');
          console.log(displaySpeedAdvisoryPanel);
          if(displaySpeedAdvisoryPanel != "none"){
               speedAdvisoryPanel.css('display','none');
               this.style.backgroundColor='black';
               this.style.color='white';
          }
          else{
               speedAdvisoryPanel.css('display','block');
               this.style.backgroundColor='rgb(167, 223, 57)';
               this.style.color='black';
          }
     });

      //display event info panel
    $("#event-info-btn").click(function(){
          var EventPanel = $("#event-info-panel");
          if(EventPanel.css('display') != "none"){
               EventPanel.css('display','none');
               this.style.backgroundColor='black';
               this.style.color='white';
          }
          else{
               EventPanel.css('display','block');
               this.style.backgroundColor='rgb(167, 223, 57)';
               this.style.color='black';
          }
     });

     //show logout modal
     $("#logout-btn").click(function(){
          //clear this ModalArea before create new modal
          $('#ModalsArea').html('');
          $('#ModalsArea').append(
               createDisengageConfirmModal(
                    '<span style="color:rgb(240, 149, 4)"><i class="fas fa-exclamation-triangle"></i></span>&nbsp;&nbsp;WARNING',
                    'Are you sure to take <strong>MANUAL</strong> control?',true,false));
          $('#disengageModal').modal({backdrop: 'static', keyboard: false}); 
     });

     //close panel X btns 
     $('#changePluginsCloseBtn').click(function(){
          $("#allPlugins-panel").css('display','none');
          $("#allPlugins-btn").css('background-color','black');
          $("#allPlugins-btn").css('color','white');
     });

     $('#platoonInfoCloseBtn').click(function(){
          $("#platoon-info-panel").css('display','none');
          $("#platoon-info-btn").css('background-color','black');
          $("#platoon-info-btn").css('color','white');
     });

     $('#speedAdvisoryInfoInfoCloseBtn').click(function(){
          $("#speed-advisory-info-panel").css('display','none');
          $("#geofence-info-btn").css('background-color','black');
          $("#geofence-info-btn").css('color','white');
     });

     $('#EventInfoInfoCloseBtn').click(function(){
          $("#event-info-panel").css('display','none');
          $("#event-info-btn").css('background-color','black');
          $("#event-info-btn").css('color','white');
     });

     $('#SystemStatusInfoInfoCloseBtn').click(function(){
          $("#status-panel").css('display','none');
          $("#status-btn").toggleClass('active');
     });

     $('#SystemLogsInfoInfoCloseBtn').click(function()
     {
          $("#logs-panel").css('display','none');
          $("#logs-btn").toggleClass('active');
     });

     $('#ActivePluginInfoInfoCloseBtn').click(function()
     {
          $("#activePlugins-panel").css('display','none');
          $("#activePlugins-btn").toggleClass('active');
     });

     $('#MapsInfoInfoCloseBtn').click(function()
     {
          $("#maps-panel").css('display','none');
          $("#maps-btn").toggleClass('active');
     });
     
     //Check dropdown every 10 seconds
     setInterval(()=>{
          //statistics dropdown
          $("#statistics-dropdown").css('display','none');
          $("#statistics-dropdown").removeClass("show");
          $("#statistics-btn").attr("aria-expanded","false");  
          $("#platoon-info-btn").css('display','none');
          $("#geofence-info-btn").css('display','none');   
          $("#event-info-btn").css('display','none');          
     },10000);

     //Check dropdown every 1 second
     setInterval(()=>{
          //Statistics dropdown
          CheckStatisticsItemShowCount();
        
          //advanced dropdown
          CheckAdvancedItemShowCount();
     },500);

     function CheckStatisticsItemShowCount()
     {
          let showCount = 0;
          $('a.statistics-dropdown-item').each(function(index){
               if(this.style.display != 'none') showCount++;
          });
          if(showCount > 0) 
          {
               $('#statistics-no-item-text').remove();               
               $("#statistics-btn").css({
                    "cursor":"pointer",
                    "color":"white"
               });
          }
          else
          {
               $("#statistics-btn").css({
                    "cursor":"not-allowed"
               });
               if($('#statistics-no-item-text').length <1)
                    $('.statistics-dropdown-menu').append('<p id="statistics-no-item-text" style="color:#ffc107">Not Available</p>');
          } 
     } 

     function CheckAdvancedItemShowCount()
     {
          let showCount = 0;
          $('a.advanced-dropdown-item').each(function(index){
               if(this.style.display != 'none' ) showCount++;
          });
          if(showCount > 0) 
          {
               $('#advanced-no-item-text').remove();
               $("#advanced-btn").css({
                    "cursor":"pointer",
                    "color":"white"
               });
          }
          else
          {
               $("#advanced-btn").css({
                    "cursor":"not-allowed",
                    "color":"grey"
               });
               if($('#advanced-no-item-text').length <1)
                    $('.advanced-dropdown-menu').html('<p id="advanced-no-item-text" style="color:#ffc107">Not Available</p>');
          } 
     } 


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
          
          console.log(session_isGuidance + session_isGuidance.active)
          if(session_isGuidance!= null && (session_isGuidance.engaged == true || session_isGuidance.active == true)) //already automated guidance-engaged
          {
               toggleLoading();
              //clear this ModalArea before create new modal
               $('#ModalsArea').html('');
               $('#ModalsArea').append(
                    createDisengageConfirmModal(
                         '<span style="color:rgb(240, 149, 4)"><i class="fas fa-exclamation-triangle"></i></span>&nbsp;&nbsp;WARNING',
                         'Are you sure to take <strong>MANUAL</strong> control?', false,true));
               $('#disengageModal').modal({backdrop: 'static', keyboard: false});          
          }
          else if(session_isGuidance != null && session_isGuidance.active == false) //guidance is currently not active
          {
               toggleLoading();
               activateGuidanceListner();
          }
          else
          {   
               //
          }
     });
    
});
