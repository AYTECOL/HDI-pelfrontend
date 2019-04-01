import React, {Component} from 'react';
import './Validaridentificacion.scss';
import icono from '../../../../../common/images/icon.png';
import store from "../../../../../store";
import {showPopupIdentification} from "../../../../../actionCreators";

class Validaridentificacion extends Component {

    constructor(props) {
        super(props);

        this.state = {
            showPopUp: false,
        };

        store.subscribe(async () => {
            let storeState = store.getState();
            let showPopUp = storeState.showPopUp;
            if (this.state.showPopUp !== showPopUp ) {
                this.setState({
                    ...this.state,
                    showPopUp: showPopUp,
                });
            }
        });
    }

    hide(){
        document.getElementById("doc-type-value").setAttribute("disabled","false");
        store.dispatch(showPopupIdentification(false));
    }

    render() {
        return (
            <div className={"modal validaridentificacion "+ ((this.state.showPopUp === true)?'show':'hide')}>
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Ups, lo sentimos</h5>
                            <p className="modal-subtitle">La identificación que ingresaste no nos permite continuar con
                                el proceso</p>
                            <button type="button" className="close" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="content">
                                <div className="icono">
                                    <img src={icono} alt=""/>
                                </div>
                            </div>
                            <div className="buttons">
                                <a  href="/" className="btn btn-secondary" data-dismiss="modal">Terminar
                                </a>
                                <button type="button" className="btn btn-primary"
                                        onClick={(e) => {
                                            this.hide();
                                        }}
                                >Ajustar</button>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <p>Para más información comunícate desde Bogotá a la línea <span>307 7050</span> o
                                desde cualquier lugar del país <span>018000 113390</span></p>
                        </div>
                    </div>
                </div>
            </div>
        )
    };
}

export default Validaridentificacion;