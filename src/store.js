import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';

const initialState = {
    mapsOptions: {
        longitude: -74.0436118,
        latitude: 4.681545,
        options: {
            zoom: 20
        }
    },
    cotizacion: {
        number: "00000000",
        typeDocument: 1,
        state: 1,
        identification: {
            code: "36",
            value: "",
            name: "",
            lastname: "",
            businessname: "",
            city: "",
            address: "",
            addressadditional: "",
        }
    },

    continueButtonDisable: true,
    stateFormIdentificacion: 0,
    typeDocument: 1,
    showMap: false,
};

const reducer = (state = initialState, action) => {
    if (action.type === "SET_ADDRES_MAP") {
        return {
            ...state,
            mapsOptions: action.data
        }
    } else if (action.type === "ADD_IDENTIFICATIONS") {
        return {
            ...state,
            identifications: {identifications: action.data}
        }
    } else if (action.type === "NEXT_STEP_INDEX") {
        let className = state.validaridentificacion.className;
        let stateForm = state.stateForm + 1;
        return {
            ...state,
            continueButtonDisable: true,
            stateFormIdentificacion: stateForm
        }
    } else if (action.type === "DISABLE_BTN_CONTINUE") {
        return {
            ...state,
            continueButtonDisable: action.data
        }
    } else if (action.type === "NEXT_STEP_INDENTIFICATION") {
        return {
            ...state,
            stateFormIdentificacion: state.stateFormIdentificacion + action.data,
            continueButtonDisable: true,
        }
    } else if (action.type === "SAVE_IDENTIFICATION_VALUE") {
        return {
            ...state,
            cotizacion: {
                ...state.cotizacion,
                identification: {...state.cotizacion.identification, ...action.data},
            }
        }
    } else if (action.type === "SAVE_COTIZACION_NUMBER") {
        return {
            ...state,
            cotizacion: {
                ...state.cotizacion,
                number: action.data,
            }
        }
    } else if (action.type === "UPDATE_TYPE_DOC") {
        return {
            ...state,
            cotizacion: {
                ...state.cotizacion,
            },
            typeDocument: action.data,
        }
    } else if (action.type === "SET_MAP_SHOW") {
        return {
            ...state,
            showMap: action.data,
        }
    }
    return state;
};

export default createStore(reducer, applyMiddleware(thunk));