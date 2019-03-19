import React, {Component} from 'react';
import IdentificationsCities from '../../../../../services/IdentificationsCities';

import store from '../../../../../store';
import {saveCityStore, saveIdentificationValue} from '../../../../../actionCreators';

class AutocompleteCities extends Component {

    constructor(props) {
        super(props);
        this.state = {
            options: {
                cities: []
            },
            originalOptions: {
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

    async getOptions() {
        let data = await IdentificationsCities.get();
        this.setState({
            ...this.state,
            options: data,
            originalOptions: data,
        });
    }

    onBlur(v) {
        let empty = false;
        if (v == "") empty = true;
        setTimeout(
            function () {
                this.setState({
                    ...this.state,
                    toggle: false,
                    empty: empty
                });
            }.bind(this), 200);
    }

    saveOption(code, value) {
        let element = {
            name: "city",
            value: code
        };
        store.dispatch(saveIdentificationValue(element));
        this.setState({
            ...this.state,
            value: value
        });
    }

    searchData(value) {
        let optionsFilters = { cities: [] };
        this.state.originalOptions.cities.map((option, key) =>{
            let item = option.city;
            let search = item.toLowerCase().search(value.toLowerCase());
            if ( search !== -1 && search == 0 ){
                optionsFilters.cities[key] = option;
            }
        });

        this.setState({
            ...this.state,
            value: value,
            toggle: true,
            options: optionsFilters,
            empty: value == ""
        });
    }

    render() {
        return (
            <div className={"form-group autocomplete " + (this.state.empty ? 'error' : '')}>
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
                <small className="form-text only-errors">Por favor ingrese la Ciudad o Municipio del Hogar.</small>
                <ul className={(this.state.toggle ? 'show' : 'hide') + " list-items"}>
                    {this.state.options.cities.map(option =>
                        <li key={option.code_city} value={option.code_city}
                            onClick={(e) => {
                                this.saveOption(option.code_city, option.department);
                            }}
                        >{option.description}</li>
                    )}
                </ul>
            </div>
        );
    }
}

export default AutocompleteCities;



