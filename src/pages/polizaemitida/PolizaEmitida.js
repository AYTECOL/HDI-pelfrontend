import React, { Component } from 'react';
import './PolizaEmitida.scss';
import SendMail from '../../components/cotizaciones/cotizacion/popups/sendmail/SendMail';
import Loading from '../../components/globals/loading/Loading';
import QuoteIussedById from '../../services/QuoteIussedById';
import GetQuote from 'services/GetQuote';
import CreateAuditData from 'services/Audit';
import PdfEndosoHogar from '../../services/PdfEndosoHogar';
import PdfPolizaHogar from '../../services/PdfPolizaHogar';
import Counter from '../../services/Counter';
import store from '../../store';
import { resetStore } from '../../store/actions';
import Helpers from '../../common/helpers/helpers';

class PolizaEmitida extends Component {
  state = {
    quote: this.props.match.params.polizaId,
    data: {},
    dataQuot: {},
    emitedPolicy: 0,
  };

  async getData() {
    Loading.toggle(true);
    let data = await QuoteIussedById.get(this.state.quote);
    let dataQuot = await GetQuote.getById(this.state.quote);
    let { params } = this.props.match;
    let { emmitedId: emitedPolicy } = params;
    let urlCodePage = parseInt(
      params.emmitedId.substr(params.emmitedId.length - 1)
    );
    let endoso = undefined;

    if (urlCodePage % 2 === 0) {
      window.open(
        'https://www.libertyseguros.co/encuesta-pe-hogar-co',
        '_blank'
      );
    }

    if (typeof data.quote_iussed_info !== 'undefined') {
      if (
        typeof data.quote_iussed_info.Item !== 'undefined' &&
        typeof data.quote_iussed_info.Item.onerous !== 'undefined'
      ) {
        if (data.quote_iussed_info.Item.onerous.length > 0) {
          endoso = true;
        }
      }
    }
    this.setState((state) => ({
      ...state,
      data,
      dataQuot,
      endoso,
      emitedPolicy,
    }));
    Loading.toggle(false);
  }

  componentDidMount() {
    this.getData();
  }

  openModal = () => {
    SendMail.toggle(true);
  };

  getPdfEndoso = async () => {
    const { quote_iussed_info, emitedPolicy, plan_selected_info } =
      this.state.data;
    const { identification, fecha_cotizacion } = this.state.dataQuot;
    console.log('state', this.state.dataQuot);
    let body = {
      opcion: 'emisión / éxito / Descargar PDFs Oneroso',
      identificacion: quote_iussed_info.Item.taker.document,
      id_ciudad: identification.city,
      id_departamento: identification.department,
      riesgo: identification.address,
      fecha_cotizacion: fecha_cotizacion,
      cotizacion: this.props.match.params.polizaId,
      prima: plan_selected_info.Item.prospect,
      poliza: emitedPolicy,
    };
    await CreateAuditData.createDataAudit(body);
    let pdfEndoso = await PdfEndosoHogar.get(this.state.quote);
    let a = document.createElement('a');
    a.style.display = 'none';
    document.body.appendChild(a);
    a.href = 'data:application/pdf;base64,' + pdfEndoso;
    a.setAttribute('download', 'BeneficiarioOnerosoHogar.pdf');
    a.click();
    document.body.removeChild(a);
    Loading.toggle(false);
  };

  getPdf = async () => {
    Loading.toggle(true);
    const { quote_iussed_info, emitedPolicy, plan_selected_info } =
      this.state.data;
    const { identification, fecha_cotizacion } = this.state.dataQuot;
    console.log('state', this.state.dataQuot);
    let body = {
      opcion: 'emisión / éxito / Descargar PDFs',
      identificacion: quote_iussed_info.Item.taker.document,
      id_ciudad: identification.city,
      id_departamento: identification.department,
      riesgo: identification.address,
      fecha_cotizacion: fecha_cotizacion,
      cotizacion: this.props.match.params.polizaId,
      prima: plan_selected_info.Item.prospect,
      poliza: emitedPolicy,
    };
    try {
      let a = document.createElement('a');
      await CreateAuditData.createDataAudit(body);
      let pdf = await PdfPolizaHogar.get(this.state.quote);
      a = document.createElement('a');
      a.style.display = 'none';
      document.body.appendChild(a);
      a.href = 'data:application/pdf;base64,' + pdf;
      a.setAttribute('download', 'PdfPolizaPrima.pdf');
      a.click();
      document.body.removeChild(a);

      Loading.toggle(false);
    } catch (e) {
      Loading.toggle(false);
    }
  };

  getNumber = async () => {
    const { history } = this.props;
    Loading.toggle(true);
    store.dispatch(resetStore());
    try {
      let number = await Counter.get();
      if (typeof number.currentValue !== 'undefined') {
        number = number.currentValue.toString();
        history.push(`/cotizacion/1/${number}`);
      }
      setTimeout(Loading.toggle(false), 1000);
    } catch (e) {
      Helpers.goToHome(history);
      setTimeout(Loading.toggle(false), 1000);
    }
  };

  render() {
    return (
      <div className="cotizacion exito">
        <div className="index-form">
          <div className="container">
            <div className="row">
              <div className="col col-sm-12 col-md-12 col-lg-12 title">
                <h2>¡Póliza emitida!</h2>
                <p>
                  Tu póliza fue emitida con el número{' '}
                  <span>{this.state.emitedPolicy}</span>, puede descargar el PDF
                  acontinuación
                </p>
                <div className="image">&nbsp;</div>
              </div>
            </div>

            <div className={'row text-center links-row'}>
              <div className="col col-sm-12 col-md-12 col-lg-12">
                <div className="generatepdf link-item">
                  <p onClick={this.getPdf}>
                    <i>&nbsp;</i> Descargar PDFS
                  </p>
                  <br />
                  {typeof this.state.endoso !== 'undefined' && (
                    <p onClick={this.getPdfEndoso}>
                      <i>&nbsp;</i> PDF Anexo Beneficiario Oneroso
                    </p>
                  )}
                </div>
                {/*<div className="sendpdf link-item" onClick={this.openModal}>*/}
                {/*<p><i>&nbsp;</i> Enviar por correo</p>*/}
                {/*</div>*/}
              </div>
            </div>

            <div className={'row text-center'}>
              <div className="col col-sm-12 col-md-12 col-lg-12">
                <button
                  onClick={this.getNumber}
                  type="button"
                  className={'btn btn-default btn-default--two'}
                >
                  Nueva cotización
                </button>
                <a href={'/'} type="button" className={'btn btn-primary'}>
                  Ir a mis negocios
                </a>
              </div>
            </div>
          </div>
        </div>
        <SendMail />
      </div>
    );
  }
}

export default PolizaEmitida;
