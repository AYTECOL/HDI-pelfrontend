<<<<<<< HEAD
=======
import Identifications from './services/Identifications';
import GetAddresInfo from './services/AddresCoordenates';
const loadIdentifications = () => {
    return dispatch => {
        return Identifications.get()
            .then(response => {
                dispatch({type: "ADD_IDENTIFICATIONS", data: response.identifications});
            });
    };
};

>>>>>>> 996af23... [PELH-2.2] Send google places request
const validarIdentificacionToogle = (data) => {
    return {type: "VALIDARIDENTIFICACION_TOOGLE", data};
};

const setAddresMap = (data) => {
    return {type: "SET_ADDRES_MAP", data};
};

const reqAddres = (address) => {
    return dispatch => {
        console.log(address.value)
        return GetAddresInfo.get(address.value)
            .then(response => {
                let map = {
                    longitude: response.lng,
                    latitude: response.lat
                }
                console.log(response)
                return {type: "SET_ADDRES_MAP", map};
            });
    };
}

const saveIdentificationValue = (element) => {
    let name = element.name;
    let value = element.value;
    let data = {};
    data[name] = value;
    return {type: "SAVE_IDENTIFICATION_VALUE", data: data};
};

const validateIdentificationValue = (name) => {
    return {type: "VALIDATE_IDENTIFICATION_VALUE", data: name};
};

const nextStepIndentification = () => {
    return {type: "NEXT_STEP_INDENTIFICATION", data: 1};
};

const continueButtonDisable = (state) => {
    return {type: "DISABLE_BTN_CONTINUE", data: state};
};

const saveCityStore = (data) => {
    return {type: "SAVE_CITY_STORE", data};
};

export {
    validarIdentificacionToogle,
    nextStepIndentification,
    saveIdentificationValue,
    validateIdentificationValue,
    saveCityStore,
<<<<<<< HEAD
    continueButtonDisable
=======
    setAddresMap,
    reqAddres
>>>>>>> 996af23... [PELH-2.2] Send google places request
};
