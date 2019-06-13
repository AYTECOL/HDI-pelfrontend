import React, {Component} from 'react';
import {Route, Switch, withRouter} from 'react-router-dom';

import Header from './components/globals/header/Header';
import Footer from './components/globals/footer/Footer';
import Loading from './components/globals/loading/Loading';

import Cotizacion from './pages/cotizacion/Cotizacion';
import Home from './pages/home/Home';
import PolizaEmitida from './pages/polizaemitida/PolizaEmitida';
import Emision from "./pages/emision/Emision";
import NotFound from './pages/notfound/NotFound';
import ErrorNetwork from './pages/errornetwork/ErrorNetwork';
import Helpers from "./common/helpers/helpers/Helpers";

class App extends Component {

    _isMounted = false;

    constructor(props) {
        super(props);
        this.state = {
            data: null
        };
    }

    componentDidMount() {
        this._isMounted = true;
        this.getUser();
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    async getUser() {
        let path = this.props.location.pathname;
        if( path.indexOf("cotizacion") !== -1 ||
            path.indexOf("emision") !== -1 ||
            path.indexOf("exito") !== -1 ){
            if (this._isMounted === true && this.state.data === null) {
                this.setState({
                    ...this.state,
                    data: await Helpers.getUser()
                });
            }
        }
    }

    render() {
        return (
            <div className="App">
                <Header data={this.state.data}/>
                <main>
                    <Switch>
                        <Route exact path="/" component={Home}/>
                        <Route exact path="/exito/:id" component={PolizaEmitida}/>
                        <Route exact path="/cotizacion/:step/:id" component={Cotizacion}/>
                        <Route exact path="/emision/:step/:id" component={Emision}/>
                        <Route exact path="/error" component={ErrorNetwork}/>
                        <Route component={NotFound}/>
                    </Switch>
                </main>
                <Footer/>
                <Loading/>
            </div>
        );
    }
}

export default withRouter(App);
