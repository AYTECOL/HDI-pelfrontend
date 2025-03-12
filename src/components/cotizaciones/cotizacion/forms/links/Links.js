import React, { Component, Fragment } from 'react';
import './Links.scss';
import PrevPdfPolizaPrima from '../../../../../services/PrevPdfPolizaPrima';
import CreateAuditData from 'services/Audit';

import { withRouter } from 'react-router-dom';
import store from '../../../../../store';
import Loading from '../../../../globals/loading/Loading';
import BtnContinue from '../btncontinue/BtnContinue';
import Helpers from '../../../../../common/helpers/helpers';

class Links extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  static async pdf(it, download = true) {
    let quote = it.props.match.params.id;
    let storeState = store.getState();
    let plans = storeState.AllPlans;
    let index = storeState.indexPlan;
    const { identification, number, fecha_cotizacion } = storeState.cotizacion;
    let plan = plans[index];
    plan = BtnContinue.toNumberCoverrange(plan);
    let body = {
      opcion: 'cotización / link generar cotización en PDF',
      identificacion: identification.value,
      id_ciudad: identification.city,
      id_departamento: identification.department,
      riesgo: identification.address,
      fecha_cotizacion: fecha_cotizacion,
      cotizacion: number,
      prima: plan.value,
    };
    try {
      let pdf = await PrevPdfPolizaPrima.get(plan, quote);
      await CreateAuditData.createDataAudit(body);
      if (typeof pdf !== 'undefined' && download === true) {
        const a = document.createElement('a');
        a.style.display = 'none';
        document.body.appendChild(a);
        a.href = 'data:application/pdf;base64,' + pdf;
        a.setAttribute('download', 'PdfPolizaPrima.pdf');
        a.click();
        document.body.removeChild(a);
      }
    } catch (e) {
      //
    }
  }

  getPdf = async () => {
    if (Helpers.hasClass('.generatepdf', 'disabled') === false) {
      Loading.toggle(true);
      await Links.pdf(this);
      Loading.toggle(false);
    }
  };

  render() {
    return (
      <Fragment>
        <div className="generatepdf link-item" onClick={this.getPdf}>
          <p>
            <i>&nbsp;</i> Generar cotización en PDF
          </p>
        </div>
        {/*<div className="sendpdf link-item" onClick={this.openModal}>*/}
        {/*<p><i>&nbsp;</i> Enviar por correo</p>*/}
        {/*</div>*/}
      </Fragment>
    );
  }
}

export default withRouter(Links);
