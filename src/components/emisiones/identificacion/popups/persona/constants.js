import { fieldsParticipation } from './ParticipationPercentages/utils';

export const fieldsNames = {
  fechadecontitucion: 'fechadecontitucion',
  documentfield: 'documentfield',
  email: 'email',
  adresstype: 'adresstype',
  address: 'address',
  ciudad: 'ciudad',
  ...fieldsParticipation,
};

export const TYPES_FILES = {
  SARLAFT: 'SARLAFT',
  HABEAS_DATA: 'HABEAS_DATA',
  CERL: 'CERL',
};

export const TYPES_FILES_LABEL = {
  SARLAFT: {
    id: 'sarlaft',
    name: 'sarlaft',
    description: 'Adjunta sarlaft diligenciado',
  },
  HABEAS_DATA: {
    id: 'habeasData',
    name: 'Habeas Data',
    description: 'Adjunta Habeas Data diligenciado',
  },
  CERL: {
    id: 'cerl',
    name: 'Certificado de Existencia y Representación Legal',
    description:
      'adjunta este certificado o documento equívalente para las Estructuras sin Personería Jurídica (con vígencia no superior a 30 días)',
  },
};

export const TYPES_PHONES = {
  MOBILE: '6',
};
