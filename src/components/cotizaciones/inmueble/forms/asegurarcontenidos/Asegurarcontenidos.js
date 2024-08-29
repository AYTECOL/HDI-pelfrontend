import React, { Component } from 'react';

import store from '../../../../../store';
import { saveInmuebleValue } from '../../../../../store/actions';
import Masknumbermoney from '../../../../../common/helpers/masknumbermoney/Masknumbermoney';
import Helpers from '../../../../../common/helpers/helpers';
import Help from '../../../../globals/icons/help';
import { Tooltip } from '../../../../Tooltip';
import MobileContents from '../MobileContents';

class Asegurarcontenidos extends Component {
  static nameModel = 'contenidoasegudado';
  static nameModelValue = 'contenidoasegudadovalor';
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
      title_desc,
    } = {
      ...(state && state.allInsurableLimits[2]),
    };
    return {
      name,
      min,
      max,
      tooltip,
      title_desc,
    };
  };

  static name() {
    return Asegurarcontenidos.getContent().name;
  }

  static min() {
    return Asegurarcontenidos.getContent().min;
  }

  static max() {
    return Asegurarcontenidos.getContent().max;
  }

  static validateField(v) {
    let error = 0;
    const content = Asegurarcontenidos.getContent();
    v = Masknumbermoney.formatToNumber(v);
    if (v.length < 1) error = 1;
    if (error === 0) {
      if (v < content.min) {
        error = 2;
      } else if (v > content.max) {
        error = 3;
      }
    }
    return error;
  }

  componentDidMount() {
    this._isMounted = true;
    this.unsubscribe = store.subscribe(async () => {
      let storeState = store.getState();
      let active = storeState.Inmueble.contenidoasegudado;
      let value = storeState.Inmueble.contenidoasegudadovalor;
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

  validateEmpty = (e) => () => {
    store.dispatch(saveInmuebleValue(e));
    Helpers.removeClass('.contenidoasegudado', 'error');
    Helpers.removeClass('.inmuebleasegudado', 'error');
    if (e.value === 0) {
      store.dispatch(
        saveInmuebleValue({
          name: 'inmuebleasegudadojoyas',
          value: 0,
        })
      );
      store.dispatch(
        saveInmuebleValue({
          name: 'inmuebleasegudadojoyasvalor',
          value: 0,
        })
      );

      store.dispatch(
        saveInmuebleValue({
          name: MobileContents.nameModel,
          value: 0,
        })
      );
      store.dispatch(
        saveInmuebleValue({
          name: MobileContents.nameModelValue,
          value: 0,
        })
      );

      store.dispatch(
        saveInmuebleValue({
          name: 'inmuebleasegudadoobras',
          value: 0,
        })
      );
      store.dispatch(
        saveInmuebleValue({
          name: 'inmuebleasegudadoobrasvalor',
          value: 0,
        })
      );

      store.dispatch(
        saveInmuebleValue({
          name: 'inmuebleasegudadotelefonos',
          value: 0,
        })
      );
      store.dispatch(
        saveInmuebleValue({
          name: 'inmuebleasegudadotelefonosvalor',
          value: 0,
        })
      );
    }
  };

  validateValue = (e) => {
    e = e.target;
    let error = Asegurarcontenidos.validateField(e.value);
    let format = Masknumbermoney.formatToMask(e.value);
    if (error === 0) Helpers.removeClass('.contenidoasegudadovalor', 'error');
    store.dispatch(
      saveInmuebleValue({
        name: 'contenidoasegudadovalor',
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
    const content = Asegurarcontenidos.getContent();
    const min = Masknumbermoney.formatToMask(content.min);
    const max = Masknumbermoney.formatToMask(content.max);
    const maximumPerItem = content.tooltip;
    const title_desc = content.title_desc;
    const { error, active, errorValue, value } = this.state;
    return (
      <div className="row">
        <div className="col col-12  col-md-6">
          <div
            className={
              Asegurarcontenidos.nameModel + ' no-icon form-group ' + error
            }
          >
            <label htmlFor={Asegurarcontenidos.nameModel}>{title_desc} </label>
            <ul className="select-item" id={Asegurarcontenidos.nameModel}>
              <li
                className={active === 1 ? 'active' : ''}
                onClick={this.validateEmpty({
                  value: 1,
                  name: Asegurarcontenidos.nameModel,
                })}
              >
                Si
              </li>
              <li
                className={active === 0 ? 'active' : ''}
                onClick={this.validateEmpty({
                  value: 0,
                  name: Asegurarcontenidos.nameModel,
                })}
              >
                No
              </li>
            </ul>
          </div>
        </div>
        {active === 1 ? (
          <div className="col col-12  col-md-6">
            <div
              className={
                Asegurarcontenidos.nameModelValue +
                ' form-group ' +
                (errorValue !== 0 ? 'error' : '')
              }
            >
              <div className="d-flex">
                <label
                  className="flex-fill"
                  htmlFor={Asegurarcontenidos.nameModelValue}
                >
                  {content.name}
                </label>

                <Tooltip placement="left" title={`${maximumPerItem}`}>
                  <Help className={'ml-auto icon-primary'} />
                </Tooltip>
              </div>
              <input
                name={Asegurarcontenidos.nameModelValue}
                id={Asegurarcontenidos.nameModelValue}
                type="text"
                className={'form-control'}
                value={value}
                placeholder=""
                onBlur={this.validateValue}
                onChange={this.validateValue}
              />
              <small className={'form-text'}>
                Mínimo. {min} - Máximo. {max}
              </small>

              {errorValue === 1 && (
                <small className={'form-text only-errors default-error show'}>
                  Por favor Ingrese el valor asegurado de Contenidos.
                </small>
              )}
              {errorValue === 2 && (
                <small className={'form-text only-errors show'}>
                  Valor Asegurado de {content.name} es inferior al permitido.
                </small>
              )}
              {errorValue === 3 && (
                <small className={'form-text only-errors show '}>
                  Valor Asegurado de {content.name} es superior al permitido.
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

export default Asegurarcontenidos;
