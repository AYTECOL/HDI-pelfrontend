import React, { Component } from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';

import store from '../../../../../store';
import { mapShow, saveIdentificationValue } from '../../../../../store/actions';
import Help from '../../../../../common/icons/help';
import {
  isValidDirection,
  validationMessages,
} from '../../../../../common/validations';
import { Tooltip } from '../../../../Tooltip';

/**
 * @type {{state:{errors:string[]}}}
 */
class Address extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errors: [],
      disabled: true,
    };
    this.textInput = React.createRef();
  }

  UNSAFE_componentWillUpdate(nextProps, nextState) {
    if (this.props.address !== nextProps.address)
      nextState.errors = this.getErrors(nextProps.address);
    const prevIdentification = this.props;
    const { city, department } = nextProps;
    let disabled = false;
    if (!city && !department) disabled = true;
    nextState.disabled = disabled;
    nextState.errors = disabled ? [] : nextState.errors;
    if (
      (city && city !== prevIdentification.city) ||
      (department && department !== prevIdentification.department)
    )
      this.textInput.current.focus();
  }

  getErrors(value) {
    let errors = [];
    if (!value || value.length > 200)
      errors.push('Ingresa una dirección del hogar valida');
    if (!isValidDirection(value)) errors.push(validationMessages.addressRegex);
    return errors;
  }

  validateChar = (event) => {
    if (!isValidDirection(event.key)) {
      event.preventDefault();
      return false;
    }
  };
  render() {
    const { address } = this.props;
    const { errors, disabled } = this.state;
    const defaultLabel = 'Dirección del hogar a asegurar';
    return (
      <div className={'form-group ' + (errors.length ? 'error' : '')}>
        <div className="d-flex position-relative">
          <label htmlFor="address">{defaultLabel}</label>
          <Tooltip
            className={'ml-auto'}
            placement="left"
            title="Asegúrate de ingresar correcta la dirección del hogar, ésta se tendrá en cuenta en caso de siniestro"
          >
            <Help className={'ml-auto icon-primary'} />
          </Tooltip>
        </div>
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
          onChange={({ target }) => {
            store.dispatch(saveIdentificationValue(target));
          }}
          onBlur={() => {
            if (store.getState().showMap !== true)
              store.dispatch(mapShow(true));
          }}
          ref={this.textInput}
          onKeyPress={this.validateChar}
        />
        {errors.map((error, i) => (
          <small key={i} className={'form-text only-errors'}>
            {error}
          </small>
        ))}
        <small className="form-text text-muted">
          Ejemplo: Calle 143Bis Carrera 23 a 34
        </small>
      </div>
    );
  }
}

export default connect(
  ({
    cotizacion: {
      identification: { address, city, department },
    },
  }) => ({
    address,
    city,
    department,
  })
)(Address);
