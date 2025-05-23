import './styles.scss';
// components
import TypeDocuments from 'components/cotizaciones/identificacion/forms/tipodocumento/TipoDocumento';
// form libs
import { useForm, FormProvider, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
// utils libs
import classNames from 'classnames';
import { useEffect } from 'react';
import Input from 'components/basics/input/input';
import {
  DEFAULT_VALUE_TYPE_DOCUMENT,
  REGEX_ALPHANUMERIC,
  REGEX_ONLY_NUMBERS,
  TYPES_DOCUMENTS,
} from 'assets/constants';
import ConsultaPersonas from 'services/ConsultaPersonas';
import Loading from 'components/globals/loading/Loading';
import Helpers from 'common/helpers/helpers';
import Validaridentificacion from 'components/cotizaciones/identificacion/popups/validaridentificacion/Validaridentificacion';
const schema = yup
  .object()
  .shape({
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
        ' Falta información requerida para el Tomador. Por favor revise el campo Primer nombre'
      ),
    secondName: yup.string(),
    lastName: yup
      .string()
      .required(
        '   Falta información requerida para el Tomador. Por favor revise el campo Primer apellido'
      ),
    secondLastName: yup.string(),
    sharesPercentage: yup
      .number()
      .transform((value) =>
        value === '' || isNaN(value) ? undefined : Number(value)
      )
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
  })
  .required();

const LegalRepresentative = ({
  disabledAll = false,
  hasErrorAddClass = () => {},
  onChangeLegalRepresentative = () => {},
  updateLegalRepresentative = () => {},
  handleChangeIsRestricted = () => {},
  LegalRepresentative = {},
  isLegalRepresentativeBeneficiary,
}) => {
  const methods = useForm({
    mode: 'all',
    defaultValues: {
      typeDocument:
        LegalRepresentative?.typeDocument || DEFAULT_VALUE_TYPE_DOCUMENT,
      document: LegalRepresentative?.document || '',
      name: LegalRepresentative?.name || '',
      secondName: LegalRepresentative?.secondName || '',
      lastName: LegalRepresentative?.lastName || '',
      secondLastName: LegalRepresentative?.secondLastName || '',
      sharesPercentage: LegalRepresentative?.sharesPercentage || '',
    },
    resolver: yupResolver(schema),
  });

  const {
    getValues,
    setValue,
    watch,
    trigger,
    reset,
    formState: { errors },
  } = methods;

  useEffect(() => {
    // initial errors in form
    trigger();
  }, [trigger]);

  const { typeDocument, document, lastName, name, secondLastName, secondName, sharesPercentage } =
    watch();

  useEffect(() => {
    // if form is valid, update data in component parent
    updateLegalRepresentative(getValues());
  }, [typeDocument, document, lastName, name, secondLastName, secondName, sharesPercentage]);

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
          handleChangeIsRestricted();
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

  return (
    <FormProvider {...methods}>
      <div className="row fields-row legal-representative">
        <div className={'col-12 no-padding-right mb-4 '}>
          <h1>Datos del Representante Legal</h1>
          <p>
            El <strong>Representante Legal </strong> es{' '}
            <strong> Beneficiario Final </strong>
          </p>
          <div className={classNames('no-icon form-group answer-select')}>
            <ul className="select-item">
              <li
                className={classNames(
                  isLegalRepresentativeBeneficiary && 'active'
                )}
                onClick={(e) => {
                  e.preventDefault();
                  if (disabledAll) return;
                  onChangeLegalRepresentative();
                }}
              >
                SI
              </li>
              <li
                className={classNames(
                  !isLegalRepresentativeBeneficiary && 'active'
                )}
                onClick={(e) => {
                  e.preventDefault();
                  if (disabledAll) return;
                  onChangeLegalRepresentative();
                }}
              >
                No
              </li>
            </ul>
          </div>
        </div>
        <div className="col col-12 col-sm-12 col-md-6 col-lg-6 no-padding-right">
          <Controller
            name="typeDocument"
            control={methods.control}
            render={({ field }) => (
              <TypeDocuments
                notJuridicOption={true}
                onChange={(e) => {
                  setValue('typeDocument', e.target.value);
                  trigger('typeDocument');
                  trigger('document');
                  /* handlerOnBlurCustom(e); */
                }}
                disabled={disabledAll}
                value={field.value}
                error={errors?.typeDocument?.message}
              />
            )}
          />
        </div>

        <div className="col col-12 col-sm-12 col-md-6 col-lg-6">
          <Input
            disabled={disabledAll}
            label="Identificación"
            name="document"
            onBlurCustom={handlerOnBlurCustom}
          />
        </div>
        <div className="col col-12 col-sm-12 col-md-6 col-lg-6 no-padding-right">
          <Input label="Primer nombre" name="name" disabled={disabledAll} />
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
        {isLegalRepresentativeBeneficiary && (
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
        )}
      </div>
    </FormProvider>
  );
};

export default LegalRepresentative;
