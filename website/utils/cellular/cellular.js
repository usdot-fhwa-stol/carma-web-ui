/**
 * <div class="signal-bars cellular-sizing-box good zero-bar" >
                      <div class="first-bar bar"></div>
                      <div class="second-bar bar"></div>
                      <div class="third-bar bar"></div>
                      <div class="fourth-bar bar"></div>
                      <div class="fifth-bar bar"></div>
                    </div>
 */

function createCellularIcon(numberOfBars){
    var cellular = document.createElement('div');
    cellular.classList.add('signal-bars','cellular-sizing-box','good',numberOfBars + '-bars');
    cellular.id='cellular';

    var firstBar = document.createElement('div');
    firstBar.classList.add('first-bar','bar');    

    var secondBar = document.createElement('div');
    secondBar.classList.add('second-bar','bar'); 

    var thirdBar = document.createElement('div');
    thirdBar.classList.add('third-bar','bar'); 

    var fourthBar = document.createElement('div');
    fourthBar.classList.add('fourth-bar','bar'); 

    var fifthBar = document.createElement('div');
    fifthBar.classList.add('fifth-bar','bar'); 

    cellular.appendChild(firstBar);
    cellular.appendChild(secondBar);
    cellular.appendChild(thirdBar);
    cellular.appendChild(fourthBar);
    cellular.appendChild(fifthBar);
    return cellular;
}

//call create function
$(document).ready(function(){
    $('#cellular-status').append(createCellularIcon('two'));
});