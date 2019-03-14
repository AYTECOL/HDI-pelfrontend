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
        identification_value: '',
        identification_name: '',
        identification_lastname: '',
        identification_city: '',
        identification_address: '',
        identification_address_additional: '',
    },
    cotizacion: {
        continueButtonDisable: false,
        identification: {
            code: "",
            value: "",
            name: "",
            lastname: "",
            city: "",
            address: "",
            address_additional: "",
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
            cotizacion: { identification: { ...state.cotizacion.identification,  code: action.data } }
        }
    } else if (action.type === "SAVE_IDENTIFICATION_VALUE") {
        return {
            ...state,
            cotizacion: { identification: { ...state.cotizacion.identification, ...action.data } }
        }
    }
    return state;
};

const validateIdentification = (state) => {
    let errors = {
        identification_type: "",
        identification_value: "",
        status: 1
    };
    let i = 0;
    for(let item in state.cotizacion.identification ){
        if (state.cotizacion.identification[item] == "") {
            errors['identification_'+item] = "error";
            errors.status = 0;
        }
        i++;
        if ( state.stateForm == 0 && i > 1 ) break;
    }
    let step;
    let continueButtonDisable = false;
    // Valida si los primero campos cumplen
    if (errors.status == 1 && (state.stateForm == 0 || state.stateForm == 1) ){
        step = 1;
        continueButtonDisable = true;
    }else{
        if ( state.stateForm == 0 ){
            step = 0;
        }else{
            step = 1;
        }
    }
    //Controla el boton de continuar
    if (state.stateForm == 1 && errors.status == 0){
        continueButtonDisable = true;
    }
    return {
        ...state,
        cotizacionErrors: {
            ...errors
        },
        stateForm: step,
        cotizacion: {
            continueButtonDisable: continueButtonDisable,
            identification: { ...state.cotizacion.identification }
        }
    }
};

export default createStore(reducer, applyMiddleware(thunk));