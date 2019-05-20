import Api from './Api';
import {ApiKeyGoogle} from '../config';

const APIKEY = ApiKeyGoogle;
// const Cors = '';
const Cors = '';

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
        return Api.get(encodeURI(`${Cors}https://maps.googleapis.com/maps/api/geocode/json?latlng=${coors.lat()},${coors.lng()}&key=${APIKEY}`), "")
            .then(response => {
                return response.results[0].formatted_address;
            });
    }
}

export default GetAddresInfo;
