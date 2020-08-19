import React, { Component } from 'react';
import { connect } from 'react-redux';

import store from '../../../../../store';
import { saveInmuebleValue } from '../../../../../actions';
import Helpers from '../../../../../common/helpers/helpers/Helpers';

class Ubicadopiso extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: false,
      floors: [],
    };
  }

  validateEmpty = (e) => {
    if (e === 'notempty') return;
    e = e.target;
    let error = false;
    if (e.value.length < 1) error = true;
    if (error === false) Helpers.removeClass('.pisonumero', 'error');
    this.setState({
      ...this.state,
      error: error,
    });
    store.dispatch(saveInmuebleValue(e));
  };

  render() {
    const { value, floors } = this.props;
    const floorsAvalables = Array.from({ length: floors }, (_v, i) => i + 1);
    return (
      <div
        className={
          'pisonumero input-select form-group ' +
          (this.state.error ? 'error' : '')
        }
      >
        <label htmlFor="pisonumero">Piso donde se encuentra ubicado</label>
        <select
          name="pisonumero"
          id="pisonumero"
          className="form-control"
          value={value}
          onBlur={this.validateEmpty}
          onChange={this.validateEmpty}
        >
          <option value="">Seleccione</option>
          {floorsAvalables.map((option, i) => (
            <option key={i} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    );
  }
}

export default connect(({ Inmueble: { numerodepisos, pisonumero } }) => ({
  floors: numerodepisos,
  value: pisonumero,
}))(Ubicadopiso);
