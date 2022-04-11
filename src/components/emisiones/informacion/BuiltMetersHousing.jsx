import React from 'react';
import validator from 'validator';

export const validate = (newValue) =>
  validator.isNumeric(newValue) && +newValue > 0;

export function BuiltMetersHousing({ value, onChange }) {
  const handleChange = ({ target: { value: newValue } }) => {
    const valid = validate(newValue);
    onChange({
      value: valid || !newValue ? newValue : '',
    });
  };
  return (
    <div className="form-group ">
      <label htmlFor="area">
        Metros construidos de vivienda (m2) (Opcional)
      </label>
      <input
        type="text"
        className="form-control number"
        name="area"
        value={value}
        onChange={handleChange}
        placeholder={'Ingresa el tamaño de la vivienda'}
      />
      <small>Ingresa la información en M2</small>
    </div>
  );
}
