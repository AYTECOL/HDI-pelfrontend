import { applyMiddleware, createStore, compose } from 'redux';
import thunk from 'redux-thunk';
import MobileContents from './components/cotizaciones/inmueble/forms/MobileContents';
import OtherQuestions from './components/cotizaciones/inmueble/forms/OtherQuestions';

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
  if (action.type === 'SET_ADDRES_MAP') {
    return {
      ...state,
      mapsOptions: action.data,
    };
  } else if (action.type === 'ADD_IDENTIFICATIONS') {
    return {
      ...state,
      identifications: { identifications: action.data },
    };
  } else if (action.type === 'NEXT_STEP_INDEX') {
    let stateForm = state.stateForm + 1;
    return {
      ...state,
      continueButtonDisable: true,
      stateFormIdentificacion: stateForm,
    };
  } else if (action.type === 'DISABLE_BTN_CONTINUE') {
    return {
      ...state,
      continueButtonDisable: action.data,
    };
  } else if (action.type === 'NEXT_STEP_INDENTIFICATION') {
    return {
      ...state,
      stateFormIdentificacion: state.stateFormIdentificacion + action.data,
      continueButtonDisable: true,
    };
  } else if (action.type === 'SAVE_IDENTIFICATION_VALUE') {
    return {
      ...state,
      cotizacion: {
        ...state.cotizacion,
        identification: { ...state.cotizacion.identification, ...action.data },
      },
    };
  } else if (action.type === 'SAVE_COTIZACION_NUMBER') {
    return {
      ...state,
      cotizacion: {
        ...state.cotizacion,
        number: action.data,
      },
    };
  } else if (action.type === 'UPDATE_TYPE_DOC') {
    return {
      ...state,
      cotizacion: {
        ...state.cotizacion,
      },
      typeDocument: action.data,
    };
  } else if (action.type === 'SET_MAP_SHOW') {
    return {
      ...state,
      showMap: action.data,
    };
  } else if (action.type === 'SAVE_DESCRIPTION_CITY') {
    return {
      ...state,
      cityDescription: action.data,
    };
  } else if (action.type === 'RESTORE_COTIZACION') {
    return {
      ...state,
      cotizacion: action.data,
      typeDocument: action.data.typeDocument,
      stateFormIdentificacion: action.data.stateFormIdentificacion,
      showMap: action.data.showMap,
      mapsOptions: action.data.mapsOptions,
    };
  } else if (action.type === 'RESTORE_COTIZACION_RISK') {
    return {
      ...state,
      typeInmueble: action.data.type_risk,
      Inmueble: action.data,
    };
  } else if (action.type === 'NEXT_STEP') {
    return {
      ...state,
      cotizacion: {
        ...state.cotizacion,
        state: action.data,
      },
    };
  } else if (action.type === 'TYPE_INMUEBLE') {
    return {
      ...state,
      typeInmueble: action.data,
    };
  } else if (action.type === 'SAVE_INMUEBLE_VALUE') {
    return {
      ...state,
      Inmueble: {
        ...state.Inmueble,
        ...action.data,
      },
    };
  } else if (action.type === 'SAVE_INMUEBLE_VALUE_SEGURIDAD') {
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
  } else if (action.type === 'SAVE_ALL_FLOORS') {
    return {
      ...state,
      Allfloors: action.data,
    };
  } else if (action.type === 'SAVE_ALL_INSURABLE_LIMITS') {
    return {
      ...state,
      allInsurableLimits: action.data,
    };
  } else if (action.type === 'SAVE_ALL_PLANS') {
    return {
      ...state,
      AllPlans: action.data,
    };
  } else if (action.type === 'VALID_PLANS') {
    return {
      ...state,
      validPlans: action.data,
    };
  } else if (action.type === 'LOADING_PLANS_PERSPECTIVE') {
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
  } else if (action.type === 'INDEX_PLAN_SELECTED') {
    return {
      ...state,
      indexPlan: action.data,
    };
  } else if (action.type === 'LOADING') {
    return {
      ...state,
      loading: action.data,
    };
  } else if (action.type === 'SAVE_PROSPECT') {
    return {
      ...state,
      prospect: action.data,
    };
  } else if (action.type === 'ATTACHED_FILE') {
    return {
      ...state,
      attachedFile: action.data,
    };
  } else if (action.type === 'RESET_STORE') {
    return {
      ...state.originalStore,
    };
  } else if (action.type === 'SET_EXCEPTION_SARLAFT') {
    return {
      ...state,
      exceptionSarlaft: action.data,
    };
  }
  return state;
};

const { NODE_ENV } = process.env;
const composeEnhancers =
  NODE_ENV === 'development' &&
  typeof window === 'object' &&
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
      })
    : compose;

const enhancer = composeEnhancers(
  applyMiddleware(thunk)
  // other store enhancers if any
);
export default createStore(reducer, enhancer);
