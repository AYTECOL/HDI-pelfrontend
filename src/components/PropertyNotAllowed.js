import React from 'react';
import classNames from 'classnames';

const PropertyNotAllowed = ({ open, onClose }) => {
  return (
    <div className={classNames('modal d-flex', !open && 'hide')}>
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Ups, lo sentimos</h5>
            <p className="modal-subtitle">
              No podemos procesar tu solicitud. Comunícate con tu Gestor
              comercial
            </p>
            <button
              type="button"
              className="close"
              aria-label="Close"
              onClick={onClose}
            >
              &nbsp;
            </button>
          </div>
          <div className="modal-body">
            <div className="buttons">
              <a href="/" className="btn btn-secondary" data-dismiss="modal">
                Mi negocios
              </a>
              <button
                type="button"
                className="btn btn-primary"
                onClick={onClose}
              >
                Ajustar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyNotAllowed;
