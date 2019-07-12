import React, {Component} from 'react';

import store from '../../../../../store';
import {saveInmuebleValue} from '../../../../../actions';
import AllFloors from "../../../../../services/Allfloors";
import Helpers from "../../../../../common/helpers/helpers/Helpers";

class Ubicadopiso extends Component {

    constructor(props) {
        super(props);
        this.state = {
            error: false,
            floors: []
        };
    }

    componentDidMount() {
        this.getFloors();
        this.unsubscribe = store.subscribe(async () => {
            let storeState = store.getState();
            let value = storeState.Inmueble.pisonumero;
            if (this.state.value !== value) {
                this.setState({
                    ...this.state,
                    value: value,
                });
            }
        });
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    async getFloors() {
        let allFloors = await AllFloors.get();
        this.setState({
            ...this.state,
            floors: allFloors,
        });
    }

    validateEmpty = e => {
        if (e === 'notempty') return;
        e = e.target;
        let error = false;
        if (e.value.length < 1) error = true;
        if (error === false) Helpers.removeClass(".pisonumero", "error");
        this.setState({
            ...this.state,
            error: error
        });
        store.dispatch(saveInmuebleValue(e));
    };

    render() {
        return (
            <div className={"pisonumero input-select form-group " + ((this.state.error) ? 'error' : '')}>
                <label htmlFor="pisonumero">Piso donde se encuentra ubicado</label>
                <select name="pisonumero" id="pisonumero" className="form-control" value={this.state.value}
                        onBlur={this.validateEmpty}
                        onChange={this.validateEmpty}>
                    <option value="">Seleccione</option>
                    {this.state.floors.map(option =>
                        <option key={option.floorCode} value={option.floorCode}>{option.answer}</option>
                    )}
                </select>
            </div>
        );
    }
}

export default Ubicadopiso;



