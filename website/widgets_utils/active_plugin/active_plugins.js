function createActivePlugin(pluginName, isActivated, isAvailable){
    let p = document.createElement('p');
    p.classList.add('card-text');

    let span = document.createElement('span');
    span.innerHTML='&nbsp;';
    if(isActivated)
        span.classList.add('badge','badge-pill','background-color-green');
    if(!isActivated && isAvailable)
        span.classList.add('badge','badge-pill','background-color-blue');

    let pluginTextSpan = document.createElement('span');
    pluginTextSpan.classList.add('active-plugin-text');
    pluginTextSpan.innerHTML = pluginName;

    p.appendChild(span);
    p.appendChild(pluginTextSpan);
    return p;
}

//call function
// $(document).ready(function () {
//     $('#active-plugins-content').append(createActivePlugin('Platooning',true,true));
//     $('#active-plugins-content').append(createActivePlugin('MPC Pursuit',false,true));
// })