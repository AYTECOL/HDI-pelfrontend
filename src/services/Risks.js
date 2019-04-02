import Service from './Service';

const BaseUrl = "https://4gw3dqvq6g.execute-api.us-east-1.amazonaws.com/dev/";

class Risks {
    static async get() {
        let url = BaseUrl + "all-risks";
        let risks;
        try {
            risks = await Service.get(url);
        } catch (e) {
            risks = {
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
            }
        }
        return risks;
    };
}

export default Risks;
