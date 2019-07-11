import React, {Component} from 'react';

import store from '../../../../../store';
import {saveInmuebleValue} from '../../../../../actions';
import Helpers from "../../../../../common/helpers/helpers/Helpers";

class Conjuntocerrado extends Component {

    constructor(props) {
        super(props);
        this.state = {
            error: false,
            show: false,
            active: 0
        };
    }

    componentDidMount() {
        this.unsubscribe = store.subscribe(async () => {
            let storeState = store.getState();
            let value = storeState.Inmueble.cojuntocerrado;
            if (this.state.active !== value) {
                this.setState({
                    ...this.state,
                    active: value,
                });
            }
        });
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    validateEmpty = e => event => {
        let error = false;
        if (e.value.length < 1) error = true;
        if (error === false) Helpers.removeClass(".cojuntocerrado", "error");
        store.dispatch(saveInmuebleValue(e));
        this.setState({
            ...this.state,
            error: error,
            active: e.data
        });
    };

    render() {
        return (
            <div className={"cojuntocerrado no-icon form-group " + this.state.error}>
                <label htmlFor="conjuntocerras">Está ubicado en conjunto cerrado</label>
                <ul className="select-item" id="conjuntocerras">
                    <li data="1"
                        className={((this.state.active === 1) ? 'active' : '')}
                        onClick={this.validateEmpty({
                            data: 1,
                            value: 1,
                            name: "cojuntocerrado"
                        })}
                    >Si
                    </li>
                    <li data="2"
                        className={((this.state.active === 2) ? 'active' : '')}
                        onClick={this.validateEmpty({
                            data: 2,
                            value: 2,
                            name: "cojuntocerrado"
                        })}
                    >No
                    </li>
                </ul>
            </div>
        );
    }
}

export default Conjuntocerrado;



