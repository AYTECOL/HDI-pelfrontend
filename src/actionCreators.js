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

const nextStepIndentification = () => {
    return {type: "NEXT_STEP_INDENTIFICATION", data: {}};
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
    continueButtonDisable
};
