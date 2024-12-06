import React, { Component } from 'react';
import './ErrorNetwork.scss';

import ImageError from 'assets/images/Power_Adapter_RGB.png';

class ErrorNetwork extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    document.querySelector('body').className += ' errornetwork';
  }

  render() {
    const route = '/';
    return (
      <div className="errorPage">
        <div className="container container-custom">
          <img src={ImageError} alt="" />
          <div className="row">
            <div className="col col-sm-12 col-md-12 col-lg-12 title">
              <h1>Lo sentimos, algo ha ocurrido </h1>
              <p>
                Es posible que exista algún problema con la conexión, intenta de
                nuevo más tarde.
              </p>
              <span>
                Si tienes alguna duda comunícate con tu ejecutivo comercial para
                mayor información.
              </span>
              <div className="buttons">
                <a
                  href={route}
                  className="btn btn-secondary btn-secondary--two"
                  data-dismiss="modal"
                >
                  Mis negocios
                </a>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {}}
                >
                  Reintentar
                </button>
              </div>
            </div>
          </div>
          <div className="footer_notfound">
            <p>HDI Seguros Colombia S.A. 2024. Todos los derechos reservados</p>
          </div>
        </div>
      </div>
    );
  }
}

export default ErrorNetwork;
