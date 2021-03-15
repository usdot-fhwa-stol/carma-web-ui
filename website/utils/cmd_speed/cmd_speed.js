/***
 *  <!--Command Speed-->
     <div class="speed-blue-circle">
        <div style="height: 100%;">
            <span id="command-speed" class="speed-text" style="vertical-align: -50%;">0</span> 
            <div  class="speed-unit">MPH</div>
        </div>
    </div>
 */
function createCmdSpeedCircle(cmdSpeedTxt){
    let divPanel = document.createElement('div');
    divPanel.classList.add('speed-blue-Squaire');

    let divPanelInner = document.createElement('div');
    divPanelInner.style.height='100%';

    let divType= document.createElement('div');
    divType.classList.add('speed-type');
    divType.innerHTML = 'APPLIED<br>SPEED';

    let spanText = document.createElement('span');
    spanText.classList.add('speed-text');
    spanText.style.verticalAlign='-30%';
    spanText.innerText = cmdSpeedTxt;
    spanText.id='command-speed-id'

    let divUnit= document.createElement('div');
    divUnit.classList.add('speed-unit');
    divUnit.innerText = 'MPH';

    divPanel.appendChild(divPanelInner);
    divPanelInner.appendChild(divType);
    divPanelInner.appendChild(spanText);
    divPanelInner.appendChild(divUnit);
    return divPanel;
}

function updateCmdSpeedCircle(cmdSpeedTxt){
    document.getElementById('command-speed-id').innerText = cmdSpeedTxt;
}
//initialization: call create function
$(document).ready(function(){
    $('.command-speed-col').append(createCmdSpeedCircle('0'));
});
