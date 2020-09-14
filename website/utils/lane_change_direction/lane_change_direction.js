/**
 * Create Steering wheel widget
 */

function updateLaneChange(svgDoc, miles)
{
  svgDoc.getElementById('lane_change_in_miles_id').innerHTML =  'in ' + miles + ' miles.';
}