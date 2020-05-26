	var intervalID = 0;
	var time = 10;

	MsgPop.displaySmall = true;
	MsgPop.position = "bottom-right";

	$(document).ready(function(){
		var test = MsgPop.open({
		Type:			"success",
		Content:		"Welcome to MsgPop!"});

		MsgPop.live();
	});

	function showMessages(){
		MsgPop.closeAll({ClearEvents:	true});
		MsgPop.displaySmall = true;

		MsgPop.open({
		Type:			"success",
		Content:		"This has been a success!",
		AutoClose:		false});

		MsgPop.open({
		Type:			"error",
		Content:		"Fail! You have to click the close button.",
		AutoClose:		false,
		ClickAnyClose:	false});

		MsgPop.open({
		Type:			"message",
		Content:		'This message was created using msgPop! It will close in <span id="time">10</span> seconds!',
		AutoClose:		true,
		BeforeOpen:		function(){
							time = 10;
							if(intervalID == 0){
								intervalID = setInterval(function(){
									time-=1;
									$(document.getElementById('time')).html(time);
								},1000);
							}
						},
		BeforeClose:	function(){
							time = 10;
							clearInterval(intervalID);
							intervalID = 0;
						},
		CloseTimer:		10000,
		ClickAnyClose:	false,
		HideCloseBtn:	true});

		MsgPop.open({
		Type:			"caution",
		Content:		"This is a caution. Click anywhere to close me!",
		AutoClose:		false,
		ClickAnyClose:	true,
		ShowIcon:		true,
		HideCloseBtn:	true});

		MsgPop.open({
		Type:			"warning",
		Content:		"This is a warning. Click anywhere to close me!",
		AutoClose:		false,
		ClickAnyClose:	true,
		ShowIcon:		true,
		HideCloseBtn:	true});

		MsgPop.open({
		Type:			"success",
		Content:		"I was hiding...If you close me you will see an example of my hooks.",
		AutoClose:		false});

		MsgPop.open({
		Type:			"error",
		Content:		"This message will self destruct in 5 seconds!",
		AutoClose:		true,
		CloseTimer:		5000,
		ClickAnyClose:	false,
		HideCloseBtn:	true});


		MsgPop.open({
		Type:			"message",
		Content:		"I have given this message a unique dom ID",
		AutoClose:		false,
		MsgID:			"info",
		ClickAnyClose:	true});
	}
