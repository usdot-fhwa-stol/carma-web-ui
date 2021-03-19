
function createLaneChangeStatus(toHideStatus,img_path, description)
{
    let divLaneChangeStatusWrapper = document.createElement('div');
    divLaneChangeStatusWrapper.id='lane_change_status_wrapper';
    if(toHideStatus) 
        divLaneChangeStatusWrapper.style.display='none';

    let p_lane_change_status_div = document.createElement('div');
    
    //Lane Change description
    let p_lane_change_status = document.createElement("p");
    p_lane_change_status.innerHTML = description;
    p_lane_change_status.id = "lane_change_status_description_id";
    p_lane_change_status.alt = "Status";
    p_lane_change_status_div.append(p_lane_change_status);

    //Lane Change status
    let img_lane_change_status_icon = document.createElement("img");
    img_lane_change_status_icon.src = img_path;
    img_lane_change_status_icon.id = "img_lane_change_status_icon_id";
    p_lane_change_status_div.append(img_lane_change_status_icon);

    //
    divLaneChangeStatusWrapper.appendChild(p_lane_change_status_div);

    return divLaneChangeStatusWrapper;
}

function updateLaneChangeStatus(toHideStatus,img_path, description)
{    
    if(!toHideStatus)
    {
        document.getElementById('lane_change_status_description_id').innerHTML = description;
        document.getElementById('img_lane_change_status_icon_id').src = img_path;
    }
    else
    {
        //clear the lane change status bubble
        document.getElementById('divLaneChangeStatusContent').innerHTML="";

        //hide the lane change status bubble
        document.getElementById('divLaneChangeStatusArea').style.display = 'none';
    }
}
