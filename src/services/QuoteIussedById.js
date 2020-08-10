import Api from "./Api";
import AuthHeader from './AuthHeader';
const BaseUrl = "/get/all/quote-iussed-by-id/";

class QuoteIussedById {

    static mergeUsers(data) {
        if (typeof data.quote_iussed_info !== "undefined") {
            if (typeof data.quote_iussed_info.Item !== "undefined") {
                let users = [];
                let item = data.quote_iussed_info.Item;
                ['taker', 'insured', 'benefist'].map(it => {
                    if (it === 'taker') item[it] = [item[it]];
                    for (let i = 0; i < item[it].length; i++) {
                        let u = item[it][i];
                        let key = u.document + "_" + u.document_type;
                        if (typeof users[key] === "undefined") {
                            users[key] = u;
                        }
                    }
                    data.quote_iussed_info.Item[it] = [];
                    return this;
                });

                for (let i in users) {
                    const user = users[i]
                    let status = false;
                    if (user && user.role && user.role.length)
                      for (let j = 0; j < user.role.length; j++) {
                        let role = user.role[j];
                        if (status === false) {
                          if (role === 1) {
                            // Tomador
                            data.quote_iussed_info.Item['taker'] = user;
                            status = true;
                          } else if (role === 2) {
                            // Asegurado
                            data.quote_iussed_info.Item['insured'].push(user);
                            status = true;
                          } else if (role === 3) {
                            // Beneficiario
                            data.quote_iussed_info.Item['benefist'].push(user);
                            status = true;
                          }
                        }
                      }
                }
            }
        }
        return data;
    }

    static async get(id) {
        let authHeader =  new AuthHeader();
        authHeader = authHeader.generateAuthCode();
        return QuoteIussedById.mergeUsers(await Api.get(BaseUrl + id, undefined, authHeader));
    }
}

export default QuoteIussedById;
