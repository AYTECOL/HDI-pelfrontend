import Service from './Service';

const BaseUrl = "https://4gw3dqvq6g.execute-api.us-east-1.amazonaws.com/dev/all-properties-zones";

class Zones {
    static async get() {
        let data = await Service.get(BaseUrl);
        if (typeof data.properties_zones === "undefined") {
            data.properties_zones = [
                {
                    "zoneCode": "2",
                    "answer": "Rural"
                },
                {
                    "zoneCode": "1",
                    "answer": "Urbana"
                }
            ];
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

