import React, { Component } from 'react';
import { connect } from 'react-redux';

import store from '../../../../../store';
import { saveInmuebleValue } from '../../../../../store/actions';
import BuildYears from '../../../../../services/AllBuildYears';
import Helpers from '../../../../../common/helpers/helpers/Helpers';

class Anoconstruccion extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: false,
      years: [],
    };
  }

  componentDidMount() {
    this.getYears();
  }

  async getYears() {
    let years = await BuildYears.get();
    this.setState({
      years,
    });
  }

  validateEmpty = async (e) => {
    if (e === 'notempty') return;
    e = e.target;
    let error = false;
    if (e.value.length < 1) error = true;
    if (error === false) Helpers.removeClass('.anoconstruido', 'error');
    await store.dispatch((dispatch) => {
      dispatch(saveInmuebleValue(e));
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
          'anoconstruido input-select form-group ' +
          (this.state.error ? 'error' : '')
        }
      >
        <label htmlFor="anoconstruido">
          Año en que fue construido inmueble
        </label>
        <select
          disabled={this.state.disabled ? 'disabled' : ''}
          name="anoconstruido"
          id="anoconstruido"
          className={(this.state.disabled ? 'disabled ' : '') + 'form-control'}
          value={value}
          onBlur={this.validateEmpty}
          onChange={this.validateEmpty}
        >
          <option value="">Selecciona</option>
          {this.state.years.map((option) => (
            <option key={option.buildYearCode} value={option.buildYearCode}>
              {option.answer}
            </option>
          ))}
        </select>
      </div>
    );
  }
}

export default connect(({ Inmueble: { anoconstruido: value } }) => ({
  value,
}))(Anoconstruccion);
