import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';

const initialState = {
<<<<<<< HEAD
    stateFormIdentificacion: 0,

=======
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
            zoom: 20
        }
    },
    cotizacionExclude: [
        'identification_addressadditional'
    ],
    continueButtonDisable: true,
>>>>>>> 2ca8784... [PEL-2.4]Startup Maps component
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
    },

    continueButtonDisable: true,
    disabledNumberIdentification: false
};

const reducer = (state = initialState, action) => {
<<<<<<< HEAD
    if (action.type === "SAVE_IDENTIFICATION_VALUE") {
=======
    if (action.type === "VALIDARIDENTIFICACION_TOOGLE") {
        return {
            ...state,
            validaridentificacion: {className: action.data}
        }
    } else if (action.type === "SET_ADDRES_MAP") {
        console.log(action.data);
        console.log("_______________________________")
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
>>>>>>> 996af23... [PELH-2.2] Send google places request
        return {
            ...state,
            cotizacion: {
                ...state.cotizacion,
                identification: {...state.cotizacion.identification, ...action.data},
            }
        }
    }else if( action.type === "DISABLE_BTN_CONTINUE" ){
        return {
            ...state,
            continueButtonDisable: action.data
        }
    }else if( action.type === "NEXT_STEP_INDENTIFICATION" ){
        return {
            ...state,
            stateFormIdentificacion: state.stateFormIdentificacion + action.data
        }
    }
    return state;
};

export default createStore(reducer, applyMiddleware(thunk));