import Service from './Service';

const Url = "https://jnvmb2ndq8.execute-api.us-east-1.amazonaws.com/dev/cities";

class IdentificationsCities {
    static async get() {
        let cities = await Service.get(Url);
        // let extis = [];
        // let newCities = [];
        // for (let i in cities.cities){
        //     let d = cities.cities[i];
        //     if ( extis.indexOf(d.code_city) === -1 ){
        //         newCities.push(d);
        //         extis.push(d.code_city);
        //     }
        // }
        // cities.cities = newCities;
        return cities;
    };
}

export default IdentificationsCities;
