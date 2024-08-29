import React, { Component } from 'react';
import './Cards.scss';
import { withRouter } from 'react-router-dom';
import store from '../../../../store';
import AllInsurableLimits from '../../../../services/AllInsurableLimits';
import MobileContents from '../../inmueble/forms/MobileContents';
import Masknumbermoney from '../../../../common/helpers/masknumbermoney/Masknumbermoney';
import { saveInmuebleValue } from '../../../../store/actions';
import InspectionPolicy from '../../../../services/InspectionPolicy';
import AllBuildYears from '../../../../services/AllBuildYears';
import Plans from '../plans/Plans';
import Coberturas from '../coberturas/Coberturas';
import { IDS_COVERAGE_VALUES } from '../../../../common';
import { getItems } from './getItems';
import Helpers from '../../../../common/helpers/helpers';
class Cards extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: getItems(),
      anoconstruidos: [],
      Inmueble: store.getState().Inmueble,
      InmuebleOk: false,
      showInspect: false,
      inspection_detail: '',
      inspection: '',
    };
    for (const item of this.state.items) {
      item.value = '';
      item.active = true;
      item.errorValue = 0;
      item.inactiveToggle = false;
      item.inactiveAdd = false;
    }
    this.state.items[0].active = false;
    this.getAllInsurableLimits();
    this.getAllBuildYears();
  }

  static async getDataFromInspectionPolicy() {
    let inspect = await InspectionPolicy.get();
    if (inspect !== null && typeof inspect !== 'undefined') {
      if (typeof inspect[1] !== 'undefined' && inspect[1] !== 'NA') {
        store.dispatch(
          saveInmuebleValue({
            value: inspect[1],
            name: 'inspection_policies',
          })
        );
        store.dispatch(
          saveInmuebleValue({
            value: true,
            name: 'max_values_dedu',
          })
        );
        return inspect;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.updateCards !== this.props.updateCards) {
      if (this.props.updateCards) {
        this.validateAllItems();
      }
    }
  }

  validateAllItems = async () => {
    let attempts = 0;
    let allInsurableLimits = store.getState().allInsurableLimits;

    while (attempts < 3) {
      if (allInsurableLimits && allInsurableLimits.length > 0) {
        const items = this.state.items.map((item, index) => {
          const error = item.parent.validateField(item.value);
          return { ...item, errorValue: error };
        });

        this.setState({ items });
        return;
      }

      await new Promise((resolve) => setTimeout(resolve, 500));
      allInsurableLimits = store.getState().allInsurableLimits;
      attempts += 1;
    }

    const items = this.state.items.map((item, index) => {
      const error = item.parent.validateField(item.value);
      return { ...item, errorValue: error };
    });

    this.setState({ items });
  };

  async getAllBuildYears() {
    this.setState({
      ...this.state,
      anoconstruidos: await AllBuildYears.get(),
    });
  }

  async getInspectionPolicy() {
    let inspect = await Cards.getDataFromInspectionPolicy();
    return new Promise((resolve) => {
      if (inspect !== false) {
        this.setState(
          {
            ...this.state,
            inspection_detail: inspect[0],
            inspection: inspect[1],
            showInspect: true,
          },
          resolve
        );
      } else {
        this.setState(
          {
            ...this.state,
            showInspect: false,
          },
          resolve
        );
      }
    });
  }

  componentDidMount() {
    this.validateToggle();
    this.unsubscribe = store.subscribe(() => {
      let storeState = store.getState();
      let inmueble = storeState.Inmueble;
      if (inmueble !== this.state.Inmueble && this.state.InmuebleOk === false) {
        let items = this.state.items;
        for (let i = 0; i < items.length; i++) {
          const { parent } = items[i];
          items[i].value = inmueble[parent.nameModelValue] || '';
          items[i].active = inmueble[parent.nameModel] === 0;
          if (items[i].value === '""') items[i].value = '';
          let error = items[i].parent.validateField(items[i].value);
          items[i].errorValue = error;
        }
        this.setState(
          {
            ...this.state,
            items: items,
            Inmueble: inmueble,
            InmuebleOk: true,
          },
          async () => {
            await this.getInspectionPolicy();
            this.validateToggle();
          }
        );
      }
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  async getAllInsurableLimits() {
    await AllInsurableLimits.get();
  }

  getItemsActive(items) {
    let newItems = items;
    const inactiveToggle = newItems
      .slice(1, newItems.length)
      .every(({ active }) => !!active);
    newItems[0].inactiveToggle = inactiveToggle;
    newItems[1].inactiveToggle = newItems[0].active === true;
    for (let i = 2; i < newItems.length; i++)
      newItems[i].inactiveAdd = newItems[1].active || newItems[1].value === '';
    return newItems;
  }

  validateToggle() {
    this.setState({
      ...this.state,
      items: this.getItemsActive(this.state.items),
    });
  }

  updateStoreItem(index, clear = false) {
    // Actualiza el valor de prendido o apagado en el store
    let newItems = this.state.items;
    store.dispatch(
      saveInmuebleValue({
        value: newItems[index].active === true ? 0 : 1,
        name: newItems[index].parent.nameModel,
      })
    );
    store.dispatch(
      saveInmuebleValue({
        value: '',
        name: newItems[index].parent.nameModelValue,
      })
    );
    newItems[index].value = '';
    this.setState({
      ...this.state,
      items: newItems,
    });
  }

  toggleItem = (index) => (e) => {
    const { type } = e;
    let active = this.state.items[index].active;
    let newItems = this.state.items;
    let saved = false;
    let parent = this.state.items[index].parent;
    let error = newItems[index].errorValue;
    let valueItem = Masknumbermoney.formatToNumber(newItems[index].value);
    newItems[index].active = !active;

    // Deshabilita los demas items
    if (newItems[index].type === 2 && newItems[index].active === true) {
      for (let i = 1; i < 5; i++) newItems[i].active = newItems[index].active;
    }

    // Habilita contenido si los demas items lo tienn
    if (newItems[1].type === 2 && newItems[1].active === true) {
      if (
        (newItems[index].type === 3 && newItems[index].active === false) ||
        (newItems[index].type === 4 && newItems[index].active === false) ||
        (newItems[index].type === 5 && newItems[index].active === false)
      ) {
        newItems[1].active = newItems[index].active;
        this.updateStoreItem(1);
        saved = true;
      }
    }
    if (saved === false) this.updateStoreItem(index);

    this.setState(
      {
        ...this.state,
        items: this.getItemsActive(newItems),
      },
      async () => {
        if (type === 'click' && parseInt(error) === 0 && valueItem > 0) {
          await this.getInspectionPolicy();
          await this.sendAndValidate(parent);
        }
      }
    );
  };

  validateValue = (index) => (e) => {
    let target = e.target;
    const { type } = e;
    const value = Masknumbermoney.formatToMask(target.value);
    e.target.value = value;
    let parent = this.state.items[index].parent;
    let error = parent.validateField(target.value);
    if (+error !== 0 && e.type === 'blur') {
      Helpers.disabled('.generatepdf');
      Helpers.disabled('.next-step');
      return;
    }
    let component = new parent();
    if (type === 'blur') {
      component.validateValue(e);
    }
    let newItems = this.state.items;
    newItems[index].value = target.value;
    newItems[index].errorValue = error;
    this.setState(
      {
        ...this.state,
        items: this.getItemsActive(newItems),
      },
      async () => {
        if (type === 'blur' && parseInt(error) === 0 && value.trim() !== '') {
          await this.getInspectionPolicy();
          this.sendAndValidate(parent);
        }
      }
    );
  };

  sendAndValidate(component) {
    let storeState = store.getState();
    /**
     * @type {any[]}
     */
    let plans = storeState.AllPlans;
    let index = storeState.indexPlan;
    let name = component.nameModel;

    let type = null;
    const { contents, simpleTheft, jewelry, mobileContent } =
      IDS_COVERAGE_VALUES;
    if (name === 'inmuebleasegudadoobras') {
      type = 3;
    } else if (name === 'inmuebleasegudadotelefonos') {
      type = 4;
    } else if (name === 'inmuebleasegudadojoyas') {
      type = [simpleTheft, jewelry];
    } else if (name === 'contenidoasegudado') {
      type = [contents, simpleTheft];
    } else if (name === 'inmuebleasegudado') {
      type = 1;
    } else if (name === MobileContents.nameModel) {
      type = [mobileContent, jewelry];
    }
    plans = plans.map((plan) =>
      Coberturas.calcValue(plan, type, {
        recalculate: true,
      })
    );
    Plans.sendAndValidate(plans, index, this.props.match.params.id, true);
  }

  render() {
    return (
      <React.Fragment>
        <div className="row row-boxes">
          {this.state.items.map((option, key) => (
            <div className="col" key={key}>
              <div
                className={
                  'box-col ' +
                  (this.state.items[key].active === true ? 'active' : '')
                }
              >
                <div className={'image image-' + option.type}>&nbsp;</div>
                <p>{option.parent.name()}</p>
                <div className="wrapper-over">
                  <div
                    className={
                      (option.inactiveAdd === true ? 'invisible' : '') +
                      ' btntoggle'
                    }
                    onClick={this.toggleItem(key)}
                  >
                    +
                  </div>
                  <div
                    className={
                      'form-group ' + (option.errorValue !== 0 ? 'error' : '')
                    }
                  >
                    <label htmlFor="incendios">Valor</label>
                    <input
                      type="text"
                      className={'form-control'}
                      name="incendios"
                      id="incendios"
                      value={option.value}
                      onBlur={this.validateValue(key)}
                      onChange={this.validateValue(key)}
                    />
                    <small className={'form-text'}>
                      Mínimo.{' '}
                      {Masknumbermoney.formatToMask(option.parent.min())} -
                      Máximo.{' '}
                      {Masknumbermoney.formatToMask(option.parent.max())}
                    </small>
                    <small
                      className={
                        'form-text only-errors ' +
                        (option.errorValue === 1 ? 'show' : 'hide')
                      }
                    >
                      Por Ingrese el valor asegurado de Teléfonos Móviles.
                    </small>
                    <small
                      className={
                        'form-text only-errors ' +
                        (option.errorValue === 2 ? 'show' : 'hide')
                      }
                    >
                      Valor Asegurado de {option.parent.name()} es inferior al
                      permitido.
                    </small>
                    <small
                      className={
                        'form-text only-errors ' +
                        (option.errorValue === 3 ? 'show' : 'hide')
                      }
                    >
                      Valor Asegurado de {option.parent.name()} es superior al
                      permitido.
                    </small>
                  </div>
                  <span
                    className={
                      option.inactiveToggle === true ? 'invisible' : ''
                    }
                    onClick={this.toggleItem(key)}
                  >
                    No lo quiero
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="row">
          <div className="col col-sm-12 col-md-12 col-lg-12 title">
            <p>
              Listo, te sugerimos un paquete recomendado, sin embargo puedes
              personalizarlo de acuerdo a la necesidad, quita o agrega lo que
              consideras podría ser de utilidad en el futuro
            </p>
          </div>
        </div>

        <div
          className={
            'row justify-content-center ' +
            (this.state.showInspect === false ? 'hide' : '')
          }
        >
          <div className="col col-sm-12 col-md-10 col-lg-10">
            <div className="tool-tip info tool-tip-new">
              <p>
                Póliza sujeta a <span>{this.state.inspection_detail}</span>
              </p>
              <div className="more-info">
                <p>Más información</p>
                <div className="span">
                  <span>?</span>
                  {this.state.inspection === 'IC' ? (
                    <div className="text">
                      La vivienda requiere que la revisemos más al detalle, ten
                      presente los siguientes datos para poder agendar una
                      futura inspección en sitio: Nombre de contacto, Teléfono
                      de contacto.
                    </div>
                  ) : (
                    <div className="text">
                      La vivienda requiere que la revisemos más al detalle,
                      envíanos por favor un breve registro fotográfico de
                      acuerdo a la siguiente guía: Una foto de la Fachada (Debe
                      ser visible la estructura y todos los pisos del Edificio),
                      Una foto de la Habitación principal y de Sala-Comedor, Una
                      foto de los Baños y de la Cocina
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default withRouter(Cards);
