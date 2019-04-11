import React from 'react';
import Header from './Header';
import ReactDOM from 'react-dom';
import {Provider} from "react-redux";
import store from "../../../store";
import {BrowserRouter as Router} from "react-router-dom";

it('test render Header', () => {
    const div = document.createElement('div');
    ReactDOM.render(
        <Provider store={store}>
            <Router>
                <Header/>
            </Router>
        </Provider>, div);
    ReactDOM.unmountComponentAtNode(div);
});