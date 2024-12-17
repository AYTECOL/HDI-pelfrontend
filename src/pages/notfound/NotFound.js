import React, { Component } from 'react';
import './NotFound.scss';
import Loading from '../../components/globals/loading/Loading';
import { UrlOficina } from '../../config';

import iconNotFound from 'assets/images/notFound.png';

class NotFound extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    document.querySelector('body').className += ' notfound';
    document.querySelector('html').className += ' notfoundhtml';
    Loading.toggle(false);
  }

  render() {
    const route = '/';
    return (
      <div className="notfound">
        <div className="container container-custom">
          <img src={iconNotFound} alt="" />
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

export default NotFound;
