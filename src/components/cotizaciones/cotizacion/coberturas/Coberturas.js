import React, {Component, Fragment} from 'react';
import {withRouter} from "react-router-dom";
import Masknumbermoney from "../../../../common/helpers/masknumbermoney/Masknumbermoney";
import store from "../../../../store";
import Helpers from "../../../../common/helpers/helpers/Helpers";
import Plans from "../plans/Plans";

class Coberturas extends Component {

    constructor(props) {
        super(props);
        this.state = {
            plans: store.getState().AllPlans,
            index: 0,
            coverturasTotal: 0,
            Inmueble: {},
        };
        for (let i = 0; i < 3; i++) {
            this.state.plans[i] = {
                coverages: [
                    {
                        name: "",
                        values: []
                    }
                ]
            }
        }
    }

    static getSelectByItems(item) {
        for (let i in item) {
            if (item[i].default === true) {
                return item[i].id;
            }
        }
        return "";
    }

    static getSelectFields(item) {
        for (let i in item) {
            if (item[i].default === true) {
                return i;
            }
        }
        return "";
    }

    static calcValue(plans, index) {
        if (typeof plans[index] === "undefined") return;
        if (typeof plans[index].coverages === "undefined") return;
        for (let i = 0; i < plans[index].coverages.length; i++) {
            let d = plans[index].coverages[i].values;
            if (typeof d !== "undefined") {
                for (let j = 0; j < d.length; j++) {
                    if (typeof d[j].values === "undefined") {
                        plans[index].coverages[i].values[j].value_show = Coberturas.getValueFields(d[j]);
                    } else {
                        for (let limit = 0; limit < d[j].values.length; limit++) {
                            if (d[j].values[limit].default === true) {
                                plans[index].coverages[i].values[j].value = d[j].values[limit].limit;
                                plans[index].coverages[i].values[j].value_show = Coberturas.getValueFields(d[j]);
                            }
                        }
                    }
                }
            }
        }
        return plans;
    }

    static getValueFields(item) {
        try {
            let inmueble = store.getState().Inmueble;
            if( typeof item.values !== "undefined"){
                for (let i = 0; i < item.values.length; i++) {
                    if( item.values[i].default === true ){
                        return Masknumbermoney.formatToMas(item.values[i].limit);
                    }
                }
            }else{
                // Inmueble
                if (item.id === 1) {
                    return Masknumbermoney.formatToMask(
                        Masknumbermoney.formatToNumber(inmueble.inmuebleasegudadovalor) * parseInt(item.value) / 100);
                    //Contenidos
                } else if (item.id === 2) {
                    return Masknumbermoney.formatToMask(
                        Masknumbermoney.formatToNumber(inmueble.contenidoasegudadovalor) * parseInt(item.value) / 100);
                    //Obras
                } else if (item.id === 3) {
                    return Masknumbermoney.formatToMask(
                        Masknumbermoney.formatToNumber(inmueble.inmuebleasegudadoobrasvalor) * parseInt(item.value) / 100);
                    //Telefonos moviles
                } else if (item.id === 4) {
                    return Masknumbermoney.formatToMask(
                        Masknumbermoney.formatToNumber(inmueble.inmuebleasegudadotelefonosvalor) * parseInt(item.value) / 100);
                    //Hurto siempre basado en hurto calificado
                } else if (item.id === 5) {
                    let dataHurto = [];
                    let hurto = Coberturas.getCoverangeById(3);
                    for (let i = 0; i < hurto.values.length; i++) dataHurto.push(Coberturas.getValueFields(hurto.values[i]));
                    return Masknumbermoney.formatToMask(
                        (Masknumbermoney.formatToNumber(dataHurto[0]) + Masknumbermoney.formatToNumber(dataHurto[1])) * parseInt(item.value) / 100);
                    //Joyas
                } else if (item.id === 6) {
                    return Masknumbermoney.formatToMask(
                        Masknumbermoney.formatToNumber(inmueble.inmuebleasegudadojoyasvalor) * parseInt(item.value) / 100);
                    //Contenido mobile
                } else if (item.id === 7) {
                    let contenido = Masknumbermoney.formatToNumber(inmueble.contenidoasegudadovalor);
                    return Masknumbermoney.formatToMask(contenido * parseInt(item.value) / 100);
                }
            }
            return 'N/A';
        } catch (e) {
            return 'N/A';
        }
    }

    componentDidMount() {
        this.unsubscribe = store.subscribe(() => {
            let storeState = store.getState();
            if (this.state.plans !== storeState.AllPlans || storeState.Inmueble !== this.state.Inmueble || this.state.index !== storeState.indexPlan) {
                let plans = Coberturas.calcValue(storeState.AllPlans, storeState.indexPlan);
                if (typeof plans !== "undefined") {
                    this.setState({
                        ...this.state,
                        plans: plans,
                        Inmueble: storeState.Inmueble,
                        index: storeState.indexPlan,
                    });
                    setTimeout(() => {
                        this.countCoverturas();
                    }, 100);
                }
            }
        });
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    sendAndValidate() {
        Plans.sendAndValidate(this.state.plans,this.state.index,this.props.match.params.id);
    }

    countCoverturas() {
        if (typeof this.state.plans[this.state.index] === "undefined") return;
        let t = 0;
        let item = this.state.plans[this.state.index].coverages;
        for (let i in item) {
            if (item[i].checked === true) {
                t++;
            }
        }
        this.setState({
            ...this.state,
            coverturasTotal: t
        });
    }

    checkCoverturas = (index, key) => e => {
        let check = this.state.plans[index].coverages[key].checked;
        let newPlans = this.state.plans;
        newPlans[index].coverages[key].checked = !check;
        this.setState({
            ...this.state,
            plans: newPlans
        });
        this.countCoverturas();
        setTimeout(() => {
            this.sendAndValidate();
        }, 500);
    };

    static getCoverangeById(id) {
        let index = store.getState().indexPlan;
        let plans = store.getState().AllPlans[index].coverages;
        for (let i = 0; i < plans.length; i++) {
            if (plans[i].id === id) {
                return plans[i];
            }
        }
    }

    getCoverangeByCode(code) {
        let plans = this.state.plans[this.state.index].coverages;
        let coverange = {};
        for (let i = 0; i < plans.length; i++) {
            if (typeof plans[i].values !== "undefined") {
                for (let j = 0; j < plans[i].values.length; j++) {
                    if (plans[i].values[j].code === code) {
                        coverange = plans[i];
                    }
                }
            }
        }
        return coverange;
    }

    inputChange = (k, key, type) => e => {
        let plan = this.state.plans;
        let item = plan[this.state.index].coverages[key];
        //Input
        if (type === 1) {
            item.values[k].value_show = Masknumbermoney.formatToMask(e.target.value);
            item.values[k].errors = [];
            if (parseInt(item.values[k].code) === 9692 || parseInt(item.values[k].code) === 3017 || parseInt(item.values[k].code) === 3008) {
                let coverange = this.getCoverangeByCode(9667);
                if( typeof coverange.values !== "undefined" ){
                    for (let i = 0; i < coverange.values.length; i++) {
                        if (coverange.values[i].id === item.values[k].id) {
                            if (Masknumbermoney.formatToNumber(coverange.values[i].value_show) < Masknumbermoney.formatToNumber(item.values[k].value_show)) {
                                let n = coverange.values[i].name.toUpperCase().replace('VALOR ', '');
                                if (parseInt(item.values[k].code) === 3008) {
                                    item.values[k].errors.push('Valor asegurado del amparo ' + item.name + ', es mayor al reportado en “' + n + '” del amparo de INCENDIO ');
                                } else {
                                    item.values[k].errors.push('Valor asegurado de ' + n + ' es mayor al reportado en INCENDIO');
                                }
                            }
                        }
                    }
                    if (parseInt(item.values[k].code) === 3008) {
                        if (500000000 < Masknumbermoney.formatToNumber(item.values[k].value_show)) {
                            item.values[k].errors.push('Valor Asegurado del amparo ' + item.name + ' es superior al permitido.');
                        }
                        if (0 >= Masknumbermoney.formatToNumber(item.values[k].value_show)) {
                            item.values[k].errors.push('Valor Asegurado del amparo ' + item.name + ' es inferior al permitido.');
                        }
                    }
                    if (item.values[k].errors.length > 0) {
                        Helpers.disabled('.next-step');
                    } else {
                        Helpers.enabled('.next-step');
                    }
                }
            }
            //Select
        } else if (type === 2) {
            for (let i = 0; i < item.values[k].values.length; i++) item.values[k].values[i].default = false;
            item.values[k].values[e.target.value].default = true;
            item.values[k].value = item.values[k].values[e.target.value].limit;
            item.values[k].value_to_quotate = item.values[k].values[e.target.value].limit;
            item.values[k].value_show = Masknumbermoney.formatToMask(item.values[k].values[e.target.value].limit);
        }
        this.setState({
            ...this.state,
            plans: plan
        });

        if( e.target.tagName === "SELECT" ){
            setTimeout(()=>{
                this.sendAndValidate();
            },100);
        }
    };

    blur = () => {
        this.sendAndValidate();
    };

    showItem(opt){
        let inmueble = this.state.Inmueble;
        // Inmueble
        if (opt.id === 1) {
            return inmueble.inmuebleasegudado === 1;
            //Contenidos
        } else if (opt.id === 2) {
            return inmueble.contenidoasegudado === 1;
            //Obras
        } else if (opt.id === 3) {
            return inmueble.inmuebleasegudadoobras === 1;
            //Telefonos moviles
        } else if (opt.id === 4) {
            return inmueble.inmuebleasegudadotelefonos === 1;
            //Hurto siempre basado en hurto calificado
        } else if (opt.id === 5) {
            return inmueble.contenidoasegudado === 1;
            //Joyas
        } else if (opt.id === 6) {
            return inmueble.inmuebleasegudadojoyas === 1;
            //Contenido mobile
        } else if (opt.id >= 7 || opt.id === 0) {
            return true;
        }
    }

    static isDisabled(option, opt){
        return (option.optional === false || option.checked === false || (typeof opt.disable !== "undefined" && opt.disable === true));
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
                            <div className="close-section closeclose">Ocultar <i>&nbsp;</i></div>
                            <div className="close-section open">Ver <i>&nbsp;</i></div>
                        </div>
                    </div>

                    <div className="wrapper-box">
                        {typeof this.state.plans[this.state.index].coverages !== "undefined" && this.state.plans[this.state.index].coverages.map((option, key) =>
                            <div className={"rowor " + (option.optional === true ? '' : 'disabled-item')}
                                 key={key}>
                                <div className="row">
                                    <div
                                        className="col first items-checkboxes">
                                        <div className="form-group">
                                            <input type="checkbox"
                                                   checked={(option.checked === true ? 'checked' : false)}
                                                   disabled={(option.optional === false)}
                                                   name={"itemcheck" + key} id={"itemcheck" + key}
                                                   onChange={this.checkCoverturas(this.state.index, key)}
                                            />
                                            <label htmlFor={"itemcheck" + key}>{option.name}</label>
                                        </div>
                                    </div>
                                    <div
                                        className={"col col-12 col-sm-12 col-md-3 col-lg-3 middle " + (option.checked === false ? ' disabled-item' : '')}>
                                        {typeof option.values !== "undefined" &&
                                        <Fragment>
                                            {option.values.map((opt, k) => this.showItem(opt) &&
                                                <div
                                                    className={"form-group " + (typeof opt.values === 'undefined' ? '' : 'input-select') + (typeof opt.errors !== "undefined" && opt.errors.length > 0 ? ' error' : '')}
                                                    key={k}>
                                                    <label htmlFor={"item" + k + "_" + key}>{opt.name}</label>
                                                    {typeof opt.values === 'undefined' ? (
                                                        <input name={"item" + k + "_" + key}
                                                               id={"item" + k + "_" + key}
                                                               placeholder={opt.value_show}
                                                               onBlur={Coberturas.isDisabled(option,opt)?null:this.blur}
                                                               value={typeof opt.value_show === "undefined" ? '$0' : opt.value_show}
                                                               onChange={this.inputChange(k, key, 1)}
                                                               disabled={Coberturas.isDisabled(option,opt)}
                                                               type="text" className={"form-control"}/>
                                                    ) : (
                                                        <select className={"form-control"} name={"item" + k + "_" + key}
                                                                id={"item" + k + "_" + key}
                                                                disabled={(option.optional === false || option.checked === false)}
                                                                value={Coberturas.getSelectFields(opt.values)}
                                                                onChange={this.inputChange(k, key, 2)}>
                                                            {opt.values.map((opt, k) =>
                                                                <option key={k}
                                                                        value={k}>{Masknumbermoney.formatToMask(opt.limit)}</option>
                                                            )}
                                                        </select>
                                                    )}
                                                    {typeof opt.errors !== "undefined" && opt.errors.map((item, key) =>
                                                        <small key={key}
                                                               className={"form-text only-errors"}>{item}</small>
                                                    )}
                                                </div>
                                            )}
                                        </Fragment>
                                        }
                                    </div>
                                    <div className="col last">
                                        {typeof option.deductible !== 'undefined' ? (
                                            <div
                                                className={"pisonumero input-select form-group " + ((this.state.error) ? 'error' : '')}>
                                                <label htmlFor={"itemdeducible" + key}>Deducible</label>
                                                <select name={"itemdeducible" + key} id={"itemdeducible" + key}
                                                        className="form-control"
                                                        disabled={(option.optional === false || option.checked === false)}
                                                        defaultValue={Coberturas.getSelectByItems(option.deductible)}>
                                                    {option.deductible.map((opt, k) =>
                                                        <option key={k} value={opt.id}>{opt.name}</option>
                                                    )}
                                                </select>
                                            </div>
                                        ) : (<div className={"form-group"}>&nbsp;</div>)}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        )
    }

}

export default withRouter(Coberturas);
