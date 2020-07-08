import Api from './Api';
import Helpers from "../common/helpers/helpers/Helpers";
import AuthHeader from './AuthHeader';
const BaseUrl = "/all-properties-zones";

const Default = {
    properties_zones: [
        {
            "zoneCode": "2",
            "answer": "Rural"
        },
        {
            "zoneCode": "1",
            "answer": "Urbana"
        }
    ]
};

class AllPropertiesZones {
    static async get() {
        let data = {};
        try {
            // TODO interceptor or request
            let authHeader =  new AuthHeader()
            authHeader = authHeader.generateAuthCode()
            data = await Api.get(BaseUrl, undefined, authHeader);
        } catch (e) {
            data = Default;
        }
        if (typeof data.properties_zones === "undefined" || data.properties_zones.length === 0) {
            data = Default;
        }
        return Helpers.orderArray(data.properties_zones, "zoneCode");
    };
}

export default AllPropertiesZones;
