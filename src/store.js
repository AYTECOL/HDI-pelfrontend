import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';

const initialState = {
    autoCompleteCuidad: false,
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
        identification_businessname: '',
        identification_city: '',
        identification_address: '',
        identification_addressadditional: '',
    },
    mapsOptions:{
        longitude: -74.0436118,
        latitude: 4.681545,
        options:{
            zoom: 8
        }
    },
    cotizacionExclude: [
        'identification_addressadditional'
    ],
    continueButtonDisable: true,
    cotizacion: {
        typeDocument: 1,
        identification: {
            code: "01",
            value: "",
            name: "",
            lastname: "",
            businessname: "",
            city: "",
            address: "",
            addressadditional: "",
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
        let className = state.validaridentificacion.className;
        let stateForm = state.stateForm + 1;
        // Abre el popup
        //if (state.stateForm == 0) {
        //  className = "show";
        //  stateForm--;
        //}
        return {
            ...state,
            continueButtonDisable: true,
            stateForm: stateForm,
            validaridentificacion: {
                ...state.validaridentificacion,
                className: className
            }
        }
    } else if (action.type === "VALIDATE_IDENTIFICATION_VALUE") {
        return validateIdentification(state, action.data);
    } else if (action.type === "SAVE_IDENTIFICATION_VALUE") {
        return {
            ...state,
            cotizacion: {
                ...state.cotizacion,
                identification: {...state.cotizacion.identification, ...action.data},
            }
        }
    }else if( action.type === "TOOGLE_AUTOCOMPLETE_CIUDAD" ){
        return {
            ...state,
            autoCompleteCuidad: !state.autoCompleteCuidad
        }
    }
    return state;
};

const validateIdentification = (state, name) => {
    let errors = {
        status: 1
    };

    // Quita el estado de error para natural o juridica
    let typeDocument = state.cotizacion.typeDocument;
    if (typeDocument == 2) state.cotizacionExclude.push('identification_lastname', 'identification_name');
    if (typeDocument == 1) state.cotizacionExclude.push('identification_businessname');

    // Valida Si los campos no estan vacios
    let i = 0;
    for (let item in state.cotizacion.identification) {
        if (state.cotizacion.identification[item] == "" && state.cotizacionExclude.indexOf('identification_' + item) == -1) {
            errors.status = 0;
        }
        i++;
        if (state.stateForm == 0 && i > 1) break;
    }

    if (state.cotizacion.identification[name] == "" && state.cotizacionExclude.indexOf('identification_' + name) == -1) {
        errors['identification_' + name] = "error";
    } else {
        errors['identification_' + name] = "";
    }

    //Valida el valor contra el tipo de documento
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
            } else {
                errors.identification_value = "";
            }
            typeDocument = 1;
            break;
        // Valida solo el nit
        case "08":
            let s = v.split("-");
            if (v.indexOf("-") == -1 || isNaN(parseInt(v)) ||
                s[0].length < 7 || s[1].length < 1 || isNaN(s[0]) || isNaN(s[1])
            ) {
                errors.identification_value = "error";
                errors.status = 0;
            } else {
                errors.identification_value = "";
            }
            typeDocument = 2;
            break;
    }

    let continueButtonDisable = false;
    //Controla el boton de continuar
    if (state.stateForm == 0 && errors.status == 0) continueButtonDisable = true;
    if (state.stateForm == 1 && errors.status == 0) continueButtonDisable = true;

    delete errors.status;
    return {
        ...state,
        cotizacionErrors: {
            ...state.cotizacionErrors,
            ...errors
        },
        continueButtonDisable: continueButtonDisable,
        cotizacion: {
            identification: {...state.cotizacion.identification},
            typeDocument: typeDocument
        }
    }
};

export default createStore(reducer, applyMiddleware(thunk));