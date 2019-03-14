import Identifications from './services/Identifications';

const loadIdentifications = () => {
    return dispatch => {
        return Identifications.get()
            .then(response => {
                dispatch({ type: "ADD_IDENTIFICATIONS", data: response.identifications });
            });
    };
};

const validarIdentificacionToogle = (data) => {
    return { type: "VALIDARIDENTIFICACION_TOOGLE", data };
};

const saveIdentificationType = (value) => {
    return {type: "SAVE_IDENTIFICATION_TYPE", data: value};
};

const saveIdentificationValue = (element) => {
    let name = element.name;
    let value = element.value;
    let data = {};
    data[name] = value;
    return {type: "SAVE_IDENTIFICATION_VALUE", data: data};
};

const nextStepIndex = (doc) => {
    console.log(doc);
    return {type: "NEXT_STEP_INDEX", data: {}};
};

export {
    loadIdentifications,
    validarIdentificacionToogle,
    nextStepIndex,
    saveIdentificationType,
    saveIdentificationValue
};