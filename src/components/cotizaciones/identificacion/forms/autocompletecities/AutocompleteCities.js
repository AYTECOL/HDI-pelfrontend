import React, { Component } from 'react';
import classNames from 'classnames';
import { withRouter } from 'react-router-dom';

import { withCities } from '../../hooks/cities';
import store from '../../../../../store';
import Helpers from '../../../../../common/helpers/helpers';
import PropTypes from 'prop-types';

class AutocompleteCities extends Component {
  _isMounted = false;

  get nameInput() {
    return typeof this.props.name === 'undefined' ? 'city' : this.props.name;
  }

  constructor(props) {
    super(props);
    this.state = {
      options: {
        cities: [],
      },
      originalOptions: {
        cities: [],
      },
      value: this.props.value || '',
      empty: false,
      idElement: '',
      toggle: false,
      valueLoadedCity: 0,
      valueLoadedDepartment: 0,
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
              valueLoadedDepartment: department,
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
    const { value } = props;
    this.setState({
      ...this.state,
      value: typeof value === 'string' ? value : (value || ''),
    });
  }

  /**
   * @param {Function} callBack
   * @return {Promise<void>}
   */
  async getOptions(callBack) {
    const { citiesProps } = this.props;
    let cities = await citiesProps.promise;
    const options = { cities };
    if (this._isMounted) {
      this.setState(
        {
          ...this.state,
          options: options,
          originalOptions: options,
        },
        callBack
      );
    }
  }

  getTextById() {
    /**
     * */

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
        value: value,
      });
    }
  }

  onBlur = (v) => {
    if (v !== 'noempty') {
      v = v.target.value;
      let empty = false;
      if (v === '') empty = true;
      setTimeout(() => {
        const typed = (this.state.value || '').trim();
        if (typed) {
          const match = this.state.originalOptions.cities.find(
            (o) => (o.description || '').toLowerCase() === typed.toLowerCase()
          );
          if (match) {
            this.setState({
              ...this.state,
              toggle: false,
              empty: false,
            });
            this.changeTargets([
              { name: this.nameInput, value: match.description },
              { name: 'city_code', value: parseInt(match.code_city) },
              { name: 'department_code', value: parseInt(match.code_department) },
              { name: 'city', value: match.city },
              { name: 'departamento', value: match.department },
            ]);
          } else {
            // si no hay match exacto, muestra error y limpia en el padre
            this.setState({
              ...this.state,
              toggle: false,
              empty: true,
            });
            this.changeTargets([
              { name: this.nameInput, value: '' },
              { name: 'city_code', value: 0 },
              { name: 'department_code', value: 0 },
              { name: 'city', value: '' },
              { name: 'departamento', value: '' },
            ]);
          }
        } else {
          this.setState({
            ...this.state,
            toggle: false,
            empty: empty,
          });
        }
      }, 200);
    }
  };

  /**
   * @param {({ name:string, value:any })[]} targets
   */
  changeTargets = (targets) => {
    const { onChange } = this.props;
    if (typeof onChange !== 'function') {
      // Si no hay onChange seguro, no hacemos nada para evitar excepciones
      return;
    }
    for (const { name, value } of targets) {
      onChange({
        target: { name, value },
      });
    }
  };

  saveOption = (option) => () => {
    const { onSelect } = this.props;
    onSelect && onSelect(option);
    let code = option.code_city;
    let value = option.description;
    let description = option.department;
    let city = option.city;
    let codeDepartment = option.code_department;
    setTimeout(() => {
      this.setState({
        ...this.state,
        value,
        empty: false,
      });
      if (typeof this.props.onChange === 'function') {
        this.changeTargets([
          {
            value: value,
            name: this.nameInput,
          },
          {
            value: parseInt(code),
            name: 'city_code',
          },
          {
            value: parseInt(codeDepartment),
            name: 'department_code',
          },
          {
            value: city,
            name: 'city',
          },
          {
            value: description,
            name: 'departamento',
          },
        ]);
      }
    }, 200);
  };

  removeAccents(text) {
    // https://stackoverflow.com/questions/990904/remove-accents-diacritics-in-a-string-in-javascript
    return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  searchData = ({ target: { value } }) => {
    const { cities } = this.state.originalOptions;
    const options = { cities: [] };
    cities.forEach((option) => {
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
        empty: !value,
      },
      () => {
        const { onSelect } = this.props;
        this.state.empty && onSelect && onSelect();
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

  moveOptions = (e) => {
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
      
      // Si hay opciones disponibles, seleccionar la activa o la primera
      if (this.state.toggle && options.cities && options.cities.length > 0) {
        const activeOption = options.cities.find(opt => opt.active);
        const optionToSelect = activeOption || options.cities[0];
        this.saveOption(optionToSelect)();
        e.target.blur();
      } else {
        // Si no hay opciones, ejecutar el blur normal para validar
        this.onBlur('noempty');
        e.target.blur();
      }
    }
    if (typeof options !== 'undefined') {
      this.setState({
        ...this.state,
        options: options,
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
    const defaultLabel = 'Ciudad o municipio del hogar a asegurar';
    return (
      <div className={'form-group autocomplete ' + (empty ? 'error' : '')}>
        <label className={hideTitle ? 'hide' : ''} htmlFor="city">
          {!label ? defaultLabel : label}
        </label>
        <input
          name={this.nameInput}
          id="city"
          type="text"
          className={classNames(
            'form-control text-truncate',
            !!disabled && 'disabled',
            !value ? 'not-value' : ''
          )}
          placeholder={`Ingresa la ${defaultLabel.toLowerCase()}`}
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
          Por favor ingrese la {(!label && defaultLabel) || label}.
        </small>
        <ul className={(toggle ? 'show' : 'hide') + ' list-items'}>
          {options.cities &&
            options.cities.map((option, key) => (
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

AutocompleteCities.propTypes = {
  name: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  onSelect: PropTypes.func,
  citiesProps: PropTypes.shape({
    promise: PropTypes.object,
  }),
  hideTitle: PropTypes.bool,
  label: PropTypes.string,
  disabled: PropTypes.bool,
};

export default withRouter(withCities(AutocompleteCities));
