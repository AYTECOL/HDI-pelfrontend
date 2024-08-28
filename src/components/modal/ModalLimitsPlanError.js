import React from 'react';
import classNames from 'classnames';
import withRouter from 'react-router/withRouter';

import WarningIcon from 'assets/icons/warning_icon.svg';
import './Modal.scss';

const ErrorLimitsPlansModal = withRouter(
  ({
    open,
    onRetry,
    code,
    stepCotizacion,
    numberCotizacion,
    showButtonReturn,
    currentDateTime,
    history,
  }) => {
    const route = '/';
    return (
      <div className={classNames('modal d-flex', !open && 'hide')}>
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <img src={WarningIcon} alt="warning_icon" />
              <h5 className="modal-title">Ups, lo sentimos</h5>
              <p className="modal-subtitle">
                No podemos continuar con la <strong>cotización</strong> en este
                momento debido a problemas técnicos.
              </p>
              <p className="modal-subtitle">
                Por favor, intenta nuevamente a través del botón{' '}
                <strong>Reintentar.</strong>
                <br /> Si el error persiste, retoma la cotizacion en unos
                minutos desde <strong>Mis negocios</strong>.
              </p>
              <span>
                Numero de cotizacion <strong>{`${numberCotizacion}`}</strong>
              </span>

              <button
                type="button"
                className="close"
                aria-label="Close"
                onClick={() => {
                  history.push(route);
                }}
              >
                &nbsp;
              </button>
            </div>
            <div className="modal-body">
              {!showButtonReturn ? (
                <div className="buttons">
                  <a
                    href={route}
                    className="btn btn-secondary"
                    data-dismiss="modal"
                  >
                    Mis negocios
                  </a>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={onRetry}
                  >
                    Reintentar
                  </button>
                </div>
              ) : (
                <div className="buttons">
                  <a
                    href={route}
                    className="btn btn-secondary"
                    data-dismiss="modal"
                  >
                    Ir a Mis Negocios
                  </a>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <p className="modal-footer-text">
                Para obtener información adicional, comunícate con la mesa de
                ayuda al correo <br />
                <strong>soporte.aplicactivos@libertycolombia.com</strong>
                <br />
                <span>
                  Código de error: 1-{`${code}`} - Paso {`${stepCotizacion}`}:
                  Cotización
                </span>
                <br />
                <span>{currentDateTime}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

export default ErrorLimitsPlansModal;
