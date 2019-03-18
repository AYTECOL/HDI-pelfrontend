import React, { Component } from 'react';
import IdentificationsCities from '../../../../../services/IdentificationsCities';

import store from '../../../../../store';
import { saveCityStore } from '../../../../../actionCreators';

class AutocompleteCities extends Component {

    constructor(props) {
        super(props);
        this.state = {
            options: {
                cities: []
            },
            value: "",
            empty: false,
            idElement: "",
            toggle: false,
            onChange: null
        };

        this.getOptions();
    }

    async getOptions(){
        this.setState({
            ...this.state,
            options: await IdentificationsCities.get()
        });
    }

    onBlur(v){
        let empty = false;
        if (v == "") empty = true;
        setTimeout(
            function() {
                this.setState({
                    ...this.state,
                    toggle: false,
                    empty: empty
                });
            }.bind(this),150);
    }

    saveOption(code, value){
        store.dispatch(saveCityStore(code));
        this.setState({
            ...this.state,
            value: value
        });
    }

    searchData(value){
        this.setState({
            ...this.state,
            toggle: true,
            value: value
        });
    }

    render() {
        return (
            <div className={"form-group autocomplete " + (this.state.empty?'error':'')}>
                <label htmlFor="city">Ciudad o municipio del hogar</label>
                <input name="city" id="city" type="text" className="form-control"
                       autoComplete="off"
                       placeholder="Ingresa ciudad o municipio del h..."
                       value={this.state.value}
                       onBlur={(e) => {
                           this.onBlur(e.target.value);
                       }}
                       onChange={(e) => {
                           this.searchData(e.target.value);
                       }}
                />
                <small className="form-text only-errors">Por favor ingrese la Ciudad o Municipio del Hogar.
                </small>
                <ul className={(this.state.toggle?'show':'hide') + " list-items"}>
                    {this.state.options.cities.map(option =>
                        <li key={option.code_city} value={option.code_city}
                            onClick={(e) => {
                                this.saveOption(option.code_city, option.description);
                            }}
                        >{option.description}</li>
                    )}
                </ul>
            </div>
        );
    }
}

export default AutocompleteCities;



