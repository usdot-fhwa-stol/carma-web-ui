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

    let spanCheckMark = document.createElement('span');
    spanCheckMark.classList.add('checkmark');

    labelContainer.appendChild(spanRouteName);
    labelContainer.appendChild(routeRadio);
    labelContainer.appendChild(spanCheckMark);
    return labelContainer;
}

//call create function
// $(document).ready(function(){
//     $('#route-list-content').append(createRouteSelectionRadio('tfhrc_test_route','C-HUB'));
// });
