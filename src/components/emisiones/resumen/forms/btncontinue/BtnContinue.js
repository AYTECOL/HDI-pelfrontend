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
} from 'store/actions';
import QuoteService from 'services/Quote';
import Crearpolizaiaxis from 'services/Crearpolizaiaxis';
import CreateAuditData from 'services/Audit';

import QuoteIussedById from 'services/QuoteIussedById';
import IssuedCounter from 'services/IssuedCounter';
import AttachPolicyDocuments from 'services/AttachPolicyDocuments';
import GetQuoteService from 'services/GetQuote';

import arrow_back from '../../../../../assets/images/icon-back.svg';

class BtnContinue extends Component {
  constructor(props) {
    super(props);
    this.state = {
      step: parseInt(this.props.match.params.step),
      continueButtonDisable: false,
      stateFormIdentificacion: 0,
      cotizacionExclude: [],
      plan: this.props.plan,
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

  nextStep = async () => {
    const { match, history } = this.props;
    const { params } = match;
    const { id } = params;
    const exceptionSarlaft = store.getState().exceptionSarlaft;
    const mapOptions = store.getState().mapsOptions;
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
        if (
          mapOptions &&
          'longitude' in mapOptions &&
          'latitude' in mapOptions
        ) {
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

  render() {
    const { props, state } = this;
    console.log('props', props);
    const disabled = props.continueButtonDisable || state.continueButtonDisable;
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
      </Fragment>
    );
  }
}

export default withRouter(BtnContinue);
