import React, { Component } from 'react';
import store from '../../../../../store';
import { saveIdentificationValue } from '../../../../../store/actions';

import Helpers from '../../../../../common/helpers/helpers';

class Name extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: false,
      value: '',
    };
  }

  static toggleDisable(status) {
    if (status === true) {
      Helpers.disabled('#name');
    } else {
      Helpers.enabled('#name');
    }
  }

  static limit() {
    return 51;
  }

  componentDidMount() {
    this.unsubscribe = store.subscribe(async () => {
      let storeState = store.getState();
      let value = Helpers.toCapitalize(
        storeState.cotizacion.identification.name
      );
      if (this.state.value !== value) {
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
    if (e.value.length < 1 || e.value.length > Name.limit()) error = true;
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
        <label htmlFor="name">Primer nombre</label>
        <input
          name="name"
          id="name"
          type="text"
          value={this.state.value}
          className={'form-control'}
          placeholder="Ingresa primer nombre"
          onChange={this.validateEmpty}
        />
      </div>
    );
  }
}

export default Name;
