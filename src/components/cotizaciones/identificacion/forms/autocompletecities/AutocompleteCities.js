import React, {Component} from 'react';
import Cities from '../../../../../services/Cities';

import store from '../../../../../store';
import {saveDescriptionCity, saveIdentificationValue} from '../../../../../actions';
import Helpers from "../../../../../common/helpers/helpers/Helpers";

class AutocompleteCities extends Component {

    _isMounted = false;

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
        this.state.value = typeof this.props.value === "undefined" ? '' : this.props.value.toString();
        store.subscribe(() => {
            let storeState = store.getState();
            let city = storeState.cotizacion.identification.city;
            let department = storeState.cotizacion.identification.department;
            if (city !== this.state.valueLoadedCity || department !== this.state.valueLoadedDepartment) {
                if (this._isMounted) {
                    this.setState({
                        ...this.state,
                        valueLoadedCity: city,
                        valueLoadedDepartment: department,
                    });
                }
            }
        });
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    componentDidMount() {
        this._isMounted = true;
        this.getOptions();
    }

    async getOptions() {
        let data = await Cities.get();
        if (this._isMounted) {
            this.setState({
                ...this.state,
                options: data,
                originalOptions: data
            });
            setTimeout(() => {
                this.getTextById();
            }, 500);
        }
    }

    getTextById() {
        let value = "";
        for (let i = 0; i < this.state.options.cities.length; i++) {
            let d = this.state.options.cities[i];
            if (this.state.valueLoadedCity === parseInt(d.code_city) && this.state.valueLoadedDepartment === parseInt(d.code_department)) {
                value = d.department;
                break;
            }
        }
        if (value !== "" && this._isMounted) {
            this.setState({
                ...this.state,
                value: value
            });
        }
    }

    onBlur = v => {
        if (v !== 'noempty') {
            v = v.target.value;
            let empty = false;
            if (v === "") empty = true;
            setTimeout(() => {
                this.setState({
                    ...this.state,
                    toggle: false,
                    empty: empty
                });
            }, 200);
        }
    };

    saveOption = option => e => {
        let code = option.code_city;
        let value = option.description;
        let description = option.department;
        let codeDepartment = option.code_department;
        setTimeout(() => {
            Helpers.updatePdfInfo({
                'city': option.city
            });
            Helpers.updatePdfInfo({
                'department': option.department
            });
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
            if (typeof this.props.onChange !== "undefined") {
                this.props.onChange({
                    target: {
                        value: value,
                        name: this.props.name
                    }
                });
                this.props.onChange({
                    target: {
                        value: parseInt(code),
                        name: "city_code"
                    }
                });
                this.props.onChange({
                    target: {
                        value: parseInt(codeDepartment),
                        name: "department_code"
                    }
                });
            }
        }, 200);
    };

    searchData = value => {
        value = value.target.value;
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
    };

    selectActive = (options, reverse) => {
        let active = false;
        let status = false;
        if (reverse === true) options.cities = options.cities.reverse();
        for (let i in options.cities) {
            if (options.cities[i].active === true) {
                active = true;
                options.cities[i].active = false;
            } else {
                if (active === true) {
                    options.cities[i].active = true;
                    active = false;
                    status = true;
                }
            }
        }
        for (let i in options.cities) if (status === false) {
            options.cities[i].active = true;
            status = true;
        }
        if (reverse === true) options.cities = options.cities.reverse();
        return options;
    };

    moveOptions = e => {
        let key = e.keyCode;
        let options = this.state.options;
        let element = ".form-group.autocomplete .list-items li.active";
        //Down
        if (key === 40) {
            options = this.selectActive(options, false);
            //Up
        } else if (key === 38) {
            options = this.selectActive(options, true);
        } else if (key === 13 || key === 9) {
            e.preventDefault();
            this.onBlur("noempty");
            e.target.blur();
            if (Helpers.hasClass(element, 'active')) document.querySelector(element).click();
        }
        if (typeof options !== 'undefined') {
            this.setState({
                ...this.state,
                options: options
            });
            setTimeout(() => {
                if (Helpers.hasClass(element, 'active')) Helpers.scrollToElement(element, ".form-group.autocomplete .list-items", 'auto', true);
            }, 100);
        }
    };

    render() {
        return (
            <div className={"form-group autocomplete " + (this.state.empty ? 'error' : '')}>
                <label
                    className={typeof this.props.hideTitle !== "undefined" && this.props.hideTitle === true ? 'hide' : ''}
                    htmlFor="city">{typeof this.props.label === "undefined" ? 'Ciudad o municipio del hogar' : this.props.label}</label>
                <input name={typeof this.props.name === "undefined" ? 'city' : this.props.name} id="city" type="text"
                       className={"form-control " + (typeof this.props.disabled === 'undefined' ? '' : (this.props.disabled === true ? 'disabled' : ''))}
                       placeholder="Ingresa ciudad o municipio del h..."
                       value={typeof this.props.value === "undefined" ? this.state.value : (this.props.value !== "" ? this.props.value : this.state.value)}
                       disabled={typeof this.props.disabled === 'undefined' ? false : this.props.disabled}
                       autoComplete="city"
                       autoCorrect="off"
                       autoCapitalize="none"
                       onKeyDown={this.moveOptions}
                       onBlur={this.onBlur}
                       onChange={this.searchData}
                />
                <small className="form-text only-errors">Por favor ingrese
                    la {typeof this.props.label === "undefined" ? 'Ciudad o municipio del hogar' : this.props.label}.
                </small>
                <ul className={(this.state.toggle ? 'show' : 'hide') + " list-items"}>
                    {this.state.options.cities.map((option, key) =>
                        <li key={key} value={option.code_city} className={option.active ? 'active' : ''}
                            onClick={this.saveOption(option)}
                        >{option.description}</li>
                    )}
                </ul>
            </div>
        );
    }
}

export default AutocompleteCities;



