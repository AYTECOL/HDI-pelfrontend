import Api from "./Api";

const BaseUrl = "/get/all/quote-iussed-by-id/";

class QuoteIussedById {

    static mergeUsers(item){
        let users = [];
        ['taker', 'insured', 'benefist'].map((it,key)=>{
            for (let i = 0; i < item[it].length; i++) {
                let u = item[it][i];
                let key = u.document+"_"+u.document_type;
                if( typeof users[key] === "undefined" ){
                    users[key] = u;
                }
            }
            item[it] = [];
            return this;
        });
        for(let i in users ){
            let status = false;
            for (let j = 0; j < users[i].role.length; j++) {
                let role = users[i].role[j];
                if( status === false ){
                    if( role === 1 ){
                        // Tomador
                        item['taker'] = users[i];
                        status = true;
                    }else if( role === 2 ){
                        // Asegurado
                        item['insured'].push(users[i]);
                        status = true;
                    }else if( role === 3 ){
                        // Beneficiario
                        item['benefist'].push(users[i]);
                        status = true;
                    }
                }
            }
        }
        return item;
    }

    static async get(id) {
        let data = await Api.get(BaseUrl + id);
        if( typeof data.quote_iussed_info !== "undefined" ){
            if( typeof data.quote_iussed_info.Item !== "undefined" ){
                data.quote_iussed_info['Item'] = QuoteIussedById.mergeUsers(data.quote_iussed_info['Item']);
            }
        }
        return data;
    }
}

export default QuoteIussedById;
