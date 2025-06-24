/**
 *  <!--Traffic signal-->
                  <div class="signal-container">
                    <div class="signal-circle red">2</div>
                    <div class="signal-circle"></div>
                    <div class="signal-circle"></div>
                  </div>
 */
function updateTrafficSignal(signalType, signalCountDown)
{

    let  signalContainerDiv = document.getElementById('signal-container-id')
    if(signalContainerDiv == null || signalContainerDiv == "undefined"){
        signalContainerDiv = document.createElement('div');
        signalContainerDiv.classList.add('signal-container');
        signalContainerDiv.id='signal-container-id';
    }

    let signalCircleRed = document.getElementById('signal-circle-red');
    if(signalCircleRed == null || signalCircleRed == "undefined")
    {
        signalCircleRed = document.createElement('div');
        signalCircleRed.classList.add('signal-circle');
        signalCircleRed.id = 'signal-circle-red';
    }

    let signalCircleYellow = document.getElementById('signal-circle-yellow');
    if(signalCircleYellow == null || signalCircleYellow == "undefined")
    {
        signalCircleYellow = document.createElement('div');
        signalCircleYellow.classList.add('signal-circle');
        signalCircleYellow.id = 'signal-circle-yellow';
    }
    let signalCircleGreen = document.getElementById('signal-circle-green');
    if(signalCircleGreen == null || signalCircleGreen == "undefined")
    {
        signalCircleGreen = document.createElement('div');
        signalCircleGreen.classList.add('signal-circle');
        signalCircleGreen.id = 'signal-circle-green';
    }
    //reset signal state
    signalCircleRed.classList.remove(SIGNAL_RED,SIGNAL_FLASHING_RED);
    signalCircleGreen.classList.remove(SIGNAL_GREEN,SIGNAL_FLASHING_GREEN);
    signalCircleYellow.classList.remove(SIGNAL_YELLOW,SIGNAL_FLASHING_YELLOW);
    signalCircleYellow.innerHTML = "";
    signalCircleGreen.innerHTML = "";
    signalCircleRed.innerHTML = "";

    switch(signalType)
    {

        case SIGNAL_RED:
            signalCircleRed.classList.add(signalType);
            signalCircleRed.innerHTML = signalCountDown;
            break;
        case SIGNAL_GREEN:
            signalCircleGreen.classList.add(signalType);
            signalCircleGreen.innerHTML = signalCountDown;
            break;
        case SIGNAL_YELLOW:
            signalCircleYellow.classList.add(signalType);
            signalCircleYellow.innerHTML = signalCountDown;
            break;
        case SIGNAL_FLASHING_YELLOW:
            signalCircleYellow.classList.add(signalType);
            signalCircleYellow.innerHTML = signalCountDown;
            break;
        case SIGNAL_FLASHING_GREEN:
            signalCircleGreen.classList.add(signalType);
            signalCircleGreen.innerHTML = signalCountDown;
            break;
        case SIGNAL_FLASHING_RED:
            signalCircleRed.classList.add(signalType);
            signalCircleRed.innerHTML = signalCountDown;
            break;
        default:

            break;
    }
    signalContainerDiv.appendChild(signalCircleRed);
    signalContainerDiv.appendChild(signalCircleYellow);
    signalContainerDiv.appendChild(signalCircleGreen);
    return signalContainerDiv;
}
$(document).ready(function(){
    $('.traffic-signal-col').append(updateTrafficSignal('',''));
});
