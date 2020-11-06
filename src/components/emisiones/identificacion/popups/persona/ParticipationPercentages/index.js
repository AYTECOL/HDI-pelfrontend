import React from 'react';

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
        <label>Porcentajes de participación para las coberturas</label>
        <div className="row">
          {isActived(personalAccidents) && (
            <div className="col">
              <div className="form-group">
                <label>Accidentes Personales</label>
                <input
                  type="number"
                  className="form-control"
                  name={personalAccidents}
                  value={person[personalAccidents]}
                  onChange={onChange}
                />
              </div>
            </div>
          )}
          {isActived(exequiasParticipation) && (
            <div className="col">
              <div className="form-group">
                <label>Accidentes Personales</label>
                <input
                  type="number"
                  className="form-control"
                  name={exequiasParticipation}
                  value={person[exequiasParticipation]}
                  onChange={onChange}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ParticipationPercentages;
