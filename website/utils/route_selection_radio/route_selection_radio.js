/**
 * radio group to display available route list 
 * @param {*} routeId  
 * @param {*} RouteName 
 */
function  createRouteSelectionRadio(routeId, RouteName) {
    let labelContainer = document.createElement('label');
    labelContainer.classList.add('container');

    let spanRouteName = document.createElement('span');
    spanRouteName.classList.add('title');
    spanRouteName.innerHTML = RouteName;

    let routeRadio = document.createElement('input');
    routeRadio.type='radio';
    routeRadio.name = 'route_radio';
    routeRadio.id = 'route_radio_' + routeId;
    routeRadio.value = routeId;
    routeRadio.onclick = function()
    {
        //Defined in connectToROSServicesOnLoad.js
        setRouteEventLisenter(routeId);
    };

    let spanCheckMark = document.createElement('span');
    spanCheckMark.classList.add('checkmark');

    let spanRouteErrorMsg = document.createElement('span');
    spanRouteErrorMsg.innerHTML = 'Route generation failed';
    spanRouteErrorMsg.id='error_msg_'+routeId;
    spanRouteErrorMsg.setAttribute('name','route_error_msg')
    spanRouteErrorMsg.classList.add('route_error_msg');

    labelContainer.appendChild(spanRouteName);
    labelContainer.appendChild(spanRouteErrorMsg);
    labelContainer.appendChild(routeRadio);
    labelContainer.appendChild(spanCheckMark);
    return labelContainer;
}
//call create function
// $(document).ready(function(){
//     $('#route-list-content').append(createRouteSelectionRadio('tfhrc_test_route','C-HUB'));
// });
