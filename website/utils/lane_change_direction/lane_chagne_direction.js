/**
 * Create Steering wheel widget
 */
function createLaneChange(miles){
    let laneChangeLable = document.createElement('div');
    laneChangeLable.classList.add('lane-change-label');
    laneChangeLable.id='lane-change-label-id';
    laneChangeLable.innerHTML =  'in ' + miles + ' miles.';
    return laneChangeLable;
}

function updateLaneChange(miles)
{
  document.getElementById('lane-change-label-id').innerHTML =  'in ' + miles + ' miles.';
}
//initialization: call create function
$(document).ready(function(){
    $('.lane-change-col-1').append(createLaneChange('0'));
});