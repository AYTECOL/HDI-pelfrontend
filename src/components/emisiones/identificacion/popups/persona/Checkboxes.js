import React, { Component } from 'react';
import './Persona.scss';
import 'react-datepicker/dist/react-datepicker.css';

export default class Checkboxes extends Component {
  changeRole = (role) => (e) => {
    const { person } = this.props;
    let roles = person['role'];
    if (!e.target.checked) {
      let index = roles.indexOf(role);
      roles.splice(index, 1);
    } else {
      roles.push(role);
    }
    this.props.changeValue({
      target: {
        name: 'role',
        value: [...new Set(roles)],
      },
    });
  };

  render() {
    const { typePerson, person } = this.props;
    return (
      <React.Fragment>
        <div
          className={
            'row items-checkboxes justify-content-center type-person-class-' +
            person['role'].length
          }
        >
          {typePerson === 1 && (
            <React.Fragment>
              {(this.props.exitsTomador === false ||
                person['role'].indexOf(1) !== -1) && (
                <div className={'col col-sm-12 col-md-4 col-lg-4 no-padding'}>
                  <input
                    type="checkbox"
                    name="tomado"
                    id="tomado"
                    value="1"
                    checked={person['role'].indexOf(1) !== -1}
                    onChange={this.changeRole(1)}
                    disabled={
                      this.props.exitsTomador ||
                      typeof this.props.disabledAll !== 'undefined'
                    }
                    className={
                      'form-control ' +
                      (this.props.exitsTomador ||
                      typeof this.props.disabledAll !== 'undefined'
                        ? 'disabled'
                        : '')
                    }
                  />
                  <label htmlFor="tomado">Tomador</label>
                </div>
              )}
            </React.Fragment>
          )}
          {(typePerson === 1 || person['role'].indexOf(2) !== -1) && (
            <div className="col col-sm-12 col-md-4 col-lg-4 no-padding">
              <input
                type="checkbox"
                name="asegurado"
                id="asegurado"
                value="2"
                checked={person['role'].indexOf(2) !== -1}
                onChange={this.changeRole(2)}
                disabled={typeof this.props.disabledAll !== 'undefined'}
                className={
                  'form-control ' +
                  (typeof this.props.disabledAll !== 'undefined'
                    ? 'disabled'
                    : '')
                }
              />
              <label htmlFor="asegurado">Asegurado</label>
            </div>
          )}
          {(typePerson === 1 || person['role'].indexOf(3) !== -1) && (
            <div className="col col-sm-12 col-md-4 col-lg-4 no-padding">
              <input
                type="checkbox"
                name="beneficiario"
                id="beneficiario"
                value="3"
                checked={person['role'].indexOf(3) !== -1}
                onChange={this.changeRole(3)}
                disabled={typeof this.props.disabledAll !== 'undefined'}
                className={
                  'form-control ' +
                  (typeof this.props.disabledAll !== 'undefined'
                    ? 'disabled'
                    : '')
                }
              />
              <label htmlFor="beneficiario">Beneficiario</label>
            </div>
          )}
          {(typePerson === 5 ||
            typePerson === 6 ||
            person['role'].indexOf(5) !== -1) && (
            <React.Fragment>
              {this.props.hasExequias === true && (
                <div className={'col col-sm-12 col-md-6 col-lg-6 no-padding '}>
                  <input
                    type="checkbox"
                    name="exequias"
                    id="exequias"
                    value="1"
                    checked={person['role'].indexOf(5) !== -1}
                    onChange={this.changeRole(5)}
                    disabled={typeof this.props.disabledAll !== 'undefined'}
                    className={
                      'form-control ' +
                      (typeof this.props.disabledAll !== 'undefined'
                        ? 'disabled'
                        : '')
                    }
                  />
                  <label htmlFor="exequias">Exequias</label>
                </div>
              )}
            </React.Fragment>
          )}
          {(typePerson === 6 ||
            typePerson === 5 ||
            person['role'].indexOf(6) !== -1) && (
            <React.Fragment>
              {this.props.hasAccident === true && (
                <div className={'col col-sm-12 col-md-6 col-lg-6 no-padding '}>
                  <input
                    type="checkbox"
                    name="accidentes"
                    id="accidentes"
                    value="3"
                    checked={person['role'].indexOf(6) !== -1}
                    onChange={this.changeRole(6)}
                    disabled={typeof this.props.disabledAll !== 'undefined'}
                    className={
                      'form-control ' +
                      (typeof this.props.disabledAll !== 'undefined'
                        ? 'disabled'
                        : '')
                    }
                  />
                  <label htmlFor="accidentes">Accidentes personales</label>
                </div>
              )}
            </React.Fragment>
          )}
          {(typePerson === 4 || person['role'].indexOf(4) !== -1) && (
            <div className="col col-sm-12 col-md-6 col-lg-6 no-padding">
              <input
                type="checkbox"
                name="oneroso"
                id="oneroso"
                value="1"
                checked={person['role'].indexOf(4) !== -1 || typePerson === 4}
                onChange={this.changeRole(4)}
                disabled={typeof this.props.disabledAll !== 'undefined'}
                className={
                  'form-control ' +
                  (typeof this.props.disabledAll !== 'undefined'
                    ? 'disabled'
                    : '')
                }
              />
              <label htmlFor="oneroso">Beneficiario oneroso</label>
            </div>
          )}
        </div>
      </React.Fragment>
    );
  }
}
