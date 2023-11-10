import { CheckCircle, ExclamationTriangle } from 'react-bootstrap-icons';
import InfoIcon from 'assets/icons/info.svg';
const Alerts = ({
  type,
  onClose = () => {},
  onDelete = () => {},
  maxBeneficiaries = 10,
}) => {
  switch (type) {
    case 'success':
      return (
        <div className="row flex justify-content-end alert alert-success-container">
          <div className={'col-9 mb-4 mt-2 alert-success'}>
            <CheckCircle className="icon" width={16} height={16} />
            <p>
              <strong>
                {' '}
                Los datos del Beneficiario Final fueron borrados exitosamente
              </strong>{' '}
            </p>
            <button onClick={onClose} className="x-button">
              X
            </button>
          </div>
        </div>
      );

    case 'warning':
      return (
        <div className="row flex justify-content-center alert">
          <div className={'col-10 mb-4 mt-2 alert-warning'}>
            <ExclamationTriangle className="icon" />
            <p>
              <strong> ¿Deseas borrar este Beneficiario Final? </strong> Los
              datos no podrán recuperarse después.
            </p>
            <button onClick={onClose}>Cancelar</button>
            <div className="separator" />
            <button
              onClick={(e) => {
                e.preventDefault();
                onDelete();
              }}
            >
              Eliminar
            </button>
            <button onClick={onClose} className="x-button">
              X
            </button>
          </div>
        </div>
      );
    default:
      return (
        <div className="row">
          <div className={'col-12'}>
            <div className="row flex justify-content-center alert">
              <div className="col-2 alert-info-custom">
                <img src={InfoIcon} alt="info icon" width={16} height={16} />
              </div>
              <div className="col-9 alert-text">
                <p>
                  Puedes ingresar hasta{' '}
                  <strong>{maxBeneficiaries} Beneficiarios Finales </strong> en
                  total
                </p>
              </div>
            </div>
          </div>
        </div>
      );
  }
};

export default Alerts;
