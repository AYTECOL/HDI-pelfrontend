import React from "react";
//Component
import BtnContinue from "./forms/btncontinue/BtnContinue";

import "./styles.scss";
import { withRouter } from "react-router-dom";
import "moment/locale/es";
import MomentJs from "moment";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import es from "react-datepicker/node_modules/date-fns/esm/locale/es/index";

import PopUpPersona from "../identificacion/popups/persona/Persona";
import Loading from "../../globals/loading/Loading";
import QuoteIussedById from "../../../services/QuoteIussedById";
import Helpers from "../../../common/helpers/helpers/Helpers";
import Masknumbermoney from "../../../common/helpers/masknumbermoney/Masknumbermoney";
import Content from "./Content";

const typeItems = {
  /**
   * @description "Contenido Fijo"
   **/
  fixedContent: { id: 0, label: "Contenido Fijo" },
  /**
   * @description "Objetos de valor y obras de Arte"
   **/
  valuablesAndWorksOfArt: { id: 1, label: "Objetos de valor y obras de Arte" },
  /**
   * @description "Joyas"
   **/
  jewelry: { id: 2, label: "Joyas" },
  /**
   * @description "Celulares"
   **/
  cellPhones: { id: 3, label: "Celulares" },
  /**
   * @description "Contenido Movil"
   **/
  mobileContent: { id: 4, label: "Contenido Movil" }
};

/**
 * @typedef {{ label: string, id: string, min: number, max: number }} Item
 */
// @ts-check
class Index extends React.Component {
  constructor(props) {
    super(props);
    this.current = React.createRef();
    this.formatDate = "dddd, MMMM Do YYYY";
    /**
     * @type {{ items: Item[] }>}
     */
    this.state = {
      step: parseInt(this.props.match.params.step),
      totalContent: 0,
      initdate: MomentJs().format(this.formatDate),
      persons: [],
      contents: [],
      quote_contenidomovil: 0,
      inmuebles: {},
      area: "",
      addNewPerson: true,
      itemSelected: null,
      showPopUpPersona: false,
      errorPhone: false,
      items: []
    };
    this.updatePerson = this.updatePerson.bind(this);
    this.toggleErrorPhone = this.toggleErrorPhone.bind(this);
  }

  componentDidMount() {
    this.getData();
    Helpers.fieldNumeric();
  }

  async getData() {
    Loading.toggle(true);
    const { params } = this.props.match;
    let data = await QuoteIussedById.get(params.id);
    let inmuebles = data.risk_valoration_info.Item;
    let persons = this.state.persons;

    const { values } = {
      ...data.plan_selected_info.Item.coverages.find(
        ({ code, code_content }) => code === 9693 || code_content === 9693
      )
    };

    const coverageValue =
      values && values.find(({ code }) => String(code) === String(3044));
    const value_to_quotate =
      (coverageValue && coverageValue.value_to_quotate) || 0;

    this.setState({ quote_contenidomovil: value_to_quotate });
    if (typeof data.quote_iussed_info.Item !== "undefined") {
      let items = data.quote_iussed_info.Item;
      persons.push(items.taker);
      persons = persons.concat(items.insured);
      persons = persons.concat(items.benefist);
    }
    if (typeof data.more_info.Item !== "undefined") {
      data = data.more_info.Item;
      if (typeof data !== "undefined") {
        if (typeof data.start_policy_date !== "undefined")
          data["initdate"] = data.start_policy_date;
        if (typeof data.risk_use !== "undefined")
          data["utilizado"] = data.risk_use;
        if (typeof data.goods_over_cost !== "undefined")
          data["contents"] = data.goods_over_cost;
        for (let i = 0; i < data["contents"].length; i++) {
          for (let j in data.contents[i])
            if (data.contents[i][j] === '""') data.contents[i][j] = "";
        }
        if (
          typeof data.visit_person !== "undefined" &&
          typeof data.visit_person.active !== "undefined"
        ) {
          data["contactperson"] = data.visit_person.active;
          if (
            typeof data.visit_person.phone !== "undefined" &&
            data.visit_person.phone !== ""
          ) {
            persons.push({
              name: data.visit_person.name,
              telefono: data.visit_person.phone
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
     * @type {Item[]}
     */
    const items = [];
    if (typeof inmuebles !== "undefined") {
      if (inmuebles.contenido_asegudado === 1) {
        contenidos = true;
        items.push({
          ...typeItems.fixedContent,
          min: 1,
          max: inmuebles.contenido_asegudado_valor
        });

        if (inmuebles.inmueble_asegudado_obras === 1) {
          items.push({
            ...typeItems.valuablesAndWorksOfArt,
            min: 1,
            max: inmuebles.inmueble_asegudado_obrasvalor
          });
          obras = true;
        }
        if (inmuebles.inmueble_asegudado_joyas === 1) {
          items.push({
            ...typeItems.jewelry,
            min: 1,
            max: inmuebles.inmueble_asegudado_joyasvalor
          });
          joyas = true;
        }
        if (inmuebles.inmueble_asegudado_telefonos === 1) {
          items.push({
            ...typeItems.cellPhones,
            min: 899999,
            max: inmuebles.inmueble_asegudado_telefonosvalor
          });
          celulares = true;
        }
      }
      if (
        inmuebles.distribution_of_insured_securities_split.valorAmparo
          .valorAsegurado3044
      ) {
        contenidoMovil = true;
        items.push({
          ...typeItems.mobileContent,
          min: 1,
          max: value_to_quotate > 20000000 ? 20000000 : value_to_quotate
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
      items
    });
    Loading.toggle(false);
  }

  toggleErrorPhone(status) {
    this.setState({
      ...this.state,
      errorPhone: status
    });
  }

  selectItems = (name, value) => () => {
    this.setState({
      ...this.state,
      [name]: value
    });
  };

  removeContent = key => () => {
    let total = this.state.totalContent - 1;
    if (total < 0) total = 0;
    const contents = this.state.contents;
    contents.splice(key, 1);
    this.setState({
      ...this.state,
      totalContent: total,
      contents
    });
  };

  addContent = () => {
    let total = this.state.totalContent + 1;
    const { contents } = this.state;
    this.setState({
      ...this.state,
      totalContent: total,
      contents: [
        ...contents,
        {
          type: "",
          caracte: "",
          value: "",
          urlfile: "",
          showDefaultTextFile: true
        }
      ]
    });
  };

  changeDates = e => {
    this.changeValue({
      target: {
        name: "initdate",
        value: MomentJs(e).format(this.formatDate)
      }
    });
  };

  changeValue = e => {
    let v = e.target.value;
    let n = e.target.name;
    this.setState({
      ...this.state,
      [n]: v
    });
  };

  updatePerson(person) {
    let persons = this.state.persons;
    persons.push(person);
    this.setState({
      ...this.state,
      persons: persons,
      showPopUpPersona: false,
      addNewPerson: false
    });
  }

  togglePerson = (index, type) => () => {
    let showPopUpPersona = !this.state.showPopUpPersona;
    this.setState({
      ...this.state,
      showPopUpPersona: showPopUpPersona
    });
  };
  // validate text total
  updateContent = key => e => {
    const { contents } = this.state;
    contents[key][e.target.name] = e.target.value;
    this.setState({
      ...this.state,
      contents
    });
  };

  hasErrors() {
    const { contents, inmuebles, quote_contenidomovil } = this.state;
    const {
      fixedContent,
      valuablesAndWorksOfArt,
      jewelry,
      cellPhones,
      mobileContent
    } = typeItems;
    const total = {
      [fixedContent.id]: 0,
      [valuablesAndWorksOfArt.id]: 0,
      [jewelry.id]: 0,
      [cellPhones.id]: 0,
      [mobileContent.id]: 0
    };
    for (const content of contents) {
      const value = Masknumbermoney.formatToNumber(content.value);
      const contentType = content.type;
      if (this.getErrors(content)) return true;
      /**
       * @description The value is added to the total
       */
      if (contentType in total) total[contentType] += value;
    }

    if (
      inmuebles.contenido_asegudado === 1 &&
      total[fixedContent.id] !== 0 &&
      inmuebles.contenido_asegudado_valor < total[fixedContent.id]
    )
      return true;

    if (
      inmuebles.inmueble_asegudado_obras === 1 &&
      total[valuablesAndWorksOfArt.id] !== 0 &&
      inmuebles.inmueble_asegudado_obrasvalor < total[valuablesAndWorksOfArt.id]
    )
      return true;
    if (
      inmuebles.inmueble_asegudado_joyas === 1 &&
      total[jewelry.id] !== 0 &&
      inmuebles.inmueble_asegudado_joyasvalor < total[jewelry.id]
    )
      return true;
    if (inmuebles.inmueble_asegudado_telefonos === 1) {
      return (
        inmuebles.inmueble_asegudado_telefonosvalor !== total[cellPhones.id]
      );
    }
    if (total[mobileContent.id] > quote_contenidomovil) {
      return true;
    }
    return false;
  }

  getErrors(content) {
    /**
     * @type {{min?:boolean, max?:boolean} | null}
     */
    let errors = null;
    const value = Masknumbermoney.formatToNumber(content.value);
    const contentType = content.type;
    const item = this.getItem(contentType);
    const min = value < item.min;
    const max = value > item.max;
    const empty = !value;
    if (min) errors = { ...errors, min };
    if (max) errors = { ...errors, max };
    if (empty) errors = { ...errors, empty };
    return errors;
  }

  /**
   * @param {string} id
   * @return {Item}
   */
  getItem = id => {
    const { items } = this.state;
    const item = { ...items.find(item => String(item.id) === String(id)) };
    return item;
  };

  handleChange = key => e => {
    const { contents } = this.state;
    let content = contents[key];
    content[e.target.name] = Masknumbermoney.formatToMask(e.target.value);
    this.setState({
      ...this.state,
      contents
    });
  };

  changeTextFile = key => async e => {
    let validFile = Helpers.validateFile(e.target.files[0]);
    let doc = null;
    let showDefaultTextFile = true;
    let textFile = "";
    let errorFile = false;
    let uploaded = false;
    if (validFile) {
      showDefaultTextFile = false;
      doc = e.target.files[0];
      textFile = e.target.files[0].name;
    } else {
      doc = null;
      errorFile = true;
    }
    let contents = this.state.contents;
    contents[key]["doc"] = doc;
    contents[key]["showDefaultTextFile"] = showDefaultTextFile;
    contents[key]["textFile"] = textFile;
    contents[key]["errorFile"] = errorFile;
    contents[key]["uploaded"] = uploaded;

    this.setState({
      ...this.state,
      contents
    });
  };

  render() {
    const {
      area,
      utilizado,
      contenidos,
      celulares,
      contents,
      items,
      errorPhone,
      inmuebles,
      persons,
      contactperson,
      addNewPerson,
      showPopUpPersona,
      itemSelected,
      quote_contenidomovil
    } = this.state;
    const valid = !this.hasErrors();
    const {
      contenido_asegudado_valor,
      inmueble_asegudado_obrasvalor,
      inmueble_asegudado_joyasvalor,
      inmueble_asegudado_telefonosvalor
    } = inmuebles;
    /**
     * @type {Record<string, { lastKey: number | null, value: number, id: number }>}
     */
    const limitInmuebles = {
      [typeItems.fixedContent.id]: {
        lastKey: null,
        value: contenido_asegudado_valor
      },
      [typeItems.valuablesAndWorksOfArt.id]: {
        lastKey: null,
        value: inmueble_asegudado_obrasvalor
      },
      [typeItems.jewelry.id]: {
        lastKey: null,
        value: inmueble_asegudado_joyasvalor
      },
      [typeItems.cellPhones.id]: {
        lastKey: null,
        value: inmueble_asegudado_telefonosvalor
      },
      [typeItems.mobileContent.id]: {
        lastKey: null,
        value: quote_contenidomovil
      }
    };
    return (
      <React.Fragment>
        <form
          autoComplete="off"
          className="index-form emision informacion-adicioonal"
        >
          <div className="container">
            <div className="row">
              <div className="col col-sm-12 col-md-12 col-lg-12 title">
                <h2>Cuéntanos más</h2>
              </div>
            </div>

            <div className="row">
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
                    maxDate={MomentJs()
                      .add(1, "M")
                      .toDate()}
                    name="initdate"
                    value={this.state.initdate}
                    onChange={this.changeDates}
                    className={"form-control pickerDate"}
                    placeholderText={
                      "Selecciona la fecha de inicio de vigencia"
                    }
                  />
                </div>
              </div>
              <div className="col col-12 col-sm-12 col-md-12 col-lg-12">
                <div className="form-group ">
                  <label htmlFor="area">
                    Metros construidos de vivienda (m2) (Opcional)
                  </label>
                  <input
                    type="text"
                    className="form-control number"
                    name="area"
                    value={area}
                    onChange={this.changeValue}
                    placeholder={"Ingresa el tamaño de la vivienda"}
                  />
                  <small>Ingresa la información en M2</small>
                </div>
              </div>
              <div className="col col-12 col-sm-12 col-md-12 col-lg-12">
                <div className={"no-icon gridgrid form-group"}>
                  <label>El inmueble es utilizado como (opcional)</label>

                  <div className="row grid-select">
                    <div className="col col-6 col-sm-12 col-md-4 col-lg-4">
                      <div
                        className={
                          "select-item row " + (utilizado === 1 ? "active" : "")
                        }
                        onClick={this.selectItems("utilizado", 1)}
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
                          "select-item row " + (utilizado === 2 ? "active" : "")
                        }
                        onClick={this.selectItems("utilizado", 2)}
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
                          "select-item row " + (utilizado === 3 ? "active" : "")
                        }
                        onClick={this.selectItems("utilizado", 3)}
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
                <div className="col col-12 col-sm-12 col-md-10 col-lg-8">
                  <div className="row row-full">
                    <div className="col col-sm-12 col-md-6 col-lg-6">
                      <p>
                        <b>Contenidos</b>: $ 12.000.000
                      </p>
                      <p>
                        <b>Joyas</b>: $ 2.000.000
                      </p>
                      <p>
                        <b>Teléfonos Móviles:</b> Requiere relación detallada
                        para todos
                      </p>
                    </div>
                    <div className="col col-sm-12 col-md-6 col-lg-6">
                      <p>
                        <b>Objetos de valor y obras de Arte:</b> $ 2.000.000
                      </p>
                      <p>
                        <b>Contenidos Móviles:</b> $ 2.000.000
                      </p>
                    </div>
                    {celulares === true && (
                      <div className="col col-sm-12 col-md-12 col-lg-12">
                        <p>
                          Recuerda que, para emitir la póliza, debes relacionar
                          las características y el número IMEI de cada teléfono
                          móvil.{" "}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="col col-12 col-sm-12 col-md-12 col-lg-12">
                  <p className="text-center mt-3">
                    Es importante conocer este tipo de artículos, esto nos
                    permite al momento del siniestro responder de forma efectiva
                    de acuerdo a la necesidad.{" "}
                  </p>
                </div>
                <div className="wrapper-more-items">
                  <div
                    className={
                      "more-items " + (contents.length !== 0 ? "show" : "hide")
                    }
                  >
                    {contents.map((content, key) => {
                      let maximum = 0;
                      if (content.type in limitInmuebles) {
                        const currentValue = limitInmuebles[content.type];
                        const keyTemp = currentValue.lastKey;
                        currentValue.lastKey = key;
                        const valueTemp = Masknumbermoney.formatToNumber(
                          currentValue.value
                        );
                        currentValue.value -=
                          (contents[keyTemp] &&
                            Masknumbermoney.formatToNumber(
                              contents[keyTemp].value
                            )) ||
                          0;
                        if (keyTemp !== null) maximum = currentValue.value;
                        else maximum = valueTemp;
                      }
                      return (
                        <Content
                          key={key}
                          content={content}
                          items={items}
                          handleChange={this.handleChange(key)}
                          updateContent={this.updateContent(key)}
                          removeContent={this.removeContent(key)}
                          changeTextFile={this.changeTextFile(key)}
                          item={this.getItem(content.type)}
                          maximum={maximum}
                          getErrors={() => this.getErrors(content)}
                        />
                      );
                    })}
                  </div>
                </div>

                <div className="col col-12 col-sm-12 col-md-12 col-lg-12">
                  <div className="row">
                    <div className="col col-sm-12 col-md-12 col-lg-12 text-center">
                      <div
                        className={
                          "more-items " +
                          (contents.length !== 0 ? "active" : "")
                        }
                        onClick={this.addContent}
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

            {typeof inmuebles.inspection_policies !== "undefined" &&
              inmuebles.inspection_policies === "IC" && (
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
                      <div className={"no-icon gridgrid form-group"}>
                        <div className="row grid-select justify-content-center  ">
                          {persons.map((item, key) => (
                            <div
                              className="col col-6 col-sm-12 col-md-4 col-lg-4"
                              key={key}
                            >
                              <div
                                className={
                                  "select-item row " +
                                  (contactperson === key ? "active" : "")
                                }
                                onClick={this.selectItems("contactperson", key)}
                              >
                                <div className="col col-12 no-padding">
                                  <i className="userperson">&nbsp;</i>
                                </div>
                                <div className="col col-12 no-padding">
                                  <p>
                                    {typeof item.first_name !== "undefined"
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
                  disable={valid}
                  state={this.state}
                  items={items}
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
      </React.Fragment>
    );
  }
}

export default withRouter(Index);
