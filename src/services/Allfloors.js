import Api from './Api';
import Store from '../store';
import AuthHeader from './AuthHeader';
import {saveAllfloors} from '../actions';
import Helpers from "../common/helpers/helpers/Helpers";

const BaseUrl = "/all-floors";

const Default = function () {
    let data = {};
    const { maxFloors } = Allfloors;
    if (typeof data.floors === "undefined") {
        data.floors = [];
        for (let i = 1; i <= maxFloors; i++) {
            data.floors[i] = {
                answer: i,
                floorCode: i,
            }
        }
        data.floors.push({
          answer: `Mas de ${maxFloors}`,
          floorCode: maxFloors + 1,
        });
    }
    return data;
};

class Allfloors {
    static maxFloors = 30;
    static async get() {
        let data = {};
        let allfloors = [];
        let storeState = Store.getState();
        if (storeState.Allfloors.length === 0) {
            try {
                // TODO interceptor or request
                let authHeader =  new AuthHeader()
                authHeader = authHeader.generateAuthCode()
                data = await Api.get(BaseUrl, undefined, authHeader);
            } catch (e) {
                data = Default();
            }
            if (typeof data.floors === "undefined" || data.floors.length === 0) {
                data = Default();
            }

            allfloors = Helpers.orderArray(data.floors, "floorCode");
            Store.dispatch(saveAllfloors(allfloors));
        } else {
            allfloors = storeState.Allfloors;
        }

        return allfloors;
    };
}

export default Allfloors;
