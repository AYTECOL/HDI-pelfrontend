import React, {Component} from 'react';
import {Route, Switch} from 'react-router-dom';

import Header from './components/globals/header/Header';
import Footer from './components/globals/footer/Footer';
import Loading from './components/globals/loading/Loading';

import Cotizacion from './pages/cotizacion/Cotizacion';
import Home from './pages/home/Home';

class App extends Component {
    render() {
        return (
            <div className="App">
                <Header/>
                <main>
                    <Switch>
                        <Route exact path="/" component={Home}/>
                        <Route exact path="/cotizacion/:step/:id" component={Cotizacion}/>
                        <Route exact path="/cotizacion/:step/:id" component={Cotizacion}/>
                    </Switch>
                </main>
                <Footer/>
                <Loading />
            </div>
        );
    }
}

export default App;
