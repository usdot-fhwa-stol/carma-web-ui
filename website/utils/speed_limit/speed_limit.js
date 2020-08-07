/***
 * Created HTML elements 
 */
function updateSpeedLimit(speedLimitTxt){
    if( document.getElementById('speed-limit') != null)
    {
        document.getElementById('speed-limit').innerHTML = speedLimitTxt;
    }
    else
    {
        let divPanel = document.createElement('div');
        divPanel.classList.add('speed-limit');

        let divPanelInner = document.createElement('div');
        divPanelInner.classList.add('speed-limit-inner');

        let divTitle = document.createElement('div');
        divTitle.classList.add('limit-label');
        divTitle.innerText = 'SPEED LIMIT';

        let divBody= document.createElement('div');
        divBody.classList.add('limit-text');
        divBody.id = 'speed-limit'
        divBody.innerHTML = speedLimitTxt;

        divPanel.appendChild(divPanelInner);
        divPanelInner.appendChild(divTitle);
        divPanelInner.appendChild(divBody);
        return divPanel;
    }    
}

