$(document).ready(function(){
    console.log('window is loaded');
    if (typeof (Storage) !== 'undefined') 
    {
        //rosbridge connection
        connectToROS();

        /*
        * set inital paramsters that are used by the topics and services
        */
        getRequiredPluginParam();

        /****
         * subscribe to the services and topics
         */
        
        //route
        subscribeToGuidanceAvailaleRoutes ();

        //plugins
        subscribeToGuidanceRegisteredPlugins ();
        subscribeToGuidanceActivePlugins();

        //guidance
        subscribeToGuidanceState();
    } 
    else 
    {
        // Sorry! No Web Storage support..
        divCapabilitiesMessage.innerHTML = 'Sorry, cannot proceed unless your browser support HTML Web Storage Objects. Please contact your system administrator.';
    }
});
    