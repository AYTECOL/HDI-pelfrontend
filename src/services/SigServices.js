import Api from './Api'
const Url = "/sig_geocoding_data";
import AuthHeader from './AuthHeader';

class SigService {
    static async LongitudeAndLatitude(tokenAcceess, lon, lan) {
        let authHeader =  new AuthHeader();
        authHeader = authHeader.generateAuthCode();
        const dataM = await Api.get(Url + "/" + tokenAcceess + "/" + lan + "/" + lon, undefined, authHeader);
        return dataM;
    }
    static async LongitudeAndLatitudeConsumer() {

    }
}

export default SigService;
