import Api from './Api';
import {ApiKeyGoogle} from '../config';
import Axios from 'axios';

const APIKEY = ApiKeyGoogle;
// const Cors = '';
const Cors = 'https://cors-anywhere.herokuapp.com/';

class GetAddresInfo {
    static async get(address) {
        address = address.replace("#", " ").replace("N°", " ") + ", Colombia";
        let url = `${Cors}https://maps.googleapis.com/maps/api/place/findplacefromtext/json?inputtype=textquery&key=${APIKEY}&input=${address}`;
        return await Api.get(encodeURI(url), "")
            .then(response => {
                if (response.status === "ZERO_RESULTS") return {};
                if (typeof response.candidates[0] === "undefined") return {};
                return Api.get(encodeURI(`${Cors}https://maps.googleapis.com/maps/api/place/details/json?key=${APIKEY}&placeid=${response.candidates[0].place_id}`), "")
                    .then(finalResponse => {
                        return (finalResponse.result.geometry.location)
                    });
            });
    };

    static async getAdressByCoors(coors) {
        return Axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${coors.lat()},${coors.lng()}&key=${APIKEY}`)
            .then(({ data }) => {
                const [address] = data.results || [];
                /**
                 * @type {{ formatted_address: string }}
                 */
                let { formatted_address } = {
                  formatted_address: '',
                  ...address,
                };
                formatted_address.replace(/,.*/, '');
                return formatted_address
                  .replace(/,.*/, '')
                  .replace(/##|#/, 'Nro. ');
            });
    }
}

export default GetAddresInfo;
