import React from 'react';
import classNames from 'classnames';
import withRouter from 'react-router/withRouter';

const ValidatePersonIdentity = withRouter(
  ({
    subtittle,
    idPolicy,
    tittle,
    message,
    button,
    open,
    onRetry,
    history,
  }) => {
    const route = '/';

    return (
      <div className={classNames('modal d-flex', !open && 'hide')}>
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{tittle}</h5>
              <p className="modal-subtitle">{message}</p>
              <div>
                <p className="modal-subtitle">{subtittle}</p>
              </div>
              <div> Cotización: {idPolicy} </div>
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
              <div className="buttons">
                <a
                  href={route}
                  className="btn btn-primary"
                  data-dismiss="modal"
                >
                  Mis negocios
                </a>
                <button
                  type="button"
                  className={classNames('btn btn-primary', !button && 'hide')}
                  onClick={onRetry}
                >
                  Reintentar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

export default ValidatePersonIdentity;
