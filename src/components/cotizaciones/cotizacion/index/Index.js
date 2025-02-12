import React, { Component } from 'react';
import { UrlPdfSarlaft } from '../../../../config';
import Cards from '../cards/Cards';
import Tab from '../tab/Tab';
import Btns from '../forms/btncontinue/BtnContinue';
import Links from '../forms/links/Links';
import Plans from '../plans/Plans';
import Loading from '../../../globals/loading/Loading';
import AllInsurableLimits from '../../../../services/AllInsurableLimits';
import moment from 'moment';
import 'moment/locale/es'; // Importa el idioma español para moment.js

// Modales
import ModalLimitsPlanError from '../../../modal/ModalLimitsPlanError';

import Store from '../../../../store';

import './Index.scss';

import icon_information from '../../../../assets/images/icon_information.svg';

class Index extends Component {
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
      updateCards: false,
    };
  }

  async componentDidMount() {
    Loading.toggle(true);

    moment.locale('es');
    const currentDateTime = moment().format('DD/MMM/YYYY HH:mm:ss');
    this.setState({ currentDateTime });

    await this.getLimitsEstate();
  }

  async getLimitsEstate() {
    const limits = await AllInsurableLimits.get(
      Store.getState().cotizacion.number
    );

    if (!limits || limits.code) {
      this.setState({
        openLimitsModal: true,
        code: limits?.code,
        updateCards: false,
      });
    } else if (limits.length > 0) {
      this.setState({
        openLimitsModal: false,
        updateCards: true,
      });
    }
  }

  handleRetry = () => {
    this.setState(
      (prevState) => {
        const newRetryCount = prevState.retryCount + 1;
        const retryLimitReached = newRetryCount >= 4;

        return {
          retryCount: newRetryCount,
          retryLimitReached,
          showButtonReturn: retryLimitReached,
          updateCards: true,
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
        <form autoComplete="off" className="index-form contizacion-form">
        <div className="container">
          <div className="row">
            <div className="col col-sm-12 col-md-12 col-lg-12 title">
              <h2>Tu cotización</h2>
              <p>
                Listo, selecciona e ingresa un valor para los items que deseas
                asegurar
              </p>
            </div>
          </div>

          <Cards />

          <Plans />

          <div className="tabs-header text-center">
            <Tab />
          </div>

          <div className="row">
            <div className="col col-12 col-sm-12 col-md-12 col-lg-12 form-action justify-content text-center">
              <Links />
            </div>
          </div>

          <div className="row btns-bottom">
            <div className="col col-12 col-sm-12 col-md-12 col-lg-12 form-action justify-content text-center">
              <Btns />
            </div>
          </div>

          <div className="row alert-contizacion">
            <div className="col col-12 col-sm-12 col-md-12 col-lg-12 form-action justify-content text-center">
              <p>
                <i>
                  <img src={icon_information} alt="" />
                </i>
                No olvides diligenciar el SARLAFT, si aún no lo tienes
                descarga el formato{' '}
                <a
                  href={UrlPdfSarlaft}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  aquí
                </a>
              </p>
            </div>
          </div>
        </div>
      </form>
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

export default Index;