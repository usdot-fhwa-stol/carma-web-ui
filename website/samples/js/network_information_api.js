var connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
var type = connection.effectiveType;
console.log('Connection type is ' + type);
console.log(navigator);

// window events
window.addEventListener('offline', () =>
{
    console.log('came offline');
});

window.addEventListener('online', () => 
{
    console.log('came online');
});

connection.addEventListener('change',()=>
{
    console.log('Connection type changed from ' + type + ' to ' + connection.effectiveType);
    type = connection.effectiveType;    
});
