import React from 'react';
import Home from './Home';
import ReactDOM from 'react-dom';
import {Provider} from "react-redux";
import store from "../../store";
import {BrowserRouter as Router} from "react-router-dom";

it('test render Home', () => {
    const div = document.createElement('div');
    ReactDOM.render(
        <Provider store={store}>
            <Router>
                <Home/>
            </Router>
        </Provider>
        , div);
    ReactDOM.unmountComponentAtNode(div);
});