import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import moment from 'moment';
import 'moment/locale/es'; // Importa el idioma español para moment.js
// Components
import Segurarinmueble from '../forms/segurarinmueble/Segurarinmueble';
import Asegurarcontenidos from '../forms/asegurarcontenidos/Asegurarcontenidos';
import Asegurarcontenidoadicional from '../asegurarcontenidoadicional/Asegurarcontenidoadicional';
// Api
import AllInsurableLimits from '../../../../services/AllInsurableLimits';
import GetEstate from 'services/GetEstate';

import OtherQuestions from '../forms/OtherQuestions';

// Modales
import ModalLimitsPlanError from '../../../modal/ModalLimitsPlanError';

// Store
import Store from '../../../../store';

class Valoreasegurar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openLimitsModal: false,
      code: 0,
      stepCotizacion: Store.getState().cotizacion.state,
      numberCotizacion: Store.getState().cotizacion.number,
      retryCount: 0,
      retryLimitReached: false,
      showButtonReturn: false,
      currentDateTime: '',
    };
  }

  async componentDidMount() {
    moment.locale('es');
    const currentDateTime = moment().format('DD/MMM/YYYY HH:mm:ss');
    this.setState({ currentDateTime });

    await this.getLimitsEstate();
  }

  async getLimitsEstate() {
    const limits = await AllInsurableLimits.get(
      Store.getState().cotizacion.number
    );
    await GetEstate.get(Store.getState().cotizacion.number);

    if (!limits || limits.code) {
      this.setState({
        openLimitsModal: true,
        code: limits?.code,
      });
    } else if (limits.length > 0) {
      this.setState({
        openLimitsModal: false,
      });
    }
  }

  handleRetry = () => {
    this.setState(
      (prevState) => {
        const newRetryCount = prevState.retryCount + 1;
        const retryLimitReached = newRetryCount >= 3;

        return {
          retryCount: newRetryCount,
          retryLimitReached,
          showButtonReturn: retryLimitReached,
        };
      },
      async () => {
        if (!this.state.retryLimitReached) {
          await this.getLimitsEstate();
        } else {
          console.error('Límite de reintentos alcanzado');
        }
      }
    );
  };

  render() {
    return (
      <>
        <div className="inmuebleform">
          <div className="container">
            <div className="row">
              <div className="col col-sm-12 col-md-12 col-lg-12">
                <h5>Valores a asegurar</h5>
              </div>
            </div>
            <div className="row">
              <div className="col col-sm-12 col-md-12 col-lg-12">
                <Segurarinmueble />
              </div>
            </div>

            <div className="hr-mid">
              <hr />
            </div>

            <div className="row">
              <div className="col col-sm-12 col-md-12 col-lg-12">
                <Asegurarcontenidos />
              </div>
            </div>

           <div className="row justify-content-center pb-8">
              <div className="col col-sm-12 col-md-12 col-lg-12">
                <Asegurarcontenidoadicional />
              </div>
            </div>
            <hr />
            <div className="row">
              <div className="col col-sm-12 col-md-12 col-lg-12">
                <OtherQuestions />
              </div>
            </div>
          </div>
        </div>
        <ModalLimitsPlanError
          open={this.state.openLimitsModal}
          onRetry={this.handleRetry}
          code={this.state.code}
          stepCotizacion={this.state.stepCotizacion}
          numberCotizacion={this.state.numberCotizacion}
          showButtonReturn={this.state.showButtonReturn}
          currentDateTime={this.state.currentDateTime}
        />
      </>
    );
  }
}

export default withRouter(Valoreasegurar);