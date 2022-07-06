import React, { useEffect, useState } from 'react';
import Masknumbermoney from '../../../../common/helpers/masknumbermoney/Masknumbermoney';
import './summary.scss';
import { withRouter } from 'react-router-dom';

const Summary = (props) => {
  const [CountCoverages, setCountCoverages] = useState(0);
  const [CountAssists, setCountAssits] = useState(0);
  const [TotalPrima, setTotalPrima] = useState('');

  useEffect(() => {
    getData();
  });

  const getData = async () => {
    try {
      let plan = props.plan[0];
      let total = plan.prospect;
      setCountCoverages(plan['coverages'].filter(validateCheck).length);
      setCountAssits(constValidateAssists(plan['assists'][0]['values']));
      setTotalPrima(Masknumbermoney.formatToMask(total));
    } catch (e) {
      //
    }
  };
  const validateCheck = (array) => {
    return array.checked === true;
  };
  const constValidateAssists = (array) => {
    let t = 0;
    let item = array;
    for (let i in item) {
      if (item[i].checked === true) t++;
      if (typeof item[i].assists !== 'undefined') {
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
          {CountCoverages} Coberturas / {CountAssists} Asistencias{' '}
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

export default withRouter(Summary);
