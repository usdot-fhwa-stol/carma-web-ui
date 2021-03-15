$(document).ready(function(){
    
    //initialization
    g_brakeCircle = new CircleProgress('.progressBrake', {
        max: 100,
        value: 0,
        textFormat: 'percent',
    });    
});
function updateBrake(element, max, value){
    element.max = max;
    element.value = value;
}