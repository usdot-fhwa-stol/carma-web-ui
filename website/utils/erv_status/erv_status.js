/***
 * Create the ERV status warning UI element
 */
function createERVStatus(toHideStatus,img_path, description)
{
    let divERVStatusWrapper = document.createElement('div');
    divERVStatusWrapper.id='erv_status_wrapper';
    if(toHideStatus) 
        divERVStatusWrapper.style.display='none';

    let p_erv_status_div = document.createElement('div');
    p_erv_status_div.id="erv_status_description_div";
    //ERV description
    let p_erv_status = document.createElement("p");
    p_erv_status.innerHTML = description;
    p_erv_status.id = "erv_status_description_id";
    p_erv_status.alt = "Status";
    p_erv_status_div.append(p_erv_status);

    //ERV status
    let img_erv_status_icon = document.createElement("img");
    img_erv_status_icon.src = img_path;
    img_erv_status_icon.id = "img_erv_status_icon_id";
    p_erv_status_div.append(img_erv_status_icon);

    //
    divERVStatusWrapper.appendChild(p_erv_status_div);

    return divERVStatusWrapper;
}

/***
 * Update the description of the ERV status UI element
 */
function updateERVStatus(toHideStatus,img_path, description)
{    
    if(!toHideStatus)
    {
        document.getElementById('erv_status_description_id').innerHTML = description;
        document.getElementById('img_erv_status_icon_id').src = img_path;
    }
    else
    {
        //clear the ERV status bubble
        document.getElementById('divERVStatusContent').innerHTML="";

        //hide the ERV status bubble
        document.getElementById('divERVStatusArea').style.display = 'none';
    }
}
