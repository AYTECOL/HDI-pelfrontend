import React, { Component } from 'react';

import store from '../../../../store';
import { saveInmuebleValue } from '../../../../actions';
import Masknumbermoney from '../../../../common/helpers/masknumbermoney/Masknumbermoney';
import Helpers from '../../../../common/helpers/helpers/Helpers';
import { Tooltip } from '../../../Tooltip';
import Help from '../../../../common/icons/help';

class MobileContents extends Component {
  static nameModel = 'inmueble_mobile_contents';
  static nameModelValue = 'inmueble_mobile_contents_value';
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
      maximumPerItem,
    } = {
      ...(state && state.allInsurableLimits[5]),
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
      return MobileContents.getContent().name;
    } catch (e) {
      return '';
    }
  }

  static min() {
    try {
      return MobileContents.getContent().min;
    } catch (e) {
      return 0;
    }
  }

  static max() {
    try {
      return MobileContents.getContent().max;
    } catch (e) {
      return 0;
    }
  }

  static validateField(v) {
    let error = 0;
    v = Masknumbermoney.formatToNumber(v);
    if (v.length < 1) error = 1;
    if (error === 0) {
      if (v < MobileContents.min()) {
        error = 2;
      } else if (v > MobileContents.max()) {
        error = 3;
      }
    }
    return error;
  }

  componentDidMount() {
    this._isMounted = true;
    this.unsubscribe = store.subscribe(async () => {
      let storeState = store.getState();
      let active = storeState.Inmueble[MobileContents.nameModel];
      let value = storeState.Inmueble[MobileContents.nameModelValue];
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
    Helpers.removeClass('.mobileContents', 'error');
  };

  validateValue = (e) => {
    e = e.target;
    let error = MobileContents.validateField(e.value);
    let format = Masknumbermoney.formatToMask(e.value);
    if (error === 0)
      Helpers.removeClass(`.${MobileContents.nameModelValue}`, 'error');
    store.dispatch(
      saveInmuebleValue({
        name: MobileContents.nameModelValue,
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
    const content = MobileContents.getContent();
    const maximumPerItem = Masknumbermoney.formatToMask(content.maximumPerItem);
    const { active, errorValue } = this.state;
    return (
      <div className="row">
        <div className="col col-12 col-md-6">
          <div
            className={
              MobileContents.nameModel + ' form-group ' + this.state.error
            }
          >
            <label htmlFor={MobileContents.nameModel}>
              ¿Adicionalmente deseas asegurar {MobileContents.name()}?{' '}
            </label>
            <ul className="select-item" id={MobileContents.nameModel}>
              <li
                className={active === 1 ? 'active' : ''}
                onClick={this.validateEmpty({
                  value: 1,
                  name: MobileContents.nameModel,
                })}
              >
                Si
              </li>
              <li
                className={active === 0 ? 'active' : ''}
                onClick={this.validateEmpty({
                  value: 0,
                  name: MobileContents.nameModel,
                })}
              >
                No
              </li>
            </ul>
          </div>
        </div>
        {active === 1 ? (
          <div className="col col-12 col-md-6">
            <div
              className={
                MobileContents.nameModelValue +
                ' form-group ' +
                (errorValue !== 0 ? 'error' : '')
              }
            >
              <div className="d-flex">
                <label
                  className="flex-fill"
                  htmlFor={MobileContents.nameModelValue}
                >
                  Valor de {MobileContents.name()}
                </label>
                <Tooltip
                  placement="left"
                  title={`El valor máximo por cada teléfono móvil es de ${maximumPerItem}`}
                >
                  <Help className={'ml-auto icon-primary'} />
                </Tooltip>
              </div>
              <input
                name={MobileContents.nameModelValue}
                id={MobileContents.nameModelValue}
                type="text"
                value={this.state.value}
                className={'form-control'}
                placeholder=""
                onBlur={this.validateValue}
                onChange={this.validateValue}
              />
              <small className={'form-text'}>
                Mínimo. {Masknumbermoney.formatToMask(MobileContents.min())} -
                Máximo. {Masknumbermoney.formatToMask(MobileContents.max())}
              </small>
              <small
                className={
                  'form-text only-errors default-error ' +
                  (errorValue === 1 ? 'show' : 'hide')
                }
              >
                Por favor Ingrese el valor asegurado de Teléfonos Móviles.
              </small>
              <small
                className={
                  'form-text only-errors ' +
                  (errorValue === 2 ? 'show' : 'hide')
                }
              >
                Valor Asegurado de {MobileContents.name()} es inferior al
                permitido.
              </small>
              <small
                className={
                  'form-text only-errors ' +
                  (errorValue === 3 ? 'show' : 'hide')
                }
              >
                Valor Asegurado de {MobileContents.name()} es superior al
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

export default MobileContents;
