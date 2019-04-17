import Service from './Service';

const BaseUrl = "https://o78mqwmm0l.execute-api.us-east-1.amazonaws.com/dev/all-build-material";

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

class BuildMaterial {
    static async get() {
        let data = {};
        try {
            data = await Service.get(BaseUrl);
        }catch (e) {
            data = Default;
        }
        if ( typeof data.build_materials === "undefined" || data.build_materials.length === 0 ){
            data = Default;
        }
        return data.build_materials.sort(function (a, b) {
            a = parseInt(a.buildMaterialCode);
            b = parseInt(b.buildMaterialCode);
            if (a > b) {
                return 1;
            } else if (a < b) {
                return -1;
            }
            return 0;
        });
    };
}

export default BuildMaterial;

