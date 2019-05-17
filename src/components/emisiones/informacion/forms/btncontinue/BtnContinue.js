import React, {Component, Fragment} from 'react';

import {withRouter} from "react-router-dom";
import {UrlSite} from "../../../../../config";
import Helpers from "../../../../../common/helpers/helpers/Helpers";
import CreateOrUpdateMoreInfo from "../../../../../services/CreateOrUpdateMoreInfo";

class BtnContinue extends Component {

    constructor(props) {
        super(props);
        this.state = {
            step: parseInt(this.props.match.params.step),
            continueButtonDisable: true,
            stateFormIdentificacion: 0,
            cotizacionExclude: [],
            comeBack: UrlSite + "/emision/1/" + this.props.match.params.id
        };
    }

    saveAndExit = () => {
        Helpers.goToHome();
    };

    nextStep = async () => {
        let state = this.props.state;
        for (let i = 0; i < state.contents.length; i++) {
            for(let j in state.contents[i]){
                if ( state.contents[i][j] === "" ) state.contents[i][j] = '""';
            }
        }
        let name = "";
        let phone = "";
        if( state.contactperson !== null ){
            name = state.persons[state.contactperson].name;
            phone = state.persons[state.contactperson].telefono;
        }
        await CreateOrUpdateMoreInfo.get({
            "quote_id": this.props.match.params.id,
            "start_policy_date": state.initdate,
            "area": state.area,
            "risk_use": state.utilizado,
            "order": state.contactperson,
            "name":"DINAMICA",
            "visit_personalue":{
                "name": name,
                "phone": phone
            },
            "goods_over_cost": state.contents
        });
        window.location.href = UrlSite + "/emision/3/" + this.props.match.params.id;
    };

    render() {
        return (
            <Fragment>
                <div className={"return-button"}>
                    <a href={this.state.comeBack}><i className="back-icon">&nbsp;</i>Volver</a>
                </div>
                <button type="button" className={"btn btn-default"}
                        onClick={this.saveAndExit}>Guardar y salir
                </button>
                <button type="button" className={"btn btn-primary"}
                        onClick={this.nextStep}>Continuar
                </button>
            </Fragment>
        );
    }
}

export default withRouter(BtnContinue);



