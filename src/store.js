import {applyMiddleware, createStore} from 'redux';
import thunk from 'redux-thunk';

const initialState = {

    // Primer formulario identificacion
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
    disabledName: false,
    disabledLastName: false,
    cityDescription: "",
    continueButtonDisable: true,
    stateFormIdentificacion: 0,
    typeDocument: 1,
    showMap: false,
    showPopUp: false,

    // Segundo formulario Inmueble
    typeInmueble: 0,
    Inmueble: {
        numerodepisos: "",
        zona: "",
        refuerzo: "",
        anorefuerzo: "",
        anoconstruido: "",
        construidocon: "",
        cojuntocarrado: "",
        seguridad: {
            alarma: "",
            cajafuerte: "",
            puertascontroldomotico: "",
            puertasseguridadblindada: "",
            circuitocarradotv: "",
            vigilanciapermanente: "",
            reguladordeboltaje: "",
        },
        inmuebleasegudado: "",
        inmuebleasegudadovalor: "",
        contenidoasegudado: "",
        contenidoasegudadovalor: "",
    }
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case "SET_ADDRES_MAP":
            return {
                ...state,
                mapsOptions: action.data
            }
        case "ADD_IDENTIFICATIONS":
            return {
                ...state,
                identifications: {identifications: action.data}
            }
        case "NEXT_STEP_INDEX":
            let stateForm = state.stateForm + 1;
            return {
                ...state,
                continueButtonDisable: true,
                stateFormIdentificacion: stateForm
            }
        case "DISABLE_BTN_CONTINUE":
            return {
                ...state,
                continueButtonDisable: action.data
            }
        case "NEXT_STEP_INDENTIFICATION":
            return {
                ...state,
                stateFormIdentificacion: state.stateFormIdentificacion + action.data,
                continueButtonDisable: true,
            }
        case "SAVE_IDENTIFICATION_VALUE":
            return {
                ...state,
                cotizacion: {
                    ...state.cotizacion,
                    identification: {...state.cotizacion.identification, ...action.data},
                }
            }
        case "SAVE_COTIZACION_NUMBER":
            return {
                ...state,
                cotizacion: {
                    ...state.cotizacion,
                    number: action.data,
                }
            }
        case "UPDATE_TYPE_DOC":
            return {
                ...state,
                cotizacion: {
                    ...state.cotizacion,
                },
                typeDocument: action.data,
            }
        case "SET_MAP_SHOW":
            return {
                ...state,
                showMap: action.data,
            }
        case "SAVE_DESCRIPTION_CITY":
            return {
                ...state,
                cityDescription: action.data,
            }
        case "RESTORE_COTIZACION":
            return {
                ...state,
                cotizacion: action.data,
                typeDocument: action.data.typeDocument,
                stateFormIdentificacion: action.data.stateFormIdentificacion,
                showMap: action.data.showMap,
            }
        case "NEXT_STEP":
            return {
                ...state,
                cotizacion: {
                    ...state.cotizacion,
                    state: action.data
                },
            }
        case "TYPE_INMUEBLE":
            return {
                ...state,
                typeInmueble: action.data
            }
        case "SAVE_INMUEBLE_VALUE":
            return {
                ...state,
                Inmueble: {
                    ...state.Inmueble,
                    ...action.data,
                }
            }
        case "SHOW_POP_UP_IDENTIFICATION":
            return {
                ...state,
                showPopUp: action.data
            }
        case "DISABLE_NAME":
            return {
                ...state,
                disabledName: action.data
            }
        case "DISABLE_LASTNAME":
            return {
                ...state,
                disabledLastName: action.data
            }
    }
    return state;
};

export default createStore(reducer, applyMiddleware(thunk));