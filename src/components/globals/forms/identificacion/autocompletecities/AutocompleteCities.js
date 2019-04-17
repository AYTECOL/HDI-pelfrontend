import React, {Component} from 'react';
import IdentificationsCities from '../../../../../services/IdentificationsCities';

import store from '../../../../../store';
import {saveDescriptionCity, saveIdentificationValue} from '../../../../../actionCreators';

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
            onChange: null,
            valueLoadedCity: 0,
            valueLoadedDepartment: 0,
        };

        this.getOptions();
        store.subscribe(() => {
            let storeState = store.getState();
            let city = storeState.cotizacion.identification.city;
            let department = storeState.cotizacion.identification.department;
            if( city !== this.state.valueLoadedCity || department !== this.state.valueLoadedDepartment ) {
                this.setState({
                    ...this.state,
                    valueLoadedCity: city,
                    valueLoadedDepartment: department,
                });
            }
        });
    }

    async getOptions() {
        let data = await IdentificationsCities.get();
        this.setState({
            ...this.state,
            options: data,
            originalOptions: data
        });
        setTimeout(function () {
            this.getTextById();
        }.bind(this), 300);
    }

    getTextById(){
        let value = "";
        for (let i = 0; i < this.state.options.cities.length; i++) {
            let d = this.state.options.cities[i];
            if (this.state.valueLoadedCity === parseInt(d.code_city) && this.state.valueLoadedDepartment === parseInt(d.code_department)) {
                value = d.department;
                break;
            }
        }
        this.setState({
            ...this.state,
            value: value
        });
    }

    onBlur(v) {
        let empty = false;
        if (v === "") empty = true;
        setTimeout(function () {
            this.setState({
                ...this.state,
                toggle: false,
                empty: empty
            });
        }.bind(this), 200);
    }

    saveOption(code, value, description, codeDepartment) {
        setTimeout(function () {
            store.dispatch(saveIdentificationValue({
                name: "city",
                value: code
            }));
            store.dispatch(saveIdentificationValue({
                name: "department",
                value: codeDepartment
            }));
            store.dispatch(saveDescriptionCity(description));
            this.setState({
                ...this.state,
                value: value,
                empty: false
            });
        }.bind(this), 200);
    }

    searchData(value) {
        let optionsFilters = {cities: []};
        this.state.originalOptions.cities.map((option, key) => {
            let item = option.city;
            let search = item.toLowerCase().search(value.toLowerCase());
            if (search !== -1 && search === 0) {
                optionsFilters.cities[key] = option;
            }
            return true;
        });

        this.setState({
            ...this.state,
            value: value,
            toggle: true,
            options: optionsFilters,
            empty: value === ""
        });
    }

    render() {
        return (
            <div className={"form-group autocomplete " + (this.state.empty ? 'error' : '')}>
                <label htmlFor="city">Ciudad o municipio del hogar</label>
                <input name="city" id="city" type="text" className="form-control"
                       placeholder="Ingresa ciudad o municipio del h..."
                       value={this.state.value}
                       autoComplete="city"
                       autoCorrect="off"
                       autoCapitalize="none"
                       onBlur={(e) => {
                           this.onBlur(e.target.value);
                       }}
                       onChange={(e) => {
                           this.searchData(e.target.value);
                       }}
                />
                <small className="form-text only-errors">Por favor ingrese la Ciudad o Municipio del Hogar.</small>
                <ul className={(this.state.toggle ? 'show' : 'hide') + " list-items"}>
                    {this.state.options.cities.map((option, key) =>
                        <li key={key} value={option.code_city}
                            onClick={(e) => {
                                this.saveOption(option.code_city, option.department, option.description, option.code_department);
                            }}
                        >{option.description}</li>
                    )}
                </ul>
            </div>
        );
    }
}

export default AutocompleteCities;



