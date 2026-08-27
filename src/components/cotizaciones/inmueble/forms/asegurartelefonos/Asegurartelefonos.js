import React, { Component } from 'react';

import store from '../../../../../store';
import { saveInmuebleValue } from '../../../../../store/actions';
import Masknumbermoney from '../../../../../common/helpers/masknumbermoney/Masknumbermoney';
import Helpers from '../../../../../common/helpers/helpers';
import { Tooltip } from '../../../../Tooltip';
import Help from '../../../../globals/icons/help';

class Asegurartelefonos extends Component {
  static nameModel = 'inmuebleasegudadotelefonos';
  static nameModelValue = 'inmuebleasegudadotelefonosvalor';
  _isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
      error: false,
      show: false,
      active: 0,
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
      tooltip,
      title_card,
      title_desc,
    } = {
      ...(state && state.allInsurableLimits[6]),
    };
    return {
      name,
      min,
      max,
      tooltip,
      title_card,
      title_desc,
    };
  };

  static name_card() {
    try {
      return Asegurartelefonos.getContent().title_card;
    } catch (e) {
      return '';
    }
  }
  static name() {
    try {
      return Asegurartelefonos.getContent().name;
    } catch (e) {
      return '';
    }
  }

  static min() {
    try {
      return Asegurartelefonos.getContent().min;
    } catch (e) {
      return 0;
    }
  }

  static max() {
    try {
      return Asegurartelefonos.getContent().max;
    } catch (e) {
      return 0;
    }
  }

  static validateField(v) {
    let error = 0;
    v = Masknumbermoney.formatToNumber(v);
    if (v.length < 1) error = 1;
    if (error === 0) {
      if (v < Asegurartelefonos.min()) {
        error = 2;
      } else if (v > Asegurartelefonos.max()) {
        error = 3;
      }
    }
    return error;
  }

  componentDidMount() {
    this._isMounted = true;
    this.unsubscribe = store.subscribe(async () => {
      let storeState = store.getState();
      let active = storeState.Inmueble.inmuebleasegudadotelefonos;
      let value = storeState.Inmueble.inmuebleasegudadotelefonosvalor;
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

  validateEmpty = (e) => (event) => {
    store.dispatch(saveInmuebleValue(e));
    this.setState({
      ...this.state,
      active: e.value,
    });
    Helpers.removeClass('.inmuebleasegudadotelefonos', 'error');
  };

  validateValue = (e) => {
    e = e.target;
    const rawValue = e.value.replace(/\D/g, '');
    let error = Asegurartelefonos.validateField(rawValue);
    let format = Masknumbermoney.formatToMask(rawValue);
    if (error === 0)
      Helpers.removeClass('.inmuebleasegudadotelefonosvalor', 'error');
    store.dispatch(
      saveInmuebleValue({
        name: Asegurartelefonos.nameModelValue,
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
    const { active } = this.state;
    const content = Asegurartelefonos.getContent();
    const maximumPerItem = content.tooltip;
    const title_desc = content.title_desc;
    return (
      <div className="row">
        <div className="col col-12 p-0">
          <div className="row">
            <div className="col col-12 col-md-6 form-group mb-0">
              <div
                className={
                  Asegurartelefonos.nameModel +
                  ' form-group mb-0 ' +
                  this.state.error
                }
              >
                <label htmlFor={Asegurartelefonos.nameModel}>
                  {title_desc}
                </label>
              </div>
            </div>
            {active === 1 && (
              <div className="col col-12 col-md-6 p-0 d-flex align-items-end">
                <div className="d-flex flex-fill form-group mb-0 align-items-center">
                  <label
                    className="flex-fill"
                    htmlFor={Asegurartelefonos.nameModelValue}
                  >
                    {Asegurartelefonos.name()}
                  </label>
                  <Tooltip
                    className="mb-1"
                    placement="left"
                    title={`${maximumPerItem}`}
                  >
                    <Help className={'ml-auto icon-primary'} />
                  </Tooltip>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="col col-12">
          <div className="row">
            <div className="col col-12 col-md-6">
              <ul className="select-item" id={Asegurartelefonos.nameModel}>
                <li
                  className={`${this.state.active === 1 ? 'active ' : ''}Si`}
                  onClick={this.validateEmpty({
                    value: 1,
                    name: Asegurartelefonos.nameModel,
                  })}
                >
                  Si
                </li>
                <li
                  className={`${this.state.active === 0 ? 'active ' : ''}No`}
                  onClick={this.validateEmpty({
                    value: 0,
                    name: Asegurartelefonos.nameModel,
                  })}
                >
                  No
                </li>
              </ul>
            </div>
            {active === 1 ? (
              <div className="col col-12 col-md-6">
                <div
                  className={
                    Asegurartelefonos.nameModelValue +
                    ' form-group ' +
                    (this.state.errorValue !== 0 ? 'error' : '')
                  }
                >
                  <input
                    name={Asegurartelefonos.nameModelValue}
                    id="inmuebleasegudadotelefonosvalor"
                    type="text"
                    value={this.state.value}
                    className={`form-control ${
                      !this.state.value ? 'not-value' : ''
                    }`}
                    placeholder=""
                    onBlur={this.validateValue}
                    onChange={this.validateValue}
                  />
                  <small className={'form-text'}>
                    Mínimo.{' '}
                    {Masknumbermoney.formatToMask(Asegurartelefonos.min())} -
                    Máximo.{' '}
                    {Masknumbermoney.formatToMask(Asegurartelefonos.max())}
                  </small>
                  <small
                    className={
                      'form-text only-errors default-error ' +
                      (this.state.errorValue === 1 ? 'show' : 'hide')
                    }
                  >
                    Por favor Ingrese el valor asegurado de Teléfonos Móviles.
                  </small>
                  <small
                    className={
                      'form-text only-errors ' +
                      (this.state.errorValue === 2 ? 'show' : 'hide')
                    }
                  >
                    Valor Asegurado de {Asegurartelefonos.name()} es inferior al
                    permitido.
                  </small>
                  <small
                    className={
                      'form-text only-errors ' +
                      (this.state.errorValue === 3 ? 'show' : 'hide')
                    }
                  >
                    Valor Asegurado de {Asegurartelefonos.name()} es superior al
                    permitido.
                  </small>
                </div>
              </div>
            ) : (
              ''
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default Asegurartelefonos;
