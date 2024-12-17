import classNames from 'classnames';
import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
/**
 *
 * @param {string} type - Type input email, text, number, etc
 * @param {string} label - Label input
 * @param {boolean} disabled - Disabled input
 */
const Input = React.forwardRef(
  (
    {
      type = 'text',
      label = '',
      name = '',
      onBlurCustom,
      disabled = false,
      ...rest
    },
    ref
  ) => {
    const { control } = useFormContext();

    return (
      <Controller
        name={name}
        control={control}
        render={({ field, formState: { errors } }) => {
          const error = errors?.[name]?.message || null;
          if (onBlurCustom) {
            field.onBlur = (e) => onBlurCustom(e);
          }
          return (
            <div className={classNames('form-group ', error && 'error')}>
              <label htmlFor={label}>{label}</label>
              <input
                ref={ref}
                type={type}
                disabled={disabled}
                className={classNames(
                  `form-control ${!rest.value ? 'not-value' : ''}`,
                  disabled && 'disabled'
                )}
                {...field}
                {...rest}
              />
              {error && (
                <small className="form-text only-errors">{error}</small>
              )}
            </div>
          );
        }}
      />
    );
  }
);

export default Input;
