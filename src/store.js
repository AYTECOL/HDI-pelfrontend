import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

const initialState = {
    item: [],
};

const reducer = (state=initialState, action) => {
    if (action.type === "ACTION_TYPE") {
        return {
            ...state,
            item: action.item
        };
    }

    return state;
};

export default createStore(reducer, applyMiddleware(thunk));