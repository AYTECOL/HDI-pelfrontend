import React from 'react';
import store from '../../../../store';

import Name from '../../../globals/forms/identificacion/name/Name';
import Lastname from '../../../globals/forms/identificacion/lastname/Lastname';
import Razonsocial from '../../../globals/forms/identificacion/razonsocial/Razonsocial';
import Adress from '../../../globals/forms/identificacion/adress/Adress';
import Addressadditional from '../../../globals/forms/identificacion/addressadditional/Addressadditional';
import AutoCompleteCities from '../../../globals/forms/identificacion/autocompletecities/AutocompleteCities';
import Map from "../../../map/Map.js"

class SecondForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            type: 1,
            show: false
        };

        store.subscribe(() => {
            let storeState = store.getState();
            this.setState({
                ...this.state,
                show: storeState.stateFormIdentificacion == 1,
                type: storeState.typeDocument
            });
        });
    }
    render() {
        return (
            <div className={(this.state.show?'show':'hide')}>
                <div className={(this.state.type != 1 ? "hide " : "") + "row"}>
                    <div className="col col-sm-6 col-md-6 col-lg-6 form-first">
                        <Name />
                    </div>
                    <div className="col col-sm-6 col-md-6 col-lg-6 form-first">
                        <Lastname />
                    </div>
                </div>

                <div className={(this.state.type != 2 ? "hide " : "") + "row"}>
                    <div className="col col-sm-12 col-md-12 col-lg-12 form-first">
                        <Razonsocial />
                    </div>
                </div>


                <div className="row">
                    <div className="col col-sm-6 col-md-6 col-lg-6 form-first">
                        <AutoCompleteCities />
                    </div>
                    <div className="col col-sm-6 col-md-6 col-lg-6 form-first">
                        <Adress />
                    </div>
                    <div className="col col-sm-12 col-md-12 col-lg-12 form-first">
                        <Map />
                    </div>
                    <div className="col col-sm-6 col-md-6 col-lg-6 form-first">
                        <Addressadditional />
                    </div>
                </div>
            </div>
        )
    }

};

export default SecondForm;