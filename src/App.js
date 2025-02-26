import React, { Component } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';

import Header from './components/globals/header/Header';
import Footer from './components/globals/footer/Footer';
import Loading from './components/globals/loading/Loading';

import Cotizacion from './pages/cotizacion/Cotizacion';
import Home from './pages/home/Home';
import PolizaEmitida from './pages/polizaemitida/PolizaEmitida';
import Emision from './pages/emision/Emision';
import NotFound from './pages/notfound/NotFound';
import ErrorNetwork from './pages/errornetwork/ErrorNetwork';
import ConsultaPersonas from './services/ConsultaPersonas';
import Identifications from 'services/Identifications';
import store from 'store';
import { setGeneralSetIdentifications } from 'store/actions';
import AccessToken from 'services/AccessToken';
import CreateAuditData from 'services/Audit';

class App extends Component {
  _isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
      data: null,
    };
  }

  componentDidMount() {
    this._isMounted = true;
    this.getUser();
    this.getResources();
    if (!sessionStorage.getItem('auditLogged')) {
      this.authentication()
        .then(() => {
          sessionStorage.setItem('auditLogged', 'true');
        })
        .catch((error) => {
          console.error('Error en authentication:', error);
        });
    }
  }

  async getResources() {
    // get types and labels for types of documents
    let data = await Identifications.get();
    store.dispatch(setGeneralSetIdentifications(data?.identifications || []));
  }

  async authentication() {
    let queryString = window.location.search.replace('?', '').split('&');
    const body = {
      opcion: 'Login',
      clave_broker: '',
      username: '',
      celular: '',
      nombreIntermediario: '',
      sucursal: '',
    };
    if (queryString.length > 0 && queryString[0] !== '') {
      await AccessToken.get(queryString[0].replace('refer=', ''));

      // Reintentos para esperar que la data auth esté disponible en Redux
      let attempts = 0;
      let authData = store.getState().auth;
      while ((!authData || !authData.agente) && attempts < 3) {
        await new Promise((resolve) => setTimeout(resolve, 500)); // Espera 500ms
        authData = store.getState().auth;
        attempts++;
      }

      if (authData && authData.agente) {
        // Actualiza el body con la información de auth
        body.clave_broker = authData.agente || '';
        body.username = authData.usuario || '';
        body.celular = authData.Celular || '';
        body.nombreIntermediario = authData.nombreUsuario || '';
        body.sucursal = authData.Sucursal || '';

        await CreateAuditData.createDataAudit(body);
      } else {
        console.error(
          'La data de auth no está disponible después de 3 intentos'
        );
      }
    } else {
      let attempts = 0;
      let authData = store.getState().auth;

      while ((!authData || !authData.agente) && attempts < 3) {
        await new Promise((resolve) => setTimeout(resolve, 500)); // Espera 500ms
        authData = store.getState().auth;
        attempts++;
      }

      if (authData && authData.agente) {
        // Actualiza el body con la información de auth
        body.clave_broker = authData.agente || '';
        body.username = authData.usuario || '';
        body.celular = authData.Celular || '';
        body.nombreIntermediario = authData.nombreUsuario || '';
        body.sucursal = authData.Sucursal || '';

        await CreateAuditData.createDataAudit(body);
      } else {
        console.error(
          'La data de auth no está disponible después de 3 intentos'
        );
      }
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
    this.unlisten();
  }

  componentWillMount() {
    this.unlisten = this.props.history.listen((location, action) => {
      window.scroll({
        top: 0,
        left: 0,
      });
    });
  }

  async getUser() {
    if (this._isMounted === true && this.state.data === null) {
      const { pathname } = this.props.location;
      if (
        pathname === '/' ||
        pathname.indexOf('exito') !== -1 ||
        pathname.indexOf('cotizacion') !== -1 ||
        pathname.indexOf('emision') !== -1
      ) {
        this.setState({
          ...this.state,
          data: await ConsultaPersonas.getUser(),
        });
      }
    }
  }

  render() {
    return (
      <div className="App">
        <Header data={this.state.data} />
        <main>
          <Switch>
            <Route
              exact
              path="/exito/:polizaId/:emmitedId"
              component={PolizaEmitida}
            />
            <Route exact path="/exito/:polizaId" component={PolizaEmitida} />
            <Route exact path="/cotizacion/:step/:id" component={Cotizacion} />
            <Route exact path="/emision/:step/:id" component={Emision} />
            <Route exact path="/error" component={ErrorNetwork} />
            <Route exact path="/" component={Home} />
            <Route component={NotFound} />
          </Switch>
        </main>
        <Footer />
        <Loading />
      </div>
    );
  }
}

export default withRouter(App);
