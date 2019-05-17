import React, {Component} from 'react';
//Component
import BtnContinue from '../forms/btncontinue/BtnContinue';

import './Index.scss';
import {withRouter} from "react-router-dom";
import 'moment/locale/es';
import MomentJs from "moment";
import DatePicker  from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';

import PopUpPersona from '../../identificacion/popups/persona/Persona';
import Loading from "../../../globals/loading/Loading";
import QuoteIussedById from "../../../../services/QuoteIussedById";
import SarlaftFile from "../../../../services/SarlaftFile";

class Index extends Component {

    constructor(props) {
        super(props);
        this.state = {
            step: parseInt(this.props.match.params.step),
            totalContent: 0,
            initdate: '',
            persons: [],
            contents: [],
            area: '',
            addNewPerson: true,
            itemSelected: null,
            showPopUpPersona: false
        };
        this.updatePerson = this.updatePerson.bind(this);
    }

    componentDidMount() {
        this.getData();
    }

    async getData(){
        Loading.toggle(true);
        let data = await QuoteIussedById.get(this.props.match.params.id);
        if (typeof data.more_info.Item !== "undefined"){
            let items = data.quote_iussed_info.Item;
            let person = [];
            person.push(items.taker);
            for (let i = 0; i < items.insured.length; i++) person.push(items.insured[i]);
            for (let i = 0; i < items.benefist.length; i++) person.push(items.benefist[i]);

            data = data.more_info.Item;
            if( typeof data !== "undefined") {
                if(typeof data.start_policy_date !== "undefined" ) data['initdate'] = data.start_policy_date;
                if(typeof data.risk_use !== "undefined" ) data['utilizado'] = data.risk_use;
                if(typeof data.goods_over_cost !== "undefined" ) data['contents'] = data.goods_over_cost;
                for (let i = 0; i < data['contents'].length; i++) {
                    for(let j in data.contents[i]){
                        if ( data.contents[i][j] === '""' ) data.contents[i][j] = '';
                    }
                }
            }
            this.setState({
                ...this.state,
                ...data,
                persons: person
            });
        }
    }

    selectItems = (name, value) => () => {
        this.setState({
            ...this.state,
            [name]: value
        });
    };

    removeContent = () => {
        let total = this.state.totalContent - 1;
        if (total < 0) total = 0;
        let contents = this.state.contents;
        contents.pop();
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
            type: '',
            caracte: '',
            value: '',
            urlfile: ''
        });
        this.setState({
            ...this.state,
            totalContent: total,
            contents: contents
        });
    };

    changeValue = e => {
        if (typeof e.target === "undefined"){
            e = {
                target: {
                    name: 'initdate',
                    // value: MomentJs(e).format("YYYY-MM-DD")
                    value: MomentJs(e).format("dddd, MMMM Do YYYY")
                }
            }
        }
        let v = e.target.value;
        let n = e.target.name;
        this.setState({
            ...this.state,
            [n]: v
        });
    };

    updatePerson(person){
        let persons = this.state.persons;
        persons.push(person);
        this.setState({
            ...this.state,
            persons: persons,
            showPopUpPersona: false,
            addNewPerson: false
        });
    }

    togglePerson = (index,type) => () => {
        let showPopUpPersona = !this.state.showPopUpPersona;
        this.setState({
            ...this.state,
            showPopUpPersona: showPopUpPersona
        })
    };

    updateContent = key => e => {
        let contents = this.state.contents;
        contents[key][e.target.name] = e.target.value;
        this.setState({
            ...this.state,
            contents: contents
        })
    };

    changeTextFile = async e => {
      await SarlaftFile.upload(e.target.files[0]);
    };

    render() {
        return (
            <React.Fragment>
                <form autoComplete="off" className="index-form emision informacion-adicioonal">
                    <div className="container">
                        <div className="row">
                            <div className="col col-sm-12 col-md-12 col-lg-12 title">
                                <h2>Cuéntanos más</h2>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col col-12 col-sm-12 col-md-12 col-lg-12">
                                <div className="form-group"><label
                                    htmlFor="pisonumero">¿Cuándo deseas que comience la póliza?</label>
                                    <DatePicker showMonthDropdown
                                                minDate={new Date()}
                                                name="initdate"
                                                value={this.state.initdate}
                                                onChange={this.changeValue}
                                                className={"form-control pickerDate"}
                                                placeholderText={"Selecciona la fecha de inicio de vigencia"} />
                                </div>
                            </div>
                            <div className="col col-12 col-sm-12 col-md-12 col-lg-12">
                                <div className="form-group "><label
                                    htmlFor="area">Metros construidos de vivienda (Opcional)</label>
                                    <input type="text" className="form-control" name="area" value={this.state.area} onChange={this.changeValue}
                                           placeholder={"Ingresa el tamañó de la vivienda"}/>
                                </div>
                            </div>
                            <div className="col col-12 col-sm-12 col-md-12 col-lg-12">
                                <div className={"no-icon gridgrid form-group"}>
                                    <label>El inmueble es utilizado como (opcional)</label>

                                    <div className="row grid-select">

                                        <div className="col col-6 col-sm-12 col-md-4 col-lg-4">
                                            <div className={"select-item row "+(this.state.utilizado===0?'active':'')} onClick={this.selectItems('utilizado', 0)}>
                                                <div className="col col-12 no-padding">
                                                    <i className="home-icon">&nbsp;</i>
                                                </div>
                                                <div className="col col-12 no-padding">
                                                    <p>Vivienda permanente</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col col-6 col-sm-12 col-md-4 col-lg-4">
                                            <div className={"select-item row "+(this.state.utilizado===1?'active':'')} onClick={this.selectItems('utilizado', 1)}>
                                                <div className="col col-12 no-padding">
                                                    <i className="summer">&nbsp;</i>
                                                </div>
                                                <div className="col col-12 no-padding">
                                                    <p>Vivienda vacacional u ocasional</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col col-6 col-sm-12 col-md-4 col-lg-4">
                                            <div className={"select-item row "+(this.state.utilizado===2?'active':'')} onClick={this.selectItems('utilizado', 2)}>
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

                        <div className="row row-full justify-content-center box-blue-full">
                            <div className="col col-sm-12 col-md-8 col-lg-8 text-center">
                                <h4>Relaciona los bienes individuales que superen los siguientes valores</h4>
                            </div>
                            <div className="col col-sm-12 col-md-6 col-lg-6">
                                <div className="row">
                                    <div className="col col-sm-12 col-md-6 col-lg-6">
                                        <p><b>Contenidos</b>: $ 12.000.000</p>
                                        <p><b>Joyas</b>: $ 3.000.000</p>
                                        <p><b>Teléfonos Móviles:</b> Requiere relación detallada para todos</p>
                                    </div>
                                    <div className="col col-sm-12 col-md-6 col-lg-6">
                                        <p><b>Obras de Arte:</b> $ 3.000.000</p>
                                        <p><b>Contenidos Móviles:</b> $ 3.000.000</p>
                                    </div>

                                </div>
                            </div>

                            <div className="wrapper-more-items">
                                <div className={"more-items "+(this.state.contents.length!==0?'show':'hide')}>
                                    {this.state.contents.map((item,key)=>
                                        <div className="moreitems" key={key}>
                                            <div className="row">
                                                <div className="col no-padding-right">
                                                    <div className="name form-group input-select"><label
                                                        htmlFor="name">Tipo de item</label>
                                                        <select className="form-control" name="type" id="type" value={item.type} onChange={this.updateContent(key)}>
                                                            <option value="0"></option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="col no-padding-right">
                                                    <div className="name form-group "><label
                                                        htmlFor="name">Características</label>
                                                        <input type="text" className="form-control" name="caracte" value={item.caracte} onChange={this.updateContent(key)}/>
                                                    </div>
                                                </div>
                                                <div className="col no-padding-right">
                                                    <div className="name form-group "><label
                                                        htmlFor="name">Valor</label>
                                                        <input type="text" className="form-control" name="value" value={item.value} onChange={this.updateContent(key)}/>
                                                    </div>
                                                </div>
                                                <div className="col no-padding-right">
                                                    <div className="row sarlaft no-gutters">
                                                        <div className="col col-12 col-sm-12 col-md-12 col-lg-12">
                                                            <div className="sarlaft form-group">
                                                                <input type="file" className="form-control" name="sarlaft" value={item.urlfile}
                                                                       onChange={this.changeTextFile}/>
                                                                {this.state.showDefaultTextFile ? (
                                                                    <p>Arrastre archivos para adjuntar, o <b>buscar</b></p>
                                                                ) : (
                                                                    <p>{this.state.textFile}</p>
                                                                )}
                                                                <span>Formatos permitidos PDF, PNG, GIF, JPG</span>
                                                                <br/>
                                                                <span className={"error-file "+(this.state.errorFile===true?'show':'hide')}>Formato no permitido</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col col-1 text-center">
                                                    <span className="trash" onClick={this.removeContent}>&nbsp;</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="col col-sm-12 col-md-12 col-lg-12">
                                <div className="row">
                                    <div className="col col-sm-12 col-md-12 col-lg-12 text-center">
                                        <div className={"more-items "+(this.state.contents.length!==0?'active':'')} onClick={this.addContent}>
                                            <button type="button" className="more-btn">+</button>
                                            <p>Agregar contenido</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col col-sm-12 col-md-12 col-lg-12 msj-bottom text-center">
                                <p>Es importante conocer este tipo de artículos, esto nos permite al momento del siniestro
                                    responder de forma efectiva</p>
                            </div>
                        </div>

                        <div className="row row-full text-right">
                            <div className="col col-sm-12 col-md-12 col-lg-12">
                                <div className="more-info">
                                    <p>Más información <span>?</span></p>
                                </div>
                            </div>
                        </div>

                        <div className="row text-center sujeta-block justify-content-center">
                            <div className="col col-sm-12 col-md-12 col-lg-12">
                                <h5>La póliza está sujeta a inspección en sitio</h5>
                                <p>Selecciona la persona con la cuál nos vamos a contactar para realizar la inspección en el
                                    inmueble</p>
                            </div>
                            <div className="col col-sm-12 col-md-8 col-lg-8">
                                <div className={"no-icon gridgrid form-group"}>

                                    <div className="row grid-select justify-content-center  ">

                                        {this.state.persons.map((item, key)=>
                                            <div className="col col-6 col-sm-12 col-md-4 col-lg-4" key={key}>
                                                <div className={"select-item row "+(this.state.contactperson===key?'active':'')} onClick={this.selectItems('contactperson', key)}>
                                                    <div className="col col-12 no-padding">
                                                        <i className="userperson">&nbsp;</i>
                                                    </div>
                                                    <div className="col col-12 no-padding">
                                                        <p>{typeof item.first_name !== "undefined"?item.first_name:item.name}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                    </div>
                                </div>
                            </div>

                            {this.state.addNewPerson === true &&
                            <div className="col col-sm-12 col-md-12 col-lg-12 text-center">
                                <div className="more-items" onClick={this.togglePerson(-1,-1)}>
                                    <button type="button" className="more-btn">+</button>
                                    <p>Agregar persona</p>
                                </div>
                            </div>
                            }

                        </div>

                        <div className="row">
                            <div
                                className="col col-12 col-sm-12 col-md-12 col-lg-12 form-action justify-content text-center">
                                <BtnContinue state={this.state}/>
                            </div>
                        </div>
                    </div>
                </form>
                {this.state.showPopUpPersona === true && <PopUpPersona
                    toggle={this.togglePerson}
                    persons={this.state.persons}
                    item={this.state.itemSelected}
                    typePerson={4}
                    contactPerson={true}
                    updatePerson={this.updatePerson}/>}
            </React.Fragment>
        )
    }

}

export default withRouter(Index);