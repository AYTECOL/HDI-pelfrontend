import GetAddresInfo from './services/AddresCoordenates';
import store from "./store";

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
                }
                return {type: "SET_ADDRES_MAP", map};
            });
    };
}

const nextStepIndentification = () => {
    return {type: "NEXT_STEP_INDENTIFICATION", data: 1};
};

const continueButtonDisable = (state) => {
    return {type: "DISABLE_BTN_CONTINUE", data: state};
};

const saveCotizacionNumber = (number) => {
    return {type: "SAVE_COTIZACION_NUMBER", data: number}
}

const updateTypeDoc = (type) => {
    return {type: "UPDATE_TYPE_DOC", data: type}
}

export {
    nextStepIndentification,
    saveIdentificationValue,
    setAddresMap,
    continueButtonDisable,
    saveCotizacionNumber,
    updateTypeDoc,
    reqAddress
};
