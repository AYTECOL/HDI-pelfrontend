// @ts-check
import Axios from 'axios';
import { UrlService } from '../config';
import AuthHeader from './AuthHeader';

const oneMB = 1.049e6;
class UploadFileService {
  // 10MB
  static maxFileSize = 10 * oneMB;
  static get messageLimit() {
    return `El documento que desea adjuntar, supera el límite máximo permitido de ${(
      UploadFileService.maxFileSize / oneMB
    ).toFixed(0)}MB`;
  }

  /**
   * @typedef {'SARLAFT'| 'HABEAS_DATA' | 'CERL' | 'DOCS'} types
   * @param {types | null} key
   * @param {File} file
   * @param {string | null} customName
   * @return {Promise<{ location: string }>}
   */
  static async upload(key, file, customName = null) {
    const headers = await AuthHeader.getHeaders();
    /**
     * @type {{ url: string, key: string }}
     */
    const res = await Axios.post(
      `${UrlService}/signed_url_attach_document`,
      {
        [key]: customName || file.name,
      },
      { headers }
    ).then(({ data }) => data);

    await Axios.put(res.url, file);
    return { location: res.key };
  }
}

export default UploadFileService;
