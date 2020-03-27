import React, { Component, Fragment } from 'react';

import { withRouter } from "react-router-dom";
import { UrlSite } from "../../../../../config";
import Helpers from "../../../../../common/helpers/helpers/Helpers";
import CreateOrUpdateMoreInfo from "../../../../../services/CreateOrUpdateMoreInfo";
import UploadFile from "../../../../../services/UploadFile";
import store from "../../../../../store";
import { NextStep } from "../../../../../actions";
import SaveIdentifications from "../../../../../services/Quote";
import Loading from "../../../../globals/loading/Loading";

class BtnContinue extends Component {

    constructor(props) {
        super(props);
        this.state = {
            continueButtonDisable: true,
            stateFormIdentificacion: 0,
            cotizacionExclude: [],
        };
    }

    goBack = () => {
        this.props.history.push(UrlSite + "/emision/1/" + this.props.match.params.id);
    };

    nextStep = total => async () => {
        Loading.toggle(true);
        const {
          state,
          items,
          toggleErrorPhone,
          match,
          history
        } = this.props;
        let status = true;
        const getItem = id => {
            return items.find(({ key }) => String(key) === String(id));
        };
        for (let i = 0; i < state.contents.length; i++) {
            for (let j in state.contents[i]) if (state.contents[i][j] === "") state.contents[i][j] = '""';
            if (state.contents[i].uploaded === false) {
                let url = await UploadFile.upload('Docs', state.contents[i].doc);
                state.contents[i].textFile = url.location;
                state.contents[i].uploaded = true;
            }
            state.contents[i].nameType = getItem(state.contents[i].type);
            state.contents[i].typeCode = 90161;
        }

        //Validations
        if (state.celulares === true) {
            for (let i = 0; i < state.contents.length; i++) {
                if (typeof state.contents[i].textFile === "undefined" || state.contents[i].textFile.trim() === "") {
                    //status = false;
                }
                if (status === false && state.contents[i].type === 4) toggleErrorPhone(true);
            }
            if (state.contents.length === 0) {
                status = false;
                toggleErrorPhone(true);
                Loading.toggle(false);
            }
        }

        let name = "-";
        let phone = "-";
        if (typeof state.contactperson !== "undefined" && state.contactperson !== null) {
            name = state.persons[state.contactperson].name;
            phone = state.persons[state.contactperson].telefono;
        } else {
            state.contactperson = 0;
        }

        state.area = state.area === "" ? 0 : state.area;
        state.utilizado = state.utilizado === "" ? 0 : state.utilizado;

        let inmueble = store.getState().Inmueble;
        if (parseInt(inmueble.contenidoasegudado) === 0) {
            state.contents = [];
        }

        await CreateOrUpdateMoreInfo.get({
            "quote_id": match.params.id,
            "start_policy_date": state.initdate,
            "area": state.area,
            "risk_use": state.utilizado,
            "order": state.contactperson,
            "name": "DINAMICA",
            "visit_person": {
                "name": name,
                "phone": phone,
                "active": state.contactperson
            },
            "goods_over_cost": state.contents
        });

        if (typeof total !== "undefined") {
            if (status === true) {
                store.dispatch(NextStep(6));
                await SaveIdentifications.save();
                history.push(UrlSite + "/emision/3/" + match.params.id);
            }
        } else {
            await SaveIdentifications.save();
            Helpers.goToHome(history);
        }
        Loading.toggle(false);
    };

    render() {
        return (
            <Fragment>
                <div className={"return-button"}>
                    <button type="button" className="btn btn-link"
                        onClick={this.goBack}><i className="back-icon">&nbsp;</i>Volver
                    </button>
                </div>
                <button type="button" className={"btn btn-default"}
                    onClick={this.nextStep(undefined)}>Guardar y salir
                </button>
                <button type="button"
                    disabled={this.props.disable}
                    className={"btn btn-primary " + (this.props.disable === true ? 'disabled' : '')}
                    onClick={this.nextStep(true)}>Continuar
                </button>
            </Fragment>
        );
    }
}

export default withRouter(BtnContinue);



