import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import './Asistencias.scss';
import Plans from '../plans/Plans';
import Helpers from '../../../../common/helpers/helpers/Helpers';
import { connect } from 'react-redux';
import { AllPlans } from '../../../../actions';

class Asistencias extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error1: false,
      error2: false,
    };
  }

  countAsistencias(plan) {
    if (typeof plan === 'undefined') return;
    let t = 0;
    let item = plan.assists[0].values;
    for (let i in item) {
      if (item[i].checked === true) t++;
      if (typeof item[i].assists !== 'undefined') {
        for (let o in item[i].assists) {
          if (item[i].assists[o].checked === true) t++;
        }
      }
    }
    return t;
  }

  sendAndValidate() {
    const { plans, indexPlan, match } = this.props;
    Plans.sendAndValidate(plans, indexPlan, match.params.id);
  }

  isCheckedAssistsByCode(code) {
    const { plan } = this.props;
    let status = false;
    for (let i = 0; i < plan.assists.length; i++) {
      for (let j = 0; j < plan.assists[i].values.length; j++) {
        for (let k = 0; k < plan.assists[i].values[j].assists.length; k++) {
          if (
            parseInt(plan.assists[i].values[j].assists[k].code) ===
            parseInt(code)
          ) {
            status = plan.assists[i].values[j].assists[k].checked;
          }
        }
      }
    }
    return status;
  }
/**
 * return all assists in true or false
 * @param {Number} key
 * @param {boolean} isChecked
 * @returns {Array}
 */
  changeCheckAssistsByKey(key,isChecked) {
    const { indexPlan, plans } = this.props;
    let newPlans = [...plans];
    for (const assist of newPlans[indexPlan].assists) {
      for (let j = 0; j < assist.values.length; j++) {
        for (let k = 0; k < assist.values[j].assists.length; k++) {
          if (k >= key) assist.values[j].assists[k].checked = isChecked;
        }
      }
    }
    return newPlans;
  }

  checkAsistencia = (key, k, i, parent) => {
    const index = this.props.indexPlan;
    let check;
    let { plans } = this.props;
    let error1 = false;
    let error2 = false;
    const {assists: assistsParent} = plans[index];
    const codeSubAssists = parseInt(assistsParent[key].values[k].assists[i].code);
    if (typeof parent !== 'undefined') {
      check = assistsParent[key].values[k].checked;
      assistsParent[key].values[k].checked = !check;
      if (!check === false) plans = this.changeCheckAssistsByKey(0, false);
    } else {
      check = assistsParent[key].values[k].assists[i].checked;
      if ( codeSubAssists === 9695) {
        if (assistsParent[key].values[k].checked === false) {
          error1 = true;
          error2 = false;
        } else {
          assistsParent[key].values[k].assists[i].checked = !check;
          if (!check === false) plans = this.changeCheckAssistsByKey(i, false);
        }
      } else {
        if (this.isCheckedAssistsByCode(9695) === false) {
          error1 = false;
          error2 = true;
        } else {
          if (codeSubAssists === 9697 && !check) {
            plans = this.changeCheckAssistsByKey(0,true);
          }else{
            assistsParent[key].values[k].assists[i].checked = !check;
          }
          
          
        }
      }
    }
    this.setState(
      {
        error1: error1,
        error2: error2,
      },
      async () => {
        await AllPlans(plans);
        if (error1 === false && error2 === false) {
          this.sendAndValidate();
        }
      }
    );
  };

  render() {
    const { plan } = this.props;
    const assistsTotal = this.countAsistencias(plan);
    return (
      <div
        className={
          'asistencias-group ' +
          (typeof this.props.summary === 'undefined' ? '' : 'summary')
        }
      >
        {plan &&
          typeof plan.assists !== 'undefined' &&
          plan.assists.map((option, key) => (
            <div
              className={'row row-max tabs-cotizaciones row_tab_1 ' + (key + 1)}
              key={key}
            >
              <div className="col col-12 col-sm-12 col-md-12 col-lg-12 no-padding">
                <div className="row" onClick={Helpers.toggleSlide(key + 1)}>
                  <div className="col col-6 col-sm-6 col-md-6 col-lg-6 text-left">
                    <h4>
                      <span>{assistsTotal}</span>
                      {option.name}
                    </h4>
                  </div>
                  <div className="col col-6 col-sm-6 col-md-6 col-lg-6 text-right">
                    <div className="close-section closeclose">
                      Ocultar <i>&nbsp;</i>
                    </div>
                    <div className="close-section open">
                      Ver <i>&nbsp;</i>
                    </div>
                  </div>
                </div>
                <div className="wrapper-box asistencias">
                  {option.values.map((opt, k) => (
                    <div
                      className={
                        'rowor ' +
                        (opt.optional === false ? 'disabled-item' : '')
                      }
                      key={k}
                    >
                      <div className="row">
                        <div className="col col-12 col-sm-12 col-md-12 col-lg-12 asistencia items-checkboxes">
                          <div className="form-group">
                            <input
                              type="checkbox"
                              name={'itemm' + k + '_' + key}
                              id={'itemm' + k + '_' + key}
                              checked={opt.checked === true ? 'checked' : false}
                              disabled={opt.optional === false}
                              onChange={() =>
                                this.checkAsistencia(key, k, 0, true)
                              }
                            />
                            <div className="group">
                              <label htmlFor={'itemm' + k + '_' + key}>
                                {opt.name}
                              </label>
                              <p>{opt.description}</p>
                            </div>
                            {opt.assists.map((op, i) => (
                              <div className="row" key={i}>
                                <div
                                  className={
                                    'col col-12 col-sm-12 col-md-12 col-lg-12 items-checkboxes ' +
                                    (op.optional === false ? 'disabled' : '')
                                  }
                                >
                                  <input
                                    type="checkbox"
                                    name={'itemm' + k + '_' + key + '_' + i}
                                    id={'itemm' + k + '_' + key + '_' + i}
                                    disabled={
                                      op.optional === false ||
                                      opt.optional === false
                                    }
                                    checked={
                                      op.checked === true ? 'checked' : false
                                    }
                                    onChange={() =>
                                      this.checkAsistencia(key, k, i)
                                    }
                                  />
                                  <div className="group">
                                    <label
                                      htmlFor={
                                        'itemm' + k + '_' + key + '_' + i
                                      }
                                    >
                                      {op.name}
                                    </label>
                                    <p>{op.description}</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="msj-box">
                  <p
                    className={
                      'error ' + (this.state.error1 === true ? 'show' : 'hide')
                    }
                  >
                    Por favor seleccione la Asistencia Básica
                  </p>
                  <p
                    className={
                      'error ' + (this.state.error2 === true ? 'show' : 'hide')
                    }
                  >
                    Por favor seleccione la Asistencia Básica y la Asistencia
                    Hogar Plus
                  </p>
                </div>
              </div>
            </div>
          ))}
      </div>
    );
  }
}

export default withRouter(
  connect(({ AllPlans: plans, indexPlan }) => ({
    plans,
    indexPlan,
    plan: plans[indexPlan],
  }))(Asistencias)
);
