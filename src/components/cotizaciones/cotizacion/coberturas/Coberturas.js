import React, { Component, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Masknumbermoney from '../../../../common/helpers/masknumbermoney/Masknumbermoney';
import store from '../../../../store';
import Helpers from '../../../../common/helpers/helpers/Helpers';
import Plans from '../plans/Plans';
import { AllPlans as AllPlansCreator } from '../../../../actions';
import { getRulesByCode, getTotalCoverage, getValue } from '../../../../common';
import MobileContents from '../../inmueble/forms/MobileContents';
import RateNotCalculated from '../../../RateNotCalculated';
import clsx from 'clsx';
/**
 * @typedef {import('../../../../services/QuoteIussedById').QuoteIussed} QuoteIussed
 * @typedef {import('../../../../services/QuoteIussedById').PlanSelectedInfoItem} PlanSelectedInfoItem
 * @typedef {import('../../../../services/QuoteIussedById').Coverage} Coverage
 */

class Coberturas extends Component {
  _isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
      plan: store.getState().AllPlans,
      coverturasTotal: 0,
      errorRateCalculated: false,
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
   *
   * @typedef {{ recalculate: boolean }} OptionsCalc
   */
  /**
   * Cal value for each coverage
   * @param plan selected plan
   * @param type if you want cal a single type coverage
   * @param {OptionsCalc} options
   * @returns {*}
   */
  static calcValue(plan, type, options) {
    if (typeof plan === 'undefined') return;
    if (typeof plan.coverages === 'undefined') return;
    for (let i = 0; i < plan.coverages.length; i++) {
      let d = plan.coverages[i].values;
      if (typeof d !== 'undefined') {
        for (let j = 0; j < d.length; j++) {
          const value_show = Coberturas.getValueFields(d[j], type, {
            plan,
            ...options,
          });
          if (typeof d[j].values === 'undefined') {
            plan.coverages[i].values[j].value_show = value_show;
          } else {
            for (let limit = 0; limit < d[j].values.length; limit++) {
              if (d[j].values[limit].default === true) {
                plan.coverages[i].values[j].value = d[j].values[limit].limit;
                plan.coverages[i].values[j].value_show = value_show;
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
   * @param {{ id: number, hired: boolean }} item the current coverage in the iteration
   * @param {number|number[]} typeBase if you want cal a single type coverage
   * @param {{ plan: any } & OptionsCalc} options
   * @returns {*}
   */
  static getValue(item, typeBase = [], options = {}) {
    const { plan, recalculate = false } = { ...options };
    if (!item.hired) return 0;
    const rules = {
      ...getRulesByCode(item.code, plan && plan.coverages),
    };
    try {
      const types = Array.isArray(typeBase) ? typeBase : [typeBase];
      let inmueble = store.getState().Inmueble;
      if (typeof item.values !== 'undefined') {
        for (let i = 0; i < item.values.length; i++) {
          if (item.values[i].default === true) {
            return item.values[i].limit;
          }
        }
      } else {
        const notExist = !types.some(
          (type) => type === item.id || type === null
        );
        if (
          (notExist || (!!item.changed && !recalculate)) &&
          item.hired &&
          item.value_show
        )
          return item.value_show;
        /**
         * @type {number}
         */
        let value;
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
          let hurto = Coberturas.getCoverangeById(3, plan);
          if (hurto !== null) {
            const total = getTotalCoverage(hurto.values);
            return total;
          } else {
            value = Masknumbermoney.formatToNumber(item.value_show);
          }
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
          let contenido = Masknumbermoney.formatToNumber(
            inmueble[MobileContents.nameModelValue]
          );
          value = (contenido * parseInt(item.value)) / 100;
        }
        return getValue(value, rules);
      }
    } catch (e) {
      console.log(e);
    }
    return rules.min || 0;
  }

  /**
   *
   * @param {{ id: number, hired: boolean }} item the current coverage in the iteration
   * @param {number|number[]} typeBase if you want cal a single type coverage
   * @param {{ plan: any } & OptionsCalc} options
   * @returns {*}
   */
  static getValueFields(item, typeBase = [], options) {
    const value = Coberturas.getValue(item, typeBase, options);
    return Masknumbermoney.formatToMask(value);
  }
  /**
   *
   * @param id Of coverage that you want find
   * @param plan Current plan selected by user
   * @returns {*}
   */
  static getCoverangeById(id, plan = null) {
    const state = store.getState();
    let coverages;
    if (plan) {
      coverages = plan.coverages;
    } else {
      coverages = state.AllPlans[state.indexPlan];
    }
    if (typeof coverages !== 'undefined') {
      for (let i = 0; i < coverages.length; i++) {
        if (coverages[i].id === id) {
          return coverages[i];
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
    const { indexPlan, AllPlans } = store.getState();
    let plan = AllPlans[indexPlan].coverages;
    for (let i = 0; i < plan.length; i++) {
      if (plan[i].code_content === code) {
        return {
          index: i,
          coverange: plan[i],
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
   * @param {import('../../../../services/QuoteIussedById').Coverage} coverage
   */
  static stateCoverage(coverage) {
    const { values } = coverage;
    if (values)
      return values.some(
        (opt) => typeof opt.hired !== 'undefined' && opt.hired
      );
    return true;
  }

  /**
   *
   * @param {PlanSelectedInfoItem} plan
   */
  static setHiredCoverages(plan, inmuebleBase) {
    const inmueble = inmuebleBase || store.getState().Inmueble;
    const { coverages = [] } = plan;
    for (let key = 0; key < coverages.length; key++) {
      let option = coverages[key].values;
      if (typeof option !== 'undefined') {
        for (let k = 0; k < option.length; k++) {
          let opt = option[k];
          // Inmueble
          if (opt.id === 1) {
            coverages[key].values[k].hired = inmueble.inmuebleasegudado === 1;
            //Contenidos
            //Hurto siempre basado en hurto calificado
          } else if (opt.id === 2 || opt.id === 5) {
            coverages[key].values[k].hired = inmueble.contenidoasegudado === 1;
            //Obras
          } else if (opt.id === 3) {
            coverages[key].values[k].hired =
              inmueble.inmuebleasegudadoobras === 1;
            //Telefonos moviles
          } else if (opt.id === 4) {
            coverages[key].values[k].hired =
              inmueble.inmuebleasegudadotelefonos === 1;
            //Joyas
          } else if (opt.id === 6) {
            coverages[key].values[k].hired =
              inmueble.inmuebleasegudadojoyas === 1;
            //Contenido mobile
          } else if (opt.id === 7) {
            coverages[key].values[k].hired =
              inmueble[MobileContents.nameModel] === 1;
          } else if (opt.id >= 8 || opt.id === 0) {
            coverages[key].values[k].hired = true;
          }
        }
      }
    }
    return {
      ...plan,
      coverages,
    };
  }

  /**
   * Validate if each coverage field it show or not.
   * @param {PlanSelectedInfoItem} plan Plan selected by user
   * @returns {boolean}
   */
  showItem(plan) {
    plan = Coberturas.setHiredCoverages(plan);
    /**
     * @type {Coverage[]}
     */
    const coverages = plan.coverages || [];
    let valid = true;
    const newPlan = {
      ...plan,
      coverages: coverages.map(({ values, ...rest }, k) => ({
        ...rest,
        values:
          values &&
          values.map((value) => {
            const errors =
              (value.hired && [
                ...(Coberturas.getErrorsCoverage(
                  plan,
                  value,
                  k,
                  value.values ? 2 : 1
                ) || []),
              ]) ||
              undefined;
            if (errors && errors.length) valid = false;
            return {
              ...value,
              errors: errors,
            };
          }),
      })),
    };
    if (this._isMounted === true) {
      this.setState(
        {
          ...this.state,
          plan: newPlan,
          coverturasTotal: this.countCoverturas(plan),
        },
        () => {
          this.toggleValid(valid);
        }
      );
    }
  }

  componentDidMount() {
    this._isMounted = true;
    this.unsubscribe = store.subscribe(() => {
      let storeState = store.getState();
      let plan = storeState.AllPlans[storeState.indexPlan];
      if (typeof plan !== 'undefined' && this._isMounted === true) {
        this.showItem(plan);
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
  async sendAndValidate(plan) {
    let storeState = store.getState();
    let index = storeState.indexPlan;
    let plans = storeState.AllPlans;
    plans[index] = plan;
    await store.dispatch((dispatch) => {
      dispatch(AllPlansCreator([...plans]));
      return Promise.resolve();
    });
    plans[index] = Coberturas.calcValue(plan, 5);
    await Plans.sendAndValidate(plans, index, this.props.match.params.id).catch(
      (e) => {
        this.setState({ errorRateCalculated: true });
        throw e;
      }
    );
    this.setState({ errorRateCalculated: false });
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
      if (item[i].checked === true && Coberturas.stateCoverage(item[i])) {
        t++;
      }
    }
    return t;
  }

  checkCoverturas = (index, key) => (e) => {
    let check = this.state.plan.coverages[key].checked;
    let newPlan = { ...this.state.plan };
    let state = true;
    newPlan.coverages[key].checked = !check;

    let code = newPlan.coverages[key].code_content;
    //Validations for dependence's coverages
    if (parseInt(code) === 9692 && !check === false) {
      let find = Coberturas.getCoverangeByCode(9691);
      newPlan.coverages[find.index].checked = false;

      find = Coberturas.getCoverangeByCode(9693);
      newPlan.coverages[find.index].checked = false;
    }
    if (parseInt(code) === 9691 && !check === true) {
      let find = Coberturas.getCoverangeByCode(9692);
      if (find.coverange.checked === false) {
        newPlan.coverages[key].checked = false;
        state = false;
      }
    }
    if (parseInt(code) === 9693 && !check === true) {
      let find = Coberturas.getCoverangeByCode(9692);
      if (find.coverange.checked === false) {
        newPlan.coverages[key].checked = false;
        state = false;
      }
    }
    if (state === true) {
      this.setState(
        {
          ...this.state,
          plan: newPlan,
          coverturasTotal: this.countCoverturas(newPlan),
        },
        () => {
          this.sendAndValidate(newPlan);
        }
      );
    }
  };

  /**
   * Event change of coverage field
   * @param value Of coverage in the iterator
   * @param coverages
   * @returns {null | string[]}
   */
  static getErrors = (value, coverages) => {
    let formatValue = Masknumbermoney.formatToNumber(value.value_show || '');
    if (!value.hired) return null;
    const rules = getRulesByCode(value.code, coverages);
    if (rules) {
      const { max, min, formatError } = rules;
      const errors = [];
      if (max && formatValue > max) {
        errors.push(
          (formatError && formatError({ max: true, value })) ||
            `${value.name} es superior al permitido.`
        );
      }
      if (min && formatValue < min) {
        if (!!value.value || value.value !== formatValue) {
          errors.push(
            (formatError && formatError({ min: true, value })) ||
              `${value.name} es inferior al permitido.`
          );
        }
      }
      return (errors.length && errors) || undefined;
    }
  };

  /**
   * @param {PlanSelectedInfoItem} plan
   * @param {import('../../../../services/QuoteIussedById').CoverageValue} planValue
   * @param {number} key
   * @param {number} type
   */
  static getErrorsCoverage = (plan, planValue, key, type) => {
    let item = plan.coverages[key];
    const { checked } = item;
    if (!checked) return [];
    const otrosContenidos = plan.coverages.find(
      (element) => element.code_content === 9670
    );
    const valueContenido =
      otrosContenidos &&
      otrosContenidos.values &&
      otrosContenidos.values[0].value_to_quotate;

    const errors = [];
    //Input
    if (type === 1) {
      planValue.errors = [];
      //Validations extra

      //--------
      //Validations of max and min
      if (
        parseInt(planValue.code) === 9692 ||
        parseInt(planValue.code) === 3017 ||
        parseInt(planValue.code) === 3008
      ) {
        /**
         * todo Merge method with static method are equals
         * @param code code Of coverage that you want find
         */
        function getCoverageByCode(code) {
          const coverages = plan.coverages;
          for (const item of coverages)
            if (item.values)
              for (const value of item.values)
                if (value.code === code) return item;
        }
        const coverage = getCoverageByCode(9667);
        if (coverage && coverage.values) {
          for (let i = 0; i < coverage.values.length; i++) {
            if (coverage.values[i].id === planValue.id) {
              if (
                typeof coverage.values[i].value_show !== 'undefined' &&
                typeof planValue.value_show !== 'undefined'
              ) {
                if (
                  Masknumbermoney.formatToNumber(
                    coverage.values[i].value_show
                  ) < Masknumbermoney.formatToNumber(planValue.value_show)
                ) {
                  let n = coverage.values[i].name
                    .toUpperCase()
                    .replace('VALOR ', '');
                  if (parseInt(planValue.code) === 3008) {
                    errors.push(
                      'Valor asegurado del amparo ' +
                        item.name +
                        ', es superior al reportado en “' +
                        n +
                        '” del amparo de INCENDIO '
                    );
                  } else {
                    errors.push(
                      'Valor asegurado de ' +
                        n +
                        ' es superior al reportado en INCENDIO'
                    );
                  }
                }
              }
            }
          }
          if (parseInt(planValue.code) === 3008) {
            if (
              500000000 < Masknumbermoney.formatToNumber(planValue.value_show)
            ) {
              errors.push(
                'Valor Asegurado del amparo ' +
                  item.name +
                  ' es superior al permitido.'
              );
            }
            if (0 >= Masknumbermoney.formatToNumber(planValue.value_show)) {
              errors.push(
                'Valor Asegurado del amparo ' +
                  item.name +
                  ' es inferior al permitido.'
              );
            }
          }
        } else {
          let formatValue = Masknumbermoney.formatToNumber(
            planValue.value_show
          );
          if (formatValue > valueContenido) {
            errors.push('Valor asegurado es mayor al reportado en Contenidos');
          }
        }
      }
    }
    errors.push(...(Coberturas.getErrors(planValue, plan.coverages) || []));
    return errors;
  };

  inputChange = async ({ target }, k, key, type) => {
    /**
     * @type {{
     *  coverages: Coverage[]
     * }}
     */
    let plan = this.state.plan;
    let item = plan.coverages[key];

    const { value, tagName } = target;

    //Input
    if (type === 1) {
      const planValue = item.values[k];
      planValue.value_show = Masknumbermoney.formatToMask(value);
      planValue.changed = true;
      for (let j = 0; j < plan.coverages.length; j++) {
        const coverage = plan.coverages[j];
        if (+coverage.code === 9691 || +coverage.code_content === 9691) {
          for (const value of coverage.values) {
            if (+value.code === 9688) {
              if (+planValue.code === 9692) {
                value.value_show = planValue.value_show;
                value.value_to_quotate = planValue.value_to_quotate;
              }
            }
            if (+value.code === 9687) {
              if (+planValue.code === 3017) {
                value.value_show = planValue.value_show;
                value.value_to_quotate = planValue.value_to_quotate;
              }
            }
          }
        }
      }
    } else if (type === 2) {
      for (let i = 0; i < item.values[k].values.length; i++)
        item.values[k].values[i].default = false;
      item.values[k].values[value].default = true;
      item.values[k].value = item.values[k].values[value].limit;
      item.values[k].value_to_quotate = item.values[k].values[value].limit;
      item.values[k].value_show = Masknumbermoney.formatToMask(
        item.values[k].values[value].limit
      );
    }
    const errors = Coberturas.getErrorsCoverage(
      plan,
      item.values[k],
      key,
      type
    );
    item.values[k].errors = errors;
    const valid = !(errors && errors.length);
    const { coverages } = plan;
    const newPlan = {
      ...plan,
      coverages: coverages.map((coverage, i) => {
        if (key === i) {
          const { values } = coverage;
          return {
            ...coverage,
            values: values.map((valueItem, j) =>
              k === j ? { ...valueItem, errors } : valueItem
            ),
          };
        }
        return coverage;
      }),
    };
    // Select
    if (tagName === 'SELECT') {
      await this.sendAndValidate(newPlan);
    }
    this.setState(
      {
        plan: newPlan,
      },
      () => {
        this.toggleValid(valid);
      }
    );
  };

  toggleValid = (valid) => {
    if (!valid) {
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
      plan: plan,
    });
    this.sendAndValidate(plan);
  };

  render() {
    const { index } = this.props;
    const { errorRateCalculated, error } = this.state;

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
              this.state.plan.coverages.map((option, key) => {
                if (!Coberturas.stateCoverage(option)) return null;
                return (
                  <div className={'rowor'} key={key}>
                    <div className={'row'}>
                      <div
                        className={clsx(
                          'col first items-checkboxes',
                          !option.optional && 'disabled-item'
                        )}
                      >
                        <div className="form-group">
                          <input
                            type="checkbox"
                            checked={
                              option.checked === true ? 'checked' : false
                            }
                            disabled={option.optional === false}
                            name={'itemcheck' + key}
                            id={'itemcheck' + key}
                            onChange={this.checkCoverturas(index, key)}
                          />
                          <label htmlFor={'itemcheck' + key}>
                            {option.name}
                          </label>
                        </div>
                      </div>
                      <div
                        className={clsx(
                          'col col-12 col-sm-12 col-md-3 col-lg-3 middle',
                          (!option.checked || !option.optional) &&
                            'disabled-item'
                        )}
                      >
                        {typeof option.values !== 'undefined' && (
                          <Fragment>
                            {option.values.map((opt, k) => {
                              if (opt.hired === false) return null;
                              const disabled = Coberturas.isDisabled(
                                option,
                                opt
                              );
                              const value =
                                typeof opt.value_show === 'undefined'
                                  ? '$0'
                                  : opt.value_show;
                              return (
                                <div
                                  className={clsx(
                                    'form-group',
                                    opt.values && 'input-select',
                                    opt.errors &&
                                      !!opt.errors.length &&
                                      'error',
                                    disabled && 'disabled-item'
                                  )}
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
                                      onBlur={(!disabled && this.blur) || null}
                                      value={value}
                                      onChange={(e) =>
                                        this.inputChange(e, k, key, 1)
                                      }
                                      disabled={disabled}
                                      type="text"
                                      className="form-control"
                                    />
                                  ) : (
                                    <select
                                      className={'form-control'}
                                      name={'item' + k + '_' + key}
                                      id={'item' + k + '_' + key}
                                      disabled={
                                        !option.optional || !option.checked
                                      }
                                      value={Coberturas.getSelectFields(
                                        opt.values
                                      )}
                                      onChange={(e) =>
                                        this.inputChange(e, k, key, 2)
                                      }
                                    >
                                      {opt.values.map((optValue, keyValue) => (
                                        <option key={keyValue} value={keyValue}>
                                          {Masknumbermoney.formatToMask(
                                            optValue.limit
                                          )}
                                        </option>
                                      ))}
                                    </select>
                                  )}
                                  {opt.errors &&
                                    opt.errors.map((item, i) => (
                                      <small
                                        key={i}
                                        className={'form-text only-errors'}
                                      >
                                        {item}
                                      </small>
                                    ))}
                                </div>
                              );
                            })}
                          </Fragment>
                        )}
                      </div>
                      <div className="col last">
                        {typeof option.deductible !== 'undefined' ? (
                          <div
                            className={clsx(
                              'pisonumero input-select form-group',
                              error && 'error'
                            )}
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
                );
              })}
          </div>
        </div>
        <RateNotCalculated
          open={errorRateCalculated}
          onRetry={() => {
            this.sendAndValidate(this.state.plan);
          }}
        />
      </div>
    );
  }
}

export default withRouter(
  connect(({ indexPlan }) => ({ index: indexPlan }))(Coberturas)
);
