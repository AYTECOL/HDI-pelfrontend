import Identifications from './services/Identifications';

const loadIdentifications = () => {
    return dispatch => {
        return Identifications.get()
            .then(response => {
                dispatch({type: "ADD_IDENTIFICATIONS", data: response.identifications});
            });
    };
};

const validarIdentificacionToogle = (data) => {
    return {type: "VALIDARIDENTIFICACION_TOOGLE", data};
};

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

const nextStepIndex = () => {
    return {type: "NEXT_STEP_INDEX", data: {}};
};

const autoCompleteCiudadToogle = (toogle) => {
    return {type: "TOOGLE_AUTOCOMPLETE_CIUDAD", data: {}};
}

export {
    loadIdentifications,
    validarIdentificacionToogle,
    nextStepIndex,
    saveIdentificationValue,
    validateIdentificationValue,
    autoCompleteCiudadToogle
};