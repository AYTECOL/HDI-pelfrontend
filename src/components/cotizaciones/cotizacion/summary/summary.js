import React, { useState, useEffect } from "react";
import store from "../../../../store";
import QuoteIussedById from "../../../../services/QuoteIussedById";
import Masknumbermoney from "../../../../common/helpers/masknumbermoney/Masknumbermoney";
import "./summary.scss";

const summary = props => {
  const [CountCoverages, useCountCoverages] = useState(0);
  const [CountAssists, useCountAssits] = useState(0);
  const [TotalPrima, useTotalPrima] = useState("");

  useEffect(() => {
    getData();
  });
  const getData = () => {
    store.subscribe(async () => {
      let storeState = store.getState();
      let plan = await QuoteIussedById.get(storeState["AllPlans"][0].id);
      let total = 0;
      if (plan["risk_valoration_info"]["Item"].prospect > 1) {
        total = plan["risk_valoration_info"]["Item"].prospect;
      }
      useCountCoverages(
        storeState["AllPlans"][0]["coverages"].filter(validateCheck).length
      );
      useCountAssits(
        constValidateAssists(storeState["AllPlans"][0]["assists"][0]["values"])
      );
      useTotalPrima(Masknumbermoney.formatToMask(total));
    });
  };
  const validateCheck = array => {
    return array.checked === true;
  };
  const constValidateAssists = array => {
    let t = 0;
    let item = array;
    for (let i in item) {
      if (item[i].checked === true) t++;
      if (typeof item[i].assists !== "undefined") {
        for (let o in item[i].assists) {
          if (item[i].assists[o].checked === true) t++;
        }
      }
    }
    return t;
  };
  return (
    <div className="div-space row style-div">
      <div className="col-md-4" align="center">
        <div className="content-wrapper">
          <p className="text-fix">
            <b className="text-prima">Valor de prima</b>
          </p>
          <p className="number-text">{TotalPrima}</p>
        </div>
      </div>
      <div className="col-md-4" align="center">
        <p className="text-fix">
          <b className="text-include2">Incluye</b>
        </p>
        <p className="second-text">
          {CountCoverages} Coberturas / {CountAssists} Asistencias{" "}
        </p>
      </div>
      <div className="col-md-4" align="center">
        {/* <p>
          <b className="text-include2">Financiación</b>
        </p>
        <p className="second-text">$30.000 / 10 cuotas</p>{" "} */}
      </div>
    </div>
  );
};

export default summary;
