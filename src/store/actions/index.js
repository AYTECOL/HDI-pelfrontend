import * as actionsTypes from '../constants';
const saveIdentificationValue = (element) => {
  return {
    type: actionsTypes.SAVE_IDENTIFICATION_VALUE,
    data: { [element.name]: element.value },
  };
};

const setAddresMap = (data) => {
  return { type: actionsTypes.SET_ADDRES_MAP, data };
};

// types
export const MAP_FORCE_RETRY = 'MAP_FORCE_RETRY';
export const MAP_CLEAR_FORCE_RETRY = 'MAP_CLEAR_FORCE_RETRY';

// action creators
export const mapForceRetry = () => ({
  type: MAP_FORCE_RETRY,
});

export const mapClearForceRetry = () => ({
  type: MAP_CLEAR_FORCE_RETRY,
});

const nextStepIndentification = () => {
  return { type: actionsTypes.NEXT_STEP_INDENTIFICATION, data: 1 };
};

const continueButtonDisable = (state) => {
  return { type: actionsTypes.DISABLE_BTN_CONTINUE, data: state };
};

const saveCotizacionNumber = (number) => {
  return { type: actionsTypes.SAVE_COTIZACION_NUMBER, data: number };
};

const updateTypeDoc = (type) => {
  return { type: actionsTypes.UPDATE_TYPE_DOC, data: type };
};

const mapShow = (status) => {
  return { type: actionsTypes.SET_MAP_SHOW, data: status };
};

const saveDescriptionCity = (description) => {
  return { type: 'SAVE_DESCRIPTION_CITY', data: description };
};

const restoreCotizacion = (cotizacion) => {
  return { type: actionsTypes.RESTORE_COTIZACION, data: cotizacion };
};

const restoreCotizacionRisk = (cotizacion) => {
  return { type: actionsTypes.RESTORE_COTIZACION_RISK, data: cotizacion };
};

const NextStep = (step) => {
  return { type: actionsTypes.NEXT_STEP, data: step };
};

// Segundo formulario
const typeInmueble = (data) => {
  return { type: actionsTypes.TYPE_INMUEBLE, data };
};

const saveInmuebleValue = (element) => {
  return {
    type: actionsTypes.SAVE_INMUEBLE_VALUE,
    data: { [element.name]: element.value },
  };
};

const setPropertyValidation = (validate) => (dispatch) => {
  dispatch({ type: actionsTypes.SAVE_INMUEBLE_VALUE, data: { validate } });
  return Promise.resolve();
};

const saveInmuebleValueSeguridad = (element) => {
  return {
    type: actionsTypes.SAVE_INMUEBLE_VALUE_SEGURIDAD,
    data: { [element.name]: element.value },
  };
};
const saveProspect = (data) => {
  return { type: actionsTypes.SAVE_PROSPECT, data: data };
};

const setExceptionSarlaft = (data) => {
  return { type: actionsTypes.SET_EXCEPTION_SARLAFT, data: data };
};

const setGeneralSetIdentifications = (data) => {
  return { type: actionsTypes.GENERAL_SET_IDENTIFICATIONS, data: data };
};

const setTabQuotation = (data) => {
  return { type: actionsTypes.SET_QUOTATION, data: data };
};
const setTabInEmission = (data) => {
  return { type: actionsTypes.SET_INEMISSION, data: data };
};
const setTabEmitted = (data) => {
  return { type: actionsTypes.SET_EMITED, data: data };
};

const setPlansQuot = (data) => {
  return { type: actionsTypes.SET_PLAN_QUOT, data: data };
};
const setPlansEmmit = (data) => {
  return { type: actionsTypes.SET_PLAN_EMITED, data: data };
};

// action authentication
const setAuthUser = (data) => {
  return {
    type: actionsTypes.SET_AUTH_USER,
    data: data,
  };
};
// action authentication
const setAuthUserCotiza = (data) => {
  return {
    type: actionsTypes.SET_AUTH_USER_COTIZA,
    data: data,
  };
};

// Tercer formulario
const indexPlanSelected = (index) => {
  return { type: actionsTypes.INDEX_PLAN_SELECTED, data: index };
};

// Dada Services
const saveAllfloors = (data) => {
  return { type: actionsTypes.SAVE_ALL_FLOORS, data: data };
};
const saveAllInsurableLimits = (data) => {
  return { type: actionsTypes.SAVE_ALL_INSURABLE_LIMITS, data: data };
};
const saveEstate = (data) => {
  return { type: actionsTypes.SAVE_ESTATE, data: data };
};
const AllPlans = (data) => (dispatch) => {
  dispatch({ type: actionsTypes.SAVE_ALL_PLANS, data: data });
  return Promise.resolve();
};
export const setValidPlans = (data) => {
  return { type: actionsTypes.VALID_PLANS, data: data };
};

/**
 * @typedef {{ plan: number, state: boolean }} LoadingPlanPerspective
 */
/**
 * @param {LoadingPlanPerspective} data
 */
export const setLoadingPlanPerspective = (data) => (dispatch) => {
  dispatch({ type: actionsTypes.LOADING_PLANS_PERSPECTIVE, data: data });
  return Promise.resolve();
};

/**
 *
 * @param {boolean} state
 */
export const saveAttachedFile = (state) => {
  return { type: actionsTypes.ATTACHED_FILE, data: state };
};

/**
 *
 * @param {boolean} state
 */
export const setLoading = (state) => {
  return { type: actionsTypes.LOADING, data: state };
};

const resetStore = () => {
  return { type: actionsTypes.RESET_STORE };
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
  saveEstate,
  AllPlans,
  indexPlanSelected,
  saveProspect,
  resetStore,
  saveAttachedFile as attachedFile,
  setPropertyValidation,
  setExceptionSarlaft,
  setGeneralSetIdentifications,
  setAuthUser,
  setTabQuotation,
  setTabInEmission,
  setTabEmitted,
  setPlansQuot,
  setPlansEmmit,
  setAuthUserCotiza,
};
