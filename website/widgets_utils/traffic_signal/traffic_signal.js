/**
 *  <!--Traffic signal-->
                  <div class="signal-container">
                    <div class="signal-circle red">2</div>
                    <div class="signal-circle"></div>
                    <div class="signal-circle"></div>
                  </div>
 */
function createTrafficSignal(signalType, signalCountDown)
{
    let signalContainerDiv = document.createElement('div');
    signalContainerDiv.classList.add('signal-container');

    let signalCircleRed = document.createElement('div');
    signalCircleRed.classList.add('signal-circle');

    let signalCircleYellow = document.createElement('div');
    signalCircleYellow.classList.add('signal-circle');
    
    let signalCircleGreen = document.createElement('div');
    signalCircleGreen.classList.add('signal-circle');

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
    }
    signalContainerDiv.appendChild(signalCircleRed);
    signalContainerDiv.appendChild(signalCircleYellow);
    signalContainerDiv.appendChild(signalCircleGreen);
    return signalContainerDiv;
}
//call create function
$(document).ready(function(){
    $('.traffic-signal-col').append(createTrafficSignal('red','45'));
});