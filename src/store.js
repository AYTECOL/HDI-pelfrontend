import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

const initialState = {
    validaridentificacion: {
        className: 'hide'
    },
    identifications: {}
};

const reducer = (state=initialState, action) => {
    if (action.type === "ALIDARIDENTIFICACION_TOOGLE") {
        return {
            ...state,
            validaridentificacion: { className: action.data }
        }
    }


    return state;
};

export default createStore(reducer, applyMiddleware(thunk));