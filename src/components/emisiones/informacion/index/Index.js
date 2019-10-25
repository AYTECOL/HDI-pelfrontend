import React, { Component } from "react";
//Component
import BtnContinue from "../forms/btncontinue/BtnContinue";

import "./Index.scss";
import { withRouter } from "react-router-dom";
import "moment/locale/es";
import MomentJs from "moment";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import es from "react-datepicker/node_modules/date-fns/esm/locale/es/index";

import PopUpPersona from "../../identificacion/popups/persona/Persona";
import Loading from "../../../globals/loading/Loading";
import QuoteIussedById from "../../../../services/QuoteIussedById";
import Helpers from "../../../../common/helpers/helpers/Helpers";
import Masknumbermoney from "../../../../common/helpers/masknumbermoney/Masknumbermoney";

class Index extends Component {
  constructor(props) {
    super(props);
    this.current = React.createRef();
    let formatDate = "dddd, MMMM Do YYYY";
    this.state = {
      step: parseInt(this.props.match.params.step),
      totalContent: 0,
      initdate: MomentJs().format(formatDate),
      formatDate: formatDate,
      persons: [],
      contents: [],
      inmueble: {},
      area: "",
      disableBtn: false,
      addNewPerson: true,
      itemSelected: null,
      showPopUpPersona: false,
      errorPhone: false,
      items: [
        "Contenido Fijo",
        "Obras de Arte",
        "Joyas",
        "Celulares",
        "Contenido Movil"
      ],
      limits: []
    };
    this.updatePerson = this.updatePerson.bind(this);
    this.toggleErrorPhone = this.toggleErrorPhone.bind(this);
  }

  static showName(name) {
    let s = name.split("/");
    return s[s.length - 1];
  }

  componentDidMount() {
    this.getData();
    Helpers.fieldNumeric();
  }

  async getData() {
    Loading.toggle(true);
    let data = await QuoteIussedById.get(this.props.match.params.id);
    let inmueble = data.risk_valoration_info.Item;
    let persons = this.state.persons;
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
    if (typeof inmueble !== "undefined") {
      if (inmueble.contenido_asegudado === 1) {
        contenidos = true;
        if (inmueble.inmueble_asegudado_obras === 1) obras = true;
        if (inmueble.inmueble_asegudado_joyas === 1) joyas = true;
        if (inmueble.inmueble_asegudado_telefonos === 1) celulares = true;
      }
      if (
        inmueble.distribution_of_insured_securities_split.valorAmparo
          .valorAsegurado3044
      ) {
        contenidoMovil = true;
      }
    }
    const validateMinMax = [
      {
        min: 1,
        max: inmueble.contenido_asegudado_valor
      },
      {
        min: 1,
        max: inmueble.inmueble_asegudado_obrasvalor
      },
      {
        min: 1,
        max: inmueble.inmueble_asegudado_joyasvalor
      },
      {
        min: 899999,
        max: inmueble.inmueble_asegudado_telefonosvalor
      },
      {
        min: 1,
        max:
          inmueble.distribution_of_insured_securities_split.valorAmparo
            .valorAsegurado3044
      }
    ];
    this.setState({ limits: validateMinMax });
    this.setState({
      ...this.state,
      ...data,
      inmueble: inmueble,
      persons: persons,
      contenidos: contenidos,
      obras: obras,
      joyas: joyas,
      celulares: celulares,
      contenidomovil: contenidoMovil
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

  removeContent = key => e => {
    let total = this.state.totalContent - 1;
    if (total < 0) total = 0;
    let contents = this.state.contents;
    contents.splice(e.target.id, 1);
    this.setState({
      ...this.state,
      totalContent: total,
      contents: contents
    });
  };

  addContent = () => {
    let total = this.state.totalContent + 1;
    let contents = this.state.contents;
    contents.push({
      type: "",
      caracte: "",
      value: "",
      urlfile: "",
      showDefaultTextFile: true
    });
    this.setState({
      ...this.state,
      totalContent: total,
      contents: contents
    });
  };

  changeDates = e => {
    this.changeValue({
      target: {
        name: "initdate",
        value: MomentJs(e).format(this.state.formatDate)
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
    let contents = this.state.contents;
    let inmubles = this.state.inmueble;
    let textTotal = document.querySelectorAll(".total-value");
    if (e.target.value === "0") {
      textTotal[key].innerText = `Maximo: ${
        inmubles.contenido_asegudado_valor > 50000000
          ? "50.000.000"
          : Masknumbermoney.formatToMask(inmubles.contenido_asegudado_valor)
      } `;
    }
    if (e.target.value === "1") {
      textTotal[key].innerText = `Maximo: ${
        inmubles.inmueble_asegudado_obrasvalor > 20000000
          ? "20.000.000"
          : Masknumbermoney.formatToMask(inmubles.inmueble_asegudado_obrasvalor)
      } `;
    }
    if (e.target.value === "2") {
      textTotal[key].innerText = `Maximo: ${
        inmubles.inmueble_asegudado_joyasvalor > 20000000
          ? "20.000.000"
          : Masknumbermoney.formatToMask(inmubles.inmueble_asegudado_joyasvalor)
      } `;
    }
    if (e.target.value === "3") {
      textTotal[key].innerText = `Maximo: ${
        inmubles.inmueble_asegudado_telefonosvalor > 4000000
          ? "4.000.000"
          : Masknumbermoney.formatToMask(
              inmubles.inmueble_asegudado_telefonosvalor
            )
      } `;
    }

    if (e.target.value === "4") {
      textTotal[key].innerText = `Maximo: ${
        inmubles.distribution_of_insured_securities_split.valorAmparo
          .valorAsegurado3044 > 20000000
          ? "20.000.000"
          : Masknumbermoney.formatToMask(
              inmubles.distribution_of_insured_securities_split.valorAmparo
                .valorAsegurado3044
            )
      } `;
    }
    contents[key][e.target.name] = e.target.value;
    this.setState({
      ...this.state,
      contents: contents
    });
  };

  validateTotalAsegurado(disableBtn) {
    let contents = this.state.contents;
    let inmubles = this.state.inmueble;
    let disabled = false;

    let total_contenido_asegudado = 0;
    let total_inmueble_asegudado_obras = 0;
    let total_inmueble_asegudado_joyas = 0;
    let total_inmueble_asegudado_telefonos = 0;

    for (let i = 0; i < contents.length; i++) {
      let value = Masknumbermoney.formatToNumber(contents[i].value);
      if (parseInt(contents[i].type) === 0) total_contenido_asegudado += value;
      if (parseInt(contents[i].type) === 1)
        total_inmueble_asegudado_obras += value;
      if (parseInt(contents[i].type) === 2)
        total_inmueble_asegudado_joyas += value;
      if (parseInt(contents[i].type) === 3)
        total_inmueble_asegudado_telefonos += value;
    }
    if (
      inmubles.contenido_asegudado === 1 &&
      disabled === false &&
      total_contenido_asegudado !== 0
    ) {
      if (inmubles.contenido_asegudado_valor < total_contenido_asegudado) {
        disabled = true;
      }
    }
    if (
      inmubles.inmueble_asegudado_obras === 1 &&
      disabled === false &&
      total_inmueble_asegudado_obras !== 0
    ) {
      if (
        inmubles.inmueble_asegudado_obrasvalor < total_inmueble_asegudado_obras
      ) {
        disabled = true;
      }
    }
    if (
      inmubles.inmueble_asegudado_joyas === 1 &&
      disabled === false &&
      total_inmueble_asegudado_joyas !== 0
    ) {
      if (
        inmubles.inmueble_asegudado_joyasvalor < total_inmueble_asegudado_joyas
      ) {
        disabled = true;
      }
    }
    if (inmubles.inmueble_asegudado_telefonos === 1 && disabled === false) {
      disabled =
        inmubles.inmueble_asegudado_telefonosvalor !==
        total_inmueble_asegudado_telefonos;
    }
    if (disableBtn === true) disabled = true;
    this.setState({
      ...this.state,
      disableBtn: disabled
    });
  }

  validateContent = key => e => {
    let contents = this.state.contents;
    let disableBtn = this.state.disableBtn;
    let limits = this.state.limits[contents[key].type];
    let v = Masknumbermoney.formatToNumber(e.target.value);
    if (v >= limits.min && v <= limits.max) {
      contents[key]["error1"] = false;
      contents[key]["error2"] = false;
      disableBtn = false;
    } else {
      contents[key]["error1"] = false;
      if (v <= limits.min) {
        contents[key]["error1"] = true;
      }
      contents[key]["error1"] = false;
      if (v >= limits.max) {
        contents[key]["error2"] = true;
      }

      disableBtn = true;
    }
    if (disableBtn != true) {
      if (contents[key].type === "0") {
        if (v <= 0) {
          contents[key]["error1"] = true;
          disableBtn = true;
        } else {
          contents[key]["error1"] = false;
        }
        if (v >= 50000001) {
          contents[key]["error2"] = true;
          disableBtn = true;
        } else {
          contents[key]["error2"] = false;
        }
      }
      if (contents[key].type === "1") {
        if (v <= 0) {
          contents[key]["error1"] = true;
          disableBtn = true;
        } else {
          contents[key]["error1"] = false;
        }
        if (v >= 20000001) {
          contents[key]["error2"] = true;
          disableBtn = true;
        } else {
          contents[key]["error2"] = false;
        }
      }
      if (contents[key].type === "2") {
        if (v <= 899999) {
          contents[key]["error1"] = true;
          disableBtn = true;
        } else {
          contents[key]["error1"] = false;
        }
        if (v >= 20000001) {
          contents[key]["error2"] = true;
          disableBtn = true;
        } else {
          contents[key]["error2"] = false;
        }
      }
      if (contents[key].type === "3") {
        if (v <= 899999) {
          contents[key]["error1"] = true;
          disableBtn = true;
        } else {
          contents[key]["error1"] = false;
        }
        if (v >= 4000001) {
          contents[key]["error2"] = true;
          disableBtn = true;
        } else {
          contents[key]["error2"] = false;
        }
      }
    }
    contents[key][e.target.name] = Masknumbermoney.formatToMask(e.target.value);
    this.setState({
      ...this.state,
      contents: contents,
      disableBtn: disableBtn
    });
    setTimeout(() => {
      this.validateTotalAsegurado(disableBtn);
    }, 250);
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
      contents: contents
    });
  };

  render() {
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
                    value={this.state.area}
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
                          "select-item row " +
                          (this.state.utilizado === 1 ? "active" : "")
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
                          "select-item row " +
                          (this.state.utilizado === 2 ? "active" : "")
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
                          "select-item row " +
                          (this.state.utilizado === 3 ? "active" : "")
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

            {this.state.contenidos === true && (
              <div className="row row-full justify-content-center box-blue-full">
                <div className="col col-sm-12 col-md-8 col-lg-8 text-center">
                  <h4>
                    Relaciona los bienes individuales que superen los siguientes
                    valores
                  </h4>
                </div>
                <div className="col col-sm-12 col-md-6 col-lg-6">
                  <div className="row">
                    <div className="col col-sm-12 col-md-6 col-lg-6">
                      <p>
                        <b>Contenidos</b>: $ 12.000.000
                      </p>
                      <p>
                        <b>Joyas</b>: $ 2.000.000
                      </p>
                    </div>
                    <div className="col col-sm-12 col-md-6 col-lg-6">
                      <p>
                        <b>Obras de Arte:</b> $ 2.000.000
                      </p>
                      <p>
                        <b>Contenidos Móviles:</b> $ 2.000.000
                      </p>
                    </div>
                    <div className="col">
                      <p>
                        <b>Teléfonos Móviles:</b> Requiere relación detallada
                        para todos
                      </p>
                    </div>
                    {this.state.celulares === true && (
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
                <div className="col col-sm-12 col-md-12 col-lg-12">
                  <p className="text-center">
                    Es importante conocer este tipo de artículos, esto nos
                    permite al momento del siniestro responder de forma efectiva
                    de acuerdo a la necesidad.{" "}
                  </p>
                </div>
                <div className="wrapper-more-items">
                  <div
                    className={
                      "more-items " +
                      (this.state.contents.length !== 0 ? "show" : "hide")
                    }
                  >
                    {this.state.contents.map((item, key) => (
                      <div className="moreitems" key={key}>
                        <div className="row">
                          <div className="col no-padding-right">
                            <div className="name form-group input-select">
                              <label htmlFor="name">Tipo de item</label>
                              <select
                                className="form-control"
                                name="type"
                                id="type"
                                value={item.type}
                                onChange={this.updateContent(key)}
                              >
                                <option value="" />
                                {this.state.items.map((i, k) => (
                                  <React.Fragment key={k}>
                                    {((this.state.contenidos === true &&
                                      k === 0) ||
                                      (this.state.obras === true && k === 1) ||
                                      (this.state.joyas === true && k === 2) ||
                                      (this.state.contenidomovil === true &&
                                        k === 4) ||
                                      (this.state.celulares === true &&
                                        k === 3)) && (
                                      <option value={k}>{i}</option>
                                    )}
                                  </React.Fragment>
                                ))}
                              </select>
                            </div>
                          </div>
                          <div className="col no-padding-right">
                            <div className="name form-group ">
                              <label htmlFor="name">Características</label>
                              <input
                                type="text"
                                className="form-control"
                                name="caracte"
                                value={item.caracte}
                                onChange={this.updateContent(key)}
                              />
                              <small className="form-text d-block text-left">
                                Ej: Marca, referencia, Numero IMEI, color...
                              </small>
                            </div>
                          </div>
                          <div className="col no-padding-right">
                            <div
                              className={
                                "name form-group " +
                                (item.error1 || item.error2 ? "error" : "")
                              }
                            >
                              <label htmlFor="name">Valor</label>
                              <input
                                type="text"
                                className="form-control"
                                name="value"
                                value={item.value}
                                onChange={this.validateContent(key)}
                              />
                              <small className="form-text d-block text-left total-value">
                                $ 0
                              </small>
                              <small
                                className={
                                  "form-text only-errors " +
                                  (item.error1 === true ? "show" : "hide")
                                }
                              >
                                Valor Asegurado del ítem{" "}
                                {this.state.items[item.type]} es inferior al
                                permitido
                              </small>
                              <small
                                className={
                                  "form-text only-errors " +
                                  (item.error2 === true ? "show" : "hide")
                                }
                              >
                                Valor Asegurado del ítem{" "}
                                {this.state.items[item.type]} es mayor al
                                permitido
                              </small>
                            </div>
                          </div>
                          <div className="col no-padding-right">
                            <div className="row sarlaft no-gutters">
                              <div className="col col-12 col-sm-12 col-md-12 col-lg-12">
                                <div className="sarlaft form-group">
                                  <input
                                    type="file"
                                    className="form-control"
                                    name="doc"
                                    onChange={this.changeTextFile(key)}
                                  />
                                  {item.showDefaultTextFile ? (
                                    <p>
                                      Arrastre archivos para adjuntar, o{" "}
                                      <b>buscar</b>
                                    </p>
                                  ) : (
                                    <p>{Index.showName(item.textFile)}</p>
                                  )}
                                  <span>
                                    Formatos permitidos PDF, PNG, GIF, JPG
                                  </span>
                                  <br />
                                  <span
                                    className={
                                      "error-file " +
                                      (item.errorFile === true
                                        ? "show"
                                        : "hide")
                                    }
                                  >
                                    Formato no permitido
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col col-1 text-center no-padding-left">
                            <span
                              id={key}
                              className="trash"
                              onClick={this.removeContent(key)}
                            >
                              &nbsp;
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="col col-sm-12 col-md-12 col-lg-12">
                  <div className="row">
                    <div className="col col-sm-12 col-md-12 col-lg-12 text-center">
                      <div
                        className={
                          "more-items " +
                          (this.state.contents.length !== 0 ? "active" : "")
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

                <div className="col col-sm-12 col-md-12 col-lg-12">
                  <div className="msj-error text-center">
                    {this.state.errorPhone === true && (
                      <p className="form-text only-errors">
                        Falta relacionar los Teléfonos Móviles y las
                        características de cada uno
                      </p>
                    )}
                  </div>
                </div>

                {this.state.contenidos === false && (
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

            {typeof this.state.inmueble.inspection_policies !== "undefined" &&
              this.state.inmueble.inspection_policies === "IC" && (
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
                          {this.state.persons.map((item, key) => (
                            <div
                              className="col col-6 col-sm-12 col-md-4 col-lg-4"
                              key={key}
                            >
                              <div
                                className={
                                  "select-item row " +
                                  (this.state.contactperson === key
                                    ? "active"
                                    : "")
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

                    {this.state.addNewPerson === true && (
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
                  disable={this.state.disableBtn}
                  state={this.state}
                  items={this.state.items}
                  toggleErrorPhone={this.toggleErrorPhone}
                />
              </div>
            </div>
          </div>
        </form>
        {this.state.showPopUpPersona === true && (
          <PopUpPersona
            toggle={this.togglePerson}
            persons={this.state.persons}
            item={this.state.itemSelected}
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
