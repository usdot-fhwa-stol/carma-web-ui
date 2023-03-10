/***
 * Create the ERV status warning UI element
 */
function createEventStatus(toHideStatus,img_path, description)
{
    let divEventStatusWrapper = document.createElement('div');
    divEventStatusWrapper.id='event_status_wrapper';
    if(toHideStatus) 
        divEventStatusWrapper.style.display='none';

    let p_event_status_div = document.createElement('div');
    
    //Lane Change description
    let p_event_status = document.createElement("p");
    p_event_status.innerHTML = description;
    p_event_status.id = "event_status_description_id";
    p_event_status.alt = "Status";
    p_event_status_div.append(p_event_status);

    //Lane Change status
    let img_event_status_icon = document.createElement("img");
    img_event_status_icon.src = img_path;
    img_event_status_icon.id = "img_event_status_icon_id";
    p_event_status_div.append(img_event_status_icon);

    //
    divEventStatusWrapper.appendChild(p_event_status_div);

    return divEventStatusWrapper;
}
/***
 * Update the description of the ERV status UI element
 */
function updateEventStatus(toHideStatus,img_path, description)
{    
    if(!toHideStatus)
    {
        document.getElementById('event_status_description_id').innerHTML = description;
        document.getElementById('img_event_status_icon_id').src = img_path;
    }
    else
    {
        //clear the lane change status bubble
        document.getElementById('divEventStatusContent').innerHTML="";

        //hide the lane change status bubble
        document.getElementById('divEventStatusArea').style.display = 'none';
    }
}
