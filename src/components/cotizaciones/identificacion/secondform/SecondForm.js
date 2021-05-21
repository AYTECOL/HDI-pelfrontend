import React, {Component} from 'react';
import store from '../../../../store';

import Name from '../forms/name/Name';
import Lastname from '../forms/lastname/Lastname';
import Razonsocial from '../forms/razonsocial/Razonsocial';
import Adress from '../forms/adress/Adress';
import Addressadditional from '../forms/addressadditional/Addressadditional';
import AutoCompleteCities from '../forms/autocompletecities/AutocompleteCities';
import Map from "../map/Map.js"
import { saveDescriptionCity, saveIdentificationValue } from '../../../../actions';

class SecondForm extends Component {

    constructor(props) {
        super(props);
        let storeState = store.getState();
        this.state = {
            type: storeState.typeDocument,
            show: storeState.stateFormIdentificacion === 1
        };
    }

    componentDidMount() {
        this.unsubscribe = store.subscribe(() => {
            let storeState = store.getState();
            let stateFormIdentificacion = storeState.stateFormIdentificacion === 1;
            if (stateFormIdentificacion !== this.state.show || storeState.typeDocument !== this.state.type) {
                this.setState({
                    ...this.state,
                    show: stateFormIdentificacion,
                    type: storeState.typeDocument
                });
            }
        });
    }

  componentWillUnmount() {
    this.unsubscribe();
  }

  resetAddress() {
    store.dispatch(
      saveIdentificationValue({
        name: 'address',
        value: '',
      })
    );
  }

  resetCity() {
    store.dispatch(
      saveIdentificationValue({
        name: 'city',
        value: '',
      })
    );
    this.resetAddress();
  }

  /**
   *
   * @param {{
   * code_city: number;
   * department: string;
   * code_department: number;
   * }|undefined} option
   */
  onChangeCity = (option) => {
    this.resetAddress();
    if (option) {
      let code = option.code_city;
      let description = option.department;
      let codeDepartment = option.code_department;
      store.dispatch((dispatch) => {
        dispatch(
          saveIdentificationValue({
            name: 'city',
            value: code,
          })
        );
        dispatch(
          saveIdentificationValue({
            name: 'department',
            value: codeDepartment,
          })
        );
        dispatch(saveDescriptionCity(description));
      });
    } else this.resetCity();
  };

  render() {
    return (
         <div className={(this.state.show ? 'show' : 'hide')}>
                <div className={(this.state.type !== 1 ? "hide " : "") + "row"}>
                    <div className="col col-12 col-sm-6 col-md-6 col-lg-6 form-first">
                        <Name/>
                    </div>
                    <div className="col col-12 col-sm-6 col-md-6 col-lg-6 form-first">
                        <Lastname/>
                    </div>
                </div>

                <div className={(this.state.type !== 2 ? "hide " : "") + "row"}>
                    <div className="col col-sm-12 col-md-12 col-lg-12 form-first">
                        <Razonsocial/>
                    </div>
                </div>

                <div className="row">
                    <div className="col col-12 p-0">
                        <AutoCompleteCities
                          onSelect={(option) => this.onChangeCity(option)}
                        />
                     </div>
                    <div className="col col-12 p-0">
                        <Adress/>
                    </div>
                </div>

                <div className="row">
                    <div className="col col-12 col-sm-12 col-md-12 col-lg-12 form-first">
                        <Addressadditional/>
                    </div>
                </div>

                <Map/>

            </div>
        )
    }

}

export default SecondForm;