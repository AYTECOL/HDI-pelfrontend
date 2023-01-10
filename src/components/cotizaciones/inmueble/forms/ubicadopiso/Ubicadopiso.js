import React, { Component } from 'react';
import { connect } from 'react-redux';

import store from '../../../../../store';
import { saveInmuebleValue } from '../../../../../store/actions';
import Helpers from '../../../../../common/helpers/helpers';
import Allfloors from '../../../../../services/Allfloors';
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
    const { maxFloors, maxFloorsMessage } = Allfloors;
    const length = floors === maxFloorsMessage ? maxFloors + 1 : floors;
    const floorsAvalables = Array.from({ length }, (_v, i) => i + 1);
    return (
      <div
        className={
          'pisonumero input-select form-group ' +
          (this.state.error ? 'error' : '')
        }
      >
        <label htmlFor="pisonumero">
          Piso donde se encuentra el Apartamento
        </label>
        <select
          name="pisonumero"
          id="pisonumero"
          className="form-control"
          value={value}
          onBlur={this.validateEmpty}
          onChange={this.validateEmpty}
        >
          <option value="">Seleccione</option>
          {floorsAvalables.map((option, i) => {
            if (i + 1 > maxFloors)
              return (
                <option key={i} value={maxFloors + 1}>
                  {maxFloorsMessage}
                </option>
              );
            return (
              <option key={i} value={option}>
                {option}
              </option>
            );
          })}
        </select>
      </div>
    );
  }
}

export default connect(({ Inmueble: { numerodepisos, pisonumero } }) => ({
  floors: numerodepisos,
  value: pisonumero,
}))(Ubicadopiso);
