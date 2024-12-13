import React from 'react';
import classNames from 'classnames';

import close_icon from 'assets/images/icon_close.svg';

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
              <img src={close_icon} alt="" />
            </button>
          </div>
          <div className="modal-body">
            <div className="buttons">
              <a
                href="/"
                className="btn btn-secondary btn-secondary--two "
                data-dismiss="modal"
              >
                Mis negocios
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
