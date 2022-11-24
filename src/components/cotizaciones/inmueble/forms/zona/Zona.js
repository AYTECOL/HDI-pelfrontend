import React, { Component } from 'react';

import store from '../../../../../store';
import { saveInmuebleValue } from '../../../../../store/actions';
import './Zona.scss';
import AllPropertiesZones from '../../../../../services/AllPropertiesZones';
import Helpers from '../../../../../common/helpers/helpers';
import { connect } from 'react-redux';

class Zona extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: false,
      zonas: [],
    };
  }

  componentDidMount() {
    this.getZones();
  }

  async getZones() {
    let zonas = await AllPropertiesZones.get();
    this.setState({
      ...this.state,
      zonas: zonas,
    });
  }

  saveData = (e) => (event) => {
    Helpers.removeClass('.zona', 'error');
    store.dispatch(saveInmuebleValue(e));
  };

  render() {
    const { value } = this.props;
    return (
      <div className={'zona no-icon form-group ' + this.state.error}>
        <label htmlFor="zona">El inmueble está ubicado en zona</label>
        <ul className="select-item" id="zona">
          {this.state.zonas.map((option, key) => (
            <li
              key={option.zoneCode}
              className={+value === +option.zoneCode ? 'active' : ''}
              onClick={this.saveData({
                value: +option.zoneCode,
                name: 'zona',
                text: option.answer,
              })}
            >
              {option.answer}
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default connect(({ Inmueble }) => {
  return { value: Inmueble.zona };
})(Zona);
