import React, { Component } from 'react';
import './Footer.scss';

class Footer extends Component {
  render() {
    return (
      <footer className="App-footer">
        <div className="footer container">
          <div className="row">
            <div
              id="first-footer"
              className="col col-12 col-sm-4 col-md-4 col-lg-4"
            >
              <h6>¿Necesitas ayuda?</h6>
              <p>Bogotá 307 7050</p>
              <p>Línea nacional 018000 113390</p>
            </div>
            <div
              id="last-footer"
              className="col col-12 col-sm-8 col-md-8 col-lg-8"
            >
              <div className="content">
                <ul>
                  <li>
                    <a href="/#" target="_blank">
                      Términos y condiciones
                    </a>
                  </li>
                  <li>|</li>
                  <li>
                    <a href="/#" target="_blank">
                      Política de privacidad
                    </a>
                  </li>
                </ul>
                <p>Liberty seguros 2018</p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    );
  }
}

export default Footer;
