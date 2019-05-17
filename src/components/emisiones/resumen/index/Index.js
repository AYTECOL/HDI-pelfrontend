import React, {Component} from 'react';
//Component
import BtnContinue from '../forms/btncontinue/BtnContinue';

import './Index.scss';
import {withRouter} from "react-router-dom";
import Card from "../../identificacion/card/Card";
import store from "../../../../store";
import PopUpPersona from '../../identificacion/popups/persona/Persona';
import Validaridentificacion
    from "../../../cotizaciones/identificacion/popups/validaridentificacion/Validaridentificacion";
import Helpers from "../../../../common/helpers/helpers/Helpers";
import Coberturas from '../../../cotizaciones/cotizacion/coberturas/Coberturas';
import Asistencias from '../../../cotizaciones/cotizacion/asistencias/Asistencias';
import Loading from "../../../globals/loading/Loading";
import QuoteIussedById from "../../../../services/QuoteIussedById";
import AllPlans from "../../../../services/AllPlans";
import {AllPlans as AllPlansCreator, indexPlanSelected} from "../../../../actions";

class Index extends Component {

    constructor(props) {
        super(props);
        this.state = {
            step: parseInt(this.props.match.params.step),
            cotizacion: {},
            persons: [],
            contents: [],
            itemSelected: null,
            typePerson: 1
        };
        store.subscribe(async () => {
            let storeState = store.getState();
            let cotizacion = storeState.cotizacion;
            if (this.state.cotizacion !== cotizacion) {
                let persons = [];
                let tomador = cotizacion.identification;
                tomador['role'] = [1];
                persons.push(tomador);
                this.setState({
                    ...this.state,
                    cotizacion: cotizacion,
                    persons: persons
                });
            }
        });
        this.getData();
    }

    async getData(){
        Loading.toggle(true);
        let plan = await QuoteIussedById.get(this.props.match.params.id);
        let plans = [];

        let selected = plan.plan_selected_info.Item;
        plans.push(selected);
        for (let i = 0; i < plans.length; i++) {
            for (let j = 0; j < plans[i].coverages.length; j++) {
                plans[i].coverages[j].optional = false;
            }
            for (let j = 0; j < plans[i].assists.length; j++) {
                plans[i].assists[j].optional = false;
            }
        }
        store.dispatch(indexPlanSelected(0));
        store.dispatch(AllPlansCreator(plans));
        console.log(plans);



        let persons = plan;
        let items = persons.quote_iussed_info.Item;
        let person = [];
        person.push(items.taker);
        for (let i = 0; i < person.length; i++) if ( typeof person[i].role === "undefined" ) person[i].role = [1];

        for (let i = 0; i < items.insured.length; i++) person.push(items.insured[i]);
        for (let i = 0; i < person.length; i++) if ( typeof person[i].role === "undefined" ) person[i].role = [2];

        for (let i = 0; i < items.benefist.length; i++) person.push(items.benefist[i]);
        for (let i = 0; i < person.length; i++) if ( typeof person[i].role === "undefined" ) person[i].role = [3];

        for (let i = 0; i < items.onerous.length; i++) person.push(items.onerous[i]);
        for (let i = 0; i < person.length; i++) if ( typeof person[i].role === "undefined" ) person[i].role = [4];

        for (let i = 0; i < items.persons_aditionals.length; i++) person.push(items.persons_aditionals[i]);
        for (let i = 0; i < person.length; i++) if ( typeof person[i].role === "undefined" ) person[i].role = [5];

        for (let i = 0; i < person.length; i++) {
            person[i]['name'] = person[i]['first_name'];
            person[i]['secondname'] = person[i]['second_name'];
            person[i]['lastname'] = person[i]['first_last_name'];
            person[i]['secondlastname'] = person[i]['second_last_name'];
            person[i]['code'] = person[i]['document_type'];
            person[i]['value'] = person[i]['document'];
            person[i]['genero'] = person[i]['gender'];
            person[i]['fechadenacimiento'] = person[i]['birthdate'];
            person[i]['tipodetelefono'] = person[i]['phone_type'];
            person[i]['telefono'] = person[i]['phone'];
            person[i]['email'] = person[i]['email'];
            person[i]['ciudad'] = person[i]['location'];
            person[i]['adresstype'] = person[i]['address_type'];
            person[i]['address'] = person[i]['address'];
            person[i]['sarlfaltActive'] = person[i]['sarlaft_document_url'];
        }

        console.log(person);



        let data = plan.more_info.Item;
        data['initdate'] = data.start_policy_date;
        data['utilizado'] = data.risk_use;
        data['contents'] = data.goods_over_cost;
        for (let i = 0; i < data['contents'].length; i++) {
            for(let j in data.contents[i]){
                if ( data.contents[i][j] === '""' ) data.contents[i][j] = '';
            }
        }

        this.setState({
            ...this.state,
            plans: plans,
            persons: person,
            contents: data['contents']
        });
    }

    togglePopUpPersona = (index, type) => e => {
        if (index !== -1 && index !== -2 && typeof type === "undefined") {
            let roles = this.state.persons[index]['role'];
            if (roles.indexOf(5) !== -1 || roles.indexOf(6) !== -1) type = 2;
            if (roles.indexOf(4) !== -1) type = 3;
        }
        this.showAnyPopup("showPopUpPersona", index, type);
        Validaridentificacion.toggle(false);
        if (index === -2) {

        }
    };

    render() {
        if (this.state.step !== 3) return <div className="hide">&nbsp;</div>;
        return (
            <form autoComplete="off" className="index-form emision">
                <div className="container">
                    <div className="row">
                        <div className="col col-sm-12 col-md-12 col-lg-12 title">
                            <h2>Resumen de tu póliza</h2>
                            <p>Eso es todo, valida y confirma la información del plan seleccionado</p>
                        </div>
                    </div>

                    <Card persons={this.state.persons}
                          showView={true}
                          togglePopUpPersona={this.togglePopUpPersona}
                          togglePopUpDelete={this.togglePopUpDelete}/>

                    <div className="wrapper-items">
                        <div className="col subwrapper">
                            <div className="row">
                                <div className="col col-sm-12 col-md-5 first-group">
                                    <div className="icon apartamento">&nbsp;</div>
                                    <h4>Calle 134 # 23b 34 piso 3 torre b</h4>
                                    <p>Apartamento / Bogotá </p>
                                    <span>$ 270.000.000</span>
                                </div>
                                <div className="col col-sm-12 col-md-7 no-margin second-group">
                                    <div className="row">
                                        <div className="col col-sm-12 col-md-3 gray-box first">
                                            <p><b>Contenidos</b></p>
                                            <p className="big-number">$ 20.000.000</p>
                                        </div>
                                        <div className="col col-sm-12 col-md-9 no-padding">
                                            <div className="row">
                                                <div className="col col-sm-12 col-md-4">
                                                    <p><b>Número de pisos</b></p>
                                                    <p>16</p>
                                                </div>
                                                <div className="col col-sm-12 col-md-4">
                                                    <p><b>Ubicado en</b></p>
                                                    <p>Zona urbana</p>
                                                </div>
                                                <div className="col col-sm-12 col-md-4">
                                                    <p><b>Año</b></p>
                                                    <p>2000-2018</p>
                                                </div>
                                                <div className="col col-sm-12 col-md-4">
                                                    <p><b>Ubicado en el piso</b></p>
                                                    <p>9</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col col-sm-12 col-md-3 no-padding">
                                            <div className="row">
                                                <div className="col col-12 gray-box">
                                                    <p><b>Obras de arte</b></p>
                                                    <p className="big-number">$ 20.000.000</p>
                                                </div>
                                                <div className="col col-12 gray-box">
                                                    <p><b>Joyas</b></p>
                                                    <p className="big-number">$ 10.000.000</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col col-sm-12 col-md-9 no-padding">
                                            <div className="row">
                                                <div className="col col-sm-12 col-md-4">
                                                    <p><b>Conjunto cerrado</b></p>
                                                    <p>Si</p>
                                                </div>
                                                <div className="col col-sm-12 col-md-4">
                                                    <p><b>Seguridad</b></p>
                                                    <p>Alarma Extintor Circuito cerra…</p>
                                                </div>
                                                <div className="col col-sm-12 col-md-4">
                                                    <p><b>Construido</b></p>
                                                    <p>Ladrillo y
                                                        cemento</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <Coberturas toggleSlide={Helpers.toggleSlide}/>
                            <Asistencias toggleSlide={Helpers.toggleSlide}/>
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
                                            <h4><span>{this.state.contents.length}</span>Items</h4>
                                        </div>
                                        <div className="col col-12 col-sm-12 col-md-6 col-lg-6 text-right">
                                            <div className="close-section closeclose">Ocultar <i>&nbsp;</i></div>
                                            <div className="close-section open">Ver <i>&nbsp;</i></div>
                                        </div>
                                    </div>
                                    <div className="wrapper-box">
                                        <div className="wrapper-content">

                                            {this.state.contents.map((item, key) =>
                                                <div className="row" key={key}>
                                                    <div className="col col-sm-6 col-md-3">
                                                        <p><span>Tipo de contenido</span></p>
                                                        <p>{item.type}</p>
                                                    </div>
                                                    <div className="col col-sm-6 col-md-3">
                                                        <p><span>IMEI y características</span></p>
                                                        <p>{item.caracte}</p>
                                                    </div>
                                                    <div className="col col-sm-6 col-md-3">
                                                        <p><span>Valor</span></p>
                                                        <p>{item.value}</p>
                                                    </div>
                                                    <div className="col col-sm-6 col-md-3">
                                                        <a className="btn btn-download" href={item.urlfile}>Documento.pdf</a>
                                                    </div>
                                                </div>
                                            )}

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div
                            className="col col-12 col-sm-12 col-md-12 col-lg-12 form-action justify-content text-center">
                            <BtnContinue/>
                        </div>
                    </div>
                </div>
                {this.state.showPopUpPersona === true && <PopUpPersona
                    toggle={this.togglePopUpPersona}
                    persons={this.state.persons}
                    item={this.state.itemSelected}
                    typePerson={this.state.typePerson}/>}
            </form>
        )
    }

}

export default withRouter(Index);