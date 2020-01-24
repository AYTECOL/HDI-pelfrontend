import React from "react";
//Component
import BtnContinue from "../forms/btncontinue/BtnContinue";

export const ButtonsFooter = () => {
  const [accept, setAccept] = React.useState(false);
  return (
    <div className="row">
      <div className="col-12 justify-content text-center">
        <div className={"col first items-checkboxes "}>
          <div class="col first items-checkboxes ">
            <div class="d-flex form-group p-3">
              <input
                className="col-auto m-auto"
                type="checkbox"
                checked={accept}
                name={"itemcheck-condtions"}
                id={"itemcheck-condtions"}
                onChange={() => {
                  setAccept(!accept);
                }}
              />
              <div class="col text-left">
                <label for="itemcheck-condtions">
                  En mi calidad de intermediario, manifiesto que he verificado
                  la documentación e información entregada por el asegurado y/o
                  el tomador, encontrando que la misma corresponde a la realidad
                  en cuanto a las características, cantidad y tipo de riesgo
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col col-12 col-sm-12 col-md-12 col-lg-12 form-action justify-content text-center">
        <BtnContinue continueButtonDisable={!accept} />
      </div>
    </div>
  );
};
export default ButtonsFooter;
