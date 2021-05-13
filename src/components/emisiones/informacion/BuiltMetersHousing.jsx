import React from 'react';

export const validate = (newValue) =>
  !isNaN(parseFloat(newValue)) && +newValue > 0;
export function BuiltMetersHousing({ value, onChange }) {
  const handleChange = ({ target: { value } }) => {
    const valid = validate(value);
    if (valid || !value)
      onChange({
        value,
      });
    if (!valid) {
      onChange({
        value: '',
      });
    }
  };
  return (
    <div className="form-group ">
      <label htmlFor="area">
        Metros construidos de vivienda (m2) (Opcional)
      </label>
      <input
        type="number"
        className="form-control number"
        name="area"
        value={value}
        onInput={handleChange}
        onChange={handleChange}
        placeholder={'Ingresa el tamaño de la vivienda'}
      />
      <small>Ingresa la información en M2</small>
    </div>
  );
}
