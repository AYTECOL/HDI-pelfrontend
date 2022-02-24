import React, { Component } from 'react';
import './SendMail.scss';
import Helpers from '../../../../../common/helpers/helpers/Helpers';

class SendMail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errorValue: 0,
      totalItems: 1,
    };
  }

  static toggle(status) {
    if (status === true) {
      Helpers.disabled('.validaridentificacion');
    } else {
      Helpers.enabled('.validaridentificacion');
    }
  }

  hide = () => {
    SendMail.toggle(false);
  };

  moreItems = () => {
    let current = this.state.totalItems;
    current++;
    this.setState({
      ...this.state,
      totalItems: current,
    });
  };

  render() {
    return (
      <div className={'modal validaridentificacion hide'}>
        <div className="modal-dialog sendmail" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Enviar cotización por correo</h5>
              <p className="modal-subtitle">
                Ingresa el correo de la persona a la que deseas enviarle la
                cotización
              </p>
              <button type="button" className="close" onClick={this.hide}>
                &nbsp;
              </button>
            </div>
            <div className="modal-body">
              <div className="content">
                {Array(this.state.totalItems)
                  .fill(1)
                  .map((el, i) => (
                    <div
                      key={i}
                      className={
                        'form-group text-left ' +
                        (this.state.errorValue !== 0 ? 'error' : '')
                      }
                    >
                      <label htmlFor="incendios">Correo</label>
                      <input
                        placeholder={'Ingresa el correo de la persona'}
                        type="text"
                        className={'form-control'}
                        name="incendios"
                        id="incendios"
                      />
                      <small
                        className={
                          'form-text only-errors ' +
                          (this.state.errorValue === 3 ? 'show' : 'hide')
                        }
                      >
                        El correo no es valido
                      </small>
                    </div>
                  ))}
                <div className="more-items" onClick={this.moreItems}>
                  <button type="button" className={'more-btn'}>
                    +
                  </button>
                  <p>Agregar otro correo</p>
                </div>
              </div>
              <div className="buttons">
                <a href="/" className="btn btn-secondary" data-dismiss="modal">
                  Cancelar
                </a>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={this.hide}
                >
                  Enviar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default SendMail;
