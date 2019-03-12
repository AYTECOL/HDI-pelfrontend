import React, { Component } from 'react';
import { BrowserRouter } from 'react-router-dom';

import Header from './components/globals/header/Header';
import Footer from './components/globals/footer/Footer';

import Cotizacion from './pages/cotizacion/Cotizacion';

class App extends Component {
  render() {
    return (
      <div className="App">
          <Header />
          <main>
              <Cotizacion />
          </main>
          <Footer />
      </div>
    );
  }
}

export default App;
