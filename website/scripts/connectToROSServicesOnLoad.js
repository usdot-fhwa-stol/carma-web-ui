$(document).ready(function(){
    console.log('window is loaded');
    if (typeof (Storage) !== 'undefined') 
    {
        connectToROS(true);
        subscribeToGuidanceAvailaleRoutes ();
        subscribeToGuidanceRegisteredPlugins ();
        subscribeToGuidanceActivatedPlugins();
        subscribeToGuidanceState ();
    } 
    else 
    {
        // Sorry! No Web Storage support..
        divCapabilitiesMessage.innerHTML = 'Sorry, cannot proceed unless your browser support HTML Web Storage Objects. Please contact your system administrator.';
    }
});
    