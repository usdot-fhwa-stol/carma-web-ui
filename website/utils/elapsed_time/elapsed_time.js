/**                       
 * Create elapsed time widget
 * */

function createElapsedTime(hours,minutes,seconds)
{
    let divElapsedTime = document.createElement('div');
    divElapsedTime.classList.add('elapse-time');
    divElapsedTime.id='elapse-time';

    let elapsedTimeLbel = document.createElement('div');
    elapsedTimeLbel.innerHTML='Elapsed Time';
    elapsedTimeLbel.classList.add('elapse-time-label');

    let clockdiv = document.createElement('div');
    clockdiv.id='clockdiv';
    
    let hourDiv = document.createElement('div');
    let hourSpanText = document.createElement('span');
    hourSpanText.classList.add('hours');
    hourSpanText.id='hours';
    hourSpanText.innerHTML = hours;
    let hourSpanUnit = document.createElement('span');
    hourSpanUnit.classList.add('smalltext');
    hourSpanUnit.innerHTML = 'Hours';
    hourSpanText.appendChild(hourSpanUnit);
    hourDiv.appendChild(hourSpanText);

    let minDiv = document.createElement('div');
    let minSpanText = document.createElement('span');
    minSpanText.classList.add('minutes');
    minSpanText.id='minutes';
    minSpanText.innerHTML = minutes;
    let minSpanUnit = document.createElement('span');
    minSpanUnit.classList.add('smalltext');
    minSpanUnit.innerHTML = 'Minutes';
    minSpanText.appendChild(minSpanUnit);
    minDiv.appendChild(minSpanText);
    
    let secDiv = document.createElement('div');
    let secSpanText = document.createElement('span');
    secSpanText.classList.add('seconds');
    secSpanText.id='seconds';
    secSpanText.innerHTML = seconds;
    let secSpanUnit = document.createElement('span');
    secSpanUnit.classList.add('smalltext');
    secSpanUnit.innerHTML = 'Seconds';
    secSpanText.appendChild(secSpanUnit);
    secDiv.appendChild(secSpanText);
    clockdiv.appendChild(hourDiv);
    clockdiv.appendChild(minDiv);
    clockdiv.appendChild(secDiv);
    divElapsedTime.appendChild(elapsedTimeLbel);
    divElapsedTime.appendChild(clockdiv);
    return divElapsedTime;
}

function updateElapsedTime(hours,minutes,seconds){
    document.getElementById('hours').innerHTML=hours;
    document.getElementById('minutes').innerHTML=minutes;
    document.getElementById('seconds').innerHTML=seconds;
}
//initialization: call create widget function
$(document).ready(function(){
    $('.elapse-time-col').append(createElapsedTime('00','00','00'))
});