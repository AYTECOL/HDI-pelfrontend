import React, {Component} from 'react';

import store from '../../../../../store';
import {saveInmuebleValue} from '../../../../../actionCreators';

class Numerodepiso extends Component {

    constructor(props) {
        super(props);
        this.state = {
            errorerror: false
        };
    }

    validateEmpty(e) {
        let error = false;
        if (e.value.length < 1) error = true;
        this.setState({
            ...this.state,
            error: error
        });
        store.dispatch(saveInmuebleValue(e));
    }

    render() {
        return (
            <div className={"input-select form-group " + ((this.state.error) ? 'error' : '')}>
                <label htmlFor="numerodepisose">Número de pisos del inmueble</label>
                <select name="numerodepisos" id="numerodepisos" className={"form-control"}
                        onBlur={(e) => {
                            this.validateEmpty(e.target);
                        }}
                        onChange={(e) => {
                            this.validateEmpty(e.target);
                        }}
                >
                    <option value="">Seleccione</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                    <option value="9">9</option>
                    <option value="10">10</option>
                    <option value="11">11</option>
                    <option value="12">12</option>
                    <option value="13">13</option>
                    <option value="14">14</option>
                    <option value="15">15</option>
                    <option value="16">16</option>
                    <option value="17">17</option>
                    <option value="18">18</option>
                    <option value="19">19</option>
                    <option value="20">20</option>
                    <option value="21">21</option>
                    <option value="22">22</option>
                    <option value="23">23</option>
                    <option value="24">24</option>
                    <option value="25">25</option>
                    <option value="26">26</option>
                    <option value="27">27</option>
                    <option value="28">28</option>
                    <option value="29">29</option>
                    <option value="30">30</option>
                    <option value="30+">Más de 30</option>
                </select>
            </div>
        );
    }
}

export default Numerodepiso;



