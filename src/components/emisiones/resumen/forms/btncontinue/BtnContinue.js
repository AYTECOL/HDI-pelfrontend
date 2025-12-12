import React, { Component, Fragment } from 'react';

import { withRouter } from 'react-router-dom';
import { UrlSite } from 'config';
import Helpers from 'common/helpers/helpers';
import PolicyService from 'services/Policy';
import Loading from 'components/globals/loading/Loading';
import store from 'store';
import {
  NextStep,
  saveIdentificationValue,
  saveAttachedFile,
  mapForceRetry,
} from 'store/actions';
import QuoteService from 'services/Quote';
import Crearpolizaiaxis from 'services/Crearpolizaiaxis';
import CreateAuditData from 'services/Audit';

import QuoteIussedById from 'services/QuoteIussedById';
import IssuedCounter from 'services/IssuedCounter';
import AttachPolicyDocuments from 'services/AttachPolicyDocuments';
import GetQuoteService from 'services/GetQuote';

import arrow_back from '../../../../../assets/images/icon-back.svg';

import ValidatePersonIdentity from 'components/ValidatePersonIdentity';

// Coordenadas válidas: no null, no vacío, no 0 (como número)
const hasValidCoordinates = (mapOptions) => {
  if (!mapOptions) return false;

  const { latitude, longitude } = mapOptions;

  // null / undefined / vacío
  if (
    latitude === null ||
    longitude === null ||
    typeof latitude === 'undefined' ||
    typeof longitude === 'undefined' ||
    latitude === '' ||
    longitude === ''
  ) {
    return false;
  }

  const latNum = Number(latitude);
  const lngNum = Number(longitude);

  // no numérico o 0
  if (!Number.isFinite(latNum) || !Number.isFinite(lngNum)) return false;
  if (latNum === 0 || lngNum === 0) return false;

  return true;
};

const shouldShowRetryModal = (mapOptions) => {
  const invalidCoords = !hasValidCoordinates(mapOptions);

  return invalidCoords;
};

class BtnContinue extends Component {
  constructor(props) {
    super(props);
    this.state = {
      step: parseInt(this.props.match.params.step),
      continueButtonDisable: false,
      stateFormIdentificacion: 0,
      cotizacionExclude: [],
      plan: this.props.plan,
      showRetryModal: false,
      maxRetriesReached: false,
      retryAttempts: 0,
    };
  }

  goBack = () => {
    this.props.history.push(
      UrlSite + '/emision/2/' + this.props.match.params.id
    );
  };

  saveAndExit = () => {
    Helpers.goToHome(this.props.history);
  };

  getPolicyEmitedNumber = (emmitedPolicy) => {
    const { policy } = emmitedPolicy;
    const { emissionId } = policy || {};
    return emissionId;
  };

  nextStep = async (isRetry = false) => {
    const { match, history } = this.props;
    const { params } = match;
    const { id } = params;
    const exceptionSarlaft = store.getState().exceptionSarlaft;
    const mapOptions = store.getState().mapsOptions;
    const auth = store.getState().auth;

    // 1) Validar condiciones para mostrar modal (coords inválidas o dirección "0"/"null")
    if (shouldShowRetryModal(mapOptions)) {
      console.log(
        'Emisión bloqueada: coordenadas inválidas o dirección inválida. Mostrando modal de reintento.'
      );

      this.setState({
        ...this.state,
        continueButtonDisable: false,
        showRetryModal: true,
      });

      return; // NO seguimos al flujo de emisión
    }

    Loading.toggle(true);
    try {
      this.setState({
        ...this.state,
        continueButtonDisable: true,
      });
      let data = await QuoteIussedById.get(this.props.match.params.id);
      let cotizacion = await GetQuoteService.getById(
        this.props.match.params.id
      );
      let userAuthCotiza = window.localStorage.getItem('authUserCotiza');

      let body = {
        opcion: 'emisión / éxito',
        identificacion: cotizacion.identification.value,
        id_ciudad: cotizacion.identification.city,
        id_departamento: cotizacion.identification.department,
        riesgo: cotizacion.identification.address,
        fecha_cotizacion: cotizacion.fecha_cotizacion,
        cotizacion: cotizacion.number,
        prima: this.props.plan[0].prospect,
      };
      cotizacion = cotizacion.identification;

      let numeroPoliza = {
        currentValue: 0,
      };

      if (
        !(
          typeof cotizacion.emissionId !== 'undefined' &&
          cotizacion.emissionI !== null &&
          cotizacion.emissionI !== ''
        )
      ) {
        let date = new Date();

        numeroPoliza = await IssuedCounter.get();
        let dataSend = await Crearpolizaiaxis.get(data);

        dataSend['id'] = id;
        let result = await PolicyService.emit(id, dataSend);
        result = result.policyReq;
        await PolicyService.emitSarlaftJuridicPerson(data);
        result.crearPolizaIAXISRq.poliza.datosPolizaHome.datosGestion.numeroPoliza =
          numeroPoliza.currentValue.toString();
        result.crearPolizaIAXISRq.poliza.datosPolizaHome.datosGestion.numeroRecibo =
          numeroPoliza.currentValue.toString();
        const newQuestionCotizacion = {
          pregunta: {
            codigo: '8907',
          },
          respuesta: {
            valor: `${userAuthCotiza}`,
          },
        };
        const newQuestionEmision = {
          pregunta: {
            codigo: '8908',
          },
          respuesta: {
            valor: `${auth.usuario}`,
          },
        };
        result.crearPolizaIAXISRq.poliza.datosPolizaHome.preguntaPoliza.push(
          newQuestionCotizacion
        );
        result.crearPolizaIAXISRq.poliza.datosPolizaHome.preguntaPoliza.push(
          newQuestionEmision
        );
        if (exceptionSarlaft) {
          const questionSarlaft = {
            pregunta: {
              codigo: '7906',
            },
            respuesta: {
              valor: '7',
            },
          };
          result.crearPolizaIAXISRq.poliza.datosPolizaHome.preguntaPoliza.push(
            questionSarlaft
          );
        }
        console.log("Coordenadas a enviar a IAXIS - preguntas 7836 y 7837 - (Obtenidas del store global y previamente de la API de GOOGLE): ", mapOptions);
        if (hasValidCoordinates(mapOptions)) {
          const questionMapOptionsLongitude = {
            pregunta: {
              codigo: '7836',
            },
            respuesta: {
              valor: `${mapOptions.longitude}`,
            },
          };
          const questionMapOptionsLatitude = {
            pregunta: {
              codigo: '7837',
            },
            respuesta: {
              valor: `${mapOptions.latitude}`,
            },
          };
          result.crearPolizaIAXISRq.poliza.datosPolizaHome.preguntaPoliza.push(
            questionMapOptionsLongitude
          );
          result.crearPolizaIAXISRq.poliza.datosPolizaHome.preguntaPoliza.push(
            questionMapOptionsLatitude
          );
        }

        let send = await Crearpolizaiaxis.save(result);
        let attachedFile = false;
        try {
          const attach = await AttachPolicyDocuments.get(
            id,
            send.crearPolizaIAXISRs.emisionPoliza.resultadoPolizaHome
              .codigoProcesoCargue
          );
          await AttachPolicyDocuments.save(attach);
          attachedFile = true;
        } catch (error) {
          attachedFile = false;
        }
        await store.dispatch((dispatch) => {
          dispatch(saveAttachedFile(attachedFile));
          dispatch(
            saveIdentificationValue({
              name: 'emissionId',
              value: numeroPoliza.currentValue,
            })
          );
          dispatch(
            saveIdentificationValue({
              name: 'emitedDate',
              value: date,
            })
          );
          return Promise.resolve();
        });
      } else {
        numeroPoliza.currentValue = cotizacion.emissionId;
      }

      store.dispatch(NextStep(7));
      body.poliza = numeroPoliza.currentValue;

      await CreateAuditData.createDataAudit(body);
      await QuoteService.save();
      history.push(`${UrlSite}/exito/${id}/${numeroPoliza.currentValue}`);

      Loading.toggle(false);
    } catch (e) {
      console.error('NEXT STEP: ', e);
      this.setState({
        ...this.state,
        continueButtonDisable: false,
      });
      Loading.toggle(false);
    }
  };

  handleRetry = () => {
    const { retryAttempts } = this.state;

    if (retryAttempts >= 3) {
      this.setState((prev) => ({
        ...prev,
        maxRetriesReached: true,
        showRetryModal: true, // sigue viendo el modal, pero sin botón de reintentar
      }));
      return;
    }

    store.dispatch(mapForceRetry());
    this.setState(
      (prev) => ({ ...prev, showRetryModal: false, retryAttempts: prev.retryAttempts + 1, }));
  };

  render() {
    const { props, state } = this;
    const disabled = props.continueButtonDisable || state.continueButtonDisable;
    const mapsOptions = store.getState().mapsOptions;
    const retryAttempts = state.retryAttempts;
    return (
      <Fragment>
        <div className={'return-button'}>
          <button type="button" className="btn btn-link" onClick={this.goBack}>
            <i className="back-icon">
              <img src={arrow_back} alt="" />
            </i>
            Volver
          </button>
        </div>
        <button
          type="button"
          className={'btn btn-default btn-default--two'}
          onClick={this.saveAndExit}
        >
          Guardar y salir
        </button>
        <button
          type="button"
          className={`btn ${disabled ? 'disabled' : 'btn-primary'}`}
          disabled={disabled}
          onClick={this.nextStep}
        >
          Emitir
        </button>
        <ValidatePersonIdentity
          subtittle={
            retryAttempts < 3 && !state.maxRetriesReached ? 'Por favor, intenta nuevamente a través del boton Reintentar, Si el error persiste, por favor retoma la cotizacion en unos minutos desde Mis negocios' : 'Por favor retoma la cotizacion en unos minutos desde Mis negocios'
          }
          idPolicy={this.props.match.params.id}
          tittle={'Ups, lo sentimos'}
          message={`Tenemos un problema técnico en este momento`}
          button={retryAttempts < 3 && !state.maxRetriesReached}
          open={state.showRetryModal}
          onRetry={this.handleRetry}
        />
      </Fragment>
    );
  }
}

export default withRouter(BtnContinue);