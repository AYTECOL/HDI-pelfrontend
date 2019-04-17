import React from 'react';
import Table from './Table';
import ReactDOM from 'react-dom';
import {Provider} from "react-redux";
import store from "../../../store";
import {BrowserRouter as Router} from "react-router-dom";

it('test render Table', () => {
    const div = document.createElement('div');
    ReactDOM.render(
        <Provider store={store}>
            <Router>
                <Table/>
            </Router>
        </Provider>
        , div);
    ReactDOM.unmountComponentAtNode(div);
});