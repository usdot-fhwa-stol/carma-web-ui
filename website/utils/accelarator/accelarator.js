$(document).ready(function(){
    //initialization 
    g_acceleratorCircle =  new CircleProgress('.progressAcc', {
            max: 100,
            value: 0,
            textFormat: 'percent',
    });   
});

function updateAccerator(element, max, value){
    element.max = max;
    element.value = value;
} 