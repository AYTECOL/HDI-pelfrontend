// Primer Formulario
const saveIdentificationValue = (element) => {
    return {type: "SAVE_IDENTIFICATION_VALUE", data: {[element.name]: element.value}};
};
const setAddresMap = (data) => {
    return {type: "SET_ADDRES_MAP", data};
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

const restoreCotizacionRisk = (cotizacion) => {
    return {type: "RESTORE_COTIZACION_RISK", data: cotizacion}
};

const NextStep = (step) => {
    return {type: "NEXT_STEP", data: step}
};


// Segundo formulario
const typeInmueble = (typeInmueble) => {
    return {type: "TYPE_INMUEBLE", data: typeInmueble}
};

const saveInmuebleValue = (element) => {
    return {type: "SAVE_INMUEBLE_VALUE", data: {[element.name]: element.value}};
};

const saveInmuebleValueSeguridad = (element) => {
    return {type: "SAVE_INMUEBLE_VALUE_SEGURIDAD", data: {[element.name]: element.value}};
};

// Tercer formulario
const indexPlanSelected = (index) => {
    return {type: "INDEX_PLAN_SELECTED", data: index}
};

// Dada Services
const saveAllfloors = (data) => {
    return {type: "SAVE_ALL_FLOORS", data: data}
};
const saveAllInsurableLimits = (data) => {
    return {type: "SAVE_ALL_INSURABLE_LIMITS", data: data}
};
const AllPlans = (data) => {
    return {type: "SAVE_ALL_PLANS", data: data}
};

export {
    nextStepIndentification,
    saveIdentificationValue,
    setAddresMap,
    continueButtonDisable,
    saveCotizacionNumber,
    updateTypeDoc,
    mapShow,
    saveDescriptionCity,
    restoreCotizacion,
    NextStep,
    typeInmueble,
    saveInmuebleValue,
    saveInmuebleValueSeguridad,
    restoreCotizacionRisk,
    saveAllfloors,
    saveAllInsurableLimits,
    AllPlans,
    indexPlanSelected
};
