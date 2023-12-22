import Alerts from './alerts';
import BeneficiariesFinalForm from './forms';
import './styles.scss';
import React from 'react';
import PropTypes from 'prop-types';

const BeneficiariesFinalPage = ({
  disabledAll,
  beneficiariesFinal,
  isLegalRepresentativeBeneficiary,
  handleDeleteBeneficiaryFinal,
  handleNewBeneficiaryFinal,
  handleUpdatedBeneficiaryData,
}) => {
  const maxBeneficiaries = isLegalRepresentativeBeneficiary ? 9 : 10;

  return (
    <>
      <div className="row fields-row  legal-representative">
        <div className={'col-12 no-padding-right mb-2 '}>
          <h1>Datos de Beneficiarios Finales</h1>
        </div>
        <div className={'col-12 no-padding-right mb-4  beneficiaries-header'}>
          <Alerts />
        </div>
      </div>
      {beneficiariesFinal?.map((beneficiary, index) => (
        <BeneficiariesFinalForm
          disabledAll={disabledAll}
          isLegalRepresentativeBeneficiary={isLegalRepresentativeBeneficiary}
          key={`beneficiary-${index}`}
          handleDeleteBeneficiaryFinal={handleDeleteBeneficiaryFinal}
          beneficiary={beneficiary}
          handleUpdatedBeneficiaryData={(data, index) => {
            handleUpdatedBeneficiaryData(data, index);
          }}
          index={index}
        />
      ))}
      {!disabledAll && beneficiariesFinal.length < maxBeneficiaries && (
        <div className="row fields-row  legal-representative mt-4">
          <div className="col col-12 col-sm-12 col-md-6 col-lg-6 no-padding-right mt-2">
            <div className="more-items" onClick={handleNewBeneficiaryFinal}>
              <button type="button" className="more-btn">
                +
              </button>
              <p>Agregar Beneficiario Final</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

BeneficiariesFinalPage.propTypes = {
  disabledAll: PropTypes.bool,
  beneficiariesFinal: PropTypes.array,
  isLegalRepresentativeBeneficiary: PropTypes.bool,
  handleDeleteBeneficiaryFinal: PropTypes.func,
  handleNewBeneficiaryFinal: PropTypes.func,
  handleUpdatedBeneficiaryData: PropTypes.func,
};

BeneficiariesFinalPage.defaultProps = {
  disabledAll: false,
  beneficiariesFinal: [],
  isLegalRepresentativeBeneficiary: false,
  handleDeleteBeneficiaryFinal: () => {},
  handleNewBeneficiaryFinal: () => {},
  handleUpdatedBeneficiaryData: () => {},
};
export default BeneficiariesFinalPage;
