// @ts-check
import Axios from 'axios';

import Api from './Api';
import { UrlAttachPolicyDocuments } from '../config';
import { getArgumentsBinaryFile } from '../common/binaryFileUtilities';
import AuthHeader from './AuthHeader';

const Url = '/attach-policy-documents';

/**
 * @typedef {{ codigo: string;}} CodigoProducto
 *
 * @typedef {{
 *  nombre: string;
 *  codigo: number;
 *  url: string;
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
    const headers = await AuthHeader.getHeaders();
    return Api.get(Url + '/' + poliza + '/' + emision, undefined, {
      ...headers,
    });
  }

  static getSignedUrlAttachDocuments = async () => {
    const headers = await AuthHeader.getHeaders();
    /**
     * @type {import('axios').AxiosPromise<{ key: string; url: string }>}
     */
    const promise = Axios.get(
      UrlAttachPolicyDocuments + '/signed_url_attach_document',
      {
        withCredentials: false,
        headers,
      }
    );
    return promise.then(({ data }) => data);
  };

  /**
   *
   * @param {DataRequest} data
   */
  static async save(data) {
    const {
      archivos: { archivo: files },
      codigoProducto,
      infoRequest,
      numeroPoliza,
    } = data.adjuntarDocumentosPolizaRq;
    const headers = await AuthHeader.getHeaders();
    return Promise.all(
      files.map(async (archivo) => {
        const { data: arraybuffer } = await Axios.get(archivo.url, {
          responseType: 'arraybuffer',
        });
        const file = new Blob([arraybuffer]);
        const signedUrlAttachDocument =
          await AttachPolicyDocuments.getSignedUrlAttachDocuments();
        await Axios.put(signedUrlAttachDocument.url, file);
        const body = getArgumentsBinaryFile(
          {
            codigo: archivo.codigo,
            nombre: archivo.nombre,
            categoria: archivo.codigo,
            fileKey: signedUrlAttachDocument.key,
          },
          { codigoProducto, infoRequest, numeroPoliza }
        );
        const url = UrlAttachPolicyDocuments + '/attach_document';
        // TODO interceptor or request
        return Axios.post(url, body, { headers });
      })
    ).catch((e) => {
      console.error(e);
      return null;
    });
  }
}

export default AttachPolicyDocuments;
