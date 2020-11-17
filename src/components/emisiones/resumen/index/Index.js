import React, { Component } from "react";

import "./Index.scss";
import { withRouter } from "react-router-dom";
import Card from "../../identificacion/card/Card";
import ButtonsFooter from "./ButtonsFooter";
import store from "../../../../store";
import PopUpPersona from "../../identificacion/popups/persona/Persona";
import Validaridentificacion from "../../../cotizaciones/identificacion/popups/validaridentificacion/Validaridentificacion";
import Helpers from "../../../../common/helpers/helpers/Helpers";
import CoberturasSummary from "../coberturas/Coberturas";
import AsistenciasSummary from "../asistencias/Asistencias";
import Loading from "../../../globals/loading/Loading";
import QuoteIussedById from "../../../../services/QuoteIussedById";
import {
  AllPlans as AllPlansCreator,
  indexPlanSelected
} from "../../../../actions";
import AllPropertiesZones from "../../../../services/AllPropertiesZones";
import AllBuildMaterial from "../../../../services/AllBuildMaterial";
import AllBuildYears from "../../../../services/AllBuildYears";
import AllSecurity from "../../../../services/AllSecurity";
import Masknumbermoney from "../../../../common/helpers/masknumbermoney/Masknumbermoney";
import Summary from "../../../cotizaciones/cotizacion/summary/summary";
import { roles } from "../../identificacion/constants";
import { someRole } from "../../utils";

class Index extends Component {
  constructor(props) {
    super(props);
    /**
     * @type {{
     *   contents: import("../../../../models/types").GoodsOverCost[],
     *   step: number,
     *  }}
     */
    this.state = {
      step: parseInt(this.props.match.params.step),
      cotizacion: {},
      adressHome: '',
      persons: [],
      contents: [],
      itemSelected: null,
      newSecurity: [],
      inmueble: {
        identificacion: {},
      },
      typePerson: 1,
      city: '',
    };
  }

  static getName(path) {
    if (typeof path !== "undefined") {
      let name = path.split("/");
      if (name.length > 0) {
        name = name[name.length - 1];
      } else {
        name = path;
      }
      return decodeURIComponent(name.replace(/\+/g, "%20"));
    } else {
      return "";
    }
  }

  componentDidMount() {
    this.getData();
  }

  async getData() {
    Loading.toggle(true);
    let plan = await QuoteIussedById.get(this.props.match.params.id);
    let plansLoader = [];

    let selected = plan.plan_selected_info.Item;
    plansLoader.push(selected);
    for (let i = 0; i < plansLoader.length; i++) {
      if (typeof plansLoader[i] !== "undefined") {
        for (let j = 0; j < plansLoader[i].coverages.length; j++) {
          plansLoader[i].coverages[j].optional = false;
        }
        for (let j = 0; j < plansLoader[i].assists.length; j++) {
          plansLoader[i].assists[j].optional = false;
          for (let k = 0; k < plansLoader[i].assists[j].values.length; k++) {
            plansLoader[i].assists[j].values[k].optional = false;
            for (
              let l = 0;
              l < plansLoader[i].assists[j].values[k].assists.length;
              l++
            ) {
              plansLoader[i].assists[j].values[k].assists[l].optional = false;
            }
          }
        }
      }
    }

    let items = plan.quote_iussed_info.Item;
    /**
     * @type {import("../../../../services/QuoteIussedById").PersonAditional[]}
     */
    const persons = [];
    if (typeof items !== "undefined") {
      if (items.taker.length !== 0) {
        persons.push(items.taker);
        for (let i = 0; i < persons.length; i++)
          if (typeof persons[i].role === "undefined") persons[i].role = [1];
      }

      [
        { name: "insured", role: 2 },
        { name: "benefist", role: 3 },
        { name: "onerous", role: 4 },
        { name: "persons_aditionals", role: 5 }
      ].forEach((item) => {
        if (typeof items[item.name] !== "undefined") {
          for (let i = 0; i < items[item.name].length; i++) {
            const person = items[item.name][i];
            const hasRole = someRole(person.role);
            const check = ![roles.obsequies, roles.personalAccidents].some((r) =>
              hasRole(r)
            );
            const existsPerson =
              check &&
              persons.some(
                ({ document, document_type }) =>
                  String(person.document) === String(document) &&
                  String(person.document_type) === String(document_type)
              );
            if (!existsPerson) persons.push(person);
          }
          for (let i = 0; i < persons.length; i++)
            if (typeof persons[i].role === "undefined")
              persons[i].role = [item.role];
        }
      });

      for (let i = 0; i < persons.length; i++) {
        persons[i]["name"] = persons[i]["first_name"];
        persons[i]["secondname"] = persons[i]["second_name"];
        persons[i]["lastname"] = persons[i]["first_last_name"];
        persons[i]["secondlastname"] = persons[i]["second_last_name"];
        persons[i]["code"] = persons[i]["document_type"];
        persons[i]["value"] = persons[i]["document"];
        persons[i]["genero"] = persons[i]["gender"];
        persons[i]["fechadenacimiento"] = persons[i]["birthdate"];
        persons[i]["tipodetelefono"] = persons[i]["phone_type"];
        persons[i]["telefono"] = persons[i]["phone"];
        persons[i]["ciudad"] = persons[i]["location"];
        persons[i]["adresstype"] = persons[i]["address_type"];
        persons[i]["sarlfaltActive"] = persons[i]["sarlaft_document_url"];
      }
    }

    let data = plan.more_info.Item;
    if (typeof data !== "undefined") {
      if (typeof data.start_policy_date !== "undefined")
        data["initdate"] = data.start_policy_date;
      if (typeof data.risk_use !== "undefined")
        data["utilizado"] = data.risk_use;
      if (typeof data.goods_over_cost !== "undefined")
        data["contents"] = data.goods_over_cost;
      for (let i = 0; i < data["contents"].length; i++)
        for (let j in data.contents[i])
          if (data.contents[i][j] === '""') data.contents[i][j] = "";
    } else {
      data = [];
    }

    let inmueble = plan.risk_valoration_info.Item;
    let zones = [];
    let materials = [];
    let buildYears = [];
    let newSecurity = [];
    if (typeof inmueble !== "undefined") {
      zones = await AllPropertiesZones.get();
      materials = await AllBuildMaterial.get();
      buildYears = await AllBuildYears.get();
      inmueble.identificacion = store.getState().cotizacion.identification;
      for (let i = 0; i < zones.length; i++)
        if (parseInt(zones[i].zoneCode) === inmueble.location_zone)
          inmueble.location_zone = zones[i].answer;
      for (let i = 0; i < materials.length; i++) {
        if (
          parseInt(materials[i].buildMaterialCode) ===
          parseInt(inmueble.build_material)
        )
          inmueble.build_material = materials[i].answer;
      }
      for (let i = 0; i < buildYears.length; i++) {
        if (
          parseInt(buildYears[i].buildYearCode) ===
          parseInt(inmueble.build_year)
        )
          inmueble.build_year = buildYears[i].answer;
      }
      let seguridad = await AllSecurity.get();
      let Map = {
        "1": { name: "alarma" },
        "2": { name: "caja_fuerte" },
        "3": { name: "circuito_cerrado_tv" },
        "5": { name: "puertas_control_domotico" },
        "6": { name: "puertas_seguridad_blindada" },
        "4": { name: "regulador_de_voltaje" },
        "7": { name: "vigilancia_permanente" }
      };
      for (let i = 0; i < seguridad.length; i++) {
        if (
          typeof seguridad[i]["id"] !== "undefined" &&
          typeof Map[seguridad[i]["id"]] !== "undefined"
        ) {
          let key = Map[seguridad[i]["id"]].name;
          if (
            typeof inmueble.seguridad[key] !== "undefined" &&
            parseInt(inmueble.seguridad[key]) === 1
          ) {
            newSecurity.push(seguridad[i]["description"]);
          }
        }
      }
    }

    this.setState({
      ...this.state,
      plans: plansLoader,
      persons: persons,
      inmueble: inmueble,
      contents: data["contents"],
      newSecurity: newSecurity,
      city: persons[0].location,
      adressHome: store.getState().pdf_info.addressHome

    });
    store.dispatch(indexPlanSelected(0));
    store.dispatch(AllPlansCreator(plansLoader));
    setTimeout(() => {
      Loading.toggle(false);
    }, 1500);
  }

  showAnyPopup(name, index, type) {
    if (typeof type === "undefined") type = 1;
    let state = !this.state[name];
    this.setState({
      ...this.state,
      [name]: state,
      itemSelected: index,
      typePerson: type
    });
    if (!Helpers.hasClass("body", "popup")) {
      Helpers.addClass("body", "popup");
    } else {
      Helpers.removeClass("body", "popup");
    }
  }

  togglePopUpPersona = (index, type) => e => {
    if (index !== -1 && index !== -2 && typeof type === "undefined") {
      let roles = this.state.persons[index]["role"];
      if (roles.indexOf(5) !== -1 || roles.indexOf(6) !== -1) type = 2;
      if (roles.indexOf(4) !== -1) type = 3;
    }
    this.showAnyPopup("showPopUpPersona", index, type);
    Validaridentificacion.toggle(false);
  };

  render() {
    return (
      <form autoComplete="off" className="index-form emision">
        <div className="container">
          <div className="row">
            <div className="col col-sm-12 col-md-12 col-lg-12 title">
              <h2>Resumen de tu póliza</h2>
              <p>
                Eso es todo, valida y confirma la información del plan
                seleccionado
              </p>
            </div>
          </div>
          <Card
            persons={this.state.persons}
            showView={true}
            togglePopUpPersona={this.togglePopUpPersona}
            togglePopUpDelete={this.togglePopUpDelete}
          />
          <div className="wrapper-items">
            <div className="col subwrapper">
              <div className="row">
                <div className="col col-12 col-sm-12 col-md-5 col-lg-5 first-group">
                  {this.state.inmueble.risk_type === 2 ? (
                    <div className="icon apartamento">&nbsp;</div>
                  ) : (
                      <div className="icon home">&nbsp;</div>
                    )}
                  <div className="content-wrapper">
                    <h4>{this.state.adressHome}</h4>
                    <p>
                      {this.state.inmueble.risk_type === 2
                        ? "Apartamento "
                        : "Casa "}
                      / {this.state.city}{" "}
                    </p>
                    <span>
                      {Masknumbermoney.formatToMask(
                        this.state.inmueble.inmueble_asegudadovalor
                      )}
                    </span>
                  </div>
                </div>
                <div className="col col-12 col-sm-12 col-md-7 no-margin second-group">
                  <div className="row">
                    <div className="col col-5 col-sm-5 col-md-3 gray-box first">
                      <p>
                        <b>Contenidos</b>
                      </p>
                      <p className="big-number">
                        {this.state.inmueble.contenido_asegudado === 1
                          ? Masknumbermoney.formatToMask(
                            this.state.inmueble.contenido_asegudado_valor
                          )
                          : "Ningúno"}
                      </p>
                    </div>
                    <div className="col col-7 col-sm-7 col-md-9 no-padding">
                      <div className="row">
                        <div className="col col-12 col-sm-12 col-md-4">
                          <p>
                            <b>Número de pisos</b>
                          </p>
                          <p>{this.state.inmueble.floors_number}</p>
                        </div>
                        <div className="col col-12 col-sm-12 col-md-4">
                          <p>
                            <b>Ubicado en</b>
                          </p>
                          <p>Zona {this.state.inmueble.location_zone}</p>
                        </div>
                        <div className="col col-12 col-sm-12 col-md-4">
                          <p>
                            <b>Año</b>
                          </p>
                          <p>{this.state.inmueble.build_year}</p>
                        </div>
                        <div className="col col-12 col-sm-12 col-md-4">
                          <p>
                            <b>Ubicado en el piso</b>
                          </p>
                          <p>{this.state.inmueble.location_floor}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col col-5 col-sm-5 col-md-3 no-padding">
                      <div className="row">
                        {this.state.inmueble.inmueble_asegudado_obras === 1 && (
                          <div className="col col-12 col-12 gray-box">
                            <p>
                              <b>Objetos de valor y obras de Arte</b>
                            </p>
                            <p className="big-number">
                              {this.state.inmueble.inmueble_asegudado_obras ===
                                1
                                ? Masknumbermoney.formatToMask(
                                  this.state.inmueble
                                    .inmueble_asegudado_obrasvalor
                                )
                                : "Ningúno"}
                            </p>
                          </div>
                        )}
                        {this.state.inmueble.inmueble_asegudado_joyas === 1 && (
                          <div className="col col-12 col-12 gray-box">
                            <p>
                              <b>Joyas</b>
                            </p>
                            <p className="big-number">
                              {this.state.inmueble.inmueble_asegudado_joyas ===
                                1
                                ? Masknumbermoney.formatToMask(
                                  this.state.inmueble
                                    .inmueble_asegudado_joyasvalor
                                )
                                : "Ningúno"}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="col col-7 col-sm-7 col-md-9 no-padding">
                      <div className="row">
                        <div className="col col-12 col-sm-12 col-md-4">
                          <p>
                            <b>Conjunto cerrado</b>
                          </p>
                          <p>
                            {this.state.inmueble.cojunto_cerrado === 1
                              ? "Si"
                              : "No"}
                          </p>
                        </div>
                        <div className="col col-12 col-sm-12 col-md-4">
                          <p>
                            <b>Seguridad</b>
                          </p>
                          <p>
                            {this.state.newSecurity.map(item => item + "\n")}
                          </p>
                        </div>
                        <div className="col col-12 col-sm-12 col-md-4">
                          <p>
                            <b>Construido</b>
                          </p>
                          <p>
                            {typeof this.state.inmueble.build_material !==
                              "undefined"
                              ? this.state.inmueble.build_material
                              : ""}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {typeof this.state.plans !== "undefined" && (
                <React.Fragment>
                  <Summary plan={this.state.plans} />
                  <CoberturasSummary />
                  <AsistenciasSummary />
                </React.Fragment>
              )}
            </div>
          </div>
          <div className="row content-relation">
            <div className="col col-12">
              <h3>Contenidos relacionados</h3>
            </div>
            <div className="col col-12">
              <div className={"row row-max tabs-cotizaciones row_tab_3 3"}>
                <div className="col col-12 col-sm-12 col-md-12 col-lg-12 no-padding">
                  <div className="row" onClick={Helpers.toggleSlide(3)}>
                    <div className="col col-12 col-sm-12 col-md-6 col-lg-6 text-left">
                      <h4>
                        <span>{this.state.contents.length}</span>Items
                      </h4>
                    </div>
                    <div
                      className={
                        "col col-12 col-sm-12 col-md-6 col-lg-6 text-right " +
                        (this.state.contents.length === 0 ? "hide" : "")
                      }
                    >
                      <div className="close-section closeclose">
                        Ocultar <i>&nbsp;</i>
                      </div>
                      <div className="close-section open">
                        Ver <i>&nbsp;</i>
                      </div>
                    </div>
                  </div>
                  <div
                    className={
                      "wrapper-box " +
                      (this.state.contents.length === 0 ? "hide" : "")
                    }
                  >
                    <div className="wrapper-content">
                      {this.state.contents.map((item, key) => (
                        <div className="row" key={key}>
                          <div className="col col-sm-6 col-md-3">
                            <p>
                              <span>Tipo de contenido</span>
                            </p>
                            <p>
                              {parseInt(item.type) === 0 && "Contenidos"}
                              {parseInt(item.type) === 1 && "Objetos de valor y obras de Arte"}
                              {parseInt(item.type) === 2 && "Joyas"}
                              {parseInt(item.type) === 3 && "Celulares"}
                            </p>
                          </div>
                          <div className="col col-sm-6 col-md-3">
                            <p>
                              <span>IMEI y características</span>
                            </p>
                            <p>{item.caracte}</p>
                          </div>
                          <div className="col col-sm-6 col-md-3">
                            <p>
                              <span>Valor</span>
                            </p>
                            <p>{Masknumbermoney.formatToMask(item.value)}</p>
                          </div>
                          <div className="col col-sm-6 col-md-3">
                            {item.files &&
                              Object.keys(item.files).map((key) => {
                                /**
                                 * @type {import("../../../../models/types").Attachment | undefined}
                                 */
                                const file = item.files[key];
                                return (
                                  file && (
                                    <div
                                      key={key}
                                      className="p-1"
                                    >
                                      <button
                                        type="button"
                                        className="btn btn-download w-100 text-truncate m-0"
                                      >
                                        {file.name}
                                      </button>
                                    </div>
                                  )
                                );
                              })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <ButtonsFooter />
        </div>
        {this.state.showPopUpPersona === true && (
          <PopUpPersona
            toggle={this.togglePopUpPersona}
            persons={this.state.persons}
            item={this.state.itemSelected}
            disabledAll={true}
            typePerson={this.state.typePerson}
          />
        )}
      </form>
    );
  }
}

export default withRouter(Index);
