/***
 * Created HTML elements 
 */
function createSpeedLimit(speedLimitTxt){
    let divPanel = document.createElement('div');
    divPanel.classList.add('speed-limit');

    let divPanelInner = document.createElement('div');
    divPanelInner.classList.add('speed-limit-inner');

    let divTitle = document.createElement('div');
    divTitle.classList.add('limit-label');
    divTitle.innerText = 'SPEED LIMIT';

    let divBody= document.createElement('div');
    divBody.classList.add('limit-text');
    divBody.id = 'speed-limit'
    divBody.innerText = speedLimitTxt;

    divPanel.appendChild(divPanelInner);
    divPanelInner.appendChild(divTitle);
    divPanelInner.appendChild(divBody);
    return divPanel;
}

//call create function
$(document).ready(function(){
    $('.speed-limit-col').append(createSpeedLimit('45'));
});
