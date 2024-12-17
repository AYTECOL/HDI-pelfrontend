import React from 'react';
import moment from 'moment';
import classNames from 'classnames';
import DatePicker from 'react-datepicker';
import es from 'react-datepicker/node_modules/date-fns/esm/locale/es/index';

import { fieldsNames } from './constants';
export const DateInput = (props) => {
  const participationPercentages =
    props.isActived(fieldsNames.personalAccidents) ||
    props.isActived(fieldsNames.exequiasParticipation);
  const initialDate = moment().subtract(18, 'years').toDate();
  const { fechadenacimiento, fechadenacimientoDisabled } = props.person;
  const showDateError =
    participationPercentages && +new Date(fechadenacimiento) > +initialDate;
  const className = props.hasErrorAddClass('fechadenacimiento');
  let selected = initialDate;
  if (fechadenacimiento) {
    const date = moment(fechadenacimiento, 'YYYY-MM-DD');
    if (date.isValid()) {
      selected = date.toDate();
    }
  }

  return (
    <div className={classNames('fechadenacimiento form-group ', className)}>
      <label htmlFor="fechadenacimiento">Fecha de nacimiento</label>
      <DatePicker
        locale={es}
        name="fechadenacimiento"
        selected={selected}
        value={fechadenacimiento}
        dateFormat="yyyy-MM-dd"
        onChange={props.changeDates}
        showMonthDropdown
        showYearDropdown
        scrollableYearDropdown
        yearDropdownItemNumber={100}
        maxDate={new Date()}
        startDate={moment().subtract(18, 'years').toDate()}
        disabled={fechadenacimientoDisabled}
        className={
          `form-control ${!fechadenacimiento ? 'not-value' : ''}` +
          (fechadenacimientoDisabled ? 'disabled' : '')
        }
      />
      <small className="form-text only-errors">
        Falta información requerida para el Tomador. Por favor revise el campo
        Fecha de nacimiento
      </small>
      {showDateError && (
        <small
          className={classNames('form-text', showDateError && 'error-label')}
        >
          Se sugiere que el beneficiario sea mayor de 18 años
        </small>
      )}
    </div>
  );
};
