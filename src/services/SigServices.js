import Api from './Api'
const Url = "/sig_geocoding_data";

class SigService {
    static async LongitudeAndLatitude(tokenAcceess, lon, lan) {

        const dataM = await Api.get(Url + "/" + tokenAcceess + "/" + lan + "/" + lon, undefined, {

        });

        return dataM;
    }
    static async LongitudeAndLatitudeConsumer() {

    }
}

export default SigService;
