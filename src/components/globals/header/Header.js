import React, { Component } from 'react';
import './Header.scss';
import logo from '../../../common/images/logo.png';
import { withRouter } from 'react-router-dom';
import ConsultaPersonas from '../../../services/ConsultaPersonas';

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      path: this.props.location.pathname,
      activeMenu1: '',
      name: 'User name',
    };
    if (this.state.path === '/') this.state.activeMenu1 = 'active';
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if (typeof nextProps.data === 'undefined' || nextProps.data === null)
      return;
    let state = this.state;
    if (typeof nextProps.data.name !== 'undefined') {
      state.name = nextProps.data.name;
    } else if (typeof nextProps.data.nombreUsuario !== 'undefined') {
      state.name = nextProps.data.nombreUsuario;
    }
    if (state.name !== this.state.name) {
      this.setState({
        ...state,
      });
    }
  }

  render() {
    return (
      <header className="App-header">
        <div className="header container">
          <div className="row">
            <div id="logo" className="col col-12 col-sm-12 col-md-4 col-lg-4">
              <img src={logo} alt="" />
            </div>
            <div
              id="main-menu"
              className="col col-12 col-sm-12 col-md-8 col-lg-8"
            >
              <ul>
                <li className={'item-home ' + this.state.activeMenu1}>
                  <a href="/">
                    <i className="icon1">&nbsp;</i>Mis negocios
                  </a>
                </li>
                <li className="item-user">
                  <a href="/#">
                    <i className="icon2">&nbsp;</i>
                    {this.state.name}
                  </a>
                </li>
                <li className="logout">
                  <a
                    href="/#"
                    onClick={(e) => {
                      e.preventDefault();
                      ConsultaPersonas.logout();
                    }}
                  >
                    <i className="icon3">&nbsp;</i>Salir
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </header>
    );
  }
}

export default withRouter(Header);
