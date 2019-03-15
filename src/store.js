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
            zoom: 8
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
    if (action.type === "SAVE_IDENTIFICATION_VALUE") {
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