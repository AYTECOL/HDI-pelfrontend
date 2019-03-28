import Service from './Service';

const APIKEY = 'AIzaSyBgo1kZwdmm7WnRiT9rkfXcVn87QJha6AU';

class GetAddresInfo {
    static async get(address) {
        address = address + ", Colombia";
        // address = address +  ", Manizales, Caldas, Colombia";
        address = address.replace("#", " ");
        address = address.replace("N°", " ");
        //let url = `https://maps.googleapis.com/maps/api/geocode/json?key=${APIKEY}&address=${address}`;
        let url = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?inputtype=textquery&key=${APIKEY}&input=${address}`;
        return await Service.get(encodeURI(url))
            .then(response => {
                //return response.results[0].geometry.location;
                if (response.status === "ZERO_RESULTS") return {};
                return Service.get(encodeURI(`https://maps.googleapis.com/maps/api/place/details/json?key=${APIKEY}&placeid=${response.candidates[0].place_id}`))
                    .then(finalResponse => {
                        return (finalResponse.result.geometry.location)
                    });
            });
    };

    static async getAdressByCoors(coors) {
        return Service.get(encodeURI(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${coors.lat()},${coors.lng()}&key=${APIKEY}`))
            .then(response => {
                return response.results[0].formatted_address;
            });
    }
}

export default GetAddresInfo;
