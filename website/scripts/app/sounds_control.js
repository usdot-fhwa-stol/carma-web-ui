
/*
    Play sound for specific alerts or notifications.
*/
function playSound(audioId, repeat) {
    var audioAlert = document.getElementById(audioId);
    if(audioAlert!=null && audioAlert != 'undefined' && !audioAlert.muted)
    {
        audioAlert.currentTime = 0;
        $(document).ready(function(){
            audioAlert.play();
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