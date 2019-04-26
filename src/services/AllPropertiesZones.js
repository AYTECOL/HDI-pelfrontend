import Api from './Api';
import Helpers from "../common/helpers/helpers/Helpers";

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
            data = await Api.get(BaseUrl);
        } catch (e) {
            data = Default;
        }
        if (typeof data.properties_zones === "undefined" || data.properties_zones.length === 0) {
            data = Default;
        }
        return Helpers.orderArray(data.properties_zones,"zoneCode");
    };
}

export default AllPropertiesZones;

