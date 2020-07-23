/**
 * Create Steering wheel widget
  <div style="color: white; font-size: 10pt;text-align: center;font-weight: bolder;">STEERING</div>
                      <div id="steering-wheel-wrapper" class="steering-wheel-wrapper" style="position: absolute;">
                        <span style="color: white; position: absolute;z-index: 2;top:31px;left:30px;font-weight: bold;">5%</span>
                        <img src="images/basic_travel/Steering/Steering_whell@2x.png" style="transform: rotateZ(20deg);width: 100px; height: 100px;"/>              
                      </div>
 */
function createSteeringWheel(degreePercent,rotateDegree){
    let steeringWheelContainerDiv = document.createElement('div');
    steeringWheelContainerDiv.id='steering-wheel';

    let steeringWheelLable = document.createElement('div');
    steeringWheelLable.classList.add('steering-wheel-label');
    steeringWheelLable.innerHTML = 'STEERING';

    let steeringwheelWrapper = document.createElement('div');
    steeringwheelWrapper.classList.add('steering-wheel-wrapper');

    let steeringWheelSpan = document.createElement('span');
    steeringWheelSpan.classList.add('steering-wheel-span');
    steeringWheelSpan.innerHTML = degreePercent;

    let steeringWheelImg = document.createElement('img');
    steeringWheelImg.classList.add('steering-wheel-img');
    steeringWheelImg.src='../../images/basic_travel/Steering/Steering_whell@2x.png';
    steeringWheelImg.style.transform = 'rotateZ(' + rotateDegree+ 'deg)';

    steeringwheelWrapper.appendChild(steeringWheelSpan);
    steeringwheelWrapper.appendChild(steeringWheelImg);

    steeringWheelContainerDiv.appendChild(steeringWheelLable);
    steeringWheelContainerDiv.appendChild(steeringwheelWrapper);
    return steeringWheelContainerDiv;
}
//call create function
$(document).ready(function(){
    $('.steel-angle-col-1').append(createSteeringWheel('20%','72'));
});