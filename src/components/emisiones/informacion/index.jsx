// @ts-check
import React from 'react';
//Component
import BtnContinue from './forms/btncontinue/BtnContinue';

import './styles.scss';
import { withRouter } from 'react-router-dom';
import 'moment/locale/es';
import MomentJs from 'moment';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import es from 'react-datepicker/node_modules/date-fns/esm/locale/es/index';

import PopUpPersona from '../identificacion/popups/persona/person';
import Loading from '../../globals/loading/Loading';
import QuoteIussedById from '../../../services/QuoteIussedById';
import Helpers from '../../../common/helpers/helpers';
import Masknumbermoney from '../../../common/helpers/masknumbermoney/Masknumbermoney';
import Content from './Content';
import Store from '../../../store';
import {
  isItemRequired,
  itemsRequiredSince,
  typeItems,
} from '../../../common/typeItems';
import UploadFileService from '../../../services/UploadFile';
import { BuiltMetersHousing } from './BuiltMetersHousing';
import { Articles } from './Articles';
import { LastContentWarn } from './LastContentWarn';
import { TYPES_VALUE_CONTENT } from './constants';
import AllInsurableLimits from 'services/AllInsurableLimits';
import GetEstate from 'services/GetEstate';
import moment from 'moment';
import 'moment/locale/es';

import ModalLimitsPlanError from '../../modal/ModalLimitsPlanError';

// 10MB
const maxFileSize = UploadFileService.maxFileSize;

class Index extends React.Component {
  constructor(props) {
    super(props);
    this.current = React.createRef();
    this.formatDate = 'dddd, MMMM Do YYYY';
    /**
     * @type {{
     *   items: import('../../../models/types').Item[],
     *   contents: import('../../../models/types').GoodsOverCostLocal[],
     *   step: number,
     *   totalContent: number,
     *   initdate: string,
     *   persons: any[],
     *   quote_contenidomovil: number,
     *   inmuebles: any,
     *   area: string,
     *   addNewPerson: boolean,
     *   itemSelected: any,
     *   showPopUpPersona: boolean,
     *   errorPhone: boolean,
     *  }}
     */
    this.state = {
      step: parseInt(this.props.match.params.step),
      totalContent: 0,
      initdate: MomentJs().format(this.formatDate),
      persons: [],
      contents: [],
      quote_contenidomovil: 0,
      inmuebles: {},
      area: '',
      addNewPerson: true,
      itemSelected: null,
      showPopUpPersona: false,
      errorPhone: false,
      items: [],
      openLimitsModal: false,
      code: 0,
      stepCotizacion: Store.getState().cotizacion.state,
      numberCotizacion: Store.getState().cotizacion.number,
      retryCount: 0,
      retryLimitReached: false,
      showButtonReturn: false,
      currentDateTime: '',
      updateArticles: false,
      typeItem: typeItems,
    };
    this.updatePerson = this.updatePerson.bind(this);
    this.toggleErrorPhone = this.toggleErrorPhone.bind(this);
  }

  formatToNumber(value) {
    return Masknumbermoney.formatToNumber(value);
  }

  formatToMask(value) {
    return Masknumbermoney.formatToMask(value);
  }

  async componentDidMount() {
    moment.locale('es');
    const currentDateTime = moment().format('DD/MMM/YYYY HH:mm:ss');
    this.setState({ currentDateTime });

    await this.getLimitsEstate();
    this.getData();
    Helpers.fieldNumeric();
  }

  async getLimitsEstate() {
    const limits = await AllInsurableLimits.get(
      Store.getState().cotizacion.number
    );

    let estate_data = await GetEstate.get(Store.getState().cotizacion.number);
    if (!limits || limits.code || !estate_data || estate_data.code) {
      this.setState({
        openLimitsModal: true,
        code: limits?.code || estate_data?.code,
        updateArticles: false,
        items: [],
      });
    } else if (limits.length > 0 && estate_data.length > 0) {
      this.setState({
        openLimitsModal: false,
        updateArticles: true,
        items: estate_data,
      });
    }
  }

  handleRetry = () => {
    this.setState(
      (prevState) => {
        const newRetryCount = prevState.retryCount + 1;
        const retryLimitReached = newRetryCount >= 3;

        return {
          retryCount: newRetryCount,
          retryLimitReached,
          showButtonReturn: retryLimitReached,
          updateArticles: true,
        };
      },
      async () => {
        if (!this.state.retryLimitReached) {
          await this.getLimitsEstate();
        } else {
          console.log('Límite de reintentos alcanzado');
        }
      }
    );
  };

  async getData() {
    Loading.toggle(true);
    const { params } = this.props.match;
    /**
     * @type {import('../../../services/QuoteIussedById').QuoteIussed | import('../../../services/QuoteIussedById').MoreInfoItem & { contents?: import('../../../models/types').GoodsOverCost[]}}
     */
    let data = await QuoteIussedById.get(params.id);
    await GetEstate.get(Store.getState().cotizacion.number);
    let inmuebles = data.risk_valoration_info.Item;
    let persons = this.state.persons;
    const plan_selected_info = data.plan_selected_info.Item;
    const { values } = {
      ...(plan_selected_info &&
        plan_selected_info.coverages.find(
          ({ code, code_content }) => code === 9693 || code_content === 9693
        )),
    };

    const coverageValue =
      values && values.find(({ code }) => String(code) === String(3044));
    const value_to_quotate =
      (coverageValue && coverageValue.value_to_quotate) || 0;

    this.setState({ quote_contenidomovil: value_to_quotate });
    if (typeof data.quote_iussed_info.Item !== 'undefined') {
      let items = data.quote_iussed_info.Item;
      persons.push(items.taker);
      persons = persons.concat(items.insured);
      persons = persons.concat(items.benefist);
    }
    if (typeof data.more_info.Item !== 'undefined') {
      data = data.more_info.Item;
      if (typeof data !== 'undefined') {
        if (typeof data.start_policy_date !== 'undefined')
          data['initdate'] = data.start_policy_date;
        if (typeof data.risk_use !== 'undefined')
          data['utilizado'] = data.risk_use;
        if (typeof data.goods_over_cost !== 'undefined')
          data['contents'] = data.goods_over_cost;
        for (let i = 0; i < data['contents'].length; i++) {
          for (let j in data.contents[i])
            if (data.contents[i][j] === '""') data.contents[i][j] = '';
        }
        if (
          typeof data.visit_person !== 'undefined' &&
          typeof data.visit_person.active !== 'undefined'
        ) {
          data['contactperson'] = data.visit_person.active;
          if (
            typeof data.visit_person.phone !== 'undefined' &&
            data.visit_person.phone !== ''
          ) {
            persons.push({
              name: data.visit_person.name,
              telefono: data.visit_person.phone,
            });
          }
        }
      }
    }
    let contenidos = false;
    let obras = false;
    let joyas = false;
    let celulares = false;
    let contenidoMovil = false;
    /**
     * @type {import('../../../models/types').Item[]}
     */
    const items = [];
    const estate = Store.getState().estate;

    const keys = Object.keys(typeItems);
    const typeItems2 = {};

    estate.forEach((item, index) => {
      typeItems2[keys[index]] = {
        id: item.id,
        label: item.label,
        max: item.max,
        required: item.required,
      };
    });

    this.setState({ typeItem: typeItems2 });

    if (typeof inmuebles !== 'undefined') {
      if (inmuebles.contenido_asegudado === 1) {
        contenidos = true;
        items.push({
          ...estate?.find((type) => type.id === 0),
          min: 1,
          max: estate?.find((type) => type.id === 0)?.max,
          maxTotal: inmuebles.contenido_asegudado_valor,
        });

        if (inmuebles.inmueble_asegudado_obras === 1) {
          items.push({
            ...estate?.find((type) => type?.id === 1),
            min: 1,
            max: estate?.find((type) => type?.id === 1)?.max,
            maxTotal: inmuebles.inmueble_asegudado_obrasvalor,
          });
          obras = true;
        }
        if (inmuebles.inmueble_asegudado_joyas === 1) {
          items.push({
            ...estate?.find((type) => type.id === 2),
            min: 1,
            max: estate?.find((type) => type.id === 2)?.max,
            maxTotal: inmuebles.inmueble_asegudado_joyasvalor,
            required: true,
          });
          joyas = true;
        }
        if (inmuebles.inmueble_asegudado_telefonos === 1) {
          items.push({
            ...estate?.find((type) => type.id === 3),
            min: 899999,
            max: estate?.find((type) => type.id === 3)?.max,
            maxTotal: inmuebles.inmueble_asegudado_telefonosvalor,
          });
          celulares = true;
        }
      }
      if (
        inmuebles.distribution_of_insured_securities_split.valorAmparo
          .valorAsegurado3044 && inmuebles.inmueble_mobile_contents === 1
      ) {
        contenidoMovil = true;
        items.push({
          ...estate?.find((type) => type.id == 4),
          min: 1,
          max: estate?.find((type) => type.id === 4)?.max,
          maxTotal: value_to_quotate,
          required: true,
        });
      }
    }
    this.setState({
      ...this.state,
      ...data,
      inmuebles,
      persons,
      contenidos,
      obras,
      joyas,
      celulares,
      contenidoMovil,
      items,
      estate,
    });
    Loading.toggle(false);
  }

  toggleErrorPhone(status) {
    this.setState({
      ...this.state,
      errorPhone: status,
    });
  }

  selectItems = (name, value) => () => {
    this.setState({
      ...this.state,
      [name]: value,
    });
  };

  removeContent = (key) => () => {
    let total = this.state.totalContent - 1;
    if (total < 0) total = 0;
    const contents = this.state.contents;
    contents.splice(key, 1);
    this.setState({
      ...this.state,
      totalContent: total,
      contents,
    });
  };

  getLastContent = () => {
    const { contents } = this.state;
    return contents[contents.length - 1];
  };

  addContent = ({ totalByType }) => {
    let total = this.state.totalContent + 1;
    const { contents } = this.state;
    const last = this.getLastContent();
    let nextType = '';
    if (last && last.type) {
      const item = this.getItem(last.type);
      const limit = item.maxTotal;
      const total = totalByType[last.type];
      if (!this.validateTotalItem(limit, total)) {
        nextType = last.type;
      }
    }
    this.setState({
      ...this.state,
      totalContent: total,
      contents: [
        ...contents,
        {
          type: nextType,
          caracte: '',
          value: '',
          real_value: '',
        },
      ],
    });
  };

  changeDates = (e) => {
    this.setState({ initdate: MomentJs(e).format(this.formatDate) });
  };

  updatePerson(person) {
    let persons = this.state.persons;
    persons.push(person);
    this.setState({
      ...this.state,
      persons: persons,
      showPopUpPersona: false,
      addNewPerson: false,
    });
  }

  togglePerson = (index, type) => () => {
    let showPopUpPersona = !this.state.showPopUpPersona;
    this.setState({
      ...this.state,
      showPopUpPersona: showPopUpPersona,
    });
  };
  // validate text total
  updateContent = (key) => (e) => {
    const { contents } = this.state;
    contents[key][e.target.name] = e.target.value;
    this.setState({
      ...this.state,
      contents,
    });
  };

  getTotal = () => {
    const { contents } = this.state;
    const {
      fixedContent,
      valuablesAndWorksOfArt,
      jewelry,
      cellPhones,
      mobileContent,
    } = this.state.typeItem;
    const total = {
      [fixedContent.id]: 0,
      [valuablesAndWorksOfArt.id]: 0,
      [jewelry.id]: 0,
      [cellPhones.id]: 0,
      [mobileContent.id]: 0,
    };
    let error = false;
    for (const content of contents) {
      const value = this.formatToNumber(content.value);
      const contentType = content.type;
      if (!error && this.getErrors(content, total[contentType] + value))
        error = true;
      /**
       * @description The value is added to the total
       */
      if (contentType in total) total[contentType] += value;
    }
    return {
      error,
      total: {
        fixedContent: total[fixedContent.id],
        valuablesAndWorksOfArt: total[valuablesAndWorksOfArt.id],
        jewelry: total[jewelry.id],
        cellPhones: total[cellPhones.id],
        mobileContent: total[mobileContent.id],
      },
      totalByType: total,
    };
  };

  validateTotalItem(max, current, item) {
    const isRequired = !!(
      item && isItemRequired(item.required, { max, total: current })
    );
    if (!isRequired) return true;
    const valid = current >= max - 999 && current <= max;
    return valid;
  }

  hasErrors() {
    const { inmuebles, quote_contenidomovil, contents } = this.state;
    const { total, error } = this.getTotal();
    const {
      fixedContent,
      valuablesAndWorksOfArt,
      jewelry,
      cellPhones,
      mobileContent,
    } = this.state.typeItem;
    if (error) return true;
    if (
      inmuebles.contenido_asegudado === 1 &&
      !this.validateTotalItem(
        inmuebles.contenido_asegudado_valor,
        total.fixedContent,
        fixedContent
      )
    )
      return true;

    if (
      inmuebles.inmueble_asegudado_obras === 1 &&
      !this.validateTotalItem(
        inmuebles.inmueble_asegudado_obrasvalor,
        total.valuablesAndWorksOfArt,
        valuablesAndWorksOfArt
      )
    )
      return true;
    if (
      inmuebles.inmueble_asegudado_joyas === 1 &&
      !this.validateTotalItem(
        inmuebles.inmueble_asegudado_joyasvalor,
        total.jewelry,
        jewelry
      )
    )
      return true;
    if (
      inmuebles.inmueble_asegudado_telefonos === 1 &&
      !this.validateTotalItem(
        inmuebles.inmueble_asegudado_telefonosvalor,
        total.cellPhones,
        cellPhones
      )
    ) {
      return true;
    }
    if (
      quote_contenidomovil &&
      !this.validateTotalItem(
        quote_contenidomovil,
        total.mobileContent,
        mobileContent
      )
    ) {
      return true;
    }
    if (
      contents.some(
        ({ files }) =>
          files &&
          Object.keys(files).some((key) => {
            /**
             * @type {import('../../../models/types').AttachmentLocal}
             */
            const file = files[key];
            return !!file && file.errorFile;
          })
      )
    )
      return true;
    return false;
  }

  getErrors(content, maximum) {
    /**
     * @type {{min?:boolean, max?:boolean, empty?: boolean, maxRealValue: boolean, minRealValue: boolean} | null}
     */
    let errors = null;
    const value = this.formatToNumber(content.value);
    const realValue = this.formatToNumber(content.real_value);
    const contentType = content.type;
    const item = this.getItem(contentType);
    const min = value < item.min;
    const max = value > (maximum >= item.max ? item.max : maximum);
    const minRealValue = realValue <= 0;
    const empty = !value;
    if (min) errors = { ...errors, min };
    if (max) errors = { ...errors, max };
    if (minRealValue) errors = { ...errors, minRealValue };
    if (empty) errors = { ...errors, empty };
    return errors;
  }

  /**
   * @param {string | number} id
   * @return {import('../../../models/types').Item}
   */
  getItem = (id) => {
    const { items } = this.state;
    const item = { ...items.find((item) => `${item.id}` === `${id}`) };
    return {
      ...item,
      max: item.maxTotal < item.max ? item.maxTotal : item.max,
    };
  };

  handleChange =
    (key) =>
    ({ value, type }) => {
      const { contents: oldContents } = this.state;
      const contents = [...oldContents];
      let content = contents[key];
      if (type === TYPES_VALUE_CONTENT.REAL_VALUE) {
        content.real_value = value;
      } else {
        content.value = value;
      }

      this.setState({
        ...this.state,
        contents: contents,
      });
    };

  /**
   *
   * @param {number} key
   */
  changeTextFile =
    (key) =>
    /**
     *
     * @param {React.ChangeEvent<HTMLInputElement>} e
     * @param {import('../../../models/types').TypeAttachments} type
     */
    async (e, type) => {
      const { contents } = this.state;
      const content = contents[key];

      /**
       * @type {import('../../../models/types').AttachmentsLocal>}
       */
      const files = { ...content.files };
      /**
       * @type {FileList}
       */
      const [file] = e.target.files;
      let validFile = Helpers.validateFile(file);
      let doc = null;
      let errorFile = null;
      if (!file) {
        errorFile = 'Este campo es requerido';
      } else if (!validFile) {
        doc = null;
        errorFile = 'Formato no permitido';
      } else if (file.size >= maxFileSize) {
        errorFile = UploadFileService.messageLimit;
      } else {
        doc = file;
      }
      files[type] = { file: doc, errorFile };

      content.files = files;

      this.setState({
        ...this.state,
        contents,
      });
    };

  render() {
    const {
      area,
      utilizado,
      contenidos,
      contents,
      items,
      errorPhone,
      inmuebles,
      persons,
      contactperson,
      addNewPerson,
      showPopUpPersona,
      itemSelected,
      quote_contenidomovil,
    } = this.state;
    const invalid = this.hasErrors();
    const { total, totalByType } = this.getTotal();
    const itemsMap = new Map(items.map((item) => [`${item.id}`, item]));
    const {
      contenido_asegudado_valor,
      inmueble_asegudado_obrasvalor,
      inmueble_asegudado_joyasvalor,
      inmueble_asegudado_telefonosvalor,
    } = inmuebles;
    /**
     * @type {Record<string, { lastKey: number | null, value: number }>}
     */
    const limitInmuebles = {
      [typeItems.fixedContent.id]: {
        lastKey: null,
        value: contenido_asegudado_valor,
      },
      [typeItems.valuablesAndWorksOfArt.id]: {
        lastKey: null,
        value: inmueble_asegudado_obrasvalor,
      },
      [typeItems.jewelry.id]: {
        lastKey: null,
        value: inmueble_asegudado_joyasvalor,
      },
      [typeItems.cellPhones.id]: {
        lastKey: null,
        value: inmueble_asegudado_telefonosvalor,
      },
      [typeItems.mobileContent.id]: {
        lastKey: null,
        value: quote_contenidomovil,
      },
    };

    return (
      <React.Fragment>
        <form
          autoComplete="off"
          className="index-form emision informacion-adicioonal"
        >
          <div className="container">
            <div className="row custom-row">
              <div className="col col-sm-12 col-md-12 col-lg-12 title">
                <h2>Cuéntanos más</h2>
              </div>
            </div>

            <div className="row custom-row">
              <div className="col col-12 col-sm-12 col-md-12 col-lg-12">
                <div className="form-group">
                  <label htmlFor="pisonumero">
                    ¿Cuándo deseas que comience la póliza?
                  </label>
                  <DatePicker
                    locale={es}
                    showMonthDropdown
                    showYearDropdown
                    minDate={new Date()}
                    maxDate={MomentJs().add(1, 'M').toDate()}
                    name="initdate"
                    value={this.state.initdate}
                    onChange={this.changeDates}
                    className={'form-control pickerDate'}
                    placeholderText={
                      'Selecciona la fecha de inicio de vigencia'
                    }
                  />
                </div>
              </div>
              <div className="col col-12 col-sm-12 col-md-12 col-lg-12">
                <BuiltMetersHousing
                  value={area}
                  onChange={({ value }) => {
                    this.setState({ area: value });
                  }}
                />
              </div>
              <div className="col col-12 col-sm-12 col-md-12 col-lg-12">
                <div className={'no-icon gridgrid form-group'}>
                  <label>El inmueble es utilizado como (opcional)</label>

                  <div className="row grid-select">
                    <div className="col col-6 col-sm-12 col-md-4 col-lg-4">
                      <div
                        className={
                          'select-item row ' + (utilizado === 1 ? 'active' : '')
                        }
                        onClick={this.selectItems('utilizado', 1)}
                      >
                        <div className="col col-12 no-padding">
                          <i className="home-icon">&nbsp;</i>
                        </div>
                        <div className="col col-12 no-padding">
                          <p>Vivienda permanente</p>
                        </div>
                      </div>
                    </div>
                    <div className="col col-6 col-sm-12 col-md-4 col-lg-4">
                      <div
                        className={
                          'select-item row ' + (utilizado === 2 ? 'active' : '')
                        }
                        onClick={this.selectItems('utilizado', 2)}
                      >
                        <div className="col col-12 no-padding">
                          <i className="summer">&nbsp;</i>
                        </div>
                        <div className="col col-12 no-padding">
                          <p>Vivienda vacacional u ocasional</p>
                        </div>
                      </div>
                    </div>
                    <div className="col col-6 col-sm-12 col-md-4 col-lg-4">
                      <div
                        className={
                          'select-item row ' + (utilizado === 3 ? 'active' : '')
                        }
                        onClick={this.selectItems('utilizado', 3)}
                      >
                        <div className="col col-12 no-padding">
                          <i className="home-pay">&nbsp;</i>
                        </div>
                        <div className="col col-12 no-padding">
                          <p>Vivienda en arriendo</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {contenidos === true && (
              <div className="row row-full justify-content-center box-blue-full">
                <div className="col col-12 col-sm-12 col-md-8 col-lg-8 text-center">
                  <h4>
                    Relaciona los bienes individuales que superen los siguientes
                    valores
                  </h4>
                </div>
                <div className="col-12">
                  <div className="row justify-content-center">
                    <div className="col-6 ">
                      <p>
                        <b> • Contenidos Fijos</b>:{' '}
                        {Masknumbermoney.formatToMask(
                          itemsRequiredSince.fixedContent
                        )}
                      </p>
                      {Store.getState()?.estate[1]?.required ? (
                        <p>
                          <b> • Objetos de valor y obras de Arte:</b> Requiere
                          relación detallada para todos
                        </p>
                      ) : (
                        <p>
                          <b> • Objetos de valor y obras de Arte:</b>{' '}
                          {Masknumbermoney.formatToMask(
                            itemsRequiredSince.valuablesAndWorksOfArt
                          )}
                        </p>
                      )}
                    </div>
                    <div className="col-6">
                      <p>
                        <b> • Joyas</b>: Requiere relación detallada para todos
                      </p>
                      <p>
                        <b> • Contenidos Móviles:</b> Requiere relación
                        detallada para todos
                      </p>
                      <p>
                        <b> • Teléfonos Móviles:</b> Requiere relación detallada
                        para todos
                      </p>
                    </div>
                  </div>
                </div>
                <Articles
                  inmuebles={inmuebles}
                  total={total}
                  quote_contenidomovil={quote_contenidomovil}
                  items={items}
                  invalid={invalid}
                  individual_estate={Store.getState().estate}
                  validateTotalItem={this.validateTotalItem}
                  updateArticles={this.state.updateArticles}
                />
                <div className="wrapper-more-items">
                  <div
                    className={
                      'more-items ' + (contents.length !== 0 ? 'show' : 'hide')
                    }
                  >
                    {contents.map((content, key) => {
                      let maximum = 0;
                      if (content.type in limitInmuebles) {
                        const currentValue = limitInmuebles[content.type];
                        const keyTemp = currentValue.lastKey;
                        currentValue.lastKey = key;
                        const valueTemp = this.formatToNumber(
                          currentValue.value
                        );
                        currentValue.value -=
                          (contents[keyTemp] &&
                            this.formatToNumber(contents[keyTemp].value)) ||
                          0;
                        if (keyTemp !== null) maximum = currentValue.value;
                        else maximum = valueTemp;
                      }
                      return (
                        <Content
                          key={key}
                          content={content}
                          items={items.filter(
                            (item) =>
                              !totalByType[item.id] ||
                              !this.validateTotalItem(
                                item.maxTotal,
                                totalByType[item.id],
                                item
                              ) ||
                              `${content.type}` === `${item.id}`
                          )}
                          handleChange={({ value, type }) => {
                            this.handleChange(key)({
                              value: value,
                              type,
                            });
                          }}
                          updateContent={this.updateContent(key)}
                          removeContent={this.removeContent(key)}
                          changeTextFile={this.changeTextFile(key)}
                          item={itemsMap.get(`${content.type}`)}
                          maximum={maximum}
                          getErrors={() => this.getErrors(content, maximum)}
                        />
                      );
                    })}
                    <div className="row justify-content-center">
                      <div className="col-12 col-md-7">
                        <LastContentWarn
                          content={this.getLastContent()}
                          totalByType={totalByType}
                          validateTotalItem={this.validateTotalItem}
                          getItem={this.getItem}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col col-12 col-sm-12 col-md-12 col-lg-12">
                  <div className="row">
                    <div className="col col-sm-12 col-md-12 col-lg-12 text-center">
                      <div
                        className={
                          'more-items ' +
                          (contents.length !== 0 ? 'active' : '')
                        }
                        onClick={() => this.addContent({ totalByType })}
                      >
                        <button type="button" className="more-btn">
                          +
                        </button>
                        <p>Agregar contenido</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col col-12 col-sm-12 col-md-12 col-lg-12">
                  <div className="msj-error text-center">
                    {errorPhone === true && (
                      <p className="form-text only-errors">
                        Falta relacionar los Teléfonos Móviles y las
                        características de cada uno
                      </p>
                    )}
                  </div>
                </div>

                {contenidos === false && (
                  <div className="col col-sm-12 col-md-12 col-lg-12 msj-bottom text-center">
                    <p>
                      Es importante conocer este tipo de artículos, esto nos
                      permite al momento del siniestro responder de forma
                      efectiva
                    </p>
                  </div>
                )}
              </div>
            )}

            {typeof inmuebles.inspection_policies !== 'undefined' &&
              inmuebles.inspection_policies === 'IC' && (
                <React.Fragment>
                  <div className="row row-full text-right">
                    <div className="col col-sm-12 col-md-12 col-lg-12">
                      <div className="more-info">
                        <p>
                          Más información <span>?</span>
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="row text-center sujeta-block justify-content-center">
                    <div className="col col-12 col-sm-12 col-md-12 col-lg-12">
                      <h5>La póliza está sujeta a inspección en sitio</h5>
                      <p>
                        Selecciona la persona con la cuál nos vamos a contactar
                        para realizar la inspección en el inmueble
                      </p>
                    </div>
                    <div className="col col-12 col-sm-12 col-md-8 col-lg-8">
                      <div className={'no-icon gridgrid form-group'}>
                        <div className="row grid-select justify-content-center  ">
                          {persons.map((item, key) => (
                            <div
                              className="col col-6 col-sm-12 col-md-4 col-lg-4"
                              key={key}
                            >
                              <div
                                className={
                                  'select-item row ' +
                                  (contactperson === key ? 'active' : '')
                                }
                                onClick={this.selectItems('contactperson', key)}
                              >
                                <div className="col col-12 no-padding">
                                  <i className="userperson">&nbsp;</i>
                                </div>
                                <div className="col col-12 no-padding">
                                  <p>
                                    {typeof item.first_name !== 'undefined'
                                      ? item.first_name
                                      : item.name}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {addNewPerson === true && (
                      <div className="col col-sm-12 col-md-12 col-lg-12 text-center">
                        <div
                          className="more-items"
                          onClick={this.togglePerson(-1, -1)}
                        >
                          <button type="button" className="more-btn">
                            +
                          </button>
                          <p>Agregar persona</p>
                        </div>
                      </div>
                    )}
                  </div>
                </React.Fragment>
              )}

            <div className="row">
              <div className="col col-12 col-sm-12 col-md-12 col-lg-12 form-action justify-content text-center">
                <BtnContinue
                  disable={invalid}
                  state={this.state}
                  getItem={this.getItem}
                  toggleErrorPhone={this.toggleErrorPhone}
                />
              </div>
            </div>
          </div>
        </form>
        {showPopUpPersona === true && (
          <PopUpPersona
            toggle={this.togglePerson}
            persons={persons}
            item={itemSelected}
            typePerson={7}
            contactPerson={true}
            updatePerson={this.updatePerson}
          />
        )}
        <ModalLimitsPlanError
          open={this.state.openLimitsModal}
          onRetry={this.handleRetry}
          code={this.state.code}
          numberCotizacion={this.state.numberCotizacion}
          showButtonReturn={this.state.showButtonReturn}
          currentDateTime={this.state.currentDateTime}
        />
      </React.Fragment>
    );
  }
}

export default withRouter(Index);
