import React from 'react';
import classNames from 'classnames';

import { roles } from '../constants';
import ParticipationPercentage from './ParticipationPercentage';
import { fieldsNames } from '../popups/persona/constants';
import { someRole } from '../../utils';

/**
 *
 * @param {{ persons: any[] }} props
 */
const Card = (props) => {
  const { showEdit, showView, togglePopUpPersona, togglePopUpDelete } = props;

  const persons = [];
  const obsequies = [];
  const personalAccidents = [];

  props.persons.forEach((person, key) => {
    const value = { person, key };
    const hasRole = someRole(person.role);
    const hasObsequies = hasRole(roles.obsequies);
    const hasPersonalAccidents = hasRole(roles.personalAccidents);
    if (
      hasRole(roles.beneficiary) ||
      hasRole(roles.insured) ||
      hasRole(roles.taker)
    )
      persons.push(value);
    if (hasObsequies) obsequies.push(value);
    if (hasPersonalAccidents) personalAccidents.push(value);
  });

  const percentageProps = {
    showEdit,
    showView,
    togglePopUpPersona,
    togglePopUpDelete,
  };
  return (
    <div className="row">
      <div className="col wrapper-more-selected">
        {persons.map(({ person, key }) => {
          /**
           * @type {number[]}
           */
          const personRoles = person.role;

          const showAddress = [
            roles.beneficiary,
            roles.insured,
            roles.taker,
          ].some(someRole(personRoles));
          const showCol = showAddress;

          return (
            <div key={key} className="row item-select">
              <div className="col col-custom col-1">
                <div className="icon-image">&nbsp</div>
              </div>
              <div className="col col-custom">
                <span>Rol</span>
                <p className="font-weight-bold">
                  {person['role'].indexOf(roles.taker) !== -1 ? 'Tomador ' : ''}
                </p>
                <p className="font-weight-bold">
                  {person['role'].indexOf(roles.insured) !== -1
                    ? 'Asegurado '
                    : ''}
                </p>
                <p className="font-weight-bold">
                  {person['role'].indexOf(roles.beneficiary) !== -1
                    ? 'Beneficiario '
                    : ''}
                </p>
                <p className="font-weight-bold">
                  {person['role'].indexOf(roles.onerousBeneficiary) !== -1
                    ? 'Beneficiario oneroso '
                    : ''}
                </p>
              </div>
              <div className="col col-custom col-sm-2 col-md-2">
                <span>Identificación</span>
                <p>{person['value']}</p>
              </div>
              {parseInt(person['code']) === 37 ? (
                <div className={classNames('col', !showCol && 'col-sm-5')}>
                  <span>Razón social</span>
                  <p>{person['businessname']}</p>
                </div>
              ) : (
                <div className={classNames('col name', !showCol && 'col-sm-5')}>
                  <span>Nombre y apellido</span>
                  <p>
                    {person['name']} {person['lastname']}
                  </p>
                </div>
              )}
              {showAddress && (
                <div className="col col-custom col-sm-3 col-md-3">
                  <span>Dirección</span>
                  <p>{person['address']}</p>
                </div>
              )}
              <div className="col col-custom actions">
                {props.showEdit === true && (
                  <p>
                    <i onClick={props.togglePopUpPersona(key)}>Modificar</i>
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
                    <i onClick={props.togglePopUpPersona(key)}>Ver Detalles</i>
                  </p>
                )}
              </div>
            </div>
          );
        })}
        {!!obsequies.length && (
          <ParticipationPercentage
            persons={obsequies}
            name={'Exequias'}
            {...percentageProps}
            getPercentage={(person) => {
              return person[fieldsNames.exequiasParticipation];
            }}
          />
        )}
        {!!personalAccidents.length && (
          <ParticipationPercentage
            persons={personalAccidents}
            name={'Accidentes personales'}
            {...percentageProps}
            getPercentage={(person) => {
              return person[fieldsNames.personalAccidents];
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Card;
