import Api from './Api'
const Url = "/sig_geocoding_data";

class SigService {
    static async LongitudeAndLatitude(tokenAcceess, lon, lan) {

        let url = `https://apis.us-east-1.libertymutual.com/geolocation/LongitudeAndLatitude?lon=${String(lan)}&lan=${String(lon)}&f=pjson`;
        const authorization = `Bearer ${tokenAcceess}`

        const dataM = await Api.get(Url + "/" + tokenAcceess + "/" + lon + "/" + lan, undefined, {

        });

        return 'tokenResponse';
    }
    static async LongitudeAndLatitudeConsumer() {

    }
}

export default SigService;
