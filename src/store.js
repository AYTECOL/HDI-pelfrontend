import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';

const initialState = {
    stateFormIdentificacion: 0,

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