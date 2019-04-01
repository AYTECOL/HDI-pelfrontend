import React, {Component} from 'react';

import store from '../../../../../store';
import {saveInmuebleValue} from '../../../../../actionCreators';

class Conjuntocerrado extends Component {


    constructor(props) {
        super(props);
        this.state = {
            error: false,
            show: false,
            active: 0
        };
    }

    validateEmpty(e) {
        let error = false;
        if (e.value.length < 1) error = true;
        store.dispatch(saveInmuebleValue(e));
        this.setState({
            ...this.state,
            error: error,
            active: e.data
        });
    }

    render() {
        return (
            <div className={"form-group " + this.state.error}>
                <label htmlFor="doc-type-value">Está ubicado en conjunto cerrado</label>
                <ul className="select-item">
                    <li data="1"
                        className={((this.state.active === 1) ? 'active' : '')}
                        onClick={(e) => {
                            this.validateEmpty({
                                data: 1,
                                value: "Si",
                                name: "cojuntocerrado"
                            });
                        }}
                    >Si
                    </li>
                    <li data="2"
                        className={((this.state.active === 2) ? 'active' : '')}
                        onClick={(e) => {
                            this.validateEmpty({
                                data: 2,
                                value: "No",
                                name: "cojuntocerrado"
                            });
                        }}
                    >No
                    </li>
                </ul>
            </div>
        );
    }
}

export default Conjuntocerrado;



