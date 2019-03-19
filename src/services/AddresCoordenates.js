import Service from './Service';
import axios from 'axios';
const APIKEY = 'AIzaSyBgo1kZwdmm7WnRiT9rkfXcVn87QJha6AU'; 

class GetAddresInfo {
    static async get(address) {
        return await axios.get(encodeURI(`https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/findplacefromtext/json?inputtype=textquery&key=${APIKEY}&input=${address}`))
       .then(response => {
            if( response.status === "ZERO_RESULTS" ) return "";
            return  axios.get(encodeURI(`https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/details/json?key=${APIKEY}&placeid=${response.data.candidates[0].place_id}`))
            .then(finalResponse => {
                return(finalResponse.data.result.geometry.location)
            });
       });
   };
}

export default GetAddresInfo;
