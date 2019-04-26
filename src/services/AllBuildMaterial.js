import Api from './Api';
import Helpers from "../common/helpers/helpers/Helpers";

const BaseUrl = "/all-build-material";

const Default = {
    build_materials: [
        {
            "buildMaterialCode": "2",
            "answer": "Mampostería (ladrillo)"
        },
        {
            "buildMaterialCode": "1",
            "answer": "Madera"
        },
        {
            "buildMaterialCode": "4",
            "answer": "Adobe"
        },
        {
            "buildMaterialCode": "3",
            "answer": "Acero reforzado"
        },
        {
            "buildMaterialCode": "5",
            "answer": "Murosen concreto"
        },
        {
            "buildMaterialCode": "6",
            "answer": "Bahareque"
        }
    ]
};

class AllBuildMaterial {
    static async get() {
        let data = {};
        try {
            data = await Api.get(BaseUrl);
        } catch (e) {
            data = Default;
        }
        if (typeof data.build_materials === "undefined" || data.build_materials.length === 0) {
            data = Default;
        }
        return Helpers.orderArray(data.build_materials,"buildMaterialCode");
    };
}

export default AllBuildMaterial;

