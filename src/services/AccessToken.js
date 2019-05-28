import Api from './Api';

const Url = "/access-token";
const BaseUrl = "https://a86t6v1qyj.execute-api.us-east-1.amazonaws.com/dev";

class AccessToken {
    static async get(refer) {
        refer = decodeURIComponent(refer.replace(/\+/g, '%20'));
        let data = {
            "refer": refer
        };
        try {
            let reponse =  await Api.post(Url, data, BaseUrl);
            if( typeof reponse['accessToken'] !== "undefined" ){
                return reponse;
            }else{
                return null;
            }
        }catch (e) {
            if( e.status === 401 ){
                return null;
            }
        }
    };
}

export default AccessToken;
