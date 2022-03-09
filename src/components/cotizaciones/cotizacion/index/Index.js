import React, { Component } from 'react';
import { UrlPdfSarlaft } from '../../../../config';
import Cards from '../cards/Cards';
import Tab from '../tab/Tab';
import Btns from '../forms/btncontinue/BtnContinue';
import Links from '../forms/links/Links';
import Plans from '../plans/Plans';
import Loading from '../../../globals/loading/Loading';
import './Index.scss';

class Index extends Component {
  componentDidMount() {
    Loading.toggle(true);
  }

  render() {
    return (
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
                <i>i</i>No olvides diligenciar el SARLAFT, si aún no lo tienes
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
    );
  }
}

export default Index;
