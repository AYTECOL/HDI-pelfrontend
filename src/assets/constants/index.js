export const STEP_QUOTATION = [1, 2, 3]; //Codigos para los registros en estado Cotizacion
export const STEP_ISSUE = [4, 5, 6];
export const STEP_EMITTED = [7];

export const LIMITS_EXCEPTIONS_SARLAFT = {
  LIMIT_PRIMA: 6960000,
  LIMIT_VALUE_INSURED: 156600000,
};
export const OPTIONS_TYPES_RISK = {
  HOUSE: 1,
  APARTMENT: 2,
};

export const ROLES_KEY = {
  IS_TAKER: 1,
  IS_INSURED: 2,
  IS_BENEFICIARY: 3,
  IS_ONEROUS: 4,
};

export const COD_COVERAGES_INSURED = {
  ACCIDENTS_PERSON: 716,
  OBSEQUIES: 774,
};

export const VALIDITY_QUOTES_DAYS = 30;

export const DEFAULT_VALUE_TYPE_DOCUMENT = 36;
export const TYPE_DOCUMENT_IS_JURIDIC = 37;
export const REGEX_ONLY_NUMBERS = /^[0-9]+$/;
export const REGEX_ALPHANUMERIC = /^[a-zA-Z0-9]+$/;
export const TYPES_DOCUMENTS = {
  PASSPORT: '40',
  DIPLOMATIC_CARD: '44',
};

export const MONTHS = [
  'enero',
  'febrero',
  'marzo',
  'abril',
  'mayo',
  'junio',
  'julio',
  'agosto',
  'septiembre',
  'octubre',
  'noviembre',
  'diciembre',
];

export const STATUS = {
  EMITTED: 'EMITTED',
  QUOTATION: 'QUOTATION',
  PROCESS_IN_EMISSION: 'PROCESS_IN_EMISSION',
};
