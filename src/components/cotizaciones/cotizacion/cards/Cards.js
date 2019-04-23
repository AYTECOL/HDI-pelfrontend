import React from 'react';
import './Cards.scss';
import {withRouter} from "react-router-dom";
import store from "../../../../store";
import AllInsurableLimits from "../../../../services/AllInsurableLimits";
import Segurarinmueble from "../../../globals/forms/inmueble/segurarinmueble/Segurarinmueble";
import Asegurarcontenidos from "../../../globals/forms/inmueble/asegurarcontenidos/Asegurarcontenidos";
import Asegurarobras from "../../../globals/forms/inmueble/asegurarobras/Asegurarobras";
import Asegurarjoyas from "../../../globals/forms/inmueble/asegurarjoyas/Asegurarjoyas";
import Asegurartelefonos from "../../../globals/forms/inmueble/asegurartelefonos/Asegurartelefonos";
import Masknumbermoney from "../../../../common/helpers/masknumbermoney/Masknumbermoney";
import {toggleLoading} from "../../../../actionCreators";

class Cards extends React.Component {

    _isMounted = false;

    componentDidMount() {
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

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
            Inmueble: store.getState().Inmueble,
            InmuebleOk: false
        };
        for (let i = 0; i < 5; i++) {
            this.state.items[i].value = "";
            this.state.items[i].active = true;
            this.state.items[i].errorValue = 0;
            this.state.items[i].inactiveToggle = false;
        }
        this.state.items[0].active = false;

        store.subscribe(async () => {
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
                for (let i = 0; i < 5; i++) {
                    if (this.state.items[i].value === '""') this.state.items[i].value = "";
                }
                this.setState({
                    ...this.state,
                    items: items,
                    Inmueble: inmueble,
                    InmuebleOk: true
                });
            }
        });

        this.getAllInsurableLimits();
        this.validateToggle();
    }

    async getAllInsurableLimits() {
        await AllInsurableLimits.get();
    }

    validateToggle() {
        let newItems = this.state.items;
        if (
            newItems[1].active === true &&
            newItems[2].active === true &&
            newItems[3].active === true &&
            newItems[4].active === true
        ) {
            newItems[0].inactiveToggle = true;
        } else {
            newItems[0].inactiveToggle = false;
        }
        if (
            newItems[0].active === true
        ) {
            newItems[1].inactiveToggle = true;
        } else {
            newItems[1].inactiveToggle = false;
        }
        if (this._isMounted) {
            this.setState({
                ...this.state,
                items: newItems
            });
        }
    }

    updateStoreItem(index){
        // Actualiza el valor de prendido o apagado en el store
        let newItems = this.state.items;
        let newObj = new newItems[index].parent();
        newObj.validateEmpty({
            value: newItems[index].active === true?0:1,
            name: newItems[index].parent.nameModel
        });
    }

    toggleItem(index) {
        let active = this.state.items[index].active;
        let newItems = this.state.items;
        newItems[index].active = !active;

        this.updateStoreItem(index);

        // Pone el cargando para cotizacion
        if( newItems[index].type === 1 || newItems[index].type === 2 ){
            store.dispatch(toggleLoading(true));
        }

        // Deshabilita los demas items
        if( newItems[index].type === 2 && newItems[index].active === true ){
            for(let i = 1; i < 5; i++) newItems[i].active = newItems[index].active;
        }

        // Habilita contenido si los demas items lo tienn
        if(
            newItems[index].type === 3 && newItems[index].active === false ||
            newItems[index].type === 4 && newItems[index].active === false ||
            newItems[index].type === 5 && newItems[index].active === false
        ){
            store.dispatch(toggleLoading(true));
            newItems[1].active = newItems[index].active;
            this.updateStoreItem(1);
        }

        this.setState({
            ...this.state,
            items: newItems
        });
        this.validateToggle();
    }

    validateValue(e, index) {
        e.value = Masknumbermoney.formatToMask(e.value);
        let parent = this.state.items[index].parent;
        let component = new parent();
        component.validateValue(e);
        let error = parent.validateField(e.value);

        let newItems = this.state.items;
        newItems[index].value = e.value;
        newItems[index].errorValue = error;
        this.setState({
            ...this.state,
            items: newItems
        });
    }

    render() {
        return (
            <div className="row row-boxes">
                {this.state.items.map((option, key) =>
                    <div className="col" key={key}>
                        <div className={"box-col " + (this.state.items[key].active === true ? 'active' : '')}>
                            <div className={"image image-" + (key + 1)}></div>
                            <p>{option.parent.name()}</p>
                            <div className="wrapper-over">
                                <div className="btntoggle" onClick={(e) => {
                                    this.toggleItem(key)
                                }}>+
                                </div>
                                <div className={"form-group " + (option.errorValue !== 0 ? 'error' : '')}>
                                    <label htmlFor="incendios">Valor</label>
                                    <input type="text" className={"form-control"} name="incendios" id="incendios"
                                           value={option.value}
                                           onBlur={(e) => {
                                               this.validateValue(e.target, key);
                                           }}
                                           onChange={(e) => {
                                               this.validateValue(e.target, key);
                                           }}
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
                                <span className={(option.inactiveToggle === true ? 'invisible' : '')} onClick={(e) => {
                                    this.toggleItem(key)
                                }}>No lo quiero</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        )
    }

}

export default withRouter(Cards);