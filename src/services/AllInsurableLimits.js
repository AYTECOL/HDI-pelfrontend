import Service from './Service';
import Store from '../store';
import {saveAllInsurableLimits} from '../actionCreators';

const BaseUrl = "https://jnvmb2ndq8.execute-api.us-east-1.amazonaws.com/dev/all-insurable-limits";

const Default = function () {
    let data = {};
    if (typeof data.limits === "undefined") {
        data = {
            "limits": [
                {
                    "insurable_limit_id": "2",
                    "description": "Contenidos",
                    "min_value": 1000000,
                    "max_value": 1000000000
                },
                {
                    "insurable_limit_id": "1",
                    "description": "Inmueble",
                    "min_value": 2000000,
                    "max_value": 4000000000
                },
                {
                    "insurable_limit_id": "6",
                    "description": "Teléfonos móviles",
                    "min_value": 900000,
                    "max_value": 10000000
                },
                {
                    "insurable_limit_id": "5",
                    "description": "Contenidos móviles",
                    "min_value": 1000000,
                    "max_value": 160000000
                },
                {
                    "insurable_limit_id": "4",
                    "description": "Joyas",
                    "min_value": 900000,
                    "max_value": 100000000
                },
                {
                    "insurable_limit_id": "3",
                    "description": "Obras de Arte",
                    "min_value": 1,
                    "max_value": 600000000
                }
            ],
            "status": 200
        };
    }
    return data;
};

class AllInsurableLimits {
    static async get() {
        let data = {};
        let allInsurableLimits = [];
        let storeState = Store.getState();
        if (storeState.allInsurableLimits.length === 0) {
            try {
                data = await Service.get(BaseUrl);
            } catch (e) {
                data = Default();
            }
            if (typeof data.limits === "undefined" || data.limits.length === 0) {
                data = Default();
            }

            allInsurableLimits = data.limits.sort(function (a, b) {
                a = parseInt(a.insurable_limit_id);
                b = parseInt(b.insurable_limit_id);
                if (a > b) {
                    return 1;
                } else if (a < b) {
                    return -1;
                }
                return 0;
            });

            let newData = [];
            for (let i = 0; i < allInsurableLimits.length; i++) {
                newData[allInsurableLimits[i].insurable_limit_id] = allInsurableLimits[i];
            }
            allInsurableLimits = newData;
            Store.dispatch(saveAllInsurableLimits(allInsurableLimits));
        } else {
            allInsurableLimits = storeState.limits;
        }
        return allInsurableLimits;
    };
}

export default AllInsurableLimits;

