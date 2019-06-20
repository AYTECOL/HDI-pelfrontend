import Api from "./Api";
import Helpers from "../common/helpers/helpers/Helpers";

const BaseUrl = "/prev-pdf-poliza-prima/";

class PrevPdfPolizaPrima {
  static async get(plan, quoteId) {
    let user = await Helpers.getUser();
    return await Api.post(BaseUrl + quoteId, plan, undefined, undefined, {
      pelhauthorization: user !== null ? user["accessToken"] : ""
    });
  }
}

export default PrevPdfPolizaPrima;
