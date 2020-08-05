$(document).ready(function(){
    console.log('window is loaded');
    if (typeof (Storage) !== 'undefined') 
    {
        /*
        **************************************
        * rosbridge connection 
        * ************************************
        */
        connectToROS();

        /*
        **************************************
        * set inital paramsters that are used 
        * by the topics and services
        * ************************************
        */
        getRequiredPluginParam();

        /****
         * ***********************************
         * subscribe to the services and topics
         * ***********************************
         */        
        //SECTION: Route Area
        subscribeToGuidanceAvailaleRoutes ();        

        /***
         * SECTION: Status icons 
         */
        //GPS or PinPoint status
        subscribeToDriverDiscovery();
        //OBU status
        subscribeToInboundBinary();
        subscribeToOutboundBinary();

        /**
         * SECTION: Display Area
         * **/
        //Current Vehicle Speed
        subscribeToLocalizationEKFTwist();        
        //Vechile Command
        //Steering angle; applied speed; brake; accelerator
        subscribeToVehicleCMD();        
        //Route - Speed Limit
        subscribeToGuidanceRouteState();
        //Traffic Signal 
        TrafficSignalInfoList();

        /***
         * SECTION: Right Panel Info
         * */
        //Active plugins & Change plugins
        subscribeToGuidanceRegisteredPlugins ();
        subscribeToGuidanceActivePlugins();

        /***
         * SECTION: Bottom Menu 
         * */
        //guidance button
        subscribeToGuidanceState();
    } 
    else 
    {
        // Sorry! No Web Storage support..
        divCapabilitiesMessage.innerHTML = 'Sorry, cannot proceed unless your browser support HTML Web Storage Objects. Please contact your system administrator.';
    }
});
    