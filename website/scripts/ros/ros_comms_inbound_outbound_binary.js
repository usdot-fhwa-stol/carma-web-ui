/**
 * Subscribe to /hardware_interface/comms/inbound_binary_msg
 * Show driver status for OBU
 */
function subscribeToInboundBinary(){
    let listener = new ROSLIB.Topic({
        ros:g_ros,
        name: T_COMMS_INBOUND_BINARY_MSG,
        messageType: M_CAV_BYTEARRAY
    });
    let isTimeerSet = false;

    listener.subscribe(function(message)
    {
        //Check ROSBridge connection before subscribe a topic
        IsROSBridgeConnected();
        
        //Get PinPoint status for now.
        let OBUStatusOBJ = document.getElementById('OBU-status-svg');
        
        if (OBUStatusOBJ == null || OBUStatusOBJ == 'undefined')
        return;

        let svgDov = OBUStatusOBJ.contentDocument;
        if (svgDov == null || svgDov == 'undefined')
            return;

        let OBUStatusDownArrow1 = svgDov.getElementById('dsrc-cls-1-down-1');
        let OBUStatusDownArrow2 = svgDov.getElementById('dsrc-cls-1-down-2');
        let BottomLine = svgDov.getElementById('bottom-line');

        // Set the colour to something else
        OBUStatusDownArrow1.setAttribute('fill', 'rgb(188, 250, 63)'); 
        OBUStatusDownArrow1.setAttribute('stroke', 'rgb(188, 250, 63)'); 
        OBUStatusDownArrow2.setAttribute('fill', 'rgb(188, 250, 63)'); 
        OBUStatusDownArrow2.setAttribute('stroke', 'rgb(188, 250, 63)'); 
        BottomLine.setAttribute('fill', 'rgb(188, 250, 63)'); 
        BottomLine.setAttribute('stroke', 'rgb(188, 250, 63)');  
        //set back to black after 5 seconds.
        if(!isTimeerSet)
        {
            isTimeerSet=true;
            setTimeout(function(){
                OBUStatusDownArrow1.setAttribute('fill', 'grey'); //grey
                OBUStatusDownArrow1.setAttribute('stroke', 'grey'); //grey
                OBUStatusDownArrow2.setAttribute('fill', 'grey'); //grey
                OBUStatusDownArrow2.setAttribute('stroke', 'grey'); //grey
                BottomLine.setAttribute('fill', 'grey'); //grey
                BottomLine.setAttribute('stroke', 'grey'); //grey
                isTimeerSet=false;
            }, 5000);
        }
    });
    
}

/**
 * Subscribe to /hardware_interface/comms/outbound_binary_msg
 * Show driver status for OBU
 */
function subscribeToOutboundBinary(){
    let listener = new ROSLIB.Topic({
        ros:g_ros,
        name: T_COMMS_OUTBOUND_BINARY_MSG,
        messageType: M_CAV_BYTEARRAY
    });
    let isTimeerSet = false;

    listener.subscribe(function(message)
    {
        //Check ROSBridge connection before subscribe a topic
        IsROSBridgeConnected();
        
        //Get OBU status for now.
        let OBUStatusOBJ = document.getElementById('OBU-status-svg');
        
        if (OBUStatusOBJ == null || OBUStatusOBJ == 'undefined')
        return;

        let svgDov = OBUStatusOBJ.contentDocument;
        if (svgDov == null || svgDov == 'undefined')
            return;
        let OBUStatusUpArrow1 = svgDov.getElementById('dsrc-cls-1-up-1');
        let OBUStatusUpArrow2 = svgDov.getElementById('dsrc-cls-1-up-2');
        let BottomLine = svgDov.getElementById('bottom-line');
        
        // Set the colour to something else
        OBUStatusUpArrow1.setAttribute('fill', 'rgb(188, 250, 63)'); 
        OBUStatusUpArrow1.setAttribute('stroke', 'rgb(188, 250, 63)'); 
        OBUStatusUpArrow2.setAttribute('fill', 'rgb(188, 250, 63)'); 
        OBUStatusUpArrow2.setAttribute('stroke', 'rgb(188, 250, 63)'); 
        BottomLine.setAttribute('fill', 'rgb(188, 250, 63)'); 
        BottomLine.setAttribute('stroke', 'rgb(188, 250, 63)');  
        //set back to black after 5 seconds.
        if(!isTimeerSet)
        {
            isTimeerSet=true;
            setTimeout(function(){
                OBUStatusUpArrow1.setAttribute('fill', 'grey'); 
                OBUStatusUpArrow1.setAttribute('stroke', 'grey'); 
                OBUStatusUpArrow2.setAttribute('fill', 'grey'); 
                OBUStatusUpArrow2.setAttribute('stroke', 'grey'); 
                BottomLine.setAttribute('fill', 'grey'); 
                BottomLine.setAttribute('stroke', 'grey'); 
                isTimeerSet=false;
            }, 5000);
        }
    });
    
}