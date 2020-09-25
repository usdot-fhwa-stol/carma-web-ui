/**
 * Create Steering wheel widget
 */
function createSteeringWheel(degreePercent,rotateDegree){
    let steeringWheelContainerDiv = document.createElement('div');
    steeringWheelContainerDiv.id='steering-wheel-id';

    let steeringWheelLable = document.createElement('div');
    steeringWheelLable.classList.add('steering-wheel-label');
    steeringWheelLable.innerHTML = 'STEERING';

    let steeringwheelWrapper = document.createElement('div');
    steeringwheelWrapper.classList.add('steering-wheel-wrapper');

    let steeringWheelSpan = document.createElement('span');
    steeringWheelSpan.classList.add('steering-wheel-span');
    steeringWheelSpan.id='steering-wheel-span-id';
    steeringWheelSpan.innerHTML = degreePercent;

    let steeringWheelImg = document.createElement('img');
    steeringWheelImg.classList.add('steering-wheel-img');
    steeringWheelImg.id= 'steering-wheel-img-id';
    steeringWheelImg.src='../../images/Steering/Steering_whell@2x.png';
    steeringWheelImg.style.transform = 'rotateZ(' + rotateDegree+ 'deg)';

    steeringwheelWrapper.appendChild(steeringWheelSpan);
    steeringwheelWrapper.appendChild(steeringWheelImg);

    steeringWheelContainerDiv.appendChild(steeringWheelLable);
    steeringWheelContainerDiv.appendChild(steeringwheelWrapper);
    return steeringWheelContainerDiv;
}

function updateSteeringWheel(degreePercent,rotateDegree)
{
  document.getElementById('steering-wheel-span-id').innerHTML = degreePercent;
  document.getElementById('steering-wheel-img-id').style.transform = 'rotateZ(' + rotateDegree+ 'deg)';
}
//initialization: call create function
$(document).ready(function(){
    $('.steel-angle-col-1').append(createSteeringWheel('0%','0'));
});