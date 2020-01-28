import React, { Component } from 'react';
import classNames from 'classnames';

import store from '../../../../../store';
import { mapShow, saveIdentificationValue } from '../../../../../actions';

class Address extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: false,
      address: '',
      disabled: true,
      city: ''
    };
    this.textInput = React.createRef();
  }

  componentDidMount() {
    this.unsubscribe = store.subscribe(async () => {
      let storeState = store.getState();
      let address = storeState.cotizacion.identification.address;
      let city = storeState.cotizacion.identification.city;
      let disabled = true;
      let error = false;
      if (address.length < 1 || address.length > 200) error = true;
      let changeCity = this.state.city !== city;
      if (this.state.address !== address || changeCity) {
        if (city !== '') disabled = false;
        this.setState({
          ...this.state,
          address: address,
          city: city,
          disabled: disabled,
          error: error
        });
        if (changeCity) this.textInput.current.focus();
      }
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  validateEmpty = e => {
    e = e.target;
    let error = false;
    if (e.value.length < 1 || e.value.length > 200) error = true;
    store.dispatch(saveIdentificationValue(e));
    if (store.getState().showMap !== true) store.dispatch(mapShow(true));
    this.setState({
      ...this.state,
      error: error,
      address: e.value
    });
  };

  render() {
    const { error, address, disabled } = this.state;
    const defaultLabel = 'Dirección del hogar a asegurar';
    return (
      <div className={'form-group ' + (error ? 'error' : '')}>
        <label htmlFor="address">{defaultLabel}</label>
        <input
          name="address"
          id="address"
          type="text"
          value={address}
          className={classNames(
            'form-control text-truncate',
            disabled && 'disabled'
          )}
          placeholder={`Ingresa la ${defaultLabel.toLowerCase()}`}
          autoComplete="address"
          autoCorrect="off"
          autoCapitalize="none"
          disabled={disabled === true}
          onBlur={this.validateEmpty}
          ref={this.textInput}
          onChange={this.validateEmpty}
        />
        <small className={'form-text only-errors ' + (error ? 'show' : 'hide')}>
          Por favor ingresa la {defaultLabel.toLowerCase()}.
        </small>
        <small className="form-text text-muted">
          Ejemplo: Calle 143Bis # 23 a 34
        </small>
      </div>
    );
  }
}

export default Address;
