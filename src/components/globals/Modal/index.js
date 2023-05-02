import Styles from './Modal.module.scss';
import { Modal, Button } from 'react-bootstrap';
import CloseIcon from 'assets/icons/close.svg';
import WarningIcon from 'assets/icons/warning_icon.svg';
const ModalAlert = ({ type, children, show, handleClose, message }) => {
  let icon;
  let classes;
  switch (type) {
    case 'warning':
      icon = WarningIcon;
      classes = Styles.modalMessageWarning;
      break;
    default:
      icon = '';
      classes = '';
      break;
  }
  return (
    <Modal
      show={show}
      onHide={() => {}}
      backdrop="static"
      keyboard={false}
      centered
      className={Styles.modal}
    >
      <Modal.Header className={Styles.modalHeader}>
        <button onClick={handleClose}>
          <img src={CloseIcon} alt="close" width={20} height={20} />
        </button>
      </Modal.Header>
      <Modal.Body className={classes}>
        <img src={icon} alt={type} width={88} height={88} />
        <p>{message || ''}</p>
      </Modal.Body>
      <Modal.Footer className={Styles.modalFooter}>
        <Button variant="primary" onClick={handleClose}>
          Aceptar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalAlert;
