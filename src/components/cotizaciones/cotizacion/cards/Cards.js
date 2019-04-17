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

class Cards extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            items: [
                {
                    parent: Segurarinmueble,
                },
                {
                    parent: Asegurarcontenidos,
                },
                {
                    parent: Asegurarobras,
                },
                {
                    parent: Asegurarjoyas,
                },
                {
                    parent: Asegurartelefonos,
                }
            ]
        };
        for(let i = 0; i < 5; i++){
            this.state.items[i].active = true;
            this.state.items[i].errorValue = 0;
            this.state.items[i].inactiveToggle = false;
        }
        this.state.items[0].active = false;

        store.subscribe(async () => {
        });

        this.getAllInsurableLimits();
        this.validateToggle();
    }

    async getAllInsurableLimits() {
        await AllInsurableLimits.get();
    }

    validateToggle(){
        let newItems = this.state.items;
        if(
            newItems[1].active === true &&
            newItems[2].active === true &&
            newItems[3].active === true &&
            newItems[4].active === true
        ){
            newItems[0].inactiveToggle = true;
        }else{
            newItems[0].inactiveToggle = false;
        }
        this.setState({
            ...this.state,
            items: newItems
        });
    }

    toggleItem(index) {
        let active = this.state.items[index].active;
        let newItems = this.state.items;
        newItems[index].active = !active;
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
                            <div className={"image image-" + (key + 1)}> </div>
                            <p>{option.parent.name()}</p>
                            <div className="wrapper-over">
                                <div className="btntoggle" onClick={(e) => {
                                    this.toggleItem(key)
                                }}>+
                                </div>
                                <div className={"form-group "+(option.errorValue !== 0 ? 'error' : '')}>
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
                                <span className={(option.inactiveToggle === true?'invisible':'')} onClick={(e) => {
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