import React, { Component } from 'react';
import { connect } from 'react-redux';

import store from '../../../../store';
//Componets
import DatosGenerales from '../datosgenerales/Datosgenerales';
import Seguridad from '../seguridad/Seguridad';
import Valoreasegurar from '../valoreasegurar/Valoreasegurar';
import Counter from '../forms/counter/Counter';
import Btns from '../forms/btncontinue/BtnContinue';
// Services
import Risk from '../../../../services/AllRisks';

import './Index.scss';
import {
  saveInmuebleValue,
  typeInmueble as typeInmuebleAction,
} from '../../../../store/actions';
import Loading from '../../../globals/loading/Loading';

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activecasa: 0,
      activeapartamento: 0,
      options: {
        risks: [],
      },
    };

    this.getRisks();
  }

  componentDidMount() {
    Loading.toggle(true);
  }

  async getRisks() {
    let risks = await Risk.get();
    this.setState({
      ...this.state,
      options: risks,
    });
    Loading.toggle(false);
  }

  active = (option) => (e) => {
    let item = +option.riskId;
    let type = +option.riskId;
    store.dispatch((dispatch) => {
      dispatch(typeInmuebleAction(item));
      dispatch(
        saveInmuebleValue({
          name: 'type_risk',
          value: type,
        })
      );
      dispatch(
        saveInmuebleValue({
          name: 'type_risk_id',
          value: item,
        })
      );
    });
  };

  render() {
    const { active, typeInmueble } = this.props;
    const { options } = this.state;
    return (
      <form autoComplete="off" className="index-form inmueble">
        <div className="container">
          <div className="row">
            <div className="col col-sm-12 col-md-12 col-lg-12 title">
              <h2>Descríbenos el inmueble</h2>
              <p>
                Falta poco, diligencia la siguiente información, es importante
                conocer el contexto del riesgo a asegurar
              </p>
            </div>
          </div>

          <div className="row">
            <div className="col col-sm-12 col-md-12 col-lg-12 content-select">
              <ul>
                {options.risks.map((option) => (
                  <li
                    key={option.riskId}
                    data={option.riskId}
                    className={
                      parseInt(active) === parseInt(option.riskId)
                        ? 'active'
                        : ''
                    }
                    onClick={this.active(option)}
                  >
                    <i
                      className={
                        parseInt(option.riskId) === 1
                          ? 'home-icon'
                          : 'apartamento-icon'
                      }
                    >
                      &nbsp;
                    </i>
                    <p>{option.risk_type}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className={typeInmueble === 0 ? 'hide' : ''}>
            <DatosGenerales />

            <hr />

            <Seguridad />

            <hr />

            <Valoreasegurar />

            <div className="row text-center">
              <div className="col col-12">
                <Counter />
              </div>
            </div>

            <div className="row text-center">
              <div className="col col-12">
                <Btns />
              </div>
            </div>
          </div>
        </div>
      </form>
    );
  }
}

export default connect(({ typeInmueble, Inmueble }) => ({
  typeInmueble,
  active: Inmueble.type_risk_id,
}))(Index);
