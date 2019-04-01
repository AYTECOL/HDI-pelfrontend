import React, {Component} from 'react';

import store from '../../../../../store';
import {saveInmuebleValue} from '../../../../../actionCreators';
import './Zona.scss';

class Zona extends Component {

    constructor(props) {
        super(props);
        this.state = {
            error: false,
            active: "0"
        };
    }

    saveData(e) {
        store.dispatch(saveInmuebleValue(e));
        this.setState({
            ...this.state,
            active: e.value
        });
    }

    render() {
        return (
            <div className={"form-group " + this.state.error}>
                <label htmlFor="doc-type-value">El inmueble está ubicado en zona</label>
                <ul className="select-item">
                    <li className={(this.state.active === "1") ? 'active' : ''}
                        onClick={(e) => {
                            this.saveData({
                                value: "1",
                                name: "zona"
                            });
                        }}
                    >Urbana
                    </li>
                    <li className={(this.state.active === "2") ? 'active' : ''}
                        onClick={(e) => {
                            this.saveData({
                                value: "2",
                                name: "zona"
                            });
                        }}
                    >Rural
                    </li>
                </ul>
            </div>
        );
    }
}

export default Zona;



