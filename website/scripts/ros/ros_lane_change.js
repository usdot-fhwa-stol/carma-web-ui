/**
 * rostopic pub -r 10 /lane_change cav_msgs/LaneChangeInfo "direction: 0 
distance_to_lanechange: 3.2"
**/

function subscribeLaneChangeTopics()
{
    //ROS topic here
    let listener = new ROSLIB.Topic({
        ros:g_ros,
        name: T_LANE_CHANGE,
        messageType: M_LANE_CHANGE
    });

    let laneChangeSVG = null;
    let left_arrow = null;
    let left_dot_1  = null;
    let left_dot_2  = null;
    let left_dot_3  = null;
    let right_arrow  = null;
    let right_dot_1  = null;
    let right_dot_2  = null;
    let right_dot_3  = null;

    //load Lane change svg DOM element
    let deferLaneChangeSVGInit = $.Deferred();

    if(laneChangeSVG == null || left_arrow == null 
        || left_dot_1 == null || left_dot_2 == null 
        || left_dot_3 == null || right_arrow == null
        || right_dot_1 == null || right_dot_2 == null
        || right_dot_3 == null)
        {
            let loadLaneChangeObj = setInterval(()=>{
                let laneChangeObj = document.getElementById('lane-change-img-id') ;
                if(laneChangeObj!=null && laneChangeObj.contentDocument != null)
                {
                    laneChangeSVG = laneChangeObj.contentDocument;
                    //update direction          
                    left_arrow = laneChangeSVG.getElementById('left-arrow');
                    left_dot_1 = laneChangeSVG.getElementById('left-dot-1');
                    left_dot_2 = laneChangeSVG.getElementById('left-dot-2');
                    left_dot_3 = laneChangeSVG.getElementById('left-dot-3');
                    right_arrow = laneChangeSVG.getElementById('right-arrow');
                    right_dot_1 = laneChangeSVG.getElementById('right-dot-1');
                    right_dot_2 = laneChangeSVG.getElementById('right-dot-2');
                    right_dot_3 = laneChangeSVG.getElementById('right-dot-3');
                    if(laneChangeSVG!= null && left_arrow!=null && left_dot_1 !=null && left_dot_2 !=null && left_dot_3 !=null
                        && right_arrow!=null && right_dot_1 !=null && right_dot_2 !=null && right_dot_3 !=null)
                        {
                            deferLaneChangeSVGInit.resolve("Lane change svg is loaded");
                            clearInterval(loadLaneChangeObj);
                        }
                }
            }, 500);
        }
        else //lane change SVG already loaded
        {
            deferLaneChangeSVGInit.resolve("Lane change svg is loaded");
        }
   
     
    //Lane change svg DOM element READY
     $.when(deferLaneChangeSVGInit) 
     .done((successMessage)=>{
        //listener here
            listener.subscribe((message)=>{
                let miles = message.distance_to_lanechange.toFixed(2);
                let direction = message.direction;
                //update miles
                updateLaneChange(laneChangeSVG, miles);

                //turn left
                if(direction == LANE_CHANGE_DIRECTION_TO_LEFT) // ToLeft
                {
                    left_arrow.classList.add('cls-blue');
                    left_arrow.classList.remove('cls-gray');

                    left_dot_1.classList.add('cls-white');
                    left_dot_1.classList.remove('cls-gray');

                    left_dot_2.classList.add('cls-white');
                    left_dot_2.classList.remove('cls-gray');

                    left_dot_3.classList.add('cls-white');
                    left_dot_3.classList.remove('cls-gray');

                    right_arrow.classList.add('cls-gray');
                    right_arrow.classList.remove('cls-blue');

                    right_dot_1.classList.add('cls-gray');
                    right_dot_1.classList.remove('cls-white');

                    right_dot_2.classList.add('cls-gray');
                    right_dot_2.classList.remove('cls-white');

                    right_dot_3.classList.add('cls-gray');
                    right_dot_3.classList.remove('cls-white');
                }
                //turn right
                else if (direction == LANE_CHANGE_DIRECTION_TO_RIGHT)  //ToRight
                {
                    right_arrow.classList.add('cls-blue');
                    right_arrow.classList.remove('cls-gray');

                    right_dot_1.classList.add('cls-white');
                    right_dot_1.classList.remove('cls-gray');

                    right_dot_2.classList.add('cls-white');
                    right_dot_2.classList.remove('cls-gray');

                    right_dot_3.classList.add('cls-white');
                    right_dot_3.classList.remove('cls-gray');

                    left_arrow.classList.add('cls-gray');
                    left_arrow.classList.remove('cls-blue');

                    left_dot_1.classList.add('cls-gray');
                    left_dot_1.classList.remove('cls-white');

                    left_dot_2.classList.add('cls-gray');
                    left_dot_2.classList.remove('cls-white');

                    left_dot_3.classList.add('cls-gray');
                    left_dot_3.classList.remove('cls-white');
                }
            })
        })
       
    .fail((error)=>{
        console.log('deferlaneChangeInit: '+ error);
     });
}