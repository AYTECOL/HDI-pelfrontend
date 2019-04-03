import Service from './Service';

const BaseUrl = "https://mnkg7plc7i.execute-api.us-east-1.amazonaws.com/dev/all-floors";

const Default = function () {
    let data = {};
    if (typeof data.floors === "undefined") {
        data.floors = [];
        for (let i = 1; i < 32; i++) {
            data.floors[i] = {
                answer: i,
                floorCode: i,
            }
        }
    }
    return data;
};

class Allfloors {
    static async get() {
        let data = {};
        try {
            data = await Service.get(BaseUrl);
        }catch (e) {
            data = Default();
        }
        if ( typeof data.floors === "undefined" || data.floors.length === 0 ){
            data = Default();
        }
        return data.floors.sort(function (a, b) {
            a = parseInt(a.floorCode);
            b = parseInt(b.floorCode);
            if (a > b) {
                return 1;
            } else if (a < b) {
                return -1;
            }
            return 0;
        });
    };
}

export default Allfloors;

