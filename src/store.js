import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';

const initialState = {
    validaridentificacion: {
        className: 'hide'
    },
    identifications: {
        identifications: []
    },
    cotizacionErrors: {
        identification_type: '',
        identification_value: ''
    },
    cotizacion: {
        identification: {
            code: "",
            value: ""
        }
    }
};

const reducer = (state = initialState, action) => {
    if (action.type === "VALIDARIDENTIFICACION_TOOGLE") {
        return {
            ...state,
            validaridentificacion: {className: action.data}
        }
    } else if (action.type === "ADD_IDENTIFICATIONS") {
        return {
            ...state,
            identifications: {identifications: action.data}
        }
    } else if (action.type === "NEXT_STEP_INDEX") {
        return validateIdentification(state);
    } else if (action.type === "SAVE_IDENTIFICATION_TYPE") {
        return {
            ...state,
            cotizacion: {
                identification: { ...state.cotizacion.identification,  code: action.data },
            }
        }
    } else if (action.type === "SAVE_IDENTIFICATION_VALUE") {
        return {
            ...state,
            cotizacion: {
                identification: { ...state.cotizacion.identification, value: action.data },
            }
        }
    }
    return state;
};

const validateIdentification = (state) => {
    let errors = {};
    if (state.cotizacion.identification.code == "") {
        errors.identification_type = "error";
    }else{
        errors.identification_type = "";
    }
    if( state.cotizacion.identification.value == "" ){
        errors.identification_value = "error";
    }else{
        errors.identification_value = "";
    }
    return {
        ...state,
        cotizacionErrors: {
            ...errors
        }
    }
};

export default createStore(reducer, applyMiddleware(thunk));