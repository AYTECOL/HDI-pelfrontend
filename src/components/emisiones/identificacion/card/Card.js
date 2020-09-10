import React, { Component } from "react";
import { roles } from "../constants";

class Card extends Component {
  render() {
    return (
      <div className="row">
        <div className="col wrapper-more-selected">
          {this.props.persons.map((item, key) => (
            <div key={key} className="row item-select">
              <div className="col col-1">
                <div className="icon-image">&nbsp</div>
              </div>
              <div className="col">
                <span>Rol</span>
                <p className="font-weight-bold">
                  {item["role"].indexOf(roles.taker) !== -1 ? "Tomador " : ""}
                </p>
                <p className="font-weight-bold">
                  {item["role"].indexOf(roles.insured) !== -1 ? "Asegurado " : ""}
                </p>
                <p className="font-weight-bold">
                  {item["role"].indexOf(roles.beneficiary) !== -1 ? "Beneficiario " : ""}
                </p>
                <p className="font-weight-bold">
                  {item["role"].indexOf(roles.onerousBeneficiary) !== -1
                    ? "Beneficiario oneroso "
                    : ""}
                </p>
                <p className="font-weight-bold">
                  {item["role"].indexOf(roles.obsequies) !== -1 ? "Exequias " : ""}
                </p>
                <p className="font-weight-bold">
                  {item["role"].indexOf(roles.personalAccidents) !== -1
                    ? "Accidentes personales "
                    : ""}
                </p>
              </div>
              <div className="col col-sm-2 col-md-2">
                <span>Identificación</span>
                <p>{item["value"]}</p>
              </div>
              {parseInt(item["code"]) === 37 ? (
                <div className="col">
                  <span>Razón social</span>
                  <p>{item["businessname"]}</p>
                </div>
              ) : (
                <div className="col name">
                  <span>Nombre y apellido</span>
                  <p>
                    {item["name"]} {item["lastname"]}
                  </p>
                </div>
              )}
              {String(item.role) !== String(roles.onerousBeneficiary) && (
                <div className="col col-sm-3 col-md-3">
                  <span>Dirección</span>
                  <p>{item['address']}</p>
                </div>
              )}
              <div className="col actions">
                {this.props.showEdit === true && (
                  <p>
                    <i onClick={this.props.togglePopUpPersona(key)}>
                      Modificar
                    </i>
                    <span
                      className="trash"
                      onClick={this.props.togglePopUpDelete(key)}
                    >
                      &nbsp;
                    </span>
                  </p>
                )}
                {this.props.showView === true && (
                  <p className="viewDetails">
                    <i onClick={this.props.togglePopUpPersona(key)}>
                      Ver Detalles
                    </i>
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default Card;
