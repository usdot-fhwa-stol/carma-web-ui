
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
            sound_counter++;
            if (sound_counter < sound_counter_max) {
                playSound(audioId, true);
            }
        }, 3000)
    }

    
}