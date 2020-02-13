import React, { Component } from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';

import store from '../../../../../store';
import {mapShow, saveIdentificationValue} from '../../../../../actions';

class Address extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: false,
      disabled: true
    };
    this.textInput = React.createRef();
  }

  UNSAFE_componentWillUpdate(nextProps, nextState) {
    const prevIdentification = this.props;
    const { address, city, department } = nextProps;
    let disabled = true;
    let error = false;
    if (address.length < 1 || address.length > 200) error = true;
    if (city && department) disabled = false;
    nextState.disabled = disabled;
    nextState.error = !disabled && error;
    if (
      city !== prevIdentification.city ||
      department !== prevIdentification.department
    )
      this.textInput.current.focus();
  }

  validateEmpty = e => {
    e = e.target;
    let error = false;
    if (e.value.length < 1 || e.value.length > 200) error = true;
    store.dispatch(saveIdentificationValue(e));
    if (store.getState().showMap !== true) store.dispatch(mapShow(true));
    this.setState({
      ...this.state,
      error: error
    });
  };

  render() {
    const { address } = this.props;
    const { error, disabled } = this.state;
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

export default connect(
  ({
    cotizacion: {
      identification: { address, city, department }
    }
  }) => ({
    address,
    city,
    department
  })
)(Address);
