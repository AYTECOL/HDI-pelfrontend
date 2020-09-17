import React, { Component, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import Masknumbermoney from '../../../../common/helpers/masknumbermoney/Masknumbermoney';
import store from '../../../../store';
import Helpers from '../../../../common/helpers/helpers/Helpers';
import Plans from '../plans/Plans';
import { AllPlans as AllPlansCreator } from '../../../../actions';

class Coberturas extends Component {
  _isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
      plan: store.getState().AllPlans,
      index: 0,
      coverturasTotal: 0,
    };
    this.state.plan = {
      coverages: [
        {
          name: '',
          values: [],
        },
      ],
    };
  }

  static getSelectByItems(item) {
    for (let i in item) {
      if (item[i].default === true) {
        return item[i].id;
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

  /**
   * Cal value for each coverage
   * @param plan selected plan
   * @param type if you want cal a single type coverage
   * @returns {*}
   */
  static calcValue(plan, type = null) {
    if (typeof plan === 'undefined') return;
    if (typeof plan.coverages === 'undefined') return;
    for (let i = 0; i < plan.coverages.length; i++) {
      let d = plan.coverages[i].values;
      if (typeof d !== 'undefined') {
        for (let j = 0; j < d.length; j++) {
          if (typeof d[j].values === 'undefined') {
            plan.coverages[i].values[j].value_show = Coberturas.getValueFields(
              d[j],
              type,
              plan
            );
          } else {
            for (let limit = 0; limit < d[j].values.length; limit++) {
              if (d[j].values[limit].default === true) {
                plan.coverages[i].values[j].value = d[j].values[limit].limit;
                plan.coverages[i].values[
                  j
                ].value_show = Coberturas.getValueFields(d[j], type, plan);
              }
            }
          }
        }
      }
    }
    return plan;
  }

  /**
   *
   * @param item the current coverage in the iteration
   * @param type if you want cal a single type coverage
   * @param plan current plan selected by user.
   * @returns {*}
   */
  static getValueFields(item, type = null, plan = null) {
    try {
      let inmueble = store.getState().Inmueble;
      if (typeof item.values !== 'undefined') {
        for (let i = 0; i < item.values.length; i++) {
          if (item.values[i].default === true) {
            return Masknumbermoney.formatToMask(item.values[i].limit);
          }
        }
      } else {
        // Inmueble
        if (item.id === 1) {
          if (type === item.id || type === null) {
            return Masknumbermoney.formatToMask(
              (Masknumbermoney.formatToNumber(inmueble.inmuebleasegudadovalor) *
                parseInt(item.value)) /
                100
            );
          } else {
            return item.value_show;
          }
          //Contenidos
        } else if (item.id === 2) {
          if (type === item.id || type === null) {
            return Masknumbermoney.formatToMask(
              (Masknumbermoney.formatToNumber(
                inmueble.contenidoasegudadovalor
              ) *
                parseInt(item.value)) /
                100
            );
          } else {
            return item.value_show;
          }
          //Obras
        } else if (item.id === 3) {
          if (type === item.id || type === null) {
            return Masknumbermoney.formatToMask(
              (Masknumbermoney.formatToNumber(
                inmueble.inmuebleasegudadoobrasvalor
              ) *
                parseInt(item.value)) /
                100
            );
          } else {
            return item.value_show;
          }
          //Telefonos moviles
        } else if (item.id === 4) {
          if (type === item.id || type === null) {
            return Masknumbermoney.formatToMask(
              (Masknumbermoney.formatToNumber(
                inmueble.inmuebleasegudadotelefonosvalor
              ) *
                parseInt(item.value)) /
                100
            );
          } else {
            return item.value_show;
          }
          //Hurto siempre basado en hurto calificado
        } else if (item.id === 5) {
          let j = 0;
          let dataHurto = [];
          let hurto = Coberturas.getCoverangeById(3, plan);
          let hurtoSimple = 0;
          if (hurto !== null && item.value_show == undefined) {
            for ( j; j < hurto.values.length; j++){
              dataHurto.push(hurto.values[j].value_show);
              hurtoSimple += Masknumbermoney.formatToNumber(
                hurto.values[j].value_show
              )
            }
            return Masknumbermoney.formatToMask(hurtoSimple);
          } else {
            return item.value_show;
          }
          //Joyas
        } else if (item.id === 6) {
          if (type === item.id || type === null) {
            return Masknumbermoney.formatToMask(
              (Masknumbermoney.formatToNumber(
                inmueble.inmuebleasegudadojoyasvalor
              ) *
                parseInt(item.value)) /
                100
            );
          } else {
            return item.value_show;
          }
          //Contenido mobile
        } else if (item.id === 7) {
          if (type === item.id || type === null) {
            let contenido = Masknumbermoney.formatToNumber(
              inmueble.contenidoasegudadovalor
            );
            return Masknumbermoney.formatToMask(
              (contenido * parseInt(item.value)) / 100
            );
          } else {
            return item.value_show;
          }
        }
      }
      return 'N/A';
    } catch (e) {
      return 'N/A';
    }
  }

  /**
   *
   * @param id Of coverage that you want find
   * @param plan Current plan selected by user
   * @returns {*}
   */
  static getCoverangeById(id, plan = null) {
    let index = store.getState().indexPlan;
    let plans = store.getState().AllPlans[index];
    if (plan !== null) {
      plans = plan;
    }
    if (typeof plans.coverages !== 'undefined') {
      for (let i = 0; i < plans.coverages.length; i++) {
        if (plans.coverages[i].id === id) {
          return plans.coverages[i];
        }
      }
    } else {
      return null;
    }
  }

  /**
   *
   * @param code Of coverage that you want find
   * @returns {{coverange: ({values, name}|*), index: number}}
   */
  static getCoverangeByCode(code) {
    let index = store.getState().indexPlan;
    let plans = store.getState().AllPlans[index].coverages;
    for (let i = 0; i < plans.length; i++) {
      if (plans[i].code_content === code) {
        return {
          index: i,
          coverange: plans[i],
        };
      }
    }
  }

  /**
   * Valida if coverage field is disable
   * @param option coverage
   * @param opt coverage field
   * @returns {boolean}
   */
  static isDisabled(option, opt) {
    if (option.code_content === 9691) {
      return option.checked === false;
    }
    return (
      option.optional === false ||
      option.checked === false ||
      (typeof opt.disable !== 'undefined' && opt.disable === true)
    );
  }

  /**
   * Validate if each coverage field it show or not.
   * @param plan Plan selected by user
   * @returns {boolean}
   */
  showItem(plan) {
    for (let key = 0; key < plan.coverages.length; key++) {
      let option = plan.coverages[key].values;
      if (typeof option !== 'undefined') {
        for (let k = 0; k < option.length; k++) {
          let opt = option[k];
          let inmueble = store.getState().Inmueble;
          // Inmueble
          if (opt.id === 1) {
            plan.coverages[key].values[k].hired =
              inmueble.inmuebleasegudado === 1;
            //Contenidos
          } else if (opt.id === 2) {
            plan.coverages[key].values[k].hired =
              inmueble.contenidoasegudado === 1;
            //Obras
          } else if (opt.id === 3) {
            plan.coverages[key].values[k].hired =
              inmueble.inmuebleasegudadoobras === 1;
            //Telefonos moviles
          } else if (opt.id === 4) {
            plan.coverages[key].values[k].hired =
              inmueble.inmuebleasegudadotelefonos === 1;
            //Hurto siempre basado en hurto calificado
          } else if (opt.id === 5) {
            plan.coverages[key].values[k].hired =
              inmueble.contenidoasegudado === 1;
            //Joyas
          } else if (opt.id === 6) {
            plan.coverages[key].values[k].hired =
              inmueble.inmuebleasegudadojoyas === 1;
            //Contenido mobile
          } else if (opt.id >= 7 || opt.id === 0) {
            plan.coverages[key].values[k].hired = true;
          }
        }
      }
    }
    if (this._isMounted === true) {
      this.setState({
        ...this.state,
        plan,
      });
    }
  }

  componentDidMount() {
    this._isMounted = true;
    this.unsubscribe = store.subscribe(() => {
      let storeState = store.getState();
      let plan = storeState.AllPlans[storeState.indexPlan];
      if (typeof plan !== 'undefined' && this._isMounted === true) {
        this.setState({
          ...this.state,
          plan: plan,
          index: storeState.indexPlan,
        });
        setTimeout(() => {
          this.showItem(plan);
          this.countCoverturas(plan);
        }, 250);
      }
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
    this._isMounted = false;
  }

  /**
   * Save and send current plan to service ´prima´
   * @param plan selected plan by user.
   */
  sendAndValidate(plan) {
    let storeState = store.getState();
    let index = storeState.indexPlan;
    let plans = storeState.AllPlans;
    store.dispatch(AllPlansCreator(plans));
    setTimeout(() => {
      plan = Coberturas.calcValue(plan, 5);
      plans[index] = plan;
      Plans.sendAndValidate(plans, index, this.props.match.params.id);
    }, 500);
  }

  /**
   * Count coverage by plan
   * @param plan selected plan by user.
   */
  countCoverturas(plan) {
    if (typeof plan === 'undefined') return;
    let t = 0;
    let item = plan.coverages;
    for (let i in item) {
      if (item[i].checked === true) {
        t++;
      }
    }
    if (this._isMounted === true) {
      this.setState({
        ...this.state,
        coverturasTotal: t,
      });
    }
  }

  checkCoverturas = (index, key) => (e) => {
    let check = this.state.plan.coverages[key].checked;
    let newPlans = this.state.plan;
    let state = true;
    newPlans.coverages[key].checked = !check;

    let code = newPlans.coverages[key].code_content;
    //Validations for dependence's coverages
    if (parseInt(code) === 9692 && !check === false) {
      let find = Coberturas.getCoverangeByCode(9691);
      newPlans.coverages[find.index].checked = false;

      find = Coberturas.getCoverangeByCode(9693);
      newPlans.coverages[find.index].checked = false;
    }
    if (parseInt(code) === 9691 && !check === true) {
      let find = Coberturas.getCoverangeByCode(9692);
      if (find.coverange.checked === false) {
        newPlans.coverages[key].checked = false;
        state = false;
      }
    }
    if (parseInt(code) === 9693 && !check === true) {
      let find = Coberturas.getCoverangeByCode(9692);
      if (find.coverange.checked === false) {
        newPlans.coverages[key].checked = false;
        state = false;
      }
    }
    if (state === true) {
      this.setState({
        ...this.state,
        plans: newPlans,
      });
      this.countCoverturas(newPlans);
      this.sendAndValidate(newPlans);
    }
  };

  /**
   * todo Merge method with static method are equals
   * @param code code Of coverage that you want find
   */
  getCoverangeByCode(code) {
    let index = store.getState().indexPlan;
    let plans = store.getState().AllPlans[index].coverages;
    let coverange = {};
    for (let i = 0; i < plans.length; i++) {
      if (typeof plans[i].values !== 'undefined') {
        for (let j = 0; j < plans[i].values.length; j++) {
          if (plans[i].values[j].code === code) {
            coverange = plans[i];
          }
        }
      }
    }
    return coverange;
  }

  /**
   * Event change of coverage field
   * @param k Of value of the specific coverage
   * @param key Of coverage in the iterator
   * @param type 1 or 2, input or select
   * @returns {Function}
   */
  validateChange = (item, k, valueHurto) => {
    let formatValue = Masknumbermoney.formatToNumber(item.values[k].value_show);
    switch (item.values[k].code) {
      case 3044:
        if (formatValue > 50000000 || formatValue < 900000) {
          item.values[k].errors.push(
            `Valor Asegurado de Contenidos Móviles es ${
              formatValue > 50000000 ? 'superior' : 'inferior'
            } al permitido. `
          );
          return 1;
        }
        break;
      case 3045:
        if (formatValue > 50000000 || formatValue < 900000) {
          item.values[k].errors.push(
            `Valor Asegurado de Joyas es ${
              formatValue > 50000000 ? 'superior' : 'inferior'
            } al permitido. `
          );
          return 1;
        }
        break;
      case 9652:
        if (formatValue >= 10000001 || formatValue <= 850000) {
          item.values[k].errors.push(
            `Valor Asegurado de Teléfonos Móviles es ${
              formatValue >= 10000001 ? 'superior' : 'inferior'
            } al permitido. `
          );
          return 1;
        }
        break;
      case 9691:
        if (formatValue > valueHurto) {
          item.values[k].errors.push(
            `Valor Asegurado de Hurto simple ${
              formatValue > valueHurto ? 'superior' : 'inferior'
            } al permitido. `
          );
          return 1;
        }
        break;
    }
  };
  inputChange = (k, key, type) => (e) => {
    let plan = this.state.plan;
    let item = plan.coverages[key];
    const hurtoCalificado = plan.coverages.find(
      (element) => element.code_content === 9692
    );
    const otrosContenidos = plan.coverages.find(
      (element) => element.code_content === 9670
    );
    const valueHurto =
      hurtoCalificado &&
      hurtoCalificado.values &&
      hurtoCalificado.values[0].value_to_quotate;
    const valueContenido =
      otrosContenidos &&
      otrosContenidos.values &&
      otrosContenidos.values[0].value_to_quotate;
    //Input
    if (type === 1) {
      item.values[k].value_show = Masknumbermoney.formatToMask(e.target.value);
      item.values[k].errors = [];
      //Validations extra

      //--------
      //Validations of max and min
      if (
        parseInt(item.values[k].code) === 9692 ||
        parseInt(item.values[k].code) === 3017 ||
        parseInt(item.values[k].code) === 3008
      ) {
        let coverange = this.getCoverangeByCode(9667);
        if (typeof coverange.values !== 'undefined') {
          for (let i = 0; i < coverange.values.length; i++) {
            if (coverange.values[i].id === item.values[k].id) {
              if (
                typeof coverange.values[i].value_show !== 'undefined' &&
                typeof item.values[k].value_show !== 'undefined'
              ) {
                if (
                  Masknumbermoney.formatToNumber(
                    coverange.values[i].value_show
                  ) < Masknumbermoney.formatToNumber(item.values[k].value_show)
                ) {
                  let n = coverange.values[i].name
                    .toUpperCase()
                    .replace('VALOR ', '');
                  if (parseInt(item.values[k].code) === 3008) {
                    item.values[k].errors.push(
                      'Valor asegurado del amparo ' +
                        item.name +
                        ', es mayor al reportado en “' +
                        n +
                        '” del amparo de INCENDIO '
                    );
                  } else {
                    item.values[k].errors.push(
                      'Valor asegurado de ' +
                        n +
                        ' es mayor al reportado en INCENDIO'
                    );
                  }
                }
              }
            }
          }
          if (parseInt(item.values[k].code) === 3008) {
            if (
              500000000 <
              Masknumbermoney.formatToNumber(item.values[k].value_show)
            ) {
              item.values[k].errors.push(
                'Valor Asegurado del amparo ' +
                  item.name +
                  ' es superior al permitido.'
              );
            }
            if (
              0 >= Masknumbermoney.formatToNumber(item.values[k].value_show)
            ) {
              item.values[k].errors.push(
                'Valor Asegurado del amparo ' +
                  item.name +
                  ' es inferior al permitido.'
              );
            }
          }
          if (item.values[k].errors.length > 0) {
            Helpers.disabled('.generatepdf ');
            Helpers.disabled('.next-step');
          } else {
            Helpers.enabled('.generatepdf ');
            Helpers.enabled('.next-step');
          }
        } else {
          let formatValue = Masknumbermoney.formatToNumber(
            item.values[k].value_show
          );
          if (formatValue > valueContenido) {
            item.values[k].errors.push(
              'Valor asegurado es mayor al reportado en Contenidos'
            );
          }
          if (item.values[k].errors.length > 0) {
            Helpers.disabled('.generatepdf ');
            Helpers.disabled('.next-step');
          } else {
            Helpers.enabled('.generatepdf ');
            Helpers.enabled('.next-step');
          }
        }
      }
      //Select
    } else if (type === 2) {
      for (let i = 0; i < item.values[k].values.length; i++)
        item.values[k].values[i].default = false;
      item.values[k].values[e.target.value].default = true;
      item.values[k].value = item.values[k].values[e.target.value].limit;
      item.values[k].value_to_quotate =
        item.values[k].values[e.target.value].limit;
      item.values[k].value_show = Masknumbermoney.formatToMask(
        item.values[k].values[e.target.value].limit
      );
    }
    this.setState({
      ...this.state,
      plans: plan,
    });

    if (e.target.tagName === 'SELECT') {
      this.sendAndValidate(plan);
    }
    let codeError = this.validateChange(item, k, valueHurto);
    if (codeError === 1) {
      Helpers.disabled('.generatepdf');
      Helpers.disabled('.next-step');
    } else {
      Helpers.enabled('.generatepdf');
      Helpers.enabled('.next-step');
    }
  };

  blur = (e) => {
    if (e.target.parentNode.className.indexOf('error') === -1) {
      this.sendAndValidate(this.state.plan);
    }
  };

  /**
   * Event of select dedutible
   * @param key Of coverage in the iterate
   * @returns {Function}
   */
  selectChangeDeducible = (key) => (e) => {
    let v = e.target.value;
    let plan = this.state.plan;
    let items = plan.coverages[key].deductible;
    for (let i = 0; i < items.length; i++) {
      if (parseInt(items[i]['id']) === parseInt(v)) {
        plan.coverages[key].deductible[i].default = true;
      } else {
        plan.coverages[key].deductible[i].default = false;
      }
    }
    this.setState({
      ...this.state,
      plans: plan,
    });
    this.sendAndValidate(plan);
  };

  render() {
    return (
      <div className="row row-max tabs-cotizaciones row_tab_0">
        <div className="col col-12 col-sm-12 col-md-12 col-lg-12 no-padding">
          <div className="row" onClick={Helpers.toggleSlide(0)}>
            <div className="col col-6 col-sm-6 col-md-6 col-lg-6 text-left">
              <h4>
                <span>{this.state.coverturasTotal}</span>Coberturas
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

          <div className="wrapper-box">
            {typeof this.state.plan.coverages !== 'undefined' &&
              this.state.plan.coverages.map((option, key) => (
                <div className={'rowor'} key={key}>
                  <div className={'row'}>
                    <div
                      className={
                        'col first items-checkboxes ' +
                        (option.optional === true ? '' : ' disabled-item')
                      }
                    >
                      <div className="form-group">
                        <input
                          type="checkbox"
                          checked={option.checked === true ? 'checked' : false}
                          disabled={option.optional === false}
                          name={'itemcheck' + key}
                          id={'itemcheck' + key}
                          onChange={this.checkCoverturas(this.state.index, key)}
                        />
                        <label htmlFor={'itemcheck' + key}>{option.name}</label>
                      </div>
                    </div>
                    <div
                      className={
                        'col col-12 col-sm-12 col-md-3 col-lg-3 middle ' +
                        (option.checked === false ? ' disabled-item' : '') +
                        (option.optional === true ? '' : ' disabled-item')
                      }
                    >
                      {typeof option.values !== 'undefined' && (
                        <Fragment>
                          {option.values.map(
                            (opt, k) =>
                              typeof opt.hired !== 'undefined' &&
                              opt.hired === true && (
                                <div
                                  className={
                                    'form-group ' +
                                    (typeof opt.values === 'undefined'
                                      ? ''
                                      : 'input-select') +
                                    (typeof opt.errors !== 'undefined' &&
                                    opt.errors.length > 0
                                      ? ' error'
                                      : '') +
                                    (Coberturas.isDisabled(option, opt)
                                      ? ' disabled-item'
                                      : '')
                                  }
                                  key={k}
                                >
                                  <label htmlFor={'item' + k + '_' + key}>
                                    {opt.name}
                                  </label>
                                  {typeof opt.values === 'undefined' ? (
                                    <input
                                      name={'item' + k + '_' + key}
                                      id={'item' + k + '_' + key}
                                      placeholder={opt.value_show}
                                      onBlur={
                                        Coberturas.isDisabled(option, opt)
                                          ? null
                                          : this.blur
                                      }
                                      value={
                                        typeof opt.value_show === 'undefined'
                                          ? '$0'
                                          : opt.value_show
                                      }
                                      onChange={this.inputChange(k, key, 1)}
                                      disabled={Coberturas.isDisabled(
                                        option,
                                        opt
                                      )}
                                      type="text"
                                      className={'form-control'}
                                    />
                                  ) : (
                                    <select
                                      className={'form-control'}
                                      name={'item' + k + '_' + key}
                                      id={'item' + k + '_' + key}
                                      disabled={
                                        option.optional === false ||
                                        option.checked === false
                                      }
                                      value={Coberturas.getSelectFields(
                                        opt.values
                                      )}
                                      onChange={this.inputChange(k, key, 2)}
                                    >
                                      {opt.values.map((opt, k) => (
                                        <option key={k} value={k}>
                                          {Masknumbermoney.formatToMask(
                                            opt.limit
                                          )}
                                        </option>
                                      ))}
                                    </select>
                                  )}
                                  {typeof opt.errors !== 'undefined' &&
                                    opt.errors.map((item, key) => (
                                      <small
                                        key={key}
                                        className={'form-text only-errors'}
                                      >
                                        {item}
                                      </small>
                                    ))}
                                </div>
                              )
                          )}
                        </Fragment>
                      )}
                    </div>
                    <div className="col last">
                      {typeof option.deductible !== 'undefined' ? (
                        <div
                          className={
                            'pisonumero input-select form-group ' +
                            (this.state.error ? 'error' : '')
                          }
                        >
                          <label htmlFor={'itemdeducible' + key}>
                            Deducible
                          </label>
                          <select
                            name={'itemdeducible' + key}
                            id={'itemdeducible' + key}
                            className="form-control"
                            disabled={false}
                            onChange={this.selectChangeDeducible(key)}
                            value={Coberturas.getSelectByItems(
                              option.deductible
                            )}
                          >
                            {option.deductible.map((opt, k) => (
                              <option key={k} value={opt.id}>
                                {opt.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      ) : (
                        <div className={'form-group'}>&nbsp;</div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Coberturas);
