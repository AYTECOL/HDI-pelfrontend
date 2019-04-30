import Api from './Api';

// const APIKEY = 'AIzaSyBL2heuQJheIysvzCbWXghuwDLu1Ga9dt4';
const APIKEY = 'AIzaSyBgo1kZwdmm7WnRiT9rkfXcVn87QJha6AU';
const Cors = 'https://cors-anywhere.herokuapp.com/';

class GetAddresInfo {
    static async get(address) {
        address = address + ", Colombia";
        address = address.replace("#", " ");
        address = address.replace("N°", " ");
        //let url = `https://maps.googleapis.com/maps/api/geocode/json?key=${APIKEY}&address=${address}`;
        let url = `${Cors}https://maps.googleapis.com/maps/api/place/findplacefromtext/json?inputtype=textquery&key=${APIKEY}&input=${address}`;
        return await Api.get(encodeURI(url), "", false)
            .then(response => {
                //return response.results[0].geometry.location;
                if (response.status === "ZERO_RESULTS") return {};
                if (typeof response.candidates[0] === "undefined") return {};
                return Api.get(encodeURI(`${Cors}https://maps.googleapis.com/maps/api/place/details/json?key=${APIKEY}&placeid=${response.candidates[0].place_id}`), "", false)
                    .then(finalResponse => {
                        return (finalResponse.result.geometry.location)
                    });
            });
    };

    static async getAdressByCoors(coors) {
        return Api.get(encodeURI(`${Cors}https://maps.googleapis.com/maps/api/geocode/json?latlng=${coors.lat()},${coors.lng()}&key=${APIKEY}`), "", false)
            .then(response => {
                return response.results[0].formatted_address;
            });
    }
}

export default GetAddresInfo;
