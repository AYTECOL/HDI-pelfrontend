import { ResConsultarPersonaRs } from './Person';

export interface PolicyRequest {
  business_name: string;
  attachedFile: boolean;
  policy: Policy;
  department: number;
  document_type: number;
  indermediatecode: string;
  create_at: string;
  step: number;
  address: string;
  document_number: string;
  quoteId: string;
  name: string;
  city: number;
  last_name: string;
  address_additional: string;
  intntermediate: Intntermediate;
  longitude: number;
  infoGeocodingSig: InfoGeocodingSig;
  plan_selected_info: object;
  status: string;
  latitude: number;
  person: ResConsultarPersonaRs;
}

export interface InfoGeocodingSig {
  features: Feature[];
  exceededTransferLimit: boolean;
  spatialReference: SpatialReference;
  fields: Field[];
  displayFieldName: null;
  geometryType: string;
}

export interface Feature {
  attributes: Attributes;
  geometry: Geometry;
}

export interface Attributes {
  AMENAZA_IN_ESTRUC: string;
  AMENAZA_INCENDIO: string;
  COD_AMENAZA_MOV_MASA: number;
  COD_AMENAZA_IMPACTO: number;
  AMENAZA_AMIT: string;
  COD_AMENAZA_IN_ESTRUC: number;
  COD_AMENAZA_VI_FUERTES: number;
  FID_T_Features: number;
  COD_AMENAZA_INCENDIO: number;
  AMENAZA_HUMO: string;
  AMENAZA_INUNDACION: string;
  AMENAZA_TSUNAMI: string;
  AMENAZA_EXPLOSION: string;
  COD_AMENAZA_INUNDACION: number;
  X: number;
  COD_AMENAZA_HUMO: number;
  Y: number;
  COD_AMENAZA_CR: number;
  FID_AMENAZA_COLOMBIA_TOTAL2: number;
  COD_AMENAZA_RC: number;
  COD_AMENAZA_TSUNAMI: number;
  COD_AMENAZA_EXPLOSION: number;
  AMENAZA_VI_FUERTES: string;
  COD_AMENAZA_HUR_SIM: number;
  AMENAZA_HUR_CAL: string;
  COD_AMENAZA_HUR_CAL: number;
  COD_AMENAZA_DANO_AGUA: number;
  AMENAZA_GRANIZO: string;
  OID: number;
  AMENAZA_CR: string;
  AMENAZA_DANO_AGUA: string;
  AMENAZA_RC: string;
  AMENAZA_DANOS_EE: string;
  COD_AMENAZA_VOLCANICA: number;
  AMENAZA_HURACAN: string;
  AMENAZA_MOV_MASA: string;
  AMENAZA_SISMICA: string;
  AMENAZA_VOLCANICA: string;
  COD_AMENAZA_HURACAN: number;
  AMENAZA_IMPACTO: string;
  COD_AMENAZA_SISMICA: number;
  COD_AMENAZA_AMIT: number;
  AMENAZA_HUR_SIM: string;
  COD_AMENAZA_DANOS_EE: number;
  COD_AMENAZA_GRANIZO: number;
}

export interface Geometry {
  x: number;
  y: number;
}

export interface Field {
  name: string;
  type: Type;
  alias: string;
  length?: number;
}

export enum Type {
  EsriFieldTypeDouble = 'esriFieldTypeDouble',
  EsriFieldTypeInteger = 'esriFieldTypeInteger',
  EsriFieldTypeOID = 'esriFieldTypeOID',
  EsriFieldTypeSmallInteger = 'esriFieldTypeSmallInteger',
  EsriFieldTypeString = 'esriFieldTypeString',
}

export interface SpatialReference {
  wkid: number;
  latestWkid: number;
}

export interface Intntermediate {
  Sucursal: string;
  app: string;
  agente: string;
  stick: string;
  usuario: string;
  nombreUsuario: string;
  perfil: string;
}

export interface Policy {}

export default class GetQuote {
  static get(): Promise<PolicyRequest[]>;
  static async getById(id: string): Promise<PolicyRequest>;
  static async getPlanSelected(quotesIds: Array): Promise<Any>;
  static async getMoreInfoPolicies(quotesIds: Array): Promise<Any>;
}

export default GetQuote;
