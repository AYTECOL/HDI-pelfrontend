import Service from './Service';

const BaseUrl = "https://4gw3dqvq6g.execute-api.us-east-1.amazonaws.com/dev/all-floors";

class Allfloors {
    static async get() {
        let data = await Service.get(BaseUrl);
        if (typeof data.floors === "undefined") {
            data.floors = [];
            for (let i = 1; i < 32; i++) {
                data.floors[i] = {
                    answer: i,
                    floorCode: i,
                }
            }
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

