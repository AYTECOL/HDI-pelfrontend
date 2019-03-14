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
        typeDocument: 1,
        identification: {
            code: "01",
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
    }else if (action.type === "SAVE_IDENTIFICATION_VALUE") {
        return {
            ...state,
            cotizacion: {
                ...state.cotizacion,
                identification: {...state.cotizacion.identification, ...action.data },
            }
        }
    }
    return state;
};

const validateIdentification = (state) => {
    let errors = {
        status: 1
    };
    // Valida Si los campos no estan vacios
    let i = 0;
    for (let item in state.cotizacion.identification) {
        if (state.cotizacion.identification[item] == "") {
            errors['identification_' + item] = "error";
            errors.status = 0;
        }
        i++;
        if (state.stateForm == 0 && i > 1) break;
    }

    //Valida el valor contra el tipo de documento
    let typeDocument = state.cotizacion.typeDocument;
    let v = state.cotizacion.identification.value;
    switch (state.cotizacion.identification.code) {
        // Valida todos los documentos persona natural
        case "01":
        case "02":
        case "06":
        case "05":
        case "07":
            if (v.length < 5 || v.length >= 15 || isNaN(v)) {
                errors.identification_value = "error";
                errors.status = 0;
            }
            typeDocument = 1;
            break;
        // Valida solo el nit
        case "08":
            let s = v.split("-");
            if ( v.indexOf("-") == -1 || isNaN(parseInt(v)) ||
                s[0].length < 7 || s[1].length < 1 || isNaN(s[0]) || isNaN(s[1])
            ){
                errors.identification_value = "error";
                errors.status = 0;
            }
            typeDocument = 2;
            break;
    }

    // Valida si los primero campos cumplen
    let step;
    let continueButtonDisable = false;
    if (errors.status == 1 && (state.stateForm == 0 || state.stateForm == 1)) {
        step = 1;
        continueButtonDisable = true;
    } else {
        if (state.stateForm == 0) {
            step = 0;
        } else {
            step = 1;
        }
    }
    //Controla el boton de continuar
    if (state.stateForm == 1 && errors.status == 0) continueButtonDisable = true;

    return {
        ...state,
        cotizacionErrors: {
            ...errors
        },
        stateForm: step,
        cotizacion: {
            continueButtonDisable: continueButtonDisable,
            identification: {...state.cotizacion.identification},
            typeDocument: typeDocument
        }
    }
};

export default createStore(reducer, applyMiddleware(thunk));