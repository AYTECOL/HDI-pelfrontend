import React, { Component } from 'react';

import store from '../../../../store';
import { saveInmuebleValue } from '../../../../store/actions';
import Masknumbermoney from '../../../../common/helpers/masknumbermoney/Masknumbermoney';
import Helpers from '../../../../common/helpers/helpers';
import { Tooltip } from '../../../Tooltip';
import Help from '../../../globals/icons/help';

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
      tooltip,
      title_desc,
    } = {
      ...(state && state.allInsurableLimits[5]),
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
    const maximumPerItem = content.tooltip;
    const title_desc = content.title_desc;
    const { active, errorValue } = this.state;
    return (
      <div className="row">
        <div className="col col-12 p-0">
          <div className="row">
            <div className="col col-12 col-md-6 form-group mb-0">
              <label htmlFor={MobileContents.nameModel}>{title_desc}</label>
            </div>
            {active === 1 && (
              <div className="col col-12 col-md-6 p-0 d-flex align-items-end">
                <div className="d-flex flex-fill form-group mb-0 align-items-center h-100">
                  <label
                    className="flex-fill mb-0"
                    htmlFor={MobileContents.nameModelValue}
                  >
                    Valor de {MobileContents.name()}
                  </label>
                  <Tooltip
                    className="mt-1"
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
              <div
                className={
                  MobileContents.nameModel + ' form-group ' + this.state.error
                }
              >
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
            {active === 1 && (
              <div className="col col-12 col-md-6">
                <div
                  className={
                    MobileContents.nameModelValue +
                    ' form-group no-label ' +
                    (errorValue !== 0 ? 'error' : '')
                  }
                >
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
                    Mínimo. {Masknumbermoney.formatToMask(MobileContents.min())}{' '}
                    - Máximo.{' '}
                    {Masknumbermoney.formatToMask(MobileContents.max())}
                  </small>
                  {errorValue === 1 && (
                    <small className={'form-text only-errors default-error'}>
                      Por favor Ingrese el valor asegurado de contenidos
                      móviles.
                    </small>
                  )}
                  {errorValue === 2 && (
                    <small className={'form-text only-errors'}>
                      Valor Asegurado de {MobileContents.name()} es inferior al
                      permitido.
                    </small>
                  )}
                  {errorValue === 3 && (
                    <small className={'form-text only-errors'}>
                      Valor Asegurado de {MobileContents.name()} es superior al
                      permitido.
                    </small>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default MobileContents;
