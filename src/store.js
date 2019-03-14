import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';

const initialState = {
    validaridentificacion: {
        className: 'hide'
    },
    stateForm: 0,
    identifications: {
        identifications: []
    },
    cotizacionErrors: {
        identification_code: '',
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
    let errors = {
        identification_type: "",
        identification_value: "",
        status: state.stateForm + 1
    };
    console.log(state.stateForm);
    for(let item in state.cotizacion.identification ){
        console.log(item);
        if (state.cotizacion.identification[item] == "") {
            errors['identification_'+item] = "error";
            errors.status = state.stateForm;
        }
    }
    return {
        ...state,
        cotizacionErrors: {
            ...errors
        },
        stateForm: errors.status
    }
};

export default createStore(reducer, applyMiddleware(thunk));