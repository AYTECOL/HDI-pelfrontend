import React, {Component} from 'react';
import './Cards.scss';
import {withRouter} from "react-router-dom";
import store from "../../../../store";
import AllInsurableLimits from "../../../../services/AllInsurableLimits";
import Segurarinmueble from "../../inmueble/forms/segurarinmueble/Segurarinmueble";
import Asegurarcontenidos from "../../inmueble/forms/asegurarcontenidos/Asegurarcontenidos";
import Asegurarobras from "../../inmueble/forms/asegurarobras/Asegurarobras";
import Asegurarjoyas from "../../inmueble/forms/asegurarjoyas/Asegurarjoyas";
import Asegurartelefonos from "../../inmueble/forms/asegurartelefonos/Asegurartelefonos";
import Masknumbermoney from "../../../../common/helpers/masknumbermoney/Masknumbermoney";
import {saveInmuebleValue} from "../../../../actions";
import InspectionPolicy from "../../../../services/InspectionPolicy";
import AllBuildYears from "../../../../services/AllBuildYears";

class Cards extends Component {

    _isMounted = false;

    constructor(props) {
        super(props);
        this.state = {
            items: [
                {
                    parent: Segurarinmueble,
                    type: 1,
                },
                {
                    parent: Asegurarcontenidos,
                    type: 2,
                },
                {
                    parent: Asegurarobras,
                    type: 3,
                },
                {
                    parent: Asegurarjoyas,
                    type: 4,
                },
                {
                    parent: Asegurartelefonos,
                    type: 5,
                }
            ],
            anoconstruidos: [],
            Inmueble: store.getState().Inmueble,
            InmuebleOk: false,
            showInspect: false,
            inspection_detail: '',
            inspection: ''
        };
        for (let i = 0; i < 5; i++) {
            this.state.items[i].value = "";
            this.state.items[i].active = true;
            this.state.items[i].errorValue = 0;
            this.state.items[i].inactiveToggle = false;
            this.state.items[i].inactiveAdd = false;
        }
        this.state.items[0].active = false;
        store.subscribe(() => {
            let storeState = store.getState();
            let inmueble = storeState.Inmueble;
            if (inmueble !== this.state.Inmueble && this.state.InmuebleOk === false) {
                let items = this.state.items;
                for (let i = 0; i < 5; i++) {
                    if (items[i].type === 1) {
                        items[i].value = inmueble.inmuebleasegudadovalor;
                        items[i].active = inmueble.inmuebleasegudado === 0;
                    } else if (items[i].type === 2) {
                        items[i].value = inmueble.contenidoasegudadovalor;
                        items[i].active = inmueble.contenidoasegudado === 0;
                    } else if (items[i].type === 3) {
                        items[i].value = inmueble.inmuebleasegudadoobrasvalor;
                        items[i].active = inmueble.inmuebleasegudadoobras === 0;
                    } else if (items[i].type === 4) {
                        items[i].value = inmueble.inmuebleasegudadojoyasvalor;
                        items[i].active = inmueble.inmuebleasegudadojoyas === 0;
                    } else if (items[i].type === 5) {
                        items[i].value = inmueble.inmuebleasegudadotelefonosvalor;
                        items[i].active = inmueble.inmuebleasegudadotelefonos === 0;
                    }
                }
                for (let i = 0; i < 5; i++) if (this.state.items[i].value === '""') this.state.items[i].value = "";
                this.setState({
                    ...this.state,
                    items: items,
                    Inmueble: inmueble,
                    InmuebleOk: true
                });
                setTimeout(() => {
                    this.getInspectionPolicy();
                },500);
            }
        });

        this.getAllInsurableLimits();
        this.validateToggle();
        this.getAllBuildYears();
    }

    async getAllBuildYears(){
        this.setState({
            ...this.state,
            anoconstruidos: await AllBuildYears.get()
        });
    }
    async getInspectionPolicy(){
        new InspectionPolicy();

        /*let Inmueble = store.getState().Inmueble;
        let anoconstruidos = this.state.anoconstruidos;
        let code = '-';
        let insured_values = '-';
        let zone = '-';
        let insured_type = '-';
        let year_construction = '-';
        let in_closed_set = '-';
        let insured_total = '-';
        if ( Inmueble.inmuebleasegudado === 1 && Inmueble.contenidoasegudado === 0 ){
            code = 1;
            insured_values = 'inmueble';
            insured_type = Inmueble.type_risk===1?'casa':'apartamento';
            for (let i = 0; i < anoconstruidos.length; i++) {
                if( anoconstruidos[i].buildYearCode.toString() === Inmueble.anoconstruido ){
                    year_construction = anoconstruidos[i].answer;
                }
            }
            in_closed_set = Inmueble.cojuntocerrado===1?'true':'false';
            insured_total = Masknumbermoney.formatToNumber(Inmueble.inmuebleasegudadovalor);
            zone = Inmueble.zona===1?'urbano':'rural';
        }
        if ( Inmueble.inmuebleasegudado === 0 && Inmueble.contenidoasegudado === 1 ){
            code = 2;
            insured_values = 'contenidos';
            insured_total = Masknumbermoney.formatToNumber(Inmueble.contenidoasegudadovalor);
            zone = Inmueble.zona===1?'urbano':'rural';
            insured_type = Inmueble.type_risk===1?'casa':'apartamento';
            in_closed_set = Inmueble.cojuntocerrado===1?'true':'false';
        }
        if ( Inmueble.inmuebleasegudado === 0 && Inmueble.contenidoasegudado === 1 && (Inmueble.inmuebleasegudadojoyas === 1 || Inmueble.inmuebleasegudadoobras === 1) ){
            code = 3;
            insured_values = 'contenidos especiales';
            if (Inmueble.inmuebleasegudadojoyas === 1 && Inmueble.inmuebleasegudadoobras === 0) {
                insured_type = 'joyas';
                insured_total = Masknumbermoney.formatToNumber(Inmueble.inmuebleasegudadojoyasvalor);
            }
            if (Inmueble.inmuebleasegudadoobras === 1 && Inmueble.inmuebleasegudadojoyas === 0) {
                insured_type = 'obras de arte';
                insured_total = Masknumbermoney.formatToNumber(Inmueble.inmuebleasegudadoobrasvalor);
            }
        }
        try {
            let data = await InspectionPolicy.get(code,insured_values,zone,insured_type,year_construction,in_closed_set,insured_total);
            if( typeof data.inspection_policy !== "undefined" ){
                this.setState({
                    ...this.state,
                    inspection_detail: data.inspection_policy.inspection_detail,
                    inspection: data.inspection_policy.inspection,
                    showInspect: true
                });
            }else{
                this.setState({
                    ...this.state,
                    showInspect: false
                });
            }
        }catch (e) {
            this.setState({
                ...this.state,
                showInspect: false
            });
        }*/
    }

    componentDidMount() {
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    async getAllInsurableLimits() {
        await AllInsurableLimits.get();
    }

    validateToggle() {
        let newItems = this.state.items;
        newItems[0].inactiveToggle = newItems[1].active === true &&
            newItems[2].active === true &&
            newItems[3].active === true &&
            newItems[4].active === true;
        newItems[1].inactiveToggle = newItems[0].active === true;
        for (let i = 2; i < 5; i++) newItems[i].inactiveAdd = newItems[1].active || newItems[1].value === "";
        if (this._isMounted) {
            this.setState({
                ...this.state,
                items: newItems
            });
            setTimeout(() => {
                this.getInspectionPolicy();
            },300);
        }
    }

    updateStoreItem(index) {
        // Actualiza el valor de prendido o apagado en el store
        let newItems = this.state.items;
        store.dispatch(saveInmuebleValue({
            value: newItems[index].active === true ? 0 : 1,
            name: newItems[index].parent.nameModel
        }));
        store.dispatch(saveInmuebleValue({
            value: '',
            name: newItems[index].parent.nameModelValue
        }));
        newItems[index].value = "";
        this.setState({
            ...this.state,
            items: newItems
        });
    }

    toggleItem = index => e => {
        let active = this.state.items[index].active;
        let newItems = this.state.items;
        let saved = false;
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

        this.setState({
            ...this.state,
            items: newItems
        });
        this.validateToggle();
    };

    validateValue = index => e => {
        let target = e.target;
        e.target.value = Masknumbermoney.formatToMask(target.value);
        let parent = this.state.items[index].parent;
        let component = new parent();
        component.validateValue(e);
        let error = parent.validateField(target.value);
        let newItems = this.state.items;
        newItems[index].value = target.value;
        newItems[index].errorValue = error;
        this.setState({
            ...this.state,
            items: newItems
        });
        this.validateToggle();
    };

    render() {
        return (
            <React.Fragment>
                <div className="row row-boxes">
                    {this.state.items.map((option, key) =>
                        <div className="col" key={key}>
                            <div className={"box-col " + (this.state.items[key].active === true ? 'active' : '')}>
                                <div className={"image image-" + (key + 1)}>&nbsp;</div>
                                <p>{option.parent.name()}</p>
                                <div className="wrapper-over">
                                    <div className={(option.inactiveAdd === true ? 'invisible' : '') + " btntoggle"}
                                         onClick={this.toggleItem(key)}>+
                                    </div>
                                    <div className={"form-group " + (option.errorValue !== 0 ? 'error' : '')}>
                                        <label htmlFor="incendios">Valor</label>
                                        <input type="text" className={"form-control"} name="incendios" id="incendios"
                                               value={option.value}
                                               onBlur={this.validateValue(key)}
                                               onChange={this.validateValue(key)}
                                        />
                                        <small
                                            className={"form-text"}>Mínimo. {Masknumbermoney.formatToMask(option.parent.min())} -
                                            Máximo. {Masknumbermoney.formatToMask(option.parent.max())}</small>
                                        <small
                                            className={"form-text only-errors " + (option.errorValue === 1 ? 'show' : 'hide')}>Por
                                            Ingrese el valor asegurado de Teléfonos Móviles.
                                        </small>
                                        <small
                                            className={"form-text only-errors " + (option.errorValue === 2 ? 'show' : 'hide')}>Valor
                                            Asegurado de {option.parent.name()} es inferior al permitido.
                                        </small>
                                        <small
                                            className={"form-text only-errors " + (option.errorValue === 3 ? 'show' : 'hide')}>Valor
                                            Asegurado de {option.parent.name()} es superior al permitido.
                                        </small>
                                    </div>
                                    <span className={(option.inactiveToggle === true ? 'invisible' : '')}
                                          onClick={this.toggleItem(key)}>No lo quiero</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="row">
                    <div className="col col-sm-12 col-md-12 col-lg-12 title">
                        <p>Listo, te sugerimos un paquete recomendado, sin embargo puedes personalizarlo de acuerdo
                            a la necesidad, quita o agrega lo que consideras podría ser de utilidad en el futuro</p>
                    </div>
                </div>

                <div className={"row justify-content-center "+(this.state.showInspect===false?'hide':'')}>
                    <div className="col col-sm-12 col-md-10 col-lg-10">
                        <div className="tool-tip info tool-tip-new">
                            <p>Póliza sujeta a <span>{this.state.inspection_detail}</span></p>
                            <div className="more-info">
                                <p>Más información</p>
                                <div className="span">
                                    <span>?</span>
                                    {this.state.inspection==="I.C"?(
                                        <div className="text">La vivienda requiere que la revisemos más al detalle, ten presente los siguientes datos para poder agendar una futura inspección en sitio: Nombre de contacto, Teléfono de contacto.</div>
                                    ):(
                                        <div className="text">La vivienda requiere que la revisemos más al detalle, envíanos por favor un breve registro fotográfico de acuerdo a la siguiente guía: Una foto de la Fachada (Debe ser visible la estructura y todos los pisos del Edificio), Una foto de la Habitación principal y de Sala-Comedor, Una foto de los Baños y de la Cocina</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }

}

export default withRouter(Cards);