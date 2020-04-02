import React, {Component, Fragment} from 'react';

import store from '../../../../../store';
import {withRouter} from "react-router-dom";

import CreateOrUpdateValoration from "../../../../../services/CreateOrUpdateValoration";
import SaveIdentifications from "../../../../../services/Quote";
import {NextStep} from "../../../../../actions";
import Helpers from "../../../../../common/helpers/helpers/Helpers";
// Components
import Segurarinmueble from '../segurarinmueble/Segurarinmueble';
import Asegurarcontenidos from "../asegurarcontenidos/Asegurarcontenidos";
import Asegurarjoyas from "../asegurarjoyas/Asegurarjoyas";
import Asegurarobras from "../asegurarobras/Asegurarobras";
import Asegurartelefonos from "../asegurartelefonos/Asegurartelefonos";
import {UrlSite} from "../../../../../config";
import Loading from "../../../../globals/loading/Loading";

class BtnContinue extends Component {

    constructor(props) {
        super(props);
        this.state = {
            disabled: false
        };
    }

    saveService = async () => {
        Loading.toggle(true);
        await SaveIdentifications.save();
        await CreateOrUpdateValoration.save();
        Helpers.goToHome(this.props.history);
    };

    goBack = async () => {
        Loading.toggle(true);
        store.dispatch(NextStep(1));
        await SaveIdentifications.save();
        await CreateOrUpdateValoration.save();
        this.props.history.push(UrlSite + "/cotizacion/1/" + this.props.match.params.id);
    };

    saveServiceContinue = async () => {
        let storeState = store.getState();

        let errors = 0;
        let inmueble = storeState.Inmueble;

        if (inmueble.type_risk === 2 && inmueble.pisonumero === "") {
            Helpers.addClass(".pisonumero", "error");
            errors++;
        } else {
            Helpers.removeClass(".pisonumero", "error");
        }

        if (inmueble.numerodepisos === "") {
            Helpers.addClass(".numerodepisos", "error");
            errors++;
        } else {
            Helpers.removeClass(".numerodepisos", "error");
        }

        if (inmueble.zona === "") {
            Helpers.addClass(".zona", "error");
            errors++;
        } else {
            Helpers.removeClass(".zona", "error");
        }

        if (inmueble.anoconstruido === "") {
            Helpers.addClass(".anoconstruido", "error");
            errors++;
        } else {
            Helpers.removeClass(".anoconstruido", "error");
        }

        if (inmueble.construidocon === "") {
            Helpers.addClass(".construidocon", "error");
            errors++;
        } else {
            Helpers.removeClass(".construidocon", "error");
        }

        if (inmueble.cojuntocerrado === "") {
            Helpers.addClass(".cojuntocerrado", "error");
            errors++;
        } else {
            Helpers.removeClass(".cojuntocerrado", "error");
        }

        if (inmueble.refuerzo === 1) {
            if (inmueble.anorefuerzo === "") {
                Helpers.addClass(".anorefuerzo", "error");
                errors++;
            } else {
                Helpers.removeClass(".anorefuerzo", "error");
            }
        }

        if (inmueble.inmuebleasegudado === 0 && (inmueble.contenidoasegudado === 0 || inmueble.contenidoasegudado === "")) {
            Helpers.addClass(".inmuebleasegudado", "error");
            Helpers.addClass(".contenidoasegudado", "error");
            errors++;
        } else {
            Helpers.removeClass(".inmuebleasegudado", "error");
            Helpers.removeClass(".contenidoasegudado", "error");
        }

        if (inmueble.inmuebleasegudado === 1) {
            if (Segurarinmueble.validateField(inmueble.inmuebleasegudadovalor) !== 0) {
                Helpers.addClass(".inmuebleasegudadovalor", "error");
                errors++;
            } else {
                Helpers.removeClass(".inmuebleasegudadovalor", "error");
            }
        }

        if (inmueble.contenidoasegudado === 1) {
            if (Asegurarcontenidos.validateField(inmueble.contenidoasegudadovalor) !== 0) {
                Helpers.addClass(".contenidoasegudadovalor", "error");
                errors++;
            } else {
                Helpers.removeClass(".contenidoasegudadovalor", "error");
            }
        }

        if (inmueble.inmuebleasegudadojoyas === 1) {
            if (Asegurarjoyas.validateField(inmueble.inmuebleasegudadojoyasvalor) !== 0) {
                Helpers.addClass(".inmuebleasegudadojoyasvalor", "error");
                errors++;
            } else {
                Helpers.removeClass(".inmuebleasegudadojoyasvalor", "error");
            }
        }

        if (inmueble.inmuebleasegudadoobras === 1) {
            if (Asegurarobras.validateField(inmueble.inmuebleasegudadoobrasvalor) !== 0) {
                Helpers.addClass(".inmuebleasegudadoobrasvalor", "error");
                errors++;
            } else {
                Helpers.removeClass(".inmuebleasegudadoobrasvalor", "error");
            }
        }

        if (inmueble.inmuebleasegudadotelefonos === 1) {
            if (Asegurartelefonos.validateField(inmueble.inmuebleasegudadotelefonosvalor) !== 0) {
                Helpers.addClass(".inmuebleasegudadotelefonosvalor", "error");
                errors++;
            } else {
                Helpers.removeClass(".inmuebleasegudadotelefonosvalor", "error");
            }
        }

        let disabled = errors !== 0;
        if (disabled !== false) {
            Helpers.scrollToElement(".error");
        } else {
            Loading.toggle(true);
            store.dispatch(NextStep(3));
            await SaveIdentifications.save();
            await CreateOrUpdateValoration.save();
            this.props.history.push(UrlSite + '/cotizacion/3/' + storeState.cotizacion.number);
        }
    };

    render() {
        return (
            <Fragment>
                <div className={"return-button"}>
                    <button className="btn btn-link" type="button" onClick={this.goBack}><i
                        className="back-icon">&nbsp;</i>Volver
                    </button>
                </div>
                <button type="button" className={"btn btn-default"}
                    onClick={this.saveService}>Guardar y salir
                </button>
                <button type="button"
                        disabled={this.state.disabled}
                        onClick={this.saveServiceContinue}
                        className={"btn btn-primary " + (this.state.disabled === true ? 'disabled' : '')}>Continuar
                </button>
            </Fragment>
        );
    }
}

export default withRouter(BtnContinue);
