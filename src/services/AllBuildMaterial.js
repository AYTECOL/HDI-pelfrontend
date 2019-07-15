// import Api from './Api';
import Helpers from "../common/helpers/helpers/Helpers";

// const BaseUrl = "/all-build-material";

const Default = {
    build_materials: [
        {
            "buildMaterialCode": "2",
            "order": 2,
            "description": "Estructuras construidas con muros conformados por la unión de bloques o ladrillos de arcilla o ladrillos de concreto con mortero.",
            "create_at": "2019-05-15 21:48:48",
            "answer": "Mampostería (ladrillo)"
        }, {
            "buildMaterialCode": "1",
            "order": 1,
            "description": "Estructuras construidas con columnas y vigas y/o muros en concreto reforzado.",
            "create_at": "2019-05-15 21:47:41",
            "answer": "Muros en concreto"
        }, {
            "buildMaterialCode": "4",
            "order": 6,
            "description": "Estructuras construidas con muros conformados por la unión de piezas en adobe de fabricación normalmente artesanal que está compuesto principalmente por arcilla y arena.",
            "create_at": "2019-05-15 21:52:13",
            "answer": "Adobe"
        }, {
            "buildMaterialCode": "4",
            "order": 5,
            "description": "Estructuras construidas con columnas y vigas y/o muros en Madera.",
            "create_at": "2019-05-15 21:51:41",
            "answer": "Madera"
        }, {
            "buildMaterialCode": "4",
            "order": 4,
            "description": "Estructuras construidas con muros compuestos de cañas o palos entretejidos y unidos con una mezcla de tierra húmeda y paja.",
            "create_at": "2019-05-15 21:51:11",
            "answer": "Bahareque"
        }, {
            "buildMaterialCode": "3",
            "order": 3,
            "description": "Estructuras construidas con columnas y vigas y/o muros en Acero.",
            "create_at": "2019-05-15 21:49:46",
            "answer": "Acero reforzado"
        }
    ]
};

class AllBuildMaterial {
    static async get() {
        // let data = {};
        // try {
        //     data = await Api.get(BaseUrl);
        // } catch (e) {
        //     data = Default;
        // }
        // if (typeof data.build_materials === "undefined" || data.build_materials.length === 0) {
        //     data = Default;
        // }
        let data = Default;
        return Helpers.orderArray(data.build_materials, "order");
    };
}

export default AllBuildMaterial;

