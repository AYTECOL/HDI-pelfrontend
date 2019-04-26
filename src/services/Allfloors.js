import Api from './Api';
import Store from '../store';
import {saveAllfloors} from '../actions';
import Helpers from "../common/helpers/helpers/Helpers";

const BaseUrl = "/all-floors";

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
        let allfloors = [];
        let storeState = Store.getState();
        if (storeState.Allfloors.length === 0) {
            try {
                data = await Api.get(BaseUrl);
            } catch (e) {
                data = Default();
            }
            if (typeof data.floors === "undefined" || data.floors.length === 0) {
                data = Default();
            }

            allfloors = Helpers.orderArray(data.floors,"floorCode");
            Store.dispatch(saveAllfloors(allfloors));
        } else {
            allfloors = storeState.Allfloors;
        }

        return allfloors;
    };
}

export default Allfloors;

