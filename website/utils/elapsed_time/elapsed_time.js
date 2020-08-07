//Initialize startDateTime for elapsed time
var startDateTime = {
    get value() 
    {
        var startDateTime = sessionStorage.getItem('startDateTime');
        //console.log('get startDateTime ORIG: ' + startDateTime);
        if (startDateTime == 'undefined' || startDateTime == null || startDateTime == '')
        {
            this.start();
            startDateTime = sessionStorage.getItem('startDateTime');
        }

        //console.log('get startDateTime FINAL: ' + startDateTime);
        return startDateTime;
    },
    set value(newValue) 
    {
        sessionStorage.setItem('startDateTime', newValue);
        //console.log('set startDateTime: ' + newValue);
    },
    remove() 
    {
        sessionStorage.removeItem('startDateTime');
    },
    start() 
    {
        sessionStorage.setItem('startDateTime', new Date().getTime());
    }
};

/**                       
 * Create elapsed time UI widget
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
    let hourSpanTextWrapper = document.createElement('span');
    let hourSpanText = document.createElement('span');
    hourSpanTextWrapper.classList.add('hours');
    hourSpanText.id='hours';
    hourSpanText.innerHTML = hours;
    let hourSpanUnit = document.createElement('span');
    hourSpanUnit.classList.add('smalltext');
    hourSpanUnit.innerHTML = 'Hours';
    hourSpanTextWrapper.appendChild(hourSpanText);
    hourSpanTextWrapper.appendChild(hourSpanUnit);
    hourDiv.appendChild(hourSpanTextWrapper);

    let minDiv = document.createElement('div');
    let minSpanTextWrapper =  document.createElement('span');
    let minSpanText = document.createElement('span');
    minSpanTextWrapper.classList.add('minutes');
    minSpanText.id='minutes';
    minSpanText.innerHTML = minutes;
    let minSpanUnit = document.createElement('span');
    minSpanUnit.classList.add('smalltext');
    minSpanUnit.innerHTML = 'Minutes';
    minSpanTextWrapper.appendChild(minSpanText);
    minSpanTextWrapper.appendChild(minSpanUnit);
    minDiv.appendChild(minSpanTextWrapper);
    
    let secDiv = document.createElement('div');
    let secSpanTextWrapper =  document.createElement('span');
    let secSpanText = document.createElement('span');
    secSpanTextWrapper.classList.add('seconds');
    secSpanText.id='seconds';
    secSpanText.innerHTML = seconds;
    let secSpanUnit = document.createElement('span');
    secSpanUnit.classList.add('smalltext');
    secSpanUnit.innerHTML = 'Seconds';
    secSpanTextWrapper.appendChild(secSpanText);
    secSpanTextWrapper.appendChild(secSpanUnit);
    secDiv.appendChild(secSpanTextWrapper);
    clockdiv.appendChild(hourDiv);
    clockdiv.appendChild(minDiv);
    clockdiv.appendChild(secDiv);

    divElapsedTime.appendChild(elapsedTimeLbel);
    divElapsedTime.appendChild(clockdiv);
    return divElapsedTime;
}

//update elapsed time UI widget
function updateElapsedTime(hours,minutes,seconds)
{
    document.getElementById('hours').innerHTML=hours;
    document.getElementById('minutes').innerHTML=minutes;
    document.getElementById('seconds').innerHTML=seconds;
}

//Count up Timer for when Guidance is engaged.
function countUpTimer() 
{
    if (session_isGuidance != null && session_isGuidance.engaged == true && startDateTime != null) 
    {
        // Get todays date and time
        let now = new Date().getTime();
        // Find the elapsed time
        let elapsedTime = now - startDateTime.value;

        //engaged_timer = '00h 00m 00s';
        if (elapsedTime < 0)
        {
            console.log('elapsedTime is negative');
            return;
        }
        // Time calculations for days, hours, minutes and seconds
        // var days = Math.floor(elapsedTime / (1000 * 60 * 60 * 24));
        let hours = Math.floor((elapsedTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        let minutes = Math.floor((elapsedTime % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = Math.floor((elapsedTime % (1000 * 60)) / 1000);
        
        //console.log('engaged_timer: ' + pad(hours, 2) + 'h '+ pad(minutes, 2) + 'm ' + pad(seconds, 2) + 's ');
        updateElapsedTime(pad(hours, 2), pad(minutes, 2), pad(seconds, 2));
    }
}

/*
    For countUpTimer to format the time.
*/
function pad(num, size) 
{
    var s = "0000" + num;
    return s.substr(s.length - size);
}


//initialization: call create widget function
$(document).ready(function(){
    //reset start time when refresh the page and session_isGuidance.engaged is false
    if( (session_isGuidance == null || (session_isGuidance != null && session_isGuidance.engaged == false) )
     && startDateTime != null)
    {
        startDateTime.remove();
    }
    //set initial time
    $('.elapse-time-col').append(createElapsedTime('00','00','00'))
});
