
function createWifiIcon(strength, color){
    var wifi = document.createElement('div');
    wifi.classList.add('wifi','strength-'+strength);
    wifi.id='wifi';

    var wifiCircle = document.createElement('div');
    wifiCircle.classList.add('circle','strength-'+strength);    

    var WifiText = document.createElement('div');
    WifiText.classList.add('wifi-text','strength-'+strength);
    WifiText.innerHTML="WIFI";

    wifiCircle.appendChild(wifi);
    //wifiCircle.appendChild(WifiText);
    return wifiCircle;
}

//call create function
$(document).ready(function(){
    $('#wifi-status').append(createWifiIcon('1'));
});