import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import Counter from "../../services/Counter";
import Loading from "../../components/globals/loading/Loading";
import Table from "../../components/home/table/Table";
import "./Home.scss";

class Home extends Component {
  componentDidMount() {
    Loading.toggle(true);
  }

  getNumber = async () => {
    const { history } = this.props;
    Loading.toggle(true);
    let number = await Counter.get();
    if (typeof number.currentValue !== "undefined") {
      number = number.currentValue.toString();
      history.push(`/cotizacion/1/${number}`);
    }
    setTimeout(Loading.toggle(false), 500);
  };

  render() {
    return (
      <div className="home">
        <div className="container">
          <div className="row">
            <div className="col col-sm-12 col-md-12 col-lg-12 title">
              <h2>Mis Negocios en línea</h2>
              <button
                type="button"
                className="btn btn-primary btn-home"
                onClick={this.getNumber}
              >
                Nueva cotización
              </button>
            </div>
          </div>

          <div className="top-bar">
            <ul className="menus">
              <li>
                <p>Cotizaciones</p> <span>12</span>
              </li>
              <li className="active">
                <p>Proceso de emisión</p> <span>43</span>
              </li>
              <li>
                <p>Pólizas emitidas</p> <span>12</span>
              </li>
            </ul>
            <div className="search">
              <div className={"form-group input-select"}>
                <select name="code" id="doc-type" className={"form-control"}>
                  <option value="">Seleciona</option>
                </select>
              </div>
              <div className={"form-group"}>
                <input
                  name="name"
                  id="name"
                  type="text"
                  className={"form-control"}
                  placeholder="Busca por Nombre, Id, dirección ..."
                />
                <button type="button" className="btn-search">
                  &nbsp;
                </button>
              </div>
            </div>
          </div>

          <div className="tabs row">
            <ul>
              <li className="active">Ver todo</li>
              <li>Opción 1</li>
              <li>Opción 2</li>
            </ul>
          </div>

          <Table />
        </div>
      </div>
    );
  }
}

export default withRouter(Home);
