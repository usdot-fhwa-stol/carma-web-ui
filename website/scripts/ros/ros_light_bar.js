//subscribe to /hardware_interface/lightbar/light_bar_status      
// green_solid: 0
// right_arrow: 0
// left_arrow: 0
// sides_solid: 0
// flash: 0
// green_flash: 0
// takedown: 0
/**
rostopic pub -r 10 /hardware_interface/lightbar/light_bar_status cav_msgs/LightBarStatus "green_solid: 1
yellow_solid: 0
right_arrow: 1
left_arrow: 0
sides_solid: 0
green_flash: 0
takedown: 0
flash: 0"
 */
/***
 * yellow solid, side_solid, left arrow or right arrow is exclusively on.
 * Yellow flash can be on while yellow solid, side_solid, left arrow or right arrow is on.
 * Green solid, green flash is exclusively on.
 */

function subscribeLightBarStatus()
{
    let listener = new ROSLIB.Topic({
        ros: g_ros,
        name: T_LIGHT_BAR_STATUS,
        messageType: M_LIGHT_BAR_STATUS
    });
    
    let lightbarSVG = null;
    let box_1 = null;
    let box_2 = null;
    let box_3 = null;
    let box_4 = null;
    let box_5 = null;
    let box_6 = null;
    let box_7 = null;
    let box_8 = null;
    let isGreenLeftOn=false; //box-4
    let isGreenRightOn=false; //box-5
    let isYellow_1_On = false; //box-1
    let isYellow_2_On = false;//box-2
    let isYellow_3_On = false;//box-3
    let isYellow_6_On = false;//box-6
    let isYellow_7_On = false;//box-7
    let isYellow_8_On = false; //box-8
    
    //load light bar svg DOM element
    let deferLightBarSVGInit = $.Deferred();
    var loadLightBarObj = setInterval(()=>{
        let lightBarObj = document.getElementById('light-bar-img-id') ;
        if(lightBarObj!=null && lightBarObj.contentDocument != null)
        {
            lightbarSVG = lightBarObj.contentDocument;
            box_1 = lightbarSVG.getElementById('indicator-box-1');
            box_2 = lightbarSVG.getElementById('indicator-box-2');
            box_3 = lightbarSVG.getElementById('indicator-box-3');
            box_4 = lightbarSVG.getElementById('indicator-box-4');
            box_5 = lightbarSVG.getElementById('indicator-box-5');
            box_6 = lightbarSVG.getElementById('indicator-box-6');
            box_7 = lightbarSVG.getElementById('indicator-box-7');
            box_8 = lightbarSVG.getElementById('indicator-box-8');
            if(lightbarSVG!=null && box_1 !=null && box_2 != null && box_3 != null && box_4 != null
                && box_5 != null && box_6 != null && box_7 != null && box_8 != null)
                {
                    deferLightBarSVGInit.resolve("Light Bar svg is loaded");
                    clearInterval(loadLightBarObj);
                }
        }
    }, 500);
     
    let isLightBarDisplayed = false;
    listener.subscribe(function(message)
    {
        //Check ROSBridge connection before subscribe a topic
        IsROSBridgeConnected();
        
        let green_solid = message.green_solid;
        let yellow_solid = message.yellow_solid;
        let right_arrow = message.right_arrow;
        let left_arrow = message.left_arrow;
        let sides_solid = message.sides_solid;
        let flash = message.flash;
        let green_flash = message.green_flash;
        let takedown = message.takedown;
        
        // insertNewTableRow('tblFirstB', 'LightBar:left_arrow: ', message.left_arrow);
        // insertNewTableRow('tblFirstB', 'LightBar:right_arrow: ', message.right_arrow);
        // insertNewTableRow('tblFirstB', 'LightBar:green_solid: ', message.green_solid);
        // insertNewTableRow('tblFirstB', 'LightBar:green_flash: ', message.green_flash);
        // insertNewTableRow('tblFirstB', 'LightBar:flash: ', message.flash);
        // insertNewTableRow('tblFirstB', 'LightBar:takedown: ', message.takedown); //Not used, green and yellow flashing.

        //update system status panel
        if($('#lightbar_info_no_data').length >0)
        {
            $('#lightbar_info_no_data').remove();
        } 

        if(!isLightBarDisplayed)
        {
            $('#lightbar_info_body').append('<tr><th scope="col"  colspan="2" >left_arrow: </th>'+
            '<td id="LightbarleftArrowId" style="width:20%">'+left_arrow+'</td></tr>');

            $('#lightbar_info_body').append('<tr><th scope="col"  colspan="2">right_arrow: </th>'+
            '<td id="LightbarRightArrowId">'+right_arrow+'</td></tr>');

            $('#lightbar_info_body').append('<tr><th scope="col" colspan="2">green_solid: </th>'+
            '<td id="LightbarGreenSolidId">'+green_solid+'</td></tr>');

            $('#lightbar_info_body').append('<tr><th scope="col"  colspan="2">green_flash: </th>'+
            '<td id="LightbarGreenFlashId">'+green_flash+'</td></tr>');

            $('#lightbar_info_body').append('<tr><th scope="col"  colspan="2">flash: </th>'+
            '<td id="LightbarFlashId">'+flash+'</td></tr>');

            $('#lightbar_info_body').append('<tr><th scope="col"  colspan="2">sides_solid: </th>'+
            '<td id="LightbarSidesSolidId">'+sides_solid+'</td></tr>');

            $('#lightbar_info_body').append('<tr><th scope="col"  colspan="2">yellow_solid: </th>'+
            '<td id="LightbarYellowSolidId">'+yellow_solid+'</td></tr>');

            $('#lightbar_info_body').append('<tr><th scope="col"  colspan="2">takedown: </th>'+
            '<td id="LightbarTakedownId">'+takedown+'</td></tr>');
            isLightBarDisplayed = true;
        }
        else
        {
            $('#LightbarleftArrowId').text(left_arrow);
            $('#LightbarRightArrowId').text(right_arrow);
            $('#LightbarGreenSolidId').text(green_solid);
            $('#LightbarGreenFlashId').text(green_flash);
            $('#LightbarFlashId').text(flash);
            $('#LightbarSidesSolidId').text(sides_solid);
            $('#LightbarYellowSolidId').text(yellow_solid);
            $('#LightbarTakedownId').text(takedown);
        }

    //update light bar SVG
    //Lane change svg DOM element READY
    $.when(deferLightBarSVGInit) 
    .done((successMessage)=>{

        //turn all  off
        if((green_solid == LIGHT_BAR_OFF && 
            yellow_solid==LIGHT_BAR_OFF && 
            right_arrow==LIGHT_BAR_OFF && 
            left_arrow == LIGHT_BAR_OFF &&
            sides_solid == LIGHT_BAR_OFF &&
            flash == LIGHT_BAR_OFF && 
            green_flash == LIGHT_BAR_OFF && lightbarSVG!= null) || (takedown == LIGHT_BAR_ON && lightbarSVG!= null))
        {
            if(box_1!=null)
            {
                box_1.classList.add('cls-gray');
                box_1.classList.remove('cls-yellow');
            }
            if(lightbarSVG.getElementById('indicator-box-2')!=null)
            {
                box_2.classList.add('cls-gray');
                box_2.classList.remove('cls-yellow');
            }            
            if(box_3!=null)
            {
                box_3.classList.add('cls-gray');
                box_3.classList.remove('cls-yellow');
            }
            if(box_4!=null)
            {
                box_4.classList.add('cls-gray');
                box_4.classList.remove('cls-green');
            }
            if(box_5!=null)
            {
                box_5.classList.add('cls-gray');
                box_5.classList.remove('cls-green');
            }
            if(box_6!=null)
            {
                box_6.classList.add('cls-gray');
                box_6.classList.remove('cls-yellow');
            }
            if(box_7!=null)
            {
                box_7.classList.add('cls-gray');
                box_7.classList.remove('cls-yellow');
            }
            if(box_8!=null)
            {
                box_8.classList.add('cls-gray');
                box_8.classList.remove('cls-yellow');
            }
        }
        else
        {
            //Green boxes
            if(green_solid == LIGHT_BAR_ON )
            {
                //left box-4
                box_4.classList.remove('cls-gray');
                box_4.classList.add('cls-green');
                //right box-5
                box_5.classList.remove('cls-gray');
                box_5.classList.add('cls-green');
                
            }
            else 
            {
                if(green_flash == LIGHT_BAR_ON )
                {
                    //left box-4
                    if(!isGreenLeftOn)
                    {
                        box_4.classList.remove('cls-gray');
                        box_4.classList.add('cls-green');
                        isGreenLeftOn = true;
                        setTimeout(()=>{
                            box_4.classList.remove('cls-green');
                            box_4.classList.add('cls-gray');
                            isGreenLeftOn = false;
                        }, 1000);
                    }
                    //right box-5
                    if(!isGreenRightOn)
                    {
                        box_5.classList.remove('cls-gray');
                        box_5.classList.add('cls-green');
                        isGreenRightOn = true;
                        setTimeout(()=>{
                            box_5.classList.remove('cls-green');
                            box_5.classList.add('cls-gray');
                            isGreenRightOn = false;
                        }, 1000);
                    }
                }
                else //Turn Green OFF
                {
                    //left box-4
                    box_4.classList.remove('cls-green');
                    box_4.classList.add('cls-gray');
                    //right box-5
                    box_5.classList.remove('cls-green');
                    box_5.classList.add('cls-gray');
                } 
            }

            //Yellow boxes
            if(box_1!=null &&  box_2!=null &&  box_3!=null &&  box_6!=null &&  box_7!=null &&  box_8!=null)
            {
                if(yellow_solid == LIGHT_BAR_ON )
                {
                    box_1.classList.remove('cls-gray');
                    box_1.classList.add('cls-yellow');
                    
                    box_2.classList.remove('cls-gray');
                    box_2.classList.add('cls-yellow');
                
                    box_3.classList.remove('cls-gray');
                    box_3.classList.add('cls-yellow');
                
                    box_6.classList.remove('cls-gray');
                    box_6.classList.add('cls-yellow');
                
                    box_7.classList.remove('cls-gray');
                    box_7.classList.add('cls-yellow');
                
                    box_8.classList.remove('cls-gray');
                    box_8.classList.add('cls-yellow');                    
                }
                else if(sides_solid == LIGHT_BAR_ON )
                {                    
                    box_1.classList.remove('cls-gray');
                    box_1.classList.add('cls-yellow');
                
                    box_2.classList.add('cls-gray');
                
                    box_3.classList.add('cls-gray');
                
                    box_4.classList.add('cls-gray');
                
                    box_5.classList.add('cls-gray');                    
                
                    box_7.classList.add('cls-gray');
                
                    box_8.classList.remove('cls-gray');
                    box_8.classList.add('cls-yellow');
                }
                else if(right_arrow == LIGHT_BAR_ON )
                {
                    //turn on yellow 1 box; and turn on yellow 2 box, turn off yellow 1 box in 1 second
                    if(!isYellow_1_On && !isYellow_2_On && !isYellow_3_On && !isYellow_6_On && !isYellow_7_On && !isYellow_8_On)
                    {
                        box_1.classList.remove('cls-gray');
                        box_1.classList.add('cls-yellow');
                        isYellow_1_On = true;                    
                        setTimeout(()=>{
                            box_1.classList.remove('cls-yellow');
                            box_1.classList.add('cls-gray');
                        box_2.classList.remove('cls-gray');  
                        box_2.classList.add('cls-yellow');
                            isYellow_1_On = false;
                            isYellow_2_On = true;
                        }, 1000);
                    }
                    //turn off yellow 2 box and turn on yellow 3 box in 1 second
                    if(!isYellow_1_On && isYellow_2_On && !isYellow_3_On && !isYellow_6_On && !isYellow_7_On && !isYellow_8_On)
                    {
                        setTimeout(()=>{
                        box_2.classList.remove('cls-yellow');
                        box_2.classList.add('cls-gray');
                            box_3.classList.remove('cls-gray');
                            box_3.classList.add('cls-yellow');
                            isYellow_2_On = false;
                            isYellow_3_On = true;
                        }, 1000);
                    }
                    //turn off yellow 3 and turn on yellow 6 box in 1 second
                    if(!isYellow_1_On && !isYellow_2_On && isYellow_3_On && !isYellow_6_On && !isYellow_7_On && !isYellow_8_On)
                    { 
                        setTimeout(()=>{
                            box_3.classList.remove('cls-yellow');
                            box_3.classList.add('cls-gray');
                            box_6.classList.remove('cls-gray');
                            box_6.classList.add('cls-yellow');
                            isYellow_3_On = false;
                            isYellow_6_On = true;
                        }, 1000);
                    }
                        //turn off yellow 6 and turn on yellow 7 box in 1 second
                        if(!isYellow_1_On && !isYellow_2_On && !isYellow_3_On && isYellow_6_On && !isYellow_7_On && !isYellow_8_On)
                        { 
                            setTimeout(()=>{
                                box_6.classList.remove('cls-yellow');
                                box_6.classList.add('cls-gray');
                                box_7.classList.remove('cls-gray');
                                box_7.classList.add('cls-yellow');
                                isYellow_6_On = false;
                                isYellow_7_On = true;
                            }, 1000);
                        }
                        //turn off yellow 7 and turn on yellow 8 box in 1 second
                    if(!isYellow_1_On && !isYellow_2_On && !isYellow_3_On && !isYellow_6_On && isYellow_7_On && !isYellow_8_On)
                    { 
                        setTimeout(()=>{
                            box_7.classList.remove('cls-yellow');
                            box_7.classList.add('cls-gray');
                            box_8.classList.remove('cls-gray');
                            box_8.classList.add('cls-yellow');
                            isYellow_7_On = false;
                            isYellow_8_On = true;
                        }, 1000);
                    }
                        //turn off yellow 8
                        if(!isYellow_1_On && !isYellow_2_On && !isYellow_3_On && !isYellow_6_On && !isYellow_7_On && isYellow_8_On)
                        { 
                            let flash_count = 0;
                            let flash_yellow_box_8 = setInterval(()=>{
                                box_8.classList.remove('cls-yellow');
                                box_8.classList.add('cls-gray'); 
                                flash_count ++;
                                if(flash_count >=3)
                                {
                                    clearInterval(flash_yellow_box_8);
                                    isYellow_8_On = false;
                                }                          
                            }, 500);
                        }
                }
                else if(left_arrow == LIGHT_BAR_ON)
                {
                    //turn on boxes 3 and 6
                    if(!isYellow_1_On && !isYellow_2_On && !isYellow_3_On && !isYellow_6_On && !isYellow_7_On && !isYellow_8_On)
                    { 
                        setTimeout(()=>{
                            box_3.classList.remove('cls-gray');
                            box_3.classList.add('cls-yellow');
                            box_6.classList.remove('cls-gray');
                            box_6.classList.add('cls-yellow');
                            isYellow_3_On = true;
                            isYellow_6_On = true;
                        }, 1000);
                    }
                    //turn off 3,6 and turn on 2,7
                    if(!isYellow_1_On && !isYellow_2_On && isYellow_3_On && isYellow_6_On && !isYellow_7_On && !isYellow_8_On)
                    { 
                        setTimeout(()=>{
                            box_3.classList.remove('cls-yellow');
                            box_3.classList.add('cls-gray');
                            box_6.classList.remove('cls-yellow');
                            box_6.classList.add('cls-gray');

                        box_2.classList.remove('cls-gray');
                        box_2.classList.add('cls-yellow');
                            box_7.classList.remove('cls-gray');
                            box_7.classList.add('cls-yellow');
                            isYellow_3_On = false;
                            isYellow_6_On = false;
                            isYellow_2_On = true;
                            isYellow_7_On = true;
                        }, 1000);
                    }
                    //turn off 2,7 and turn on 1,8
                    if(!isYellow_1_On && isYellow_2_On && !isYellow_3_On && !isYellow_6_On && isYellow_7_On && !isYellow_8_On)
                    { 
                        setTimeout(()=>{
                    box_2.classList.remove('cls-yellow');
                    box_2.classList.add('cls-gray');
                        box_7.classList.remove('cls-yellow');
                        box_7.classList.add('cls-gray');

                        box_1.classList.remove('cls-gray');
                        box_1.classList.add('cls-yellow');
                        box_8.classList.remove('cls-gray');
                        box_8.classList.add('cls-yellow');

                        isYellow_2_On = false;
                        isYellow_7_On = false;
                        isYellow_1_On = true;
                        isYellow_8_On = true;
                        }, 1000);
                    }
                    //turn off 1,8
                    if(isYellow_1_On && !isYellow_2_On && !isYellow_3_On && !isYellow_6_On && !isYellow_7_On && isYellow_8_On)
                    { 
                        let flash_count = 0;
                        let flash_1_8_boxes = setInterval(()=>{ 
                            box_1.classList.remove('cls-yellow');
                            box_1.classList.add('cls-gray');
                            box_8.classList.remove('cls-yellow');
                            box_8.classList.add('cls-gray');
                            flash_count++;
                            if(flash_count >= 3)
                            {
                            clearInterval(flash_1_8_boxes);
                            isYellow_1_On = false;
                            isYellow_8_On = false;
                            }
                            
                        }, 500);
                    }
                }
                
                if(flash == LIGHT_BAR_ON )
                {
                    //turn on boxes 3 and 6
                    if(!isYellow_1_On && !isYellow_2_On && !isYellow_3_On && !isYellow_6_On && !isYellow_7_On && !isYellow_8_On)
                    { 
                        setTimeout(()=>{
                            box_3.classList.remove('cls-gray');
                            box_3.classList.add('cls-yellow');
                            box_6.classList.remove('cls-gray');
                            box_6.classList.add('cls-yellow');
                            isYellow_3_On = true;
                            isYellow_6_On = true;
                        }, 1000);
                    }
                    //turn off 3,6 and turn on 2,7
                    if(!isYellow_1_On && !isYellow_2_On && isYellow_3_On && isYellow_6_On && !isYellow_7_On && !isYellow_8_On)
                    { 
                        setTimeout(()=>{
                            box_3.classList.remove('cls-yellow');
                            box_3.classList.add('cls-gray');
                            box_6.classList.remove('cls-yellow');
                            box_6.classList.add('cls-gray');

                            box_2.classList.remove('cls-gray');
                            box_2.classList.add('cls-yellow');
                            box_7.classList.remove('cls-gray');
                            box_7.classList.add('cls-yellow');
                            isYellow_3_On = false;
                            isYellow_6_On = false;
                            isYellow_2_On = true;
                            isYellow_7_On = true;
                        }, 1000);
                    }
                    //turn off 2,7 and turn on 1,8
                    if(!isYellow_1_On && isYellow_2_On && !isYellow_3_On && !isYellow_6_On && isYellow_7_On && !isYellow_8_On)
                    { 
                        setTimeout(()=>{
                            box_2.classList.remove('cls-yellow');
                            box_2.classList.add('cls-gray');
                            box_7.classList.remove('cls-yellow');
                            box_7.classList.add('cls-gray');

                            box_1.classList.remove('cls-gray');
                            box_1.classList.add('cls-yellow');
                            box_8.classList.remove('cls-gray');
                            box_8.classList.add('cls-yellow');
                            isYellow_1_On = true;
                            isYellow_8_On = true;
                            isYellow_2_On = false;
                            isYellow_7_On = false;
                        }, 1000);
                    }       
                    //turn off 1,8
                    if(isYellow_1_On && !isYellow_2_On && !isYellow_3_On && !isYellow_6_On && !isYellow_7_On && isYellow_8_On)
                    { 
                        setTimeout(()=>{
                            box_1.classList.remove('cls-yellow');
                            box_1.classList.add('cls-gray');
                            box_8.classList.remove('cls-yellow');
                            box_8.classList.add('cls-gray');
                            isYellow_1_On = false;
                            isYellow_8_On = false;
                        }, 1000);
                    }              
                }
                //Turn all yellows bars OFF
                if(yellow_solid == LIGHT_BAR_OFF && sides_solid == LIGHT_BAR_OFF 
                    && right_arrow == LIGHT_BAR_OFF && left_arrow == LIGHT_BAR_OFF && flash == LIGHT_BAR_OFF)
                {
                    box_1.classList.add('cls-gray');
                    box_1.classList.remove('cls-yellow');
                    box_2.classList.add('cls-gray');
                    box_2.classList.remove('cls-yellow');
                    box_3.classList.add('cls-gray');
                    box_3.classList.remove('cls-yellow');            
                    box_6.classList.add('cls-gray');
                    box_6.classList.remove('cls-yellow');
                    box_7.classList.add('cls-gray');
                    box_7.classList.remove('cls-yellow');
                    box_8.classList.add('cls-gray');
                    box_8.classList.remove('cls-yellow');            
                }
            }    
        }
            
    });
    });    
}
    