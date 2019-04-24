import React, {Component} from 'react';

import store from '../../../../../store';
import {saveInmuebleValue} from '../../../../../actionCreators';
import './Zona.scss';
import Zones from "../../../../../services/Zones";
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
        let zonas = await Zones.get();
        this.setState({
            ...this.state,
            zonas: zonas,
        });
    }

    saveData(e) {
        store.dispatch(saveInmuebleValue(e));
        Helpers.removeClass(".zona", "error");
        this.setState({
            ...this.state,
            active: e.value
        });
    }

    render() {
        return (
            <div className={"zona no-icon form-group " + this.state.error}>
                <label htmlFor="zona">El inmueble está ubicado en zona</label>
                <ul className="select-item">
                    {this.state.zonas.map((option, key) =>
                        <li key={option.zoneCode}
                            className={parseInt(this.state.active) === parseInt(option.zoneCode) ? 'active' : ''}
                            onClick={(e) => {
                                this.saveData({
                                    value: parseInt(option.zoneCode),
                                    name: "zona"
                                });
                            }}>
                            {option.answer}
                        </li>
                    )}
                </ul>
            </div>
        );
    }
}

export default Zona;



