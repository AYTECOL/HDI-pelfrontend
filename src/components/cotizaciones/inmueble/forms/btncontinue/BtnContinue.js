import React, { Component, Fragment } from 'react';

import store from '../../../../../store';
import { withRouter } from 'react-router-dom';

import CreateOrUpdateValoration from 'services/CreateOrUpdateValoration';
import QuoteService from 'services/Quote';
import CreateAuditData from 'services/Audit';

import { NextStep, setPropertyValidation } from 'store/actions';
import Helpers from 'common/helpers/helpers';
// Components
import Segurarinmueble from '../segurarinmueble/Segurarinmueble';
import Asegurarcontenidos from '../asegurarcontenidos/Asegurarcontenidos';
import Asegurarjoyas from '../asegurarjoyas/Asegurarjoyas';
import MobileContents from '../MobileContents';
import Asegurarobras from '../asegurarobras/Asegurarobras';
import Asegurartelefonos from '../asegurartelefonos/Asegurartelefonos';
import { UrlSite } from '../../../../../config';
import Loading from '../../../../globals/loading/Loading';
import OtherQuestions from '../OtherQuestions';
import PropertyNotAllowed from '../../../../PropertyNotAllowed';
import clsx from 'clsx';
import ModalAlert from 'components/globals/Modal';
import { OPTIONS_TYPES_RISK } from 'assets/constants';

import arrow_back from '../../../../../assets/images/icon-back.svg';

class BtnContinue extends Component {
  constructor(props) {
    super(props);
    this.state = {
      disabled: false,
      notContinueQuotation: false,
      propertyNotAllowed: false,
    };
  }

  saveService = async () => {
    Loading.toggle(true);
    await QuoteService.save();
    await CreateOrUpdateValoration.save();
    Helpers.goToHome(this.props.history);
  };

  goBack = async () => {
    Loading.toggle(true);
    store.dispatch(NextStep(1));
    await QuoteService.save();
    await CreateOrUpdateValoration.save();
    this.props.history.push(
      UrlSite + '/cotizacion/1/' + this.props.match.params.id
    );
  };

  saveServiceContinue = async () => {
    let storeState = store.getState();
    await store.dispatch(setPropertyValidation(true));

    let errors = 0;
    let inmueble = storeState.Inmueble;

    if (inmueble.type_risk === 2 && (inmueble.pisonumero == '' || inmueble.pisonumero == 0)) {
      Helpers.addClass('.pisonumero', 'error');
      errors++;
    } else {
      Helpers.removeClass('.pisonumero', 'error');
    }

    if (inmueble.numerodepisos == '' || inmueble.numerodepisos == 0) {
      Helpers.addClass('.numerodepisos', 'error');
      errors++;
    } else {
      Helpers.removeClass('.numerodepisos', 'error');
    }

    if (inmueble.zona == '' || inmueble.zona == 0) {
      Helpers.addClass('.zona', 'error');
      errors++;
    } else {
      Helpers.removeClass('.zona', 'error');
    }

    if (inmueble.anoconstruido == '' || inmueble.anoconstruido == 0) {
      Helpers.addClass('.anoconstruido', 'error');
      errors++;
    } else {
      Helpers.removeClass('.anoconstruido', 'error');
    }

    if (inmueble.construidocon == '' || inmueble.construidocon == 0) {
      Helpers.addClass('.construidocon', 'error');
      errors++;
    } else {
      Helpers.removeClass('.construidocon', 'error');
    }

    if (inmueble.cojuntocerrado == '' || inmueble.cojuntocerrado == 0) {
      Helpers.addClass('.cojuntocerrado', 'error');
      errors++;
    } else {
      Helpers.removeClass('.cojuntocerrado', 'error');
    }

    if (inmueble.refuerzo === 1) {
      if (inmueble.anorefuerzo == '' || inmueble.anorefuerzo == 0) {
        Helpers.addClass('.anorefuerzo', 'error');
        errors++;
      } else {
        Helpers.removeClass('.anorefuerzo', 'error');
      }
    }

    if (
      inmueble.inmuebleasegudado === 0 &&
      (inmueble.contenidoasegudado === 0 || inmueble.contenidoasegudado == '')
    ) {
      Helpers.addClass('.inmuebleasegudado', 'error');
      Helpers.addClass('.contenidoasegudado', 'error');
      errors++;
    } else {
      Helpers.removeClass('.inmuebleasegudado', 'error');
      Helpers.removeClass('.contenidoasegudado', 'error');
    }

    if (inmueble.inmuebleasegudado === 1) {
      if (
        Segurarinmueble.validateField(inmueble.inmuebleasegudadovalor) !== 0
      ) {
        Helpers.addClass('.inmuebleasegudadovalor', 'error');
        errors++;
      } else {
        Helpers.removeClass('.inmuebleasegudadovalor', 'error');
      }
    }

    if (inmueble.contenidoasegudado === 1) {
      if (
        Asegurarcontenidos.validateField(inmueble.contenidoasegudadovalor) !== 0
      ) {
        Helpers.addClass('.contenidoasegudadovalor', 'error');
        errors++;
      } else {
        Helpers.removeClass('.contenidoasegudadovalor', 'error');
      }
    }

    if (inmueble.inmuebleasegudadojoyas === 1) {
      if (
        Asegurarjoyas.validateField(inmueble.inmuebleasegudadojoyasvalor) !== 0
      ) {
        Helpers.addClass('.inmuebleasegudadojoyasvalor', 'error');
        errors++;
      } else {
        Helpers.removeClass('.inmuebleasegudadojoyasvalor', 'error');
      }
    }
    if (inmueble[MobileContents.nameModel] === 1) {
      if (
        MobileContents.validateField(
          inmueble[MobileContents.nameModelValue]
        ) !== 0
      ) {
        Helpers.addClass(`${MobileContents.nameModel}`, 'error');
        errors++;
      } else {
        Helpers.removeClass(`${MobileContents.nameModel}`, 'error');
      }
    }

    if (inmueble.inmuebleasegudadoobras === 1) {
      if (
        Asegurarobras.validateField(inmueble.inmuebleasegudadoobrasvalor) !== 0
      ) {
        Helpers.addClass('.inmuebleasegudadoobrasvalor', 'error');
        errors++;
      } else {
        Helpers.removeClass('.inmuebleasegudadoobrasvalor', 'error');
      }
    }

    if (inmueble.inmuebleasegudadotelefonos === 1) {
      if (
        Asegurartelefonos.validateField(
          inmueble.inmuebleasegudadotelefonosvalor
        ) !== 0
      ) {
        Helpers.addClass('.inmuebleasegudadotelefonosvalor', 'error');
        errors++;
      } else {
        Helpers.removeClass('.inmuebleasegudadotelefonosvalor', 'error');
      }
    }

    const otherQuestions = inmueble[OtherQuestions.nameModelValue];
    const unansweredQuestions =
      OtherQuestions.unansweredQuestions(otherQuestions);
    const validateField = OtherQuestions.validateField(otherQuestions);

    if (unansweredQuestions || !validateField) {
      errors++;
    }

    let disabled = errors !== 0;
    if (disabled) {
      const element = document.querySelector('.error');
      element &&
        element.scrollIntoView({
          behavior: 'smooth',
        });
      if (!unansweredQuestions && !validateField) {
        this.setState({ propertyNotAllowed: true });
      }
    } else {
      Loading.toggle(true);
      store.dispatch(NextStep(3));
      const {
        quote_created: { infoGeocodingSig },
      } = await QuoteService.save();
      const { identification, number, fecha_cotizacion } =
        store.getState().cotizacion;
      let body = {
        opcion: 'descripción inmueble / botón continuar',
        identificacion: identification.value,
        id_ciudad: identification.city,
        id_departamento: identification.department,
        riesgo: identification.address,
        fecha_cotizacion: fecha_cotizacion,
        cotizacion: number,
      };
      await CreateAuditData.createDataAudit(body);
      const NotInsured =
        infoGeocodingSig &&
        infoGeocodingSig.features[0]?.attributes.AMENAZA_INUNDACION ===
          'NO ASEGURABLE';
      if (
        (OPTIONS_TYPES_RISK.HOUSE === inmueble.type_risk && NotInsured) ||
        (OPTIONS_TYPES_RISK.APARTMENT === inmueble.type_risk &&
          NotInsured &&
          +inmueble.pisonumero === 1)
      ) {
        this.setState({ ...this.state, notContinueQuotation: true });
        Loading.toggle(false);
      } else {
        await CreateOrUpdateValoration.save();
        this.props.history.push(
          UrlSite + '/cotizacion/3/' + storeState.cotizacion.number
        );
      }
    }
  };

  render() {
    const { propertyNotAllowed } = this.state;
    return (
      <Fragment>
        <div className={'return-button'}>
          <button className="btn btn-link" type="button" onClick={this.goBack}>
            <i className="back-icon">
              <img src={arrow_back} alt="" />
            </i>
            Volver
          </button>
        </div>
        <button
          type="button"
          className={'btn btn-default btn-default--two'}
          onClick={this.saveService}
        >
          Guardar y salir
        </button>
        <button
          type="button"
          disabled={this.state.disabled}
          onClick={this.saveServiceContinue}
          className={clsx(
            'btn btn-primary',
            (this.state.disabled || this.state.notContinueQuotation) &&
              'disabled'
          )}
        >
          Continuar
        </button>
        <PropertyNotAllowed
          open={propertyNotAllowed}
          onClose={() => {
            this.setState({ propertyNotAllowed: false });
          }}
        />
        <ModalAlert
          type="warning"
          show={this.state.notContinueQuotation}
          message={
            <>
              Lo sentimos, no podemos entregar <br />
              la cotización en este momento
              <br />
              <span>
                La ubicación del riesgo está restringida por{' '}
                <strong>innundación</strong>{' '}
              </span>
            </>
          }
          handleClose={() =>
            this.setState({ ...this.state, notContinueQuotation: false })
          }
        />
      </Fragment>
    );
  }
}

export default withRouter(BtnContinue);
