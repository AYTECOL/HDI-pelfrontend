import Helpers from "../common/helpers/helpers/Helpers";

const Default = {
  build_materials: [
    {
      buildMaterialCode: "2",
      order: 2,
      description:
        "Estructuras construidas con muros conformados por la unión de bloques o ladrillos de arcilla o ladrillos de concreto con mortero.",
      create_at: "2019-05-15 21:48:48",
      answer: "Mampostería"
    },
    {
      buildMaterialCode: "1",
      order: 1,
      description:
        "Estructuras construidas con columnas y vigas y/o muros en concreto reforzado.",
      create_at: "2019-05-15 21:47:41",
      answer: "Concreto Reforzado"
    },
    {
      buildMaterialCode: "3",
      order: 3,
      description:
        "Estructuras construidas con columnas y vigas y/o muros en Acero.",
      create_at: "2019-05-15 21:49:46",
      answer: "Acero"
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
  }
}

export default AllBuildMaterial;
