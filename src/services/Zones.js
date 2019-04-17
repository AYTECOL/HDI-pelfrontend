import Service from './Service';

const BaseUrl = "https://o78mqwmm0l.execute-api.us-east-1.amazonaws.com/dev/all-properties-zones";

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

class Zones {
    static async get() {
        let data = {};
        try {
            data = await Service.get(BaseUrl);
        }catch (e) {
            data = Default;
        }
        if ( typeof data.properties_zones === "undefined" || data.properties_zones.length === 0 ){
            data = Default;
        }
        return data.properties_zones.sort(function (a, b) {
            a = parseInt(a.zoneCode);
            b = parseInt(b.zoneCode);
            if (a > b) {
                return 1;
            } else if (a < b) {
                return -1;
            }
            return 0;
        });
    };
}

export default Zones;

