function createSystemAlertModal(systemAlertTitle,systemAlertBody,showRestartBtn, showLogoutBtn)
{
    let divModal = document.createElement('div');
    divModal.classList.add('modal','fade','system-alert-confirm-modal');
    divModal.id='systemAlertModal';
    divModal.tabIndex = '-1';
    divModal.role='dialog';
    divModal.ariaLabelLedby = 'systemAlertModalLabel';
    divModal.ariaHidden = 'true';


    let divDialog = document.createElement('div');
    divDialog.role = 'document';
    divDialog.classList.add('modal-dialog','modal-dialog-centered');

    let divContent = document.createElement('div');
    divContent.classList.add('modal-content');

    let divHeader = document.createElement('div');
    divHeader.classList.add('modal-header');

    let spanTitle = document.createElement('div');
    spanTitle.id = 'systemAlertModalTitle';
    spanTitle.classList.add('modal-title','system-alert-custom-title');
    spanTitle.innerHTML = systemAlertTitle;

    let divBody = document.createElement('div');
    divBody.classList.add('modal-body','system-alert-custom-body');
    divBody.innerHTML = systemAlertBody;

    let divFooter =document.createElement('div');
    divFooter.classList.add('modal-footer');
    /**
    let btnCancel = document.createElement('button');
    btnCancel.classList.add('btn','btn-danger','btnCancel');
    btnCancel.type = 'button';
    btnCancel.innerHTML = 'CANCEL';
    btnCancel.addEventListener('click',function(){
        $('#systemAlertModal').modal('hide');
    });
     */
    let btnLogout;
    if(showLogoutBtn)
    {
        btnLogout = document.createElement('button');
        btnLogout.classList.add('btn','btn-danger','btn-lg');
        btnLogout.type = 'button';
        btnLogout.innerHTML = 'LOGOUT';
        btnLogout.addEventListener('click', function(){
            $("#jqxLoader").jqxLoader({width: 150, height: 100, imagePosition: 'center', isModal: true});
            $('#jqxLoader').jqxLoader('open'); 
            //Clear sesion variables
            sessionStorage.clear();
            clearInterval(g_timer); //stops the execution
            g_timer = null; //reset elapsed timer

            //pause any sounds.
            document.getElementById('audioAlert1').pause();
            document.getElementById('audioAlert2').pause();
            document.getElementById('audioAlert3').pause();
            document.getElementById('audioAlert4').pause();
            
            window.location.assign('../../../scripts/killPlatform.php');
        });      
        //if show either restart or logout button
        if(!showRestartBtn)
            btnLogout.classList.add('btnLogoutCenter');
        else
            btnLogout.classList.add('btnLogout');

        divFooter.appendChild(btnLogout);
    }   

    let btnRestart ;
    if(showRestartBtn)
    {
        btnRestart = document.createElement('button');
        btnRestart.classList.add('btn','btn-primary','btn-lg','btnRestart');
        btnRestart.type = 'button';
        btnRestart.innerHTML = 'RESTART';
        btnRestart.addEventListener('click', function(){
            $("#jqxLoader").jqxLoader({width: 150, height: 100, imagePosition: 'center', isModal: true});
            $('#jqxLoader').jqxLoader('open'); 
            //Clear sesion variables
            sessionStorage.clear();
            clearInterval(g_timer); //stops the execution
            g_timer = null; //reset elapsed timer         
            activateGuidanceListner(false); //de-activate guidance and change guidance state to DRIVER'S READY

            //pause any sounds.
            document.getElementById('audioAlert1').pause();
            document.getElementById('audioAlert2').pause();
            document.getElementById('audioAlert3').pause();
            document.getElementById('audioAlert4').pause();

            window.location.assign('../../../main.html');            
          });
        //if show either restart or logout button
        if(!showLogoutBtn)
            btnRestart.classList.add('btnRestartCenter');
        else
            btnRestart.classList.add('btnRestart');

        divFooter.appendChild(btnRestart);
    }   
    
    divHeader.appendChild(spanTitle);
    divContent.appendChild(divHeader);
    divContent.appendChild(divBody);  
    divContent.appendChild(divFooter);
    divDialog.appendChild(divContent);
    divModal.appendChild(divDialog);
    return divModal;
}
/** 
$(document).ready(function(){
    $('#ModalsArea').append(createSystemAlertModal('<i class="fas fa-exclamation-triangle"></i>SYSTEM ALERT','Are you sure you want to take manual control?'));
});
**/

