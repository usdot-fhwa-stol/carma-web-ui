 /***
     * top menu functionalities
     * ***/
$(document).ready(function(){
   
    $(".nav-link.route").click(function(){
        $(this).addClass('active');
        $(".nav-link.display").removeClass('active');

        //display route
        $("#route-list-area").css('display','block');

        //hide widgets area and 3D canvas
        $("#widgets-panel").css('display','none');
        $("#main-canvas").css('display','none');

    });
    $(".nav-link.display").click(function(){
        $(this).addClass('active');
        $(".nav-link.route").removeClass('active');

        //display widgets area and 3D canvas
        $("#widgets-panel").css('display','block');
        $("#main-canvas").css('display','block');

        //hide route
        $("#route-list-area").css('display','none');
    });

    $('#sound-status').click(()=>{
        let audioAlert4 = document.getElementById('audioAlert4');
        audioAlert4.muted = !audioAlert4.muted;
        
        let audioAlert5 = document.getElementById('audioAlert5');
        audioAlert5.muted = !audioAlert5.muted;

        if($('.fa-volume-mute').css('display')=='none')
        {
            $('.fa-volume-mute').css({
                'display': '',
                'color':'grey'
            });            
        }
        else
        {
            $('.fa-volume-mute').css('display', 'none');
        }
        if($('.fa-volume-up').css('display')=='none')
        {
            $('.fa-volume-up').css({
                'display': '',
                'color':'rgb(135, 184, 33)'
            });
        }
        else
        {
            $('.fa-volume-up').css('display', 'none');
        }       
    });
     /****Animate Signal JS
     const circles = document.querySelectorAll('.signal-circle')
     let activeLight = 0;
     setInterval(() => {
     changeLight();
     }, 1000);
     function changeLight() {
     circles[activeLight].className = 'signal-circle';
     activeLight++;
     
     if(activeLight > 2) {
     activeLight = 0;
     }
     
     const currentLight = circles[activeLight]
     
     currentLight.classList.add(currentLight.getAttribute('color'));
     }
     ****/
});
