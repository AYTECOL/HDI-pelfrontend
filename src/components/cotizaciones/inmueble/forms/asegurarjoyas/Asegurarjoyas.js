import React, { Component } from 'react';

import store from '../../../../../store';
import { saveInmuebleValue } from '../../../../../store/actions';
import Masknumbermoney from '../../../../../common/helpers/masknumbermoney/Masknumbermoney';
import Helpers from '../../../../../common/helpers/helpers/Helpers';
import { Tooltip } from '../../../../Tooltip';
import Help from '../../../../../common/icons/help';
import clsx from 'clsx';

class Asegurarjoyas extends Component {
  static nameModel = 'inmuebleasegudadojoyas';
  static nameModelValue = 'inmuebleasegudadojoyasvalor';
  _isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
      error: false,
      show: false,
      active: 0,
      min: Asegurarjoyas.min,
      max: Asegurarjoyas.max,
      errorValue: 0,
      value: '',
    };
  }

  static getContent = () => {
    const state = store.getState();
    const {
      description: name = '',
      min_value: min = 0,
      max_value: max = 0,
      maximumPerItem,
    } = {
      ...(state && state.allInsurableLimits[4]),
    };
    return {
      name,
      min,
      max,
      maximumPerItem,
    };
  };

  static name() {
    try {
      return Asegurarjoyas.getContent().name;
    } catch (e) {
      return '';
    }
  }

  static min() {
    try {
      return Asegurarjoyas.getContent().min;
    } catch (e) {
      return 0;
    }
  }

  static max() {
    try {
      return Asegurarjoyas.getContent().max;
    } catch (e) {
      return 0;
    }
  }

  static validateField(v) {
    let error = 0;
    v = Masknumbermoney.formatToNumber(v);
    if (v.length < 1) error = 1;
    if (error === 0) {
      if (v < Asegurarjoyas.min()) {
        error = 2;
      } else if (v > Asegurarjoyas.max()) {
        error = 3;
      }
    }
    return error;
  }

  componentDidMount() {
    this._isMounted = true;
    this.unsubscribe = store.subscribe(async () => {
      let storeState = store.getState();
      let active = storeState.Inmueble.inmuebleasegudadojoyas;
      let value = storeState.Inmueble.inmuebleasegudadojoyasvalor;
      if (this.state.active !== active || this.state.value !== value) {
        this.setState({
          ...this.state,
          value: value,
          active: active,
        });
      }
    });
  }

  componentWillUnmount() {
    this._isMounted = false;
    this.unsubscribe();
  }

  validateEmpty = (e) => (event) => {
    store.dispatch(saveInmuebleValue(e));
    this.setState({
      ...this.state,
      active: e.value,
    });
    Helpers.removeClass('.inmuebleasegudadojoyas', 'error');
  };

  validateValue = (e) => {
    e = e.target;
    let error = Asegurarjoyas.validateField(e.value);
    let format = Masknumbermoney.formatToMask(e.value);
    if (error === 0)
      Helpers.removeClass('.inmuebleasegudadojoyasvalor', 'error');
    store.dispatch(
      saveInmuebleValue({
        name: Asegurarjoyas.nameModelValue,
        value: format,
      })
    );
    if (this._isMounted) {
      this.setState({
        ...this.state,
        errorValue: error,
        value: format,
      });
    }
  };

  render() {
    const content = Asegurarjoyas.getContent();
    const maximumPerItem = Masknumbermoney.formatToMask(content.maximumPerItem);
    const { active, value, errorValue, error } = this.state;
    return (
      <div className="row">
        <div className="col col-12  col-md-6">
          <div
            className={clsx(
              Asegurarjoyas.nameModel,
              'no-icon form-group',
              error
            )}
          >
            <label htmlFor={Asegurarjoyas.nameModel}>
              ¿Adicionalmente deseas {Asegurarjoyas.name()}?{' '}
            </label>
            <ul className="select-item" id={Asegurarjoyas.nameModel}>
              {[
                { label: 'Si', value: 1 },
                { label: 'No', value: 0 },
              ].map((item, index) => (
                <li
                  key={index}
                  className={clsx(item.value === active && 'active')}
                  onClick={this.validateEmpty({
                    value: item.value,
                    name: Asegurarjoyas.nameModel,
                  })}
                >
                  {item.label}
                </li>
              ))}
            </ul>
          </div>
        </div>
        {active === 1 ? (
          <div className="col col-12  col-md-6">
            <div
              className={clsx(
                Asegurarjoyas.nameModelValue,
                'form-group',
                errorValue !== 0 && 'error'
              )}
            >
              <div className="d-flex">
                <label
                  className="flex-fill"
                  htmlFor={Asegurarjoyas.nameModelValue}
                >
                  Valor de {Asegurarjoyas.name()}
                </label>
                <Tooltip
                  placement="left"
                  title={`El valor máximo por cada artículo es de ${maximumPerItem}`}
                >
                  <Help className={'ml-auto icon-primary'} />
                </Tooltip>
              </div>
              <input
                name="inmuebleasegudadojoyasvalor"
                id={Asegurarjoyas.nameModelValue}
                type="text"
                value={value}
                className={'form-control'}
                placeholder=""
                onBlur={this.validateValue}
                onChange={this.validateValue}
              />
              <small className={'form-text'}>
                Mínimo. {Masknumbermoney.formatToMask(Asegurarjoyas.min())} -
                Máximo. {Masknumbermoney.formatToMask(Asegurarjoyas.max())}
              </small>
              {errorValue === 1 && (
                <small className={'form-text only-errors default-error show'}>
                  Por favor Ingrese el valor asegurado de Joyas.
                </small>
              )}
              {errorValue === 2 && (
                <small className={'form-text only-errors show'}>
                  Valor Asegurado de {Asegurarjoyas.name()} es inferior al
                  permitido.
                </small>
              )}
              {errorValue === 3 && (
                <small className={'form-text only-errors show'}>
                  Valor Asegurado de {Asegurarjoyas.name()} es superior al
                  permitido.
                </small>
              )}
            </div>
          </div>
        ) : (
          ''
        )}
      </div>
    );
  }
}

export default Asegurarjoyas;
