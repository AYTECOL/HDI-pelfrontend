import GetAddresInfo from './services/AddresCoordenates';

// Primer Formulario
const saveIdentificationValue = (element) => {
    let name = element.name;
    let value = element.value;
    let data = {};
    data[name] = value;
    return {type: "SAVE_IDENTIFICATION_VALUE", data: data};
};
const setAddresMap = (data) => {
    return {type: "SET_ADDRES_MAP", data};
};

const reqAddress = (address) => {
    return dispatch => {
        return GetAddresInfo.get(address.value)
            .then(response => {
                let map = {
                    longitude: response.lng,
                    latitude: response.lat
                };
                return {type: "SET_ADDRES_MAP", map};
            });
    };
};

const nextStepIndentification = () => {
    return {type: "NEXT_STEP_INDENTIFICATION", data: 1};
};

const continueButtonDisable = (state) => {
    return {type: "DISABLE_BTN_CONTINUE", data: state};
};

const saveCotizacionNumber = (number) => {
    return {type: "SAVE_COTIZACION_NUMBER", data: number}
};

const updateTypeDoc = (type) => {
    return {type: "UPDATE_TYPE_DOC", data: type}
};

const mapShow = (status) => {
    return {type: "SET_MAP_SHOW", data: status}
};

const saveDescriptionCity = (description) => {
    return {type: "SAVE_DESCRIPTION_CITY", data: description}
};

const restoreCotizacion = (cotizacion) => {
    return {type: "RESTORE_COTIZACION", data: cotizacion}
};

const NextStep = (step) => {
    return {type: "NEXT_STEP", data: step}
};


// Segundo formulario
const typeInmueble = (typeInmueble) => {
    return {type: "TYPE_INMUEBLE", data: typeInmueble}
};

const saveInmuebleValue = (element) => {
    let name = element.name;
    let value = element.value;
    let data = {};
    data[name] = value;
    return {type: "SAVE_INMUEBLE_VALUE", data: data};
};

const showPopupIdentification = (state) => {
    return {type: "SHOW_POP_UP_IDENTIFICATION", data: state}
};

const disabledName = () => {
    return {type: "DISABLE_NAME", data: true}
};

const disabledLastName = () => {
    return {type: "DISABLE_LASTNAME", data: true}
};

export {
    nextStepIndentification,
    saveIdentificationValue,
    setAddresMap,
    continueButtonDisable,
    saveCotizacionNumber,
    updateTypeDoc,
    reqAddress,
    mapShow,
    saveDescriptionCity,
    restoreCotizacion,
    NextStep,
    typeInmueble,
    saveInmuebleValue,
    showPopupIdentification,
    disabledLastName,
    disabledName
};
