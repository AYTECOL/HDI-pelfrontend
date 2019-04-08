import React, {Component} from 'react';

import store from '../../../../../store';
import {saveInmuebleValue} from '../../../../../actionCreators';
import AllFloors from "../../../../../services/Allfloors";

class Ubicadopiso extends Component {

    _isMounted = false;

    constructor(props) {
        super(props);
        this.state = {
            error: false,
            floors: []
        };
        if (this._isMounted) {
            store.subscribe(async () => {
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
    }

    componentDidMount() {
        this._isMounted = true;
        this.getFloors();
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    async getFloors() {
        if (this._isMounted) {
            let allFloors = await AllFloors.get();
            this.setState({
                ...this.state,
                floors: allFloors,
            });
        }
    }

    validateEmpty(e) {
        let error = false;
        if (e.value.length < 1) error = true;
        this.setState({
            ...this.state,
            error: error
        });
        store.dispatch(saveInmuebleValue(e));
    }

    render() {
        return (
            <div className={"input-select form-group " + ((this.state.error) ? 'error' : '')}>
                <label htmlFor="doc-type-value">Piso donde se encuentra ubicado</label>
                <select name="pisonumero" className="form-control" value={this.state.value}
                        onBlur={(e) => {
                            this.validateEmpty(e.target);
                        }}
                        onChange={(e) => {
                            this.validateEmpty(e.target);
                        }}
                >
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



