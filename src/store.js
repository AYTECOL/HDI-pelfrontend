import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';

const initialState = {
    autoCompleteCuidad: false,
    mapsOptions:{
        longitude: -74.0436118,
        latitude: 4.681545,
        options:{
            zoom: 20
        }
    },
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
    disabledNumberIdentification: false,
    stateFormIdentificacion: 0,
};

const reducer = (state = initialState, action) => {
    if (action.type === "SET_ADDRES_MAP") {
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
        return {
            ...state,
            continueButtonDisable: true,
            stateForm: stateForm,
            validaridentificacion: {
                ...state.validaridentificacion,
                className: className
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