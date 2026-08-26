import React, { Component } from 'react';

import store from '../../../../../store';
import { saveInmuebleValue } from '../../../../../store/actions';
import Masknumbermoney from '../../../../../common/helpers/masknumbermoney/Masknumbermoney';
import Helpers from '../../../../../common/helpers/helpers';
import { Tooltip } from '../../../../Tooltip';
import Help from '../../../../globals/icons/help';

class Asegurarobras extends Component {
  static nameModel = 'inmuebleasegudadoobras';
  static nameModelValue = 'inmuebleasegudadoobrasvalor';
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
      ...(state && state.allInsurableLimits[3]),
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
      return Asegurarobras.getContent().title_card;
    } catch (e) {
      return '';
    }
  }
  static name() {
    try {
      return Asegurarobras.getContent().name;
    } catch (e) {
      return '';
    }
  }

  static min() {
    try {
      return Asegurarobras.getContent().min;
    } catch (e) {
      return 0;
    }
  }

  static max() {
    try {
      return Asegurarobras.getContent().max;
    } catch (e) {
      return 0;
    }
  }

  static validateField(v) {
    let error = 0;
    v = Masknumbermoney.formatToNumber(v);
    if (v.length < 1) error = 1;
    if (error === 0) {
      if (v < Asegurarobras.min()) {
        error = 2;
      } else if (v > Asegurarobras.max()) {
        error = 3;
      }
    }
    return error;
  }

  componentDidMount() {
    this._isMounted = true;
    this.unsubscribe = store.subscribe(async () => {
      let storeState = store.getState();
      let active = storeState.Inmueble.inmuebleasegudadoobras;
      let value = storeState.Inmueble.inmuebleasegudadoobrasvalor;
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
    Helpers.removeClass('.inmuebleasegudadoobras', 'error');
  };

  validateValue = (e) => {
    e = e.target;
    const rawValue = e.value.replace(/[^0-9]/g, '');
    let error = Asegurarobras.validateField(rawValue);
    let format = Masknumbermoney.formatToMask(rawValue);
    if (error === 0)
      Helpers.removeClass('.inmuebleasegudadoobrasvalor', 'error');
    store.dispatch(
      saveInmuebleValue({
        name: Asegurarobras.nameModelValue,
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
    const content = Asegurarobras.getContent();
    const maximumPerItem = content.tooltip;
    const title_desc = content.title_desc;
    return (
      <div className="row">
        <div className="col col-12 col-md-6">
          <div
            className={
              Asegurarobras.nameModel +
              ' no-icon form-group ' +
              this.state.error
            }
          >
            <label htmlFor={Asegurarobras.nameModel}>{title_desc}</label>
            <ul className="select-item" id={Asegurarobras.nameModel}>
              <li
                className={`${this.state.active === 1 ? 'active ' : ''}Si`}
                onClick={this.validateEmpty({
                  value: 1,
                  name: Asegurarobras.nameModel,
                })}
              >
                Si
              </li>
              <li
                className={`${this.state.active === 0 ? 'active ' : ''}No`}
                onClick={this.validateEmpty({
                  value: 0,
                  name: Asegurarobras.nameModel,
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
              className={
                Asegurarobras.nameModelValue +
                ' form-group ' +
                (this.state.errorValue !== 0 ? 'error' : '')
              }
            >
              <div className="d-flex">
                <label
                  className="flex-fill"
                  htmlFor={Asegurarobras.nameModelValue}
                >
                  {Asegurarobras.name()}
                </label>
                <Tooltip placement="left" title={` ${maximumPerItem}`}>
                  <Help className={'ml-auto icon-primary'} />
                </Tooltip>
              </div>
              <input
                name={Asegurarobras.nameModelValue}
                id={Asegurarobras.nameModelValue}
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
                Mínimo. {Masknumbermoney.formatToMask(Asegurarobras.min())} -
                Máximo. {Masknumbermoney.formatToMask(Asegurarobras.max())}
              </small>
              <small
                className={
                  'form-text only-errors default-error ' +
                  (this.state.errorValue === 1 ? 'show' : 'hide')
                }
              >
                Por favor Ingrese el valor asegurado de Objetos de valor y obras
                de Arte.
              </small>
              <small
                className={
                  'form-text only-errors ' +
                  (this.state.errorValue === 2 ? 'show' : 'hide')
                }
              >
                Valor Asegurado de {Asegurarobras.name()} es inferior al
                permitido.
              </small>
              <small
                className={
                  'form-text only-errors ' +
                  (this.state.errorValue === 3 ? 'show' : 'hide')
                }
              >
                Valor Asegurado de {Asegurarobras.name()} es superior al
                permitido.
              </small>
            </div>
          </div>
        ) : (
          ''
        )}
      </div>
    );
  }
}

export default Asegurarobras;
