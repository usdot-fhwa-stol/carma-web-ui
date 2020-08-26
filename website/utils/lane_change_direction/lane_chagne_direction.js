/**
 * Create Steering wheel widget
 */
function createLaneChange(direction, miles){
    let laneChangeContainerDiv = document.createElement('div');
    laneChangeContainerDiv.id='lane-change-id';

    let laneChangeLable = document.createElement('div');
    laneChangeLable.classList.add('lane-change-label');
    laneChangeLable.id='lane-change-label-id';
    laneChangeLable.innerHTML =  'in ' + miles + ' miles.';

    let laneChangeWrapper = document.createElement('div');
    laneChangeWrapper.classList.add('lane-change-wrapper');

    let laneChangeImg = document.createElement('img');
    laneChangeImg.classList.add('lane-change-img');
    laneChangeImg.id= 'lane-change-img-id';
    laneChangeImg.src='../../images/turn-arrow.svg';

    laneChangeWrapper.appendChild(laneChangeImg);

    laneChangeContainerDiv.appendChild(laneChangeLable);
    laneChangeContainerDiv.appendChild(laneChangeWrapper);
    return laneChangeContainerDiv;
}

function updateLaneChange(direction, miles)
{
  document.getElementById('lane-change-label-id').innerHTML =  'in ' + miles + ' miles.';
}
//initialization: call create function
$(document).ready(function(){
    $('.lane-change-col-1').append(createLaneChange('','0'));
});