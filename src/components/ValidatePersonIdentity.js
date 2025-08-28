import React from 'react';
import clsx from 'clsx';
import { withRouter } from 'react-router-dom';

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
      <div className={clsx('modal d-flex', !open && 'hide')}>
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{tittle}</h5>
              <br />
              <p className="modal-subtitle">{message}</p>
              <br />
              <div>
                <p className="modal-subtitle">{subtittle}</p>
              </div>
              <br />
              <div> Cotización: {idPolicy} </div>
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
                  className={clsx('btn btn-primary', !button && 'hide')}
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
