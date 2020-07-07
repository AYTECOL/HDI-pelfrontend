// @ts-check
import Api from './Api';
import ConsultaPersonas from './ConsultaPersonas';
import { UrlAttachPolicyDocuments } from '../config';
const Url = '/attach-policy-documents';
const UrlLiberty = UrlAttachPolicyDocuments;

/**
 * @typedef {{ codigo: string;}} CodigoProducto
 *
 * @typedef {{
 *  nombre: string;
 *  codigo: number;
 *  ficherobase64: string;
 * }} Archivo
 *
 * @typedef {{ archivo: Archivo[]; }} Archivos
 *
 * @typedef {{
 *  infoRequest: any;
 *  codigoProducto: CodigoProducto;
 *  numeroPoliza: string;
 *  archivos: Archivos;
 *  }} AdjuntarDocumentosPolizaRq
 *
 * @typedef {{
 *  adjuntarDocumentosPolizaRq: AdjuntarDocumentosPolizaRq
 * }} DataRequest
 */

class AttachPolicyDocuments {
  static async get(poliza, emision) {
    let user = await ConsultaPersonas.getUser();
    return await Api.get(Url + '/' + poliza + '/' + emision, undefined, {
      pelhauthorization: user !== null ? user['accessToken'] : '',
    });
  }

  /**
   *
   * @param {DataRequest} data
   */
  static async save(data) {
    const {
      archivos: { archivo: files },
      ...commonData
    } = data.adjuntarDocumentosPolizaRq;
    const user = await ConsultaPersonas.getUser();
    return Promise.all(
      files.map((archivo) => {
        /**
         * @type {DataRequest}
         */
        const dataPost = {
          adjuntarDocumentosPolizaRq: {
            ...commonData,
            archivos: { archivo: [archivo] },
          },
        };
        // TODO interceptor or request
        return Api.post(
          '/adjuntardocumentospoliza',
          dataPost,
          UrlLiberty,
          undefined,
          {
            Authorization: user !== null ? 'Bearer ' + user['accessToken'] : '',
          }
        );
      })
    ).catch((e) => {
      console.log(e);
      return null;
    });
  }
}

export default AttachPolicyDocuments;
