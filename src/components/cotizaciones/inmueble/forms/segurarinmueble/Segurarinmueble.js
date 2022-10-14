import React, { Component } from 'react';
import clsx from 'clsx';

import store from '../../../../../store';
import { saveInmuebleValue } from '../../../../../store/actions';

import Masknumbermoney from '../../../../../common/helpers/masknumbermoney/Masknumbermoney';
import Helpers from '../../../../../common/helpers/helpers/Helpers';

class Segurarinmueble extends Component {
  static nameModel = 'inmuebleasegudado';
  static nameModelValue = 'inmuebleasegudadovalor';
  _isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
      error: false,
      show: false,
      active: 1,
      errorValue: 0,
      value: '',
    };
  }

  static name() {
    try {
      return store.getState().allInsurableLimits[1].description;
    } catch (e) {
      return '';
    }
  }

  static min() {
    try {
      return store.getState().allInsurableLimits[1].min_value;
    } catch (e) {
      return 0;
    }
  }

  static max() {
    try {
      return store.getState().allInsurableLimits[1].max_value;
    } catch (e) {
      return 0;
    }
  }

  static validateField(v) {
    let error = 0;
    v = Masknumbermoney.formatToNumber(v);
    if (v.length < 1) error = 1;
    if (error === 0) {
      if (v < Segurarinmueble.min()) {
        error = 2;
      } else if (v > Segurarinmueble.max()) {
        error = 3;
      }
    }
    return error;
  }

  componentDidMount() {
    this._isMounted = true;
    this.unsubscribe = store.subscribe(async () => {
      let storeState = store.getState();
      let active = storeState.Inmueble.inmuebleasegudado;
      let value = storeState.Inmueble.inmuebleasegudadovalor;
      if (this.state.active !== active || this.state.value !== value) {
        this.setState({
          ...this.state,
          active: active,
          value: value,
        });
      }
    });
  }

  componentWillUnmount() {
    this._isMounted = false;
    this.unsubscribe();
  }

  validateEmpty = (e) => () => {
    store.dispatch(saveInmuebleValue(e));
    this.setState({
      ...this.state,
      active: e.value,
    });
    Helpers.removeClass('.contenidoasegudado', 'error');
    Helpers.removeClass('.inmuebleasegudado', 'error');
  };

  validateValue = (e) => {
    e = e.target;
    let error = Segurarinmueble.validateField(e.value);
    if (error === 0)
      Helpers.removeClass('.' + Segurarinmueble.nameModelValue, 'error');
    let format = Masknumbermoney.formatToMask(e.value);
    store.dispatch(
      saveInmuebleValue({
        name: Segurarinmueble.nameModelValue,
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
    const { errorValue } = this.state;
    return (
      <div className="row">
        <div className="col col-12 col-md-6">
          <div
            className={
              Segurarinmueble.nameModel +
              ' no-icon form-group ' +
              this.state.error
            }
          >
            <label htmlFor={Segurarinmueble.nameModel}>
              ¿Deseas asegurar {Segurarinmueble.name()}?{' '}
            </label>
            <ul className="select-item" id={Segurarinmueble.nameModel}>
              <li
                className={this.state.active === 1 ? 'active' : ''}
                onClick={this.validateEmpty({
                  value: 1,
                  name: Segurarinmueble.nameModel,
                })}
              >
                Si
              </li>
              <li
                className={this.state.active === 0 ? 'active' : ''}
                onClick={this.validateEmpty({
                  value: 0,
                  name: Segurarinmueble.nameModel,
                })}
              >
                No
              </li>
            </ul>
          </div>
        </div>
        {this.state.active === 1 ? (
          <div className="col col-12 col-md-6">
            <div
              className={clsx(
                Segurarinmueble.nameModelValue,
                'form-group',
                errorValue !== 0 && 'error'
              )}
            >
              <label htmlFor={Segurarinmueble.nameModelValue}>
                Valor del inmueble
              </label>
              <input
                name="value"
                id={Segurarinmueble.nameModelValue}
                type="text"
                className={'form-control'}
                placeholder=""
                value={this.state.value}
                onBlur={this.validateValue}
                onChange={this.validateValue}
              />
              <small className={'form-text'}>
                Mínimo. {Masknumbermoney.formatToMask(Segurarinmueble.min())} -
                Máximo. {Masknumbermoney.formatToMask(Segurarinmueble.max())}
              </small>
              {errorValue === 1 && (
                <small className={'form-text only-errors show'}>
                  Por favor Ingrese el valor asegurado de Inmueble.
                </small>
              )}
              {errorValue === 2 && (
                <small className={'form-text only-errors show'}>
                  Valor asegurado del {Segurarinmueble.name()} es inferior al
                  permitido.
                </small>
              )}
              {errorValue === 3 && (
                <small className={'form-text only-errors show'}>
                  Valor asegurado del {Segurarinmueble.name()} es superior al
                  permitido.
                </small>
              )}
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}

export default Segurarinmueble;
