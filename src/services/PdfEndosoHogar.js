import Api from './Api';
import Helpers from "../common/helpers/helpers/Helpers";

const BaseUrl = "/pdf-endoso-hogar/";
let _index = 0;

class PdfEndosoHogar {
    static async get(id) {
        let user = await Helpers.getUser();
        try{
            return await Api.get(BaseUrl + id, undefined, {
                pelhauthorization: user !== null ? user['accessToken'] : ''
            }, true);;
        }catch (e) {
            if( _index < 3 ){
                _index++;
                return await PdfEndosoHogar.get(id);
            }else{
                _index = 0;
            }
        }
    };
}

export default PdfEndosoHogar;
