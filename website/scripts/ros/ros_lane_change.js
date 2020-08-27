function subscribeLaneChangeTopics()
{
    //ROS topic here
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
    let miles = 12;
    let direction = 'right';

    let deferLaneChangeSVGInit = $.Deferred();
    
    var loadLaneChangeObj = setInterval(()=>{
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
     
    //Lane change svg DOM element READY
     $.when(deferLaneChangeSVGInit) 
     .done((successMessage)=>{
        console.log(successMessage);
        //listener here

        //update miles
        updateLaneChange(miles);

        //turn left
        if(direction == 'left')
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
        else if (direction == 'right')        
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
    .fail((error)=>{
        console.log('deferlaneChangeInit: '+ error);
     });
}