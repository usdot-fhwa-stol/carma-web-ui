function createActivePlugin(pluginName,pluginType,pluginVersionId, isAvailable,isActivated)
{
    let p = document.createElement('p');
    p.classList.add('card-text');
    p.id = 'active-p-' + pluginName + pluginType + pluginVersionId;

    let span = document.createElement('span');
    span.innerHTML='&nbsp;';

    if(isActivated && isAvailable)
        span.classList.add('badge','badge-pill','background-color-green');
    if(!isActivated && isAvailable)
        span.classList.add('badge','badge-pill','background-color-blue');

    let pluginTextSpan = document.createElement('span');
    pluginTextSpan.classList.add('active-plugin-text');
    pluginTextSpan.innerHTML = pluginName;
    pluginTextSpan.id = 'active-' + pluginName + pluginType + pluginVersionId;

    p.appendChild(span);
    p.appendChild(pluginTextSpan);
    return p;
}

function updateActivePlugin(pluginName,pluginType,pluginVersionId,changeToNewStatus)
{
    let p = document.getElementById('active-p-'+ pluginName + pluginType + pluginVersionId);
    if(changeToNewStatus){
        p.style.display = 'inline-block';
    }else
        p.style.display = 'none';
}
//call function
// $(document).ready(function () {
//     $('#active-plugins-content').append(createActivePlugin('Platooning',true,true));
//     $('#active-plugins-content').append(createActivePlugin('MPC Pursuit',false,true));
// })