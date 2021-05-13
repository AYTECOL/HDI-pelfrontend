import React from 'react';

export const validate = (newValue) => !isNaN(parseFloat(newValue));
export function BuiltMetersHousing({ value, onChange }) {
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
        onChange={({ target: { value } }) => {
          const valid = validate(value) || !value;
          if (valid)
            onChange({
              value,
            });
        }}
        placeholder={'Ingresa el tamaño de la vivienda'}
      />
      <small>Ingresa la información en M2</small>
    </div>
  );
}
