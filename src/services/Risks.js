import Service from './Service';

const BaseUrl = "https://mnkg7plc7i.execute-api.us-east-1.amazonaws.com/dev/";

const Default = {
    risks: [
        {
            risk_type: "Casa",
            riskId: 1,
        },
        {
            risk_type: "Apartamento",
            riskId: 2,
        },
    ]
};

class Risks {
    static async get() {
        let url = BaseUrl + "all-risks";
        let risks;
        try {
            risks = await Service.get(url);
        } catch (e) {
            risks = Default;
        }
        if ( typeof risks.risks === "undefined" || risks.risks.length === 0 ){
            risks = Default;
        }
        return risks;
    };
}

export default Risks;
