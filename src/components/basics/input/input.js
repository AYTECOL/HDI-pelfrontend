import classNames from 'classnames';
import Help from 'components/globals/icons/help';
import { Tooltip } from 'components/Tooltip';
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
      description = '',
      tooltip = false,
      percentage = false,
      ...rest
    },
    ref
  ) => {
    const { control } = useFormContext();

    const tooltipTitle =
      'Relacionar los beneficiarios finales con 5% o más del capital social, aporte, participación, o que posee control directa o indirectamente.';

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
              <div className="form-group tooltip-container">
                <label htmlFor={label}>{label}</label>
                {tooltip && (
                  <Tooltip
                    className={'ml-auto'}
                    placement="left"
                    title={tooltipTitle}
                    wide={true}
                  >
                    <Help className={'ml-auto icon-primary'} />
                  </Tooltip>
                )}
              </div>

              <div className={percentage ? "input-with-percent" : ""}>
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
              </div>
              <div className="form-group message-container">
                <span className="form-group message-help">{description}</span>
                {error && (
                  <small className="form-text only-errors">{error}</small>
                )}
              </div>
            </div>
          );
        }}
      />
    );
  }
);

export default Input;
