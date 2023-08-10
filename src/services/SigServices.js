import Api from './Api';
import AuthHeader from './AuthHeader';
import ConsultaPersonas from './ConsultaPersonas';
const URL_LONGITUDE_LATITUDE = '/sig_geocoding_data';
const URL_CONSUMER = '/sig_geocoding_data_consumer';
const sleep = (milliseconds) => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
};
class SigService {
  static async LongitudeAndLatitude(lon, lan) {
    const user = await ConsultaPersonas.getUser();
    let tries = 3;
    let response = null;
    let authHeader = new AuthHeader();
    authHeader = authHeader.generateAuthCode();
    authHeader['pelhauthorization'] = user?.['accessToken'] || '';
    while (tries >= 0) {
      try {
        response = await Api.get(
          URL_LONGITUDE_LATITUDE + '/' + lan + '/' + lon,
          undefined,
          authHeader
        );
        const { jobId } = response;
        if (!jobId) throw new Error('Value is null or undefined');
        response = jobId;
        break;
      } catch (error) {
        console.log('error in service SIG: ', error);
        tries--;
      }
    }
    return response;
  }
  static async sigConsumer(jobId) {
    const user = await ConsultaPersonas.getUser();
    let tries = 5;
    let response = null;
    let authHeader = new AuthHeader();
    authHeader = authHeader.generateAuthCode();
    authHeader['pelhauthorization'] = user?.['accessToken'] || '';
    while (tries >= 0) {
      try {
        response = await Api.get(
          URL_CONSUMER + '/' + jobId,
          undefined,
          authHeader
        );
        const { value } = response;
        if (!value) throw new Error('Value is null or undefined');
        response = value;
        break;
      } catch (error) {
        console.log('error in service SIG: ', error);
        await sleep(5000);
        tries--;
      }
    }
    return response;
  }
}

export default SigService;
