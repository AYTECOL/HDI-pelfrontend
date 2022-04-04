import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Masknumbermoney from '../../../../common/helpers/masknumbermoney/Masknumbermoney';
import store from '../../../../store';
import Plans from '../../../cotizaciones/cotizacion/plans/Plans';
import './Coberturas.scss';
import check from '../../../../common/images/check-img.png';
import Helpers from '../../../../common/helpers/helpers/Helpers';
import { getRulesByCode, stateCoverage } from '../../../../common';

class Coberturas extends Component {
  constructor(props) {
    super(props);
    this.state = {
      plans: store.getState().AllPlans,
      index: 0,
      coverturasTotal: 0,
      Inmueble: {},
    };
    for (let i = 0; i < 3; i++) {
      this.state.plans[i] = {
        coverages: [
          {
            name: '',
            values: [],
          },
        ],
      };
    }
  }

  static getSelectByItems(item) {
    for (let i in item) {
      if (item[i].default === true) {
        return item[i].name;
      }
    }
    return '';
  }

  static getSelectFields(item) {
    for (let i in item) {
      if (item[i].default === true) {
        return i;
      }
    }
    return '';
  }

  static calcValue(plans, index) {
    if (typeof plans[index] === 'undefined') return;
    if (typeof plans[index].coverages === 'undefined') return;
    for (let i = 0; i < plans[index].coverages.length; i++) {
      let d = plans[index].coverages[i].values;
      if (typeof d !== 'undefined') {
        for (let j = 0; j < d.length; j++) {
          if (typeof d[j].values === 'undefined') {
            plans[index].coverages[i].values[j].value_show =
              Coberturas.getValueFields(d[j]);
          } else {
            for (let limit = 0; limit < d[j].values.length; limit++) {
              if (d[j].values[limit].default === true) {
                plans[index].coverages[i].values[j].value =
                  d[j].values[limit].limit;
                plans[index].coverages[i].values[j].value_show =
                  Coberturas.getValueFields(d[j]);
              }
            }
          }
        }
      }
    }
    return plans;
  }

  static getValueFields(item) {
    try {
      let inmueble = store.getState().Inmueble;
      const { max } = getRulesByCode(item.code);
      /**
       * @type {number}
       */
      let value;
      if (typeof item.values !== 'undefined') {
        for (let i = 0; i < item.values.length; i++) {
          if (item.values[i].default === true) {
            return Masknumbermoney.formatToMask(item.values[i].limit);
          }
        }
      } else {
        // Inmueble
        if (item.id === 1) {
          value =
            (Masknumbermoney.formatToNumber(inmueble.inmuebleasegudadovalor) *
              parseInt(item.value)) /
            100;
          //Contenidos
        } else if (item.id === 2) {
          value =
            (Masknumbermoney.formatToNumber(inmueble.contenidoasegudadovalor) *
              parseInt(item.value)) /
            100;
          //Obras
        } else if (item.id === 3) {
          value =
            (Masknumbermoney.formatToNumber(
              inmueble.inmuebleasegudadoobrasvalor
            ) *
              parseInt(item.value)) /
            100;
          //Telefonos moviles
        } else if (item.id === 4) {
          value =
            (Masknumbermoney.formatToNumber(
              inmueble.inmuebleasegudadotelefonosvalor
            ) *
              parseInt(item.value)) /
            100;
          //Hurto siempre basado en hurto calificado
        } else if (item.id === 5) {
          let dataHurto = [];
          let hurto = Coberturas.getCoverangeById(3);
          for (let i = 0; i < hurto.values.length; i++)
            dataHurto.push(Coberturas.getValueFields(hurto.values[i]));
          value =
            ((Masknumbermoney.formatToNumber(dataHurto[0]) +
              Masknumbermoney.formatToNumber(dataHurto[1])) *
              parseInt(item.value)) /
            100;
          //Joyas
        } else if (item.id === 6) {
          value =
            (Masknumbermoney.formatToNumber(
              inmueble.inmuebleasegudadojoyasvalor
            ) *
              parseInt(item.value)) /
            100;
          //Contenido mobile
        } else if (item.id === 7) {
          let joyas =
            (Masknumbermoney.formatToNumber(
              inmueble.inmuebleasegudadojoyasvalor
            ) *
              100) /
            100;
          let contenido =
            (Masknumbermoney.formatToNumber(inmueble.contenidoasegudadovalor) *
              10) /
            100;
          let telefonos =
            (Masknumbermoney.formatToNumber(
              inmueble.inmuebleasegudadotelefonosvalor
            ) *
              100) /
            100;
          value =
            ((joyas + contenido + telefonos) * parseInt(item.value)) / 100;
        }
      }
      if (value) {
        return Masknumbermoney.formatToMask(
          max ? (value > max ? max : value) : value
        );
      }
      return 'N/A';
    } catch (e) {
      return 'N/A';
    }
  }

  static getCoverangeById(id) {
    let index = store.getState().indexPlan;
    let plans = store.getState().AllPlans[index].coverages;
    for (let i = 0; i < plans.length; i++) {
      if (plans[i].id === id) {
        return plans[i];
      }
    }
  }

  static calcValueCoverages(valuesCoverage) {
    if (typeof valuesCoverage !== 'undefined') {
      let sumTotal = 0;
      if (valuesCoverage.values) {
        for (let i = 0; valuesCoverage['values'].length > i; i++) {
          sumTotal = sumTotal + valuesCoverage['values'][i]['value_to_quotate'];
        }
        return Masknumbermoney.formatToMask(sumTotal);
      } else {
        return '';
      }
    } else {
      return '';
    }
  }

  componentDidMount() {
    this.unsubscribe = store.subscribe(() => {
      let storeState = store.getState();
      if (
        this.state.plans !== storeState.AllPlans ||
        storeState.Inmueble !== this.state.Inmueble ||
        this.state.index !== storeState.indexPlan
      ) {
        let plans = Coberturas.calcValue(
          storeState.AllPlans,
          storeState.indexPlan
        );
        if (typeof plans !== 'undefined') {
          const plan = plans[storeState.indexPlan];
          this.setState({
            ...this.state,
            plans: plans,
            Inmueble: storeState.Inmueble,
            index: storeState.indexPlan,
            coverturasTotal: this.countCoverturas(plan),
          });
        }
      }
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  sendAndValidate() {
    Plans.sendAndValidate(
      this.state.plans,
      this.state.index,
      this.props.match.params.id
    );
  }

  countCoverturas(plan) {
    if (typeof plan === 'undefined') return;
    let t = 0;
    let item = plan.coverages;
    for (let i in item) {
      if (item[i].checked === true) {
        t++;
      }
    }
    return t;
  }

  checkCoverturas = (index, key) => (e) => {
    const plans = [...this.state.plans];
    const plan = plans[index];
    let check = plan.coverages[key].checked;
    plans.coverages[key].checked = !check;
    this.setState(
      {
        plans: plans,
        coverturasTotal: this.countCoverturas(plan),
      },
      () => {
        this.sendAndValidate();
      }
    );
  };

  blur = () => {
    this.sendAndValidate();
  };

  render() {
    const { coverturasTotal, plans, index } = this.state;
    const { coverages } = plans[index];
    return (
      <div className="row row-max tabs-cotizaciones row_tab_0 ">
        <div className="col col-12 col-sm-12 col-md-12 col-lg-12 no-padding">
          <div className="row" onClick={Helpers.toggleSlide(0)}>
            <div className="col col-6 col-sm-6 col-md-6 col-lg-6 text-left">
              <h4>
                <span>{coverturasTotal}</span>Coberturas
              </h4>
            </div>
            <div className="col-md-2">
              <b className="title-text">Valor</b>
            </div>
            <div className="col-md-2">
              <b className="text2 title-text">Deducibles</b>
            </div>
            <div className="col-md-2 text-right">
              <div className="close-section closeclose">
                <i>&nbsp;</i>
              </div>
              <div className="close-section open">
                <i>&nbsp;</i>
              </div>
            </div>
          </div>

          <div className="wrapper-box-info">
            {typeof coverages !== 'undefined' &&
              coverages.map((coverage, key) => {
                if (!stateCoverage(coverage)) return null;
                return (
                  <div
                    className={
                      'rowor ' +
                      (coverage.optional === true ? '' : 'disabled-item')
                    }
                    key={key}
                  >
                    {coverage.checked === true ? (
                      <div className="form-group">
                        <div className="row">
                          <div className="col-md-1 center-text">
                            <img src={check} alt="" />
                          </div>

                          <div className="col-md-5 center-text">
                            <label className="description-text">
                              {coverage.name}
                            </label>
                          </div>
                          <div className="col-md-3 center-text">
                            <p className="description-text">
                              {Coberturas.calcValueCoverages(coverage)}
                            </p>
                          </div>
                          <div className="col-md-2 center-text">
                            <p className="description-text">
                              {Coberturas.getSelectByItems(coverage.deductible)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : null}
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Coberturas);
