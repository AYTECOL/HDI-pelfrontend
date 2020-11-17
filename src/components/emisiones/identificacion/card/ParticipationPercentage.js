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
      <div className="col col-2 d-flex align-items-center">
        <div className="row align-items-center">
          <div className="col-sm-12 col-md-6 p-0">
            <div className="icon-image m-auto">&nbsp</div>
          </div>
          <div className="col-sm-12 col-md-6 p-0">
            <span>Rol</span>
            <p className="font-weight-bold">{name}</p>
          </div>
        </div>
      </div>
      <div className="col-10">
        <table
          className="table table-sm table-borderless mb-0"
          style={{ tableLayout: 'fixed' }}
        >
          <thead className="table-titles">
            <tr>
              <th scope="col">Identificación</th>
              <th scope="col">Nombre y apellido</th>
              <th scope="col" className="col-percentage">
                % Participación
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
                  <td className="text-center">{getPercentage(person) || 0}</td>
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
                <div className="d-flex total-percentage">
                  <div className="flex-fill">Total:</div>
                  <div className={classNames(!totalValid && 'error')}>
                    {total} %
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
