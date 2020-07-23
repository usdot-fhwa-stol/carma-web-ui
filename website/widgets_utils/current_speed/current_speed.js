/***
 *   <!--current Speed-->
    <div class="speed-green-circle">
        <div style="height: 100%;"  >
            <span id="current-speed " class="speed-text" style="vertical-align: -50%;">0</span>  
            <div  class="speed-unit">MPH</div>
        </div>
    </div>
 */
function createCurrentSpeedCircle(currentSpeedTxt){
    let divPanel = document.createElement('div');
    divPanel.classList.add('speed-green-circle');   

    let divPanelInner = document.createElement('div');
    divPanelInner.style.height='100%';

    let divType= document.createElement('div');
    divType.classList.add('speed-type');
    divType.innerHTML = 'ACTUAL';

    let spanText = document.createElement('span');
    spanText.classList.add('speed-text');
    spanText.style.verticalAlign='-5%';
    spanText.innerText = currentSpeedTxt;
    spanText.id='current-speed'

    let divUnit= document.createElement('div');
    divUnit.classList.add('speed-unit');
    divUnit.innerHTML = 'MPH';

    divPanelInner.appendChild(divType);
    divPanelInner.appendChild(spanText);
    divPanelInner.appendChild(divUnit);
    divPanel.appendChild(divPanelInner);
    return divPanel;
}

//call create function
$(document).ready(function(){
    $('.current-speed-col').append(createCurrentSpeedCircle('0'));
});
