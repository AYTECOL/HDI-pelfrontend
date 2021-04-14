import React, { Component } from 'react';
import { connect } from 'react-redux';

import store from '../../../../../store';
import { saveInmuebleValue, savePdfInfo } from '../../../../../actions';
import AllFloors from '../../../../../services/Allfloors';
import Helpers from '../../../../../common/helpers/helpers/Helpers';

class Numerodepiso extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errorerror: false,
      floors: [],
    };
  }

  componentDidMount() {
    this.getFloors();
  }

  async getFloors() {
    let allFloors = await AllFloors.get();
    this.setState({
      ...this.state,
      floors: allFloors,
    });
  }

  validateEmpty = async (e) => {
    e = e.target;
    let error = false;
    if (e.value.length < 1) error = true;
    if (error === false) Helpers.removeClass('.numerodepisos', 'error');

    await store.dispatch((dispatch) => {
      dispatch(saveInmuebleValue(e));
      dispatch(saveInmuebleValue({ name: 'pisonumero', value: '' }));
      dispatch(
        savePdfInfo({
          [e.name]: e.value,
        })
      );
      return Promise.resolve();
    });

    if (error !== this.state.error)
      this.setState({
        ...this.state,
        error: error,
      });
  };

  render() {
    const { value } = this.props;
    return (
      <div
        className={
          'numerodepisos input-select form-group ' +
          (this.state.error ? 'error' : '')
        }
      >
        <label htmlFor="numerodepisos">Número de pisos del inmueble</label>
        <select
          name="numerodepisos"
          id="numerodepisos"
          className={'form-control '}
          value={value}
          onBlur={this.validateEmpty}
          onChange={this.validateEmpty}
        >
          <option value="">Seleccione</option>
          {this.state.floors.map((option) => (
            <option key={option.floorCode} value={option.floorCode}>
              {option.answer}
            </option>
          ))}
        </select>
      </div>
    );
  }
}

export default connect(({ Inmueble: { numerodepisos } }) => ({
  value: numerodepisos,
}))(Numerodepiso);
