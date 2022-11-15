/* eslint-disable no-case-declarations */
import MobileContents from '../../components/cotizaciones/inmueble/forms/MobileContents';
import OtherQuestions from '../../components/cotizaciones/inmueble/forms/OtherQuestions';
import * as actionsTypes from '../constants';
const initialState = {
  loading: true,
  // Primer formulario identificacion
  mapsOptions: {
    longitude: 0,
    latitude: 0,
    options: {
      zoom: 20,
    },
  },
  cotizacion: {
    number: '00000000',
    typeDocument: 1,
    state: 1,
    identification: {
      code: '36',
      value: '',
      name: '',
      lastname: '',
      businessname: '',
      city: '',
      department: '',
      address: '',
      addressadditional: '',
      object: {},
    },
  },
  cityDescription: '',
  continueButtonDisable: true,
  stateFormIdentificacion: 0,
  typeDocument: 1,
  showMap: false,
  prospect: {},

  // Segundo formulario Inmueble
  typeInmueble: 0,
  Inmueble: {
    validate: false,
    type_risk: '',
    type_risk_id: '',
    pisonumero: '',
    numerodepisos: '',
    zona: '',
    refuerzo: '',
    anorefuerzo: '',
    anoconstruido: '',
    construidocon: '',
    cojuntocerrado: '',
    seguridad: {
      alarma: '',
      cajafuerte: '',
      puertascontroldomotico: '',
      puertasseguridadblindada: '',
      circuitocerradotv: '',
      vigilanciapermanente: '',
      reguladordevoltaje: '',
    },
    inmuebleasegudado: 1,
    inmuebleasegudadovalor: '',
    contenidoasegudado: 0,
    contenidoasegudadovalor: '',
    inmuebleasegudadojoyas: 0,
    inmuebleasegudadojoyasvalor: '',
    inmuebleasegudadoobras: 0,
    inmuebleasegudadoobrasvalor: '',
    inmuebleasegudadotelefonos: 0,
    inmuebleasegudadotelefonosvalor: '',
    [MobileContents.nameModel]: 0,
    [MobileContents.nameModelValue]: '',
    [OtherQuestions.nameModel]: 1,
    [OtherQuestions.nameModelValue]: [],
  },

  // tercer formulario Cotizacion
  indexPlan: '',

  // Dada Services
  Allfloors: [],
  allInsurableLimits: [],
  AllPlans: [],
  validPlans: true,
  loadingPlansPerspective: {},
  originalStore: {},
  attachedFile: false,
  exceptionSarlaft: false,
};

initialState.originalStore = initialState;

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionsTypes.SET_ADDRES_MAP:
      return {
        ...state,
        mapsOptions: action.data,
      };
    case actionsTypes.ADD_IDENTIFICATIONS:
      return {
        ...state,
        identifications: { identifications: action.data },
      };
    case actionsTypes.NEXT_STEP_INDEX:
      return {
        ...state,
        continueButtonDisable: true,
        stateFormIdentificacion: state.stateForm + 1,
      };
    case actionsTypes.DISABLE_BTN_CONTINUE:
      return {
        ...state,
        continueButtonDisable: action.data,
      };
    case actionsTypes.NEXT_STEP_INDENTIFICATION:
      return {
        ...state,
        stateFormIdentificacion: state.stateFormIdentificacion + action.data,
        continueButtonDisable: true,
      };
    case actionsTypes.SAVE_IDENTIFICATION_VALUE:
      return {
        ...state,
        cotizacion: {
          ...state.cotizacion,
          identification: {
            ...state.cotizacion.identification,
            ...action.data,
          },
        },
      };
    case actionsTypes.SAVE_COTIZACION_NUMBER:
      return {
        ...state,
        cotizacion: {
          ...state.cotizacion,
          number: action.data,
        },
      };
    case actionsTypes.UPDATE_TYPE_DOC:
      return {
        ...state,
        cotizacion: {
          ...state.cotizacion,
        },
        typeDocument: action.data,
      };
    case actionsTypes.SET_MAP_SHOW:
      return {
        ...state,
        showMap: action.data,
      };
    case actionsTypes.SAVE_DESCRIPTION_CITY:
      return {
        ...state,
        cityDescription: action.data,
      };
    case actionsTypes.RESTORE_COTIZACION:
      return {
        ...state,
        cotizacion: action.data,
        typeDocument: action.data.typeDocument,
        stateFormIdentificacion: action.data.stateFormIdentificacion,
        showMap: action.data.showMap,
        mapsOptions: action.data.mapsOptions,
      };
    case actionsTypes.RESTORE_COTIZACION_RISK:
      return {
        ...state,
        typeInmueble: action.data.type_risk,
        Inmueble: action.data,
      };
    case actionsTypes.NEXT_STEP:
      return {
        ...state,
        cotizacion: {
          ...state.cotizacion,
          state: action.data,
        },
      };
    case actionsTypes.TYPE_INMUEBLE:
      return {
        ...state,
        typeInmueble: action.data,
      };
    case actionsTypes.SAVE_INMUEBLE_VALUE:
      return {
        ...state,
        Inmueble: {
          ...state.Inmueble,
          ...action.data,
        },
      };
    case actionsTypes.SAVE_INMUEBLE_VALUE_SEGURIDAD:
      return {
        ...state,
        Inmueble: {
          ...state.Inmueble,
          seguridad: {
            ...state.Inmueble.seguridad,
            ...action.data,
          },
        },
      };
    case actionsTypes.SAVE_ALL_FLOORS:
      return {
        ...state,
        Allfloors: action.data,
      };
    case actionsTypes.SAVE_ALL_INSURABLE_LIMITS:
      return {
        ...state,
        allInsurableLimits: action.data,
      };
    case actionsTypes.SAVE_ALL_PLANS:
      return {
        ...state,
        AllPlans: action.data,
      };
    case actionsTypes.VALID_PLANS:
      return {
        ...state,
        validPlans: action.data,
      };
    case actionsTypes.LOADING_PLANS_PERSPECTIVE:
      const { loadingPlansPerspective } = { ...state };
      /**
       * @type {import('./actions').LoadingPlanPerspective}
       */
      const data = action.data;
      return {
        ...state,
        loadingPlansPerspective: {
          ...loadingPlansPerspective,
          [data.plan]: data.state,
        },
      };
    case actionsTypes.INDEX_PLAN_SELECTED:
      return {
        ...state,
        indexPlan: action.data,
      };
    case actionsTypes.LOADING:
      return {
        ...state,
        loading: action.data,
      };
    case actionsTypes.SAVE_PROSPECT:
      return {
        ...state,
        prospect: action.data,
      };
    case actionsTypes.ATTACHED_FILE:
      return {
        ...state,
        attachedFile: action.data,
      };
    case actionsTypes.RESET_STORE:
      return {
        ...state.originalStore,
      };
    case actionsTypes.SET_EXCEPTION_SARLAFT:
      return {
        ...state,
        exceptionSarlaft: action.data,
      };

    default:
      return state;
  }
};

export default reducer;
