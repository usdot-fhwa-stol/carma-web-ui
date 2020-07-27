function createDisengageConfirmModal(confirmTitle,confirmBody)
{
    let divModal = document.createElement('div');
    divModal.classList.add('modal','fade','disengage-confirm-modal');
    divModal.id='disengageModal';
    divModal.tabIndex = '-1';
    divModal.role='dialog';
    divModal.ariaLabelLedby = 'disenageModalLabel';
    divModal.ariaHidden = 'true';


    let divDialog = document.createElement('div');
    divDialog.role = 'document';
    divDialog.classList.add('modal-dialog','modal-dialog-centered');

    let divContent = document.createElement('div');
    divContent.classList.add('modal-content');

    let divHeader = document.createElement('div');
    divHeader.classList.add('modal-header');

    let spanTitle = document.createElement('div');
    spanTitle.id = 'disengageModalTitle';
    spanTitle.classList.add('modal-title','disengage-custom-title');
    spanTitle.innerHTML = confirmTitle;

    let divBody = document.createElement('div');
    divBody.classList.add('modal-body','disengage-custom-body');
    divBody.innerHTML = confirmBody;

    let divFooter =document.createElement('div');
    divFooter.classList.add('modal-footer');

    let btnCancel = document.createElement('button');
    btnCancel.classList.add('btn','btn-danger','btnCancel');
    btnCancel.type = 'button';
    btnCancel.innerHTML = 'CANCEL';
    btnCancel.addEventListener('click',function(){
        $('#disengageModal').modal('hide');
    });

    let btnProceed = document.createElement('button');
    btnProceed.classList.add('btn','btn-primary','btnProceed');
    btnProceed.type = 'button';
    btnProceed.innerHTML = 'PROCEED';
    btnProceed.addEventListener('click', function(){
        $("#jqxLoader").jqxLoader({width: 150, height: 100, imagePosition: 'center', isModal: true});
        $('#jqxLoader').jqxLoader('open'); 
        sessionStorage.clear();
        window.location.assign('../../../scripts/killPlatform.php');
    });

    divHeader.appendChild(spanTitle);
    divContent.appendChild(divHeader);
    divContent.appendChild(divBody);    
    divFooter.appendChild(btnCancel);
    divFooter.appendChild(btnProceed);
    divContent.appendChild(divFooter);
    divDialog.appendChild(divContent);
    divModal.appendChild(divDialog);
    return divModal;
}

$(document).ready(function(){
    $('#ModalsArea').append(createDisengageConfirmModal('<i class="fas fa-exclamation-triangle"></i>WARNING','Are you sure you want to take manual control?'));
});

