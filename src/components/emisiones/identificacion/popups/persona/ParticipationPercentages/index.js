import React from 'react';
import classNames from 'classnames';

import './styles.scss';
import { fieldsNames } from '../constants';
import { getMaxParticipationPercentage } from './utils';

const { personalAccidents, exequiasParticipation } = fieldsNames;

/**
 * @typedef {({ value: number, name: string }) => void} OnChange
 *
 * @typedef {import('./utils').Person} Person
 */

/**
 * @param {{
 *  person: Person, persons: Person[], item: number, onChange: OnChange, isActived: (field: boolean) => boolean
 * }} props
 */
export const ParticipationPercentages = (props) => {
  const { person, persons, item, isActived } = props;
  const max = getMaxParticipationPercentage(
    persons.filter((_p, i) => i !== item)
  );
  const min = 1;
  /**
   * @type {(event: React.ChangeEvent<HTMLInputElement>) => void}
   */
  const onChange = ({ target: { name, value } }) => {
    let newValue = (value && Number(value)) || value;
    newValue = newValue <= max[name] ? newValue : max[name];
    props.onChange({ name, value: newValue });
  };
  return (
    <div className="col col-12">
      <div className="form-group participation-percentages">
        <label className="font-weight-normal my-3 text-center">
          Porcentajes de participación
        </label>
        <div className="row mt-2">
          {[
            { label: 'Accidentes Personales', name: personalAccidents },
            { label: 'Exequias', name: exequiasParticipation },
          ].map(({ label, name }, i) => {
            const value = person[name];
            return (
              isActived(name) && (
                <div className="col" key={i}>
                  <div
                    className={classNames('form-group', {
                      error:
                        (value && min > Number(value)) || value > max[name],
                    })}
                  >
                    <label>{label}</label>
                    <input
                      type="number"
                      className="form-control"
                      name={name}
                      value={value}
                      onChange={onChange}
                    />
                  </div>
                </div>
              )
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ParticipationPercentages;
