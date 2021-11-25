import React from 'react';
import PropTypes from 'prop-types';

import styles from './Marker.module.scss';

const Marker = ({ text, onClick }) => (
  <div className={styles.root} alt={text} onClick={onClick}>
    <img
      alt=""
      src="https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi2.png"
      draggable="false"
      className={styles.marker}
    />
  </div>
);

Marker.defaultProps = {
  onClick: null,
};

Marker.propTypes = {
  onClick: PropTypes.func,
  text: PropTypes.string.isRequired,
};

export default Marker;
