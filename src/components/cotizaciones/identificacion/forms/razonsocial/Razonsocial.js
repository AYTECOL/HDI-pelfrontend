import React, { Component } from 'react';

import store from '../../../../../store';
import { saveIdentificationValue } from '../../../../../store/actions';
import Helpers from '../../../../../common/helpers/helpers';
class Razonsocial extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: false,
      value: '',
    };
  }

  static toggleDisable(status) {
    if (status === true) {
      Helpers.disabled('#businessname');
    } else {
      Helpers.enabled('#businessname');
    }
  }

  static limit() {
    return 61;
  }

  componentDidMount() {
    this.unsubscribe = store.subscribe(async () => {
      let storeState = store.getState();
      let value = Helpers.toCapitalize(
        storeState.cotizacion.identification.businessname
      );
      if (Helpers.toCapitalize(this.state.value) !== value) {
        this.setState({
          ...this.state,
          value: value,
        });
      }
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  validateEmpty = (e) => {
    e = e.target;
    e.value = Helpers.toCapitalize(e.value);
    let error = false;
    if (e.value.length < 1 || e.value.length > Razonsocial.limit())
      error = true;
    store.dispatch(saveIdentificationValue(e));
    this.setState({
      ...this.state,
      error: error,
      value: e.value,
    });
  };

  render() {
    return (
      <div className={'form-group ' + (this.state.error ? 'error' : '')}>
        <label htmlFor="businessname">Razón social</label>
        <input
          name="businessname"
          id="businessname"
          type="text"
          value={this.state.value}
          className={'form-control'}
          placeholder="Ingresa la razón social"
          onChange={this.validateEmpty}
        />
      </div>
    );
  }
}

export default Razonsocial;
