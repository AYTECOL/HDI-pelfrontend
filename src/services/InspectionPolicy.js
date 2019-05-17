import Api from './Api';

class InspectionPolicy {
    static async get(code, insured_values, zone, insured_type, year_construction, in_closed_set, insured_total) {
        return await Api.get('/inspection-policy/'+code+'/'+insured_values+'/'+zone+'/'+insured_type+'/'+year_construction+'/'+in_closed_set+'/'+insured_total);
    };
}

export default InspectionPolicy;
