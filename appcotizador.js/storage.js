function handleStorage(quotationData){
    const newQuotation = getFromSession('newQuotation');
    const isEditing = getFromSession('isEditing');
    if(newQuotation) {
        let activeId = getNewStorageId(); 
        setToSession('activeId',activeId);
        storeQuotation({id: activeId,...quotationData});
        setToSession('newQuotation',false)
        enableActiveItem(activeId,false);
    } else {
        updateQuotationsList(quotationData,isEditing);
    }
}


function getNewStorageId(isLocal = false) {
    const lastId = isLocal ? parseInt(getFromLocal('lastId')):parseInt(getFromSession('lastId'));
    const setId = isLocal ? (n)=>setToLocal('lastId',n):(n)=>setToSession('lastId',n);
    if(isNaN(lastId)){
        setId(0);
        return 0;
    } else {
        setId(lastId+1);
        return lastId+1;
    }
}


function storeQuotation(quotation, isLocal = false) {
    if(isLocal){
        let localQuotations = getFromLocal('quotations') || [];
        localQuotations.push(quotation);
        setToLocal('quotations',localQuotations);
        renderQuotationsList(false, true);
    } else {
        let sessionQuotations = getFromSession('quotations') || [];
        sessionQuotations.push(quotation);
        setToSession('quotations',sessionQuotations);
        renderQuotationsList(false, false);
    }
}

function saveQuotation(){
    const isEditing = getFromSession('isEditing');
    const activeId = getFromSession('activeId');
    if(!isEditing) {
        disableActiveItem();
        let sessionQuotation = getFromSession('quotations');
        const indexOfActiveId = sessionQuotation.indexOf(sessionQuotation.find((q)=>q.id == activeId));
        sessionQuotation = sessionQuotation[indexOfActiveId];
        sessionQuotation.id = getNewStorageId(true);
        storeQuotation(sessionQuotation,true);
        renderQuotationsList(false,true);
        setToSession('activeId',getFromLocal('lastId'))
        enableActiveItem(getFromLocal('lastId'),true);
        setToSession('isEditing', true)
        Toastify({
            text: 'Cotización guardada correctamente!',
            close: true,
            className: 'toast-success',
            duration: 3000
        }).showToast();
    } else {
        Toastify({
            text: 'La cotización ya se encuentra guardada! \n Las modificaciones que realices se actualizan automáticamente',
            close: true,
            className: 'toast-danger',
            duration: 3000
        }).showToast();
    }
}

function updateQuotationsList(quotationData, isLocal){
    const activeId = getFromSession('activeId');
    const setToStorage = isLocal ? (data) => setToLocal('quotations',data) : (data)=>setToSession('quotations',data);
    let quotations = isLocal ? getFromLocal('quotations') : getFromSession('quotations');
    const indexOfActiveId = quotations.indexOf(quotations.find((q)=> q.id == activeId));
    quotations[indexOfActiveId] = {id:activeId,...quotationData};
    setToStorage(quotations);
    renderQuotationsList(true,isLocal);
}

const DOMById = (elId) => document.getElementById(elId);

const cleanClientName = (name)=>name[0].toUpperCase()+name.slice(1).toLowerCase();

const getFromSession = (item) => JSON.parse(sessionStorage.getItem(item));
const setToSession = (key, item) => sessionStorage.setItem(key, JSON.stringify(item));
const getFromLocal = (item) => JSON.parse(localStorage.getItem(item));
const setToLocal = (key,item) => localStorage.setItem(key, JSON.stringify(item));
const getFetch = async (url) => {
	const response = await fetch(url);
	if(response.ok) {
		const data = await response.json();
		return data;
	}
	console.error('Error fetching ' + url);
	console.error(response.message);
	return null;
};
