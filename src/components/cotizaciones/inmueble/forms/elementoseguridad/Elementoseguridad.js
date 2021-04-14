import React, { Component } from "react";
import { connect } from "react-redux";

import store from "../../../../../store";
import { saveInmuebleValueSeguridad, savePdfInfo } from "../../../../../actions";

import "./Elementoseguridad.scss";
import AllSecurity from "../../../../../services/AllSecurity";

class Elementoseguridad extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: false,
            data: [],
            keys: {
                1: {
                    name: "alarma"
                },
                2: {
                    name: "cajafuerte"
                },
                3: {
                    name: "circuitocerradotv"
                },
                4: {
                    name: "reguladordevoltaje"
                },
                5: {
                    name: "puertascontroldomotico"
                },
                6: {
                    name: "puertasseguridadblindada"
                },
                7: {
                    name: "vigilanciapermanente"
                }
            }
        };
        this.getData();
    }

    async getData() {
        let data = await AllSecurity.get();
        this.setState({
            ...this.state,
            data: data
        });
    }

    saveValue = (e) => () => {
        if (this.state[e.name] === 1) {
            e.value = 0;
        } else if (this.state[e.name] === 0) {
            e.value = 1;
        }
        store.dispatch((dispatch) => {
            dispatch(saveInmuebleValueSeguridad(e));
            dispatch(
                savePdfInfo({
                    [e.name]: e.text
                })
            );
        });
    };

    render() {
        const { error, data, keys } = this.state;
        return (
            <div className={"form-group " + error}>
                <p className="p-descr">Selecciona, con cuáles de los siguientes elementos de seguridad cuenta el inmueble</p>
                <ul className="items-checkboxes">
                    <li className="row">
                        {data.map((item) => {
                            const { name } = keys[item.id];
                            return (
                                <div key={item.id} className="col col-12 col-md-6 lirow">
                                    <input
                                        type="checkbox"
                                        checked={this.props[name]}
                                        name={name}
                                        id={name}
                                        onChange={this.saveValue({
                                            value: 1,
                                            name,
                                            text: item.description
                                        })}
                                    />
                                    <label htmlFor={name}>{item.description}</label>
                                </div>
                            );
                        })}
                    </li>
                </ul>
            </div>
        );
    }
}

export default connect(({ Inmueble: { zona, seguridad } }) => {
    const values = {
        value: zona,
        alarma: seguridad.alarma,
        cajafuerte: seguridad.cajafuerte,
        puertascontroldomotico: seguridad.puertascontroldomotico,
        puertasseguridadblindada: seguridad.puertasseguridadblindada,
        circuitocerradotv: seguridad.circuitocerradotv,
        vigilanciapermanente: seguridad.vigilanciapermanente,
        reguladordevoltaje: seguridad.reguladordevoltaje
    };
    for (let i in values) if (values[i] === '""') values[i] = "";
    return values;
})(Elementoseguridad);
