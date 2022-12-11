
function isValid(fieldId) {
    switch (fieldId) {
        case 'clientName':
            const clientName = DOMById('clientName').value.trim().replace(' ','');
            if(clientName.split('').some(char => char.toLowerCase() == char.toUpperCase() || !isNaN(parseInt(char)))) return false;
            if(clientName.length < 3) return false;
            return true;
        case 'clientAge':
            const clientAge = Number(DOMById('clientAge').value.trim());
            if(isNaN(clientAge)) return false;
            if(clientAge < 17) return false;
            if(clientAge > 85) return false;
            return true;
        case 'vehicleBrand':
            const vehicleBrand = DOMById('vehicleBrand').value.trim().replace(' ','');
            if(vehicleBrand.split('').some(char => char.toLowerCase() == char.toUpperCase() || !isNaN(parseInt(char)))) return false;
            if(vehicleBrand.length < 3) return false;
            if(!DOMById('vehicleBrand').dataset.selectedItem) return false;
            return true;
        case 'vehicleYear':
            const vehicleYear = Number(DOMById('vehicleYear').value.trim());
            if(isNaN(vehicleYear)) return false;
            if(vehicleYear < 2016) return false;
            if(vehicleYear > 2022) return false;
            if(!DOMById('vehicleYear').dataset.selectedItem) return false;
            return true;
        case 'vehicleModel':
            const vehicleModel = DOMById('vehicleModel').value.trim();
            if(vehicleModel.toLowerCase() == vehicleModel.toUpperCase()) return false;
            if(vehicleModel.length < 5) return false;
            if(!DOMById('vehicleModel').dataset.selectedItem) return false;
            return true;
        case 'vehicleAmount':
            const vehicleAmount = Number(DOMById('vehicleAmount').value.trim().replaceAll('.',''));
            const vehicleStatedAmount = Number(DOMById('vehicleAmount').dataset?.statedAmount);
            if(isNaN(vehicleAmount)) return false;
            if(!calculateVehicleAmount(vehicleStatedAmount, vehicleAmount)) return false;
            return true;
    }
}


function calculateVehicleAmount(statedAmount, userAmount) {
    const maxAmount = statedAmount + (statedAmount*0.2);
    if(userAmount > maxAmount || userAmount < statedAmount) {
        showAlert(`La suma asegurada no debe superar el 20% de lo establecido.<br>Valores permitidos: $ ${statedAmount.toLocaleString('es-AR')} - ${maxAmount.toLocaleString('es-AR')}`,
        'danger','vehicleAmount')
        return false;
    }
    
    hideAlert('vehicleAmount');
    return true;
}

function formatVehicleAmount() {
    const vehicleAmountInput = document.getElementById('vehicleAmount');
    const vehicleAmount = Number(vehicleAmountInput.value.trim().replaceAll('.',''));
    vehicleAmountInput.value = vehicleAmount.toLocaleString('es-AR');
}

function validateClientData() {
    const fields = ['clientName', 'clientAge'];
    let invalids = 0;
    fields.forEach(field => {
        if(!isValid(field)) {
            validateFieldEnableNext(false, document.getElementById(field));
            invalids += 1;
        }
    })
    if(invalids > 0) return false;
    return true;
}

function validateVehicleData() {
    const fields = ['vehicleBrand', 'vehicleYear', 'vehicleModel', 'vehicleAmount'];
    let invalids = 0;
    fields.forEach(field => {
        if(!isValid(field)) {
            validateFieldEnableNext(false, document.getElementById(field));
            invalids += 1;
        }
    })
    if(invalids > 0) return false;
    if(!validateCoverages()) return false;
    return true;
}

function validateCoverages() {
    const checkboxes = document.querySelectorAll('.chkCoverage');
    let selectedCount = 0;
    checkboxes.forEach((check) => {
        if(check.checked){
            selectedCount += 1;
        }
    })
    if(selectedCount > 0) {
        document.getElementById('btn-next-vehicle').disabled = false;
        return true;
    }
    Toastify({
        text: 'Debes seleccionar al menos 1 cobertura',
        close: true,
        className: 'toast-danger',
        duration: 3000
    }).showToast();
    document.getElementById('btn-next-vehicle').disabled = true;
    return false;
}

function enableCoverages(isValid) {
	const checkboxes = document.querySelectorAll('.chkCoverage');
    checkboxes.forEach((check) => check.disabled = !isValid)
}

function resetCoverages() {
    const checkboxes = ['checkRC', 'checkTC', 'checkTR'];
    checkboxes.forEach((check) => document.getElementById(check).checked = false);
}

function nextStep(isValid, collapseId, actualCollapseId, callback = '') {
    if(isValid){
        hideAlert(actualCollapseId);
        document.getElementById('btn-'+actualCollapseId).disabled = true;
        showStep(collapseId)
        if(callback) callback();
    } else {
        showAlert('Los datos ingresados son inválidos, por favor revisalos.','danger',actualCollapseId)
    }
}

function previousStep(prevCollapseId, actualCollapseId){
    document.getElementById('btn-'+actualCollapseId).disabled = true;
    showStep(prevCollapseId);
}

function showStep(collapseId) {
    const collapse = document.getElementById(collapseId)
    document.getElementById('btn-'+collapseId).disabled = false;
    return new bootstrap.Collapse(collapse, {
    toggle: true
    });
}

function showAlert(msg, type, targetId){
    const alertHTML = document.getElementById('alert-'+targetId);
    alertHTML.scrollIntoView();
    alertHTML.innerHTML = '<div class="alert alert-' + type + ' alert-dismissible" role="alert">' + msg + '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>';
}

function hideAlert(collapseId){
    const alertMsg = document.getElementById('alert-'+collapseId);
    if(alertMsg.innerHTML !== '') alertMsg.innerHTML = '';
}

function validateFieldEnableNext(isValid, fieldElement, nextElement = '', optionalCallback){
    if(!isValid){
        fieldElement.style.border = '1px solid red';
        if(nextElement != '') document.getElementById(nextElement).disabled = true;
    } else {
        fieldElement.style.border = '1px solid green';
        if(nextElement != '') document.getElementById(nextElement).disabled = false;
        if(typeof(optionalCallback) == 'function') optionalCallback();
    }
}



const clientNameEvents = document.getElementById('clientName');
clientNameEvents.addEventListener('input', () => validateFieldEnableNext(isValid('clientName'), clientNameEvents,'clientAge'));

const clientAgeEvents = document.getElementById('clientAge');
clientAgeEvents.addEventListener('input', () => validateFieldEnableNext(isValid('clientAge'), clientAgeEvents,'btn-next-client'));

clientAgeEvents.addEventListener('keyup', (event) => {
	if(event.key == 'Enter' && isValid('clientAge')) {
		document.getElementById('btn-next-client').click();
	}
})

const vehicleBrandEvents = document.getElementById('vehicleBrand');
vehicleBrandEvents.addEventListener('change', () => validateFieldEnableNext(isValid('vehicleBrand'), vehicleBrandEvents,'',fillYearSelect));

const vehicleYearEvents = document.getElementById('vehicleYear');
vehicleYearEvents.addEventListener('change', () => validateFieldEnableNext(isValid('vehicleYear'), vehicleYearEvents,'',()=>{
    const vehicleBrand = document.getElementById('vehicleBrand');
    const selectedBrandKey = Number(vehicleBrand.dataset.selectedItem);
    fillModelsSelect(selectedBrandKey, Number(vehicleYearEvents.value));
}));

const vehicleModelEvents = document.getElementById('vehicleModel');
vehicleModelEvents.addEventListener('change', () => validateFieldEnableNext(isValid('vehicleModel'), vehicleModelEvents,'vehicleAmount'));

const vehicleAmountEvents = document.getElementById('vehicleAmount');
vehicleAmountEvents.addEventListener('change', () => {
    const isvalid = isValid('vehicleAmount');
    validateFieldEnableNext(isvalid, vehicleAmountEvents);
    enableCoverages(isvalid);
});

vehicleAmountEvents.addEventListener('input', () => {
    vehicleAmountEvents.value = vehicleAmountEvents.value.replace(/[^0-9]/g,'');
    formatVehicleAmount();
    const isvalid = isValid('vehicleAmount');
    validateFieldEnableNext(isvalid, vehicleAmountEvents);
    enableCoverages(isvalid);
});

const chkCoverage = document.querySelectorAll('.chkCoverage');
chkCoverage.forEach((chk)=> chk.addEventListener('change',validateCoverages));