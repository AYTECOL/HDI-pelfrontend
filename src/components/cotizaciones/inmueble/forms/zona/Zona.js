import React, {Component} from 'react';

import store from '../../../../../store';
import {saveInmuebleValue} from '../../../../../actions';
import './Zona.scss';
import AllPropertiesZones from "../../../../../services/AllPropertiesZones";
import Helpers from "../../../../../common/helpers/helpers/Helpers";

class Zona extends Component {

    constructor(props) {
        super(props);
        this.state = {
            error: false,
            active: 0,
            zonas: []
        };

        this.getZones();

        store.subscribe(async () => {
            let storeState = store.getState();
            let value = storeState.Inmueble.zona;
            if (this.state.active !== value) {
                this.setState({
                    ...this.state,
                    active: value,
                });
            }
        });
    }

    async getZones() {
        let zonas = await AllPropertiesZones.get();
        this.setState({
            ...this.state,
            zonas: zonas,
        });
    }

    saveData = e => event => {
        store.dispatch(saveInmuebleValue(e));
        Helpers.removeClass(".zona", "error");
        this.setState({
            ...this.state,
            active: e.value
        });
        Helpers.updatePdfInfo({
            [e.name]: e.text
        });
    };

    render() {
        return (
            <div className={"zona no-icon form-group " + this.state.error}>
                <label htmlFor="zona">El inmueble está ubicado en zona</label>
                <ul className="select-item">
                    {this.state.zonas.map((option, key) =>
                        <li key={option.zoneCode}
                            className={parseInt(this.state.active) === parseInt(option.zoneCode) ? 'active' : ''}
                            onClick={this.saveData({
                                value: parseInt(option.zoneCode),
                                name: "zona",
                                text: option.answer
                            })}>
                            {option.answer}
                        </li>
                    )}
                </ul>
            </div>
        );
    }
}

export default Zona;



