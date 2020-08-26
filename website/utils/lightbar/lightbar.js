/**
 * Create Steering wheel widget
 */
function createLightBar(lightBarGreenStatus, lightBarYellowStatus){
    let lightBarContainerDiv = document.createElement('div');
    lightBarContainerDiv.id='light-bar-id';

    let lightBarLable = document.createElement('div');
    lightBarLable.classList.add('light-bar-label');
    lightBarLable.innerHTML = 'LIGHT BAR INDICATOR';

    let lightBarWrapper = document.createElement('div');
    lightBarWrapper.classList.add('light-bar-wrapper');

    let lightBarImg = document.createElement('img');
    lightBarImg.classList.add('light-bar-img');
    lightBarImg.id= 'light-bar-img-id';
    lightBarImg.src='../../images/indicator_boxes.svg';

    lightBarWrapper.appendChild(lightBarImg);

    lightBarContainerDiv.appendChild(lightBarLable);
    lightBarContainerDiv.appendChild(lightBarWrapper);
    return lightBarContainerDiv;
}

function updateLightBar(lightBarGreenStatus, lightBarYellowStatus)
{
}
//initialization: call create function
$(document).ready(function(){
    $('.light-bar-col-1').append(createLightBar('0','0'));
});