function createSystemAlertModal(systemAlertTitle,systemAlertBody)
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

    let btnProceed = document.createElement('button');
    btnProceed.classList.add('btn','btn-primary','btnProceed');
    btnProceed.type = 'button';
    btnProceed.innerHTML = 'LOGOUT';
    btnProceed.addEventListener('click', function(){
        $("#jqxLoader").jqxLoader({width: 150, height: 100, imagePosition: 'center', isModal: true});
        $('#jqxLoader').jqxLoader('open'); 
        //Clear sesion variables
        sessionStorage.clear();
        clearInterval(g_timer); //stops the execution
        g_timer = null; //reset elapsed timer
        window.location.assign('../../../scripts/killPlatform.php');
    });

    divHeader.appendChild(spanTitle);
    divContent.appendChild(divHeader);
    divContent.appendChild(divBody);    
    //divFooter.appendChild(btnCancel);
    divFooter.appendChild(btnProceed);
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

