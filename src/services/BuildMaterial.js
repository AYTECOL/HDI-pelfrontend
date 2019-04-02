import Service from './Service';

const BaseUrl = "https://4gw3dqvq6g.execute-api.us-east-1.amazonaws.com/dev/all-build-material";

class BuildMaterial {
    static async get() {
        let data = await Service.get(BaseUrl);
        if (typeof data.build_materials === "undefined") {
            data.build_materials = [
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
            ];
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

