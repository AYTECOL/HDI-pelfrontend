import React from 'react';
import classNames from 'classnames';

import './ParticipationPercentage.scss';
import { isTotalValid } from '../popups/persona/ParticipationPercentages/utils';

/**
 *
 * @param {{
 *  persons: { person: any, key: number }[],
 *  name: string,
 *  getPercentage: (person:any) => React.ReactNode,
 *  showEdit: boolean,
 *  showView: boolean,
 *  togglePopUpPersona: Function,
 *  togglePopUpDelete: Function,
 * }} props
 */
const ParticipationPercentage = (props) => {
  const { name, persons, getPercentage = () => null } = props;
  const total = persons.reduce((p, c) => p + (getPercentage(c.person) || 0), 0);
  const totalValid = isTotalValid(total);
  return (
    <div className="row item-select">
      <div className="col col-custom col-1 d-flex align-items-center">
        <div className="icon-image">&nbsp</div>
      </div>
      <div className="col col-2 col-custom d-flex align-items-center">
        <div>
          <span>Rol</span>
          <p className="font-weight-bold">{name}</p>
        </div>
      </div>
      <div className="col p-0">
        <table
          className="table table-sm table-borderless mb-0"
          style={{ tableLayout: 'fixed' }}
        >
          <thead className="table-titles">
            <tr>
              <th scope="col" width="23%">
                Identificación
              </th>
              <th scope="col">Nombre y apellido</th>
              <th scope="col" className="col-percentage">
                % Benef
              </th>
              <th scope="col" className="text-center">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {persons.map(({ person, key }) => {
              return (
                <tr key={key}>
                  <td>{person['value']}</td>
                  <td className="text-truncate">
                    {person['name']} {person['lastname']}
                  </td>
                  <td className="text-center">{getPercentage(person) || 0} %</td>
                  <td>
                    <div className="col actions pt-0">
                      {props.showEdit === true && (
                        <p>
                          <i onClick={props.togglePopUpPersona(key)}>
                            Modificar
                          </i>
                          <span
                            className="trash"
                            onClick={props.togglePopUpDelete(key)}
                          >
                            &nbsp;
                          </span>
                        </p>
                      )}
                      {props.showView === true && (
                        <p className="viewDetails">
                          <i onClick={props.togglePopUpPersona(key)}>
                            Ver Detalles
                          </i>
                        </p>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
            <tr>
              <td></td>
              <td></td>
              <td>
                <div className="text-center total-percentage">
                  <div className={classNames(!totalValid && 'error')}>
                    Total: {total}%
                  </div>
                </div>
              </td>
              <td></td>
            </tr>
          </tbody>
        </table>

        {!totalValid && (
          <div className="total-percentage error text-center">
            La sumatoria del % de Participación debe ser igual al 100%
          </div>
        )}
      </div>
    </div>
  );
};

export default ParticipationPercentage;
