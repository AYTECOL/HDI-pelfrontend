// @ts-check
import Axios from 'axios';
import { UrlService } from '../config';
import AuthHeader from './AuthHeader';

class UploadFile {
  // 10MB
  static maxFileSize = 10 * 1e6;

  /**
   *
   * @param {"Sarlaft"| "Docs"} name
   * @param {File} file
   * @return {Promise<{ location: string }>}
   */
  static async upload(name, file) {
    const headers = await AuthHeader.getHeaders();
    /**
     * @type {{ url: string, key: string }}
     */
    const res = await Axios.post(
      `${UrlService}/signed_url_attach_document`,
      {
        [name]: file.name,
      },
      { headers }
    ).then(({ data }) => data);

    await Axios.put(res.url, file);
    return { location: res.key };
  }
}

export default UploadFile;
