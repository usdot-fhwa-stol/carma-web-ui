
/*
    Show UI instructions
    NOTE: Currently UI instructions are handled at the carma level.
    TODO: Future this topic indicator to handle at carma and plugin level to allow plugin specific actions/icons. For now, will remain here.
*/
function showUIInstructions() {

    var UIInstructionsType = {
        INFO: { value: 0, text: 'INFO' }, //Notification of status or state change
        ACK_REQUIRED: { value: 1, text: 'ACK_REQUIRED' }, //A command requiring driver acknowledgement
        NO_ACK_REQUIRED: { value: 2, text: 'NO_ACK_REQUIRED' }, //A command that does not require driver acknowledgement
    };

    // List out the expected commands to handle that applies at the carma level or generic enough.
    var UIExpectedCommands = {
        LEFT_LANE_CHANGE: { value: 0, text: 'LEFT_LANE_CHANGE' }, //From lateral controller driver
        RIGHT_LANE_CHANGE: { value: 1, text: 'RIGHT_LANE_CHANGE' }, //From lateral controller driver
        //Add new ones here.
    };

    var listenerUiInstructions = new ROSLIB.Topic({
        ros: ros,
        name: t_ui_instructions,
        messageType: 'cav_msgs/UIInstructions'
    });

    listenerUiInstructions.subscribe(function (message) {

        if (message.type == UIInstructionsType.INFO.value) {
            divCapabilitiesMessage.innerHTML = message.msg;
        }
        else {
            var msg = '';

            //NOTE: Currently handling lane change for it's icons
            switch (message.msg) {
                case UIExpectedCommands.LEFT_LANE_CHANGE.text:
                    msg = '<i class="fa fa-angle-left faa-flash animated faa-slow" aria-hidden="true" ></i>';
                    break;
                case UIExpectedCommands.RIGHT_LANE_CHANGE.text:
                    msg = '<i class="fa fa-angle-right faa-flash animated faa-slow" aria-hidden="true" ></i>';
                    break;
                default:
                    msg = message.msg; //text display only.
                    break;
            }

            if (message.type == UIInstructionsType.NO_ACK_REQUIRED.value)
                showModalNoAck(msg); // Show the icon or text  for 3 seconds.

            //Implement ACK_REQUIRED logic to call specific service.
            //For now, no custom icons for acknowledgement, simply YES/NO button. Later may have other options.
            if (message.type == UIInstructionsType.ACK_REQUIRED.value)
            {
                //Show popup to user for acknowledgement and send the response over to the specific plugin.
                showModalAck(msg, message.response_service);
            }
        }
    });
}