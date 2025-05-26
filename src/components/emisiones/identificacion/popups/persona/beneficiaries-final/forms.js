import PropTypes from 'prop-types';
import TypeDocuments from 'components/cotizaciones/identificacion/forms/tipodocumento/TipoDocumento';
import UserIcon from 'assets/icons/user.svg';
import EditIcon from 'assets/icons/edit.svg';
import ArrowUpIcon from 'assets/icons/arrow-up.svg';
import DeleteIcon from 'assets/icons/delete.svg';
import Alerts from './alerts';
import { useEffect, useState } from 'react';
import { useForm, FormProvider, Controller } from 'react-hook-form';
import * as yup from 'yup';
import {
  DEFAULT_VALUE_TYPE_DOCUMENT,
  REGEX_ALPHANUMERIC,
  REGEX_ONLY_NUMBERS,
  TYPES_DOCUMENTS,
  TYPE_DOCUMENT_IS_JURIDIC,
} from 'assets/constants';
import { yupResolver } from '@hookform/resolvers/yup';
import Input from 'components/basics/input/input';
import store from 'store';
import Helpers from 'common/helpers/helpers';
import ConsultaPersonas from 'services/ConsultaPersonas';
import Validaridentificacion from 'components/cotizaciones/identificacion/popups/validaridentificacion/Validaridentificacion';
import Loading from 'components/globals/loading/Loading';

const schemaNaturalBeneficiary = yup.object().shape({
  typeDocument: yup.string().required(),
  document: yup
    .string()
    .required(
      'Falta información requerida para el Tomador. Por favor revise el campo Identificación'
    )
    .test(
      'alphanumericOrNumeric',
      'Por favor revise el campo Identificación',
      (value, context) => {
        if (!value) return true;
        let regex = null;
        const { typeDocument } = context.parent;
        switch (typeDocument.toString()) {
          case TYPES_DOCUMENTS.PASSPORT:
          case TYPES_DOCUMENTS.DIPLOMATIC_CARD:
            regex = REGEX_ALPHANUMERIC;
            break;
          default:
            regex = REGEX_ONLY_NUMBERS;
            break;
        }
        return regex.test(value);
      }
    ),
  name: yup
    .string()
    .required(
      'Falta información requerida para el Tomador. Por favor revise el campo Primer nombre'
    ),
  secondName: yup.string(),
  lastName: yup
    .string()
    .required(
      'Falta información requerida para el Tomador. Por favor revise el campo Primer apellido'
    ),
  secondLastName: yup.string(),
  sharesPercentage: yup
    .number()
    .typeError(
      'Ingresa un número válido con máximo 2 decimales separados por punto (.)'
    )
    .transform((value) => (isNaN(value) ? '' : Number(value)))
    .min(5, 'El porcentaje de acciones es menor al permitido')
    .max(100, 'El porcentaje de acciones es mayor al permitido')
    .test(
      'max-2-decimals',
      'Máximo 2 decimales permitidos',
      (value) =>
        Number.isFinite(value) && /^\d+(\.\d{1,2})?$/.test(value.toString())
    )
    .required(
      'Falta información requerida para el Tomador. Por favor revise el campo porcentaje de acciones'
    ),
});

const schemaLegalBeneficiary = yup.object().shape({
  typeDocument: yup.string().required(),
  document: yup
    .string()
    .required(
      'Falta información requerida para el Tomador. Por favor revise el campo Identificación'
    )
    .test(
      'alphanumericOrNumeric',
      'Por favor revise el campo Identificación',
      (value, context) => {
        if (!value) return true;
        let regex = null;
        const { typeDocument } = context.parent;
        switch (typeDocument.toString()) {
          case TYPES_DOCUMENTS.PASSPORT:
          case TYPES_DOCUMENTS.DIPLOMATIC_CARD:
            regex = REGEX_ALPHANUMERIC;
            break;
          default:
            regex = REGEX_ONLY_NUMBERS;
            break;
        }
        return regex.test(value);
      }
    ),
  reasonSocialName: yup
    .string()
    .required(
      'Falta información requerida para el Tomador. Por favor revise el campo razón social'
    ),
});

const BeneficiariesFinalForm = ({
  disabledAll,
  beneficiary,
  index,
  handleDeleteBeneficiaryFinal,
  handleUpdatedBeneficiaryData,
  isLegalRepresentativeBeneficiary,
}) => {
  const [schema, setSchema] = useState(schemaNaturalBeneficiary);
  const [sureDeleteItem, setSureDeleteItem] = useState(false);
  const [confirmDeleteItem, setConfirmDeleteItem] = useState(false);
  const [isEdit, setIsEdit] = useState(true);
  const { identifications = [] } = store.getState();
  useEffect(() => {
    let timer;
    if (confirmDeleteItem) {
      timer = setTimeout(() => {
        setConfirmDeleteItem(false);
        handleDeleteBeneficiaryFinal(index);
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [confirmDeleteItem, handleDeleteBeneficiaryFinal, index]);

  const { getValues, setValue, trigger, reset, formState, control, watch } =
    useForm({
      mode: 'onChange',
      reValidateMode: 'onBlur',
      defaultValues: {
        typeDocument: beneficiary?.typeDocument || DEFAULT_VALUE_TYPE_DOCUMENT,
        document: beneficiary?.document || '',
        name: beneficiary?.name || '',
        secondName: beneficiary?.secondName || '',
        lastName: beneficiary?.lastName || '',
        secondLastName: beneficiary?.secondLastName || '',
        reasonSocialName: beneficiary?.reasonSocialName || '',
        sharesPercentage: beneficiary?.sharesPercentage || '',
      },
      context: schema,
      resolver: (data, context, options) => {
        return yupResolver(context)(data, context, options);
      },
    });

  // trigger initial form and when change schema
  useEffect(() => {
    trigger();
  }, [schema, trigger]);

  const { errors } = formState;

  const handlerOnBlurCustom = async (e) => {
    try {
      const { typeDocument, document } = getValues();
      if (typeDocument && document) {
        const responseIaxis = await ConsultaPersonas.get(
          typeDocument,
          document
        );
        const { data, restricted } = Helpers.getDataBasicPersonIaxis(
          responseIaxis,
          typeDocument
        );
        if (restricted) {
          Validaridentificacion.toggle(true);
          reset({
            typeDocument,
          });
          trigger();
        } else {
          reset({
            ...data,
            typeDocument,
            document,
          });
          trigger();
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      Loading.toggle(false);
    }
  };

  const data = watch();
  const {
    name,
    secondName,
    lastName,
    secondLastName,
    document,
    typeDocument,
    reasonSocialName,
    sharesPercentage
  } = data;

  useEffect(() => {
    handleUpdatedBeneficiaryData(data, index);
  }, [
    name,
    secondName,
    lastName,
    secondLastName,
    document,
    typeDocument,
    reasonSocialName,
    sharesPercentage
  ]);

  const typeDocumentLabel = identifications.find(
    (item) => item.code === +getValues()?.typeDocument
  );

  return (
    <>
      {!confirmDeleteItem && (
        <FormProvider {...{ control }}>
          <div className="row beneficiaries-final mt-3">
            <div className="col-12 ">
              <div className="row">
                <div className="col-9 header">
                  <img src={UserIcon} alt="user icon" />
                  <strong>
                    Beneficiario Final{' '}
                    {isLegalRepresentativeBeneficiary ? index + 2 : index + 1}
                  </strong>
                </div>
                <div className="col-3 header-2">
                  <img
                    src={isEdit ? ArrowUpIcon : EditIcon}
                    width={16}
                    height={16}
                    alt="edit icon"
                    onClick={() => setIsEdit(!isEdit)}
                    onKeyDown={() => setIsEdit(!isEdit)}
                  />
                  <div className="separator" />
                  <img
                    src={DeleteIcon}
                    width={16}
                    height={16}
                    alt="delete icon"
                    onClick={() => setSureDeleteItem(true)}
                    onKeyDown={() => setSureDeleteItem(true)}
                  />
                </div>
                <div className="separator-2" />
              </div>
              {!isEdit && (
                <div className="col-12 header-info ">
                  {+typeDocument === TYPE_DOCUMENT_IS_JURIDIC ? (
                    <p>
                      <span>Razón social</span> <br />
                      <strong>{reasonSocialName || ''}</strong>
                    </p>
                  ) : (
                    <p>
                      <span>Nombre</span> <br />
                      <strong>{`${getValues()?.name || ''} ${
                        getValues()?.secondName || ''
                      } ${getValues()?.lastName || ''} ${
                        getValues()?.secondLastName || ''
                      }`}</strong>
                    </p>
                  )}
                  <p>
                    <span>Tipo de identificación</span> <br />
                    <strong>{typeDocumentLabel?.description || ''}</strong>
                  </p>
                  <p>
                    <span>Identificación</span> <br />
                    <strong>
                      {' '}
                      {getValues()?.document
                        ? Helpers.formatNumberUnit(getValues()?.document)
                        : ''}
                    </strong>
                  </p>
                </div>
              )}

              {isEdit && (
                <div className="col-12">
                  <div className="row fields-row legal-representative">
                    <div className="col col-12 col-sm-12 col-md-6 col-lg-6 no-padding-right">
                      <Controller
                        name="typeDocument"
                        control={control}
                        render={({ field }) => (
                          <TypeDocuments
                            disabled={disabledAll}
                            onChange={({ target: { value } }) => {
                              if (+value === TYPE_DOCUMENT_IS_JURIDIC) {
                                setSchema(schemaLegalBeneficiary);
                              } else {
                                setSchema(schemaNaturalBeneficiary);
                              }
                              setValue('typeDocument', value);
                              trigger('typeDocument');
                              trigger('document');
                              handlerOnBlurCustom();
                            }}
                            value={field.value}
                            error={errors?.typeDocument?.message}
                          />
                        )}
                      />
                    </div>
                    <div className="col col-12 col-sm-12 col-md-6 col-lg-6">
                      <Input
                        label="Identificación"
                        name="document"
                        onBlurCustom={handlerOnBlurCustom}
                        disabled={disabledAll}
                      />
                    </div>
                    {+typeDocument === TYPE_DOCUMENT_IS_JURIDIC ? (
                      <div className="col col-12 col-sm-12  no-padding-right flex justify-content-start">
                        <Input
                          label="Razón social"
                          name="reasonSocialName"
                          disabled={disabledAll}
                        />
                      </div>
                    ) : (
                      <>
                        <div className="col col-12 col-sm-12 col-md-6 col-lg-6 no-padding-right">
                          <Input
                            label="Primer nombre"
                            name="name"
                            disabled={disabledAll}
                          />
                        </div>
                        <div className="col col-12 col-sm-12 col-md-6 col-lg-6">
                          <Input
                            label="Segundo nombre"
                            name="secondName"
                            disabled={disabledAll}
                          />
                        </div>

                        <div className="col col-12 col-sm-12 col-md-6 col-lg-6 no-padding-right">
                          <Input
                            label={'Primer apellido'}
                            name="lastName"
                            disabled={disabledAll}
                          />
                        </div>
                        <div className="col col-12 col-sm-12 col-md-6 col-lg-6">
                          <Input
                            label="Segundo apellido"
                            name="secondLastName"
                            disabled={disabledAll}
                          />
                        </div>
                        <div className="col col-12 col-sm-12 col-md-6 col-lg-6 shares">
                          <Input
                            label="Porcentaje de acciones"
                            name="sharesPercentage"
                            disabled={disabledAll}
                            description="Mínimo 5%, máximo 100%"
                            tooltip={true}
                            percentage={true}
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </FormProvider>
      )}

      {sureDeleteItem && !disabledAll && (
        <Alerts
          type="warning"
          onClose={() => setSureDeleteItem(false)}
          onDelete={() => {
            setSureDeleteItem(false);
            setConfirmDeleteItem(true);
          }}
          handleDeleteBeneficiaryFinal
        />
      )}
      {confirmDeleteItem && (
        <Alerts type="success" onClose={() => setConfirmDeleteItem(false)} />
      )}
    </>
  );
};

BeneficiariesFinalForm.propTypes = {
  beneficiary: PropTypes.object,
  index: PropTypes.number,
  handleDeleteBeneficiaryFinal: PropTypes.func,
  handleUpdatedBeneficiaryData: PropTypes.func,
  isLegalRepresentativeBeneficiary: PropTypes.bool,
  disabledAll: PropTypes.bool,
};

BeneficiariesFinalForm.defaultProps = {
  beneficiary: {},
  index: 0,
  handleDeleteBeneficiaryFinal: () => {},
  handleUpdatedBeneficiaryData: () => {},
  isLegalRepresentativeBeneficiary: false,
  disabledAll: false,
};

export default BeneficiariesFinalForm;
