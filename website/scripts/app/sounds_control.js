
/*
    Play sound for specific alerts or notifications.
*/
function playSound(audioId, repeat) {
    var audioAlert = document.getElementById(audioId);

    if(audioAlert!=null && audioAlert != 'undefined' && !audioAlert.muted)
    {
        audioAlert.currentTime = 0;
        $(document).ready(function(){
                audioAlert.play().catch(function(error){
                    console.error('Audio play error due to DOMException needs users interaction with DOM first.');
                    //mute the sound icon and ask for user to un mute it
                    muteSound();
                    g_play_audio_error = true;
                });
                g_play_audio_error = false;
        });

        if (repeat == false)
        return;

        //Repeat the sounds 5x max or until OK/logout page shows.
        setTimeout(function () {
            g_sound_counter++;
            if (g_sound_counter < g_sound_counter_max) {
                playSound(audioId, true);
            }
        }, 3000)
    }

    
}

//Un-Mute sound
function enableSound()
{
        let audioAlert4 = document.getElementById('audioAlert4');
        audioAlert4.muted = false;

        let audioAlert5 = document.getElementById('audioAlert5');
        audioAlert5.muted = false;

        $('.fa-volume-mute').css('display', 'none');

        $('.fa-volume-up').css({
            'display': '',
            'color':'rgb(135, 184, 33)'
        });
}


//Mute sound
function muteSound()
{
        let audioAlert4 = document.getElementById('audioAlert4');
        audioAlert4.muted = true;

        let audioAlert5 = document.getElementById('audioAlert5');
        audioAlert5.muted = true;

        $('.fa-volume-up').css('display', 'none');

        $('.fa-volume-mute').css({
            'display': '',
            'color':'grey'
        });
}