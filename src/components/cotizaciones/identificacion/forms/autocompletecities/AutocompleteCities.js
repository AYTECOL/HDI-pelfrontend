import React, { Component } from 'react';
import Cities from '../../../../../services/Cities';

import store from '../../../../../store';
import {
  saveDescriptionCity,
  saveIdentificationValue
} from '../../../../../actions';
import Helpers from '../../../../../common/helpers/helpers/Helpers';
import { withRouter } from 'react-router-dom';

class AutocompleteCities extends Component {
  _isMounted = false;

  get nameInput() {
    return typeof this.props.name === 'undefined' ? 'city' : this.props.name;
  }

  constructor(props) {
    super(props);
    this.state = {
      options: {
        cities: []
      },
      originalOptions: {
        cities: []
      },
      value: this.props.value || '',
      empty: false,
      idElement: '',
      toggle: false,
      valueLoadedCity: 0,
      valueLoadedDepartment: 0
    };
  }

  componentWillUnmount() {
    this._isMounted = false;
    this.unsubscribe();
  }

  componentDidMount() {
    this._isMounted = true;
    this.updateValue(this.props);
    const getOptions = this.getOptions();
    this.unsubscribe = store.subscribe(() => {
      const { cotizacion } = store.getState();
      const { city, department } = cotizacion.identification;
      if (
        city !== this.state.valueLoadedCity ||
        department !== this.state.valueLoadedDepartment
      ) {
        if (this._isMounted) {
          this.setState(
            {
              ...this.state,
              valueLoadedCity: city,
              valueLoadedDepartment: department
            },
            async () => {
              getOptions.then(() => {
                this.getTextById();
              });
            }
          );
        }
      }
    });
  }

  componentWillReceiveProps(nextProps, nextContext) {
    this.updateValue(nextProps);
  }

  updateValue(props) {
    if (typeof props.value !== 'undefined') {
      if (props.value.trim() !== '') {
        this.setState({
          ...this.state,
          value: props.value
        });
      }
    }
  }

  /**
   * @param {Function} callBack
   * @return {Promise<void>}
   */
  async getOptions(callBack) {
    let data = await Cities.get();
    if (this._isMounted) {
      this.setState(
        {
          ...this.state,
          options: data,
          originalOptions: data
        },
        callBack
      );
    }
  }

  resetAddress() {
    store.dispatch(
      saveIdentificationValue({
        name: 'address',
        value: ''
      })
    );
  }

  resetCity() {
    store.dispatch(
      saveIdentificationValue({
        name: this.nameInput,
        value: ''
      })
    );
    this.resetAddress();
  }

  getTextById() {
    /**
     * @typedef City
     * @type {object}
     * @property {string} code_city
     * @property {string} code_department
     * @property {string} city
     * @property {string} department
     * @property {string} description
     */

    /**
     *  @const  {City[]} cities
     */
    const { options, valueLoadedCity, valueLoadedDepartment } = this.state;
    const { cities } = options;
    const city = cities.find(
      ({ code_city, code_department }) =>
        valueLoadedCity === parseInt(code_city) &&
        valueLoadedDepartment === parseInt(code_department)
    );
    const value = (city && city.description) || '';
    if (value !== '' && this._isMounted) {
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
      if (v === '') empty = true;
      setTimeout(() => {
        this.setState({
          ...this.state,
          toggle: false,
          empty: empty
        });
      }, 200);
    }
  };

  /**
   * @param {({ name:string, value:any })[]} targets
   */
  changeTargets = targets => {
    for (const { name, value } of targets) {
      this.props.onChange({
        target: { name, value }
      });
    }
  };

  saveOption = option => e => {
    let code = option.code_city;
    let value = option.description;
    let description = option.department;
    let city = option.city;
    let codeDepartment = option.code_department;
    let { location } = this.props;
    setTimeout(() => {
      if (location.pathname.substr(0, 13) === '/cotizacion/1') {
        Helpers.updatePdfInfo({
          cityHome: option.city
        });
        Helpers.updatePdfInfo({
          departmentHome: option.department
        });
      }
      Helpers.updatePdfInfo({
        city: option.city
      });
      Helpers.updatePdfInfo({
        department: option.department
      });
      store.dispatch(
        saveIdentificationValue({
          name: 'city',
          value: code
        })
      );
      store.dispatch(
        saveIdentificationValue({
          name: 'department',
          value: codeDepartment
        })
      );
      this.resetAddress();
      store.dispatch(saveDescriptionCity(description));
      this.setState({
        ...this.state,
        value,
        empty: false
      });
      if (typeof this.props.onChange !== 'undefined') {
        this.changeTargets([
          {
            value: value,
            name: this.props.name
          },
          {
            value: parseInt(code),
            name: 'city_code'
          },
          {
            value: parseInt(codeDepartment),
            name: 'department_code'
          },
          {
            value: city,
            name: 'city'
          },
          {
            value: description,
            name: 'departamento'
          }
        ]);
      }
    }, 200);
  };

  removeAccents(text) {
    // https://stackoverflow.com/questions/990904/remove-accents-diacritics-in-a-string-in-javascript
    return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  searchData = ({ target: { value, name } }) => {
    const { cities } = this.state.originalOptions;
    const options = { cities: [] };
    cities.forEach((option, key) => {
      const city = this.removeAccents(option.city || '').toLowerCase();
      const search = city.search(this.removeAccents(value.toLowerCase()));
      if (search !== -1 && search === 0) {
        options.cities.push(option);
      }
    });

    this.setState(
      {
        ...this.state,
        value: value,
        toggle: true,
        options,
        empty: !value
      },
      () => {
        this.state.empty && this.resetCity();
      }
    );
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
    for (let i in options.cities)
      if (status === false) {
        options.cities[i].active = true;
        status = true;
      }
    if (reverse === true) options.cities = options.cities.reverse();
    return options;
  };

  moveOptions = e => {
    let key = e.keyCode;
    let options = this.state.options;
    let element = '.form-group.autocomplete .list-items li.active';
    //Down
    if (key === 40) {
      options = this.selectActive(options, false);
      //Up
    } else if (key === 38) {
      options = this.selectActive(options, true);
    } else if (key === 13 || key === 9) {
      e.preventDefault();
      this.onBlur('noempty');
      e.target.blur();
      if (Helpers.hasClass(element, 'active'))
        document.querySelector(element).click();
    }
    if (typeof options !== 'undefined') {
      this.setState({
        ...this.state,
        options: options
      });
      setTimeout(() => {
        if (Helpers.hasClass(element, 'active'))
          Helpers.scrollToElement(
            element,
            '.form-group.autocomplete .list-items',
            'auto',
            true
          );
      }, 100);
    }
  };

  render() {
    const { hideTitle, label, disabled } = this.props;
    const { empty, value, toggle, options } = this.state;
    return (
      <div className={'form-group autocomplete ' + (empty ? 'error' : '')}>
        <label className={hideTitle ? 'hide' : ''} htmlFor="city">
          {!label ? 'Ciudad o municipio del hogar' : label}
        </label>
        <input
          name={this.nameInput}
          id="city"
          type="text"
          className={'form-control ' + (!!disabled ? 'disabled' : '')}
          placeholder="Ingresa ciudad o municipio del h..."
          value={value}
          disabled={!!disabled}
          autoComplete="city"
          autoCorrect="off"
          autoCapitalize="none"
          onKeyDown={this.moveOptions}
          onBlur={this.onBlur}
          onChange={this.searchData}
        />
        <small className="form-text only-errors">
          Por favor ingrese la{' '}
          {(!label && 'Ciudad o municipio del hogar') || label}.
        </small>
        <ul className={(toggle ? 'show' : 'hide') + ' list-items'}>
          {options.cities.map((option, key) => (
            <li
              key={key}
              value={option.code_city}
              className={option.active ? 'active' : ''}
              onClick={this.saveOption(option)}
            >
              {option.description}
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default withRouter(AutocompleteCities);
