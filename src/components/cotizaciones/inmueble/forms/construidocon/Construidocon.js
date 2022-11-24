import React, { Component } from 'react';

import store from '../../../../../store';
import { saveInmuebleValue } from '../../../../../store/actions';

import './Construidocon.scss';
import AllBuildMaterial from '../../../../../services/AllBuildMaterial';
import Helpers from '../../../../../common/helpers/helpers';
import { connect } from 'react-redux';

class Construidocon extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: false,
      show: false,
      materials: [],
    };
  }

  componentDidMount() {
    this.getMaterials();
  }

  async getMaterials() {
    let materials = await AllBuildMaterial.get();
    this.setState({
      ...this.state,
      materials,
    });
  }

  validateEmpty = (e) => async () => {
    let error = false;
    if (e.value.length < 1) error = true;
    if (error === false) Helpers.removeClass('.construidocon', 'error');
    await store.dispatch((dispatch) => {
      dispatch(saveInmuebleValue(e));
      dispatch(
        saveInmuebleValue({
          name: 'indexBuild',
          value: e.data,
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
    const { error, materials } = this.state;
    return (
      <div
        className={
          'construidocon no-icon gridgrid form-group ' + (error ? 'error' : '')
        }
      >
        <label htmlFor="construidocon">El inmueble está construido con</label>
        <div className="row grid-select">
          {materials.map((option, key) => (
            <div key={key} className="col col-6 col-sm-12 col-md-4 col-lg-4">
              <div
                className={
                  'select-item row ' +
                  (value === option.buildMaterialCode ? 'active' : '')
                }
                onClick={this.validateEmpty({
                  data: option.order,
                  value: option.buildMaterialCode,
                  text: option.answer,
                  name: 'construidocon',
                })}
              >
                <div className="col col-12 no-padding">
                  {+option.order === 1 ? (
                    <i className="concreto">&nbsp;</i>
                  ) : (
                    ''
                  )}
                  {+option.order === 2 ? (
                    <i className="ladrillo">&nbsp;</i>
                  ) : (
                    ''
                  )}
                  {+option.order === 3 ? <i className="aceror">&nbsp;</i> : ''}
                </div>
                <div className="col col-12 no-padding">
                  <p>{option.answer}</p>
                </div>
                <div className="tool-tip-hover">
                  <p>{option.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default connect(({ Inmueble: { construidocon } }) => ({
  value: construidocon,
}))(Construidocon);
