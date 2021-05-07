import React from 'react';
import classNames from 'classnames';
import withRouter from 'react-router/withRouter';

const RateNotCalculated = withRouter(({ open, onRetry, history }) => {
  const route = '/';
  return (
    <div className={classNames('modal d-flex', !open && 'hide')}>
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Ups, lo sentimos</h5>
            <p className="modal-subtitle">
              No podemos calcular la prima tu hogar en este momento
            </p>
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
          </div>
        </div>
      </div>
    </div>
  );
});

export default RateNotCalculated;
