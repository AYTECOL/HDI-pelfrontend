import { GoodsOverCost } from '../models/types';
export interface QuoteIussed {
  quote_iussed_info: QuoteIussedInfo;
  risk_valoration_info: RiskValorationInfo;
  plan_selected_info: PlanSelectedInfo;
  more_info: MoreInfo;
  status: number;
}

interface MoreInfo {
  Item: MoreInfoItem;
}

export interface MoreInfoItem {
  id: string;
  area: number;
  start_policy_date: string;
  goods_over_cost: GoodsOverCost[];
  visit_person: VisitPerson;
}

export interface VisitPerson {
  name: string;
  phone: string;
  active: number;
}

interface PlanSelectedInfo {
  Item: PlanSelectedInfoItem;
}

export interface PlanSelectedInfoItem {
  coverages: Coverage[];
  assists: Assist[];
  calculation_of_pure_extra_shelter_premium: Array<
    Array<CalculationOfPureExtraShelterPremiumClass[] | string> | string
  >;
  prospect: number;
  premium_after_all_the_rules: Array<
    Array<PremiumAfterAllTheRuleClass[] | string> | string
  >;
  id: string;
  name: string;
  id_plan: string;
}

interface Assist {
  name: string;
  checked: boolean;
  optional: boolean;
  id: number;
  selected_id: string;
  values: AssistElement[];
}

interface AssistElement {
  code: number;
  assists?: AssistElement[];
  name: string;
  checked: boolean;
  description: string;
  optional: boolean;
  id: number;
}

interface CalculationOfPureExtraShelterPremiumClass {
  columnNames: ColumnName[];
  results: Array<Array<Array<number | ResultEnum> | null | string>>;
  rowNames: string[];
}

enum ColumnName {
  Description = 'Description',
  Value = 'Value',
}

enum ResultEnum {
  JavaMathBigDecimal = 'java.math.BigDecimal',
}

export interface Coverage {
  code_content: number;
  values?: CoverageValue[];
  deductible?: Deductible[];
  name: string;
  checked: boolean;
  optional: boolean;
  id: number;
  code?: number;
}

export interface Deductible {
  name: string;
  minimum_salary: number;
  default: boolean;
  id: number;
  percentage: number;
}

export interface CoverageValue {
  value_to_quotate: number;
  value_show?: string;
  code: number;
  name: string;
  optional?: boolean;
  hired: boolean;
  id: number;
  child_name?: string;
  value: number;
  child_code?: number;
  summation?: boolean;
  disable?: boolean;
  values?: PurpleValue[];
}

export interface PurpleValue {
  limit: number;
  default: boolean;
}

export interface PremiumAfterAllTheRuleClass {
  columnNames: ColumnName[];
  results: Array<Array<Array<number | ResultEnum> | string>>;
  rowNames: RowName[];
}

enum RowName {
  Amparo = 'Amparo',
  AsignaPrimaAnual = 'AsignaPrimaAnual',
  Impuesto = 'Impuesto',
  PrimaComercialTM = 'PrimaComercialTM',
  Tasa = 'Tasa',
}

interface QuoteIussedInfo {
  Item: QuoteIussedInfoItem;
}

export interface PersonAditional {
  department_code: number;
  phone_type: string;
  birthdate: string;
  address: string;
  role: number[];
  gender: number | string;
  address_type: string;
  document: string;
  fechadecontitucion: string;
  city_code: number;
  sarlaft_document_url: string;
  first_last_name: string;
  exequiasParticipation: number | string;
  personalAccidents: number | string;
  phone: string;
  ciudad: string;
  second_name: string;
  businessname: string;
  location: string;
  first_name: string;
  email: string;
  second_last_name: string;
  document_type: string;
}

interface QuoteIussedInfoItem {
  persons_aditionals: PersonAditional[];
  insured: any[];
  risk_valoration: string;
  id: string;
  benefist: Taker[];
  onerous: Taker[];
  taker: Taker;
}

export interface Taker {
  department_code: number;
  birthdate: string;
  role: number[];
  gender: number;
  document: string;
  fechadecontitucion: string;
  city_code: number;
  sarlaft_document_url: string;
  code_sarlaft: number;
  first_name: string;
  email: string;
  second_last_name: string;
  document_type: number;
  phone_type: number;
  address: string;
  address_type: string;
  first_last_name: string;
  phone: number;
  person: Person;
  ciudad: number;
  second_name: string;
  businessname: string;
  departamento: string;
  location: string;
}

interface Person {
  consultarPersonaRs: ConsultarPersonaRs;
}

interface ConsultarPersonaRs {
  personaRestringida: boolean;
  informacionExperian: InformacionExperian;
  scoreEncontradoIAXIS: boolean;
  persona: Persona;
  personaEncontradaIAXIS: boolean;
  infoResponse: InfoResponse;
  informacionSARLAFT: InformacionSARLAFT;
}

interface InfoResponse {
  estado: Estado;
  requestID: number;
}

interface Estado {
  descripcionEstado: string;
  severidad: string;
  codigoEstado: number;
  codigoEstadoServidor: number;
}

interface InformacionExperian {
  puntaje: number;
  fechaIAXIS: string;
}

interface InformacionSARLAFT {
  vigente: boolean;
}

interface Persona {
  tipoDocumento: TipoDocumento;
  contacto: Contacto[];
  tipoPersona: TipoDocumento;
  personaNatural: PersonaNatural;
  direccion: Direccion[];
  codigoPersona: number;
  numeroDocumento: number;
}

interface Contacto {
  idContacto: number;
  textoContacto: number | string;
  tipoContacto: TipoDocumento;
}

interface TipoDocumento {
  nombre: null | string;
  codigo: number | null;
}

interface Direccion {
  tipoDireccion: TipoDocumento;
  departamento: TipoDocumento;
  idDireccion: number;
  ciudad: TipoDocumento;
  pais: TipoDocumento;
  textoDireccion: string;
}

interface PersonaNatural {
  segundoNombre: string;
  primerApellido: string;
  primerNombre: string;
  fechaNacimiento: string;
  genero: TipoDocumento;
  segundoApellido: null;
  estadoCivil: TipoDocumento;
  ocupacion: TipoDocumento;
}

interface RiskValorationInfo {
  Item: RiskValorationInfoItem;
}

interface RiskValorationInfoItem {
  inspection_policies: number;
  distribution_of_insured_securities_split: DistributionOfInsuredSecuritiesSplit;
  total_premium_policy: number;
  inmueble_asegudado_obras: number;
  last_update: string;
  inmueble_asegudadovalor: number;
  inmueble_asegudado: number;
  contenido_asegudado_valor: number;
  prospect: number;
  reinforcement_year: number;
  structure_reinforcement: number;
  cojunto_cerrado: number;
  inmueble_asegudado_joyas: number;
  seguridad: Seguridad;
  inmueble_asegudado_joyasvalor: number;
  inmueble_mobile_contents: number;
  inmueble_mobile_contents_value: number;
  contenido_asegudado: number;
  total_tax_policy: number;
  risk_type: number;
  id: string;
  location_zone: number;
  inmueble_asegudado_telefonosvalor: number;
  inmueble_asegudado_obrasvalor: number;
  iva_expedition_expenses: number;
  location_floor: number;
  floors_number: string;
  build_year: string;
  inmueble_asegudado_telefonos: number;
  build_material: string;
  expedition_expenses: number;
}

interface DistributionOfInsuredSecuritiesSplit {
  runtimeContext: { [key: string]: string };
  valorAmparo: { [key: string]: number };
}

interface Seguridad {
  vigilancia_permanente: number;
  puertas_control_domotico: number;
  regulador_de_voltaje: number;
  alarma: number;
  circuito_cerrado_tv: number;
  caja_fuerte: number;
  puertas_seguridad_blindada: number;
}

export class QuoteIussedById {
  static mergeUsers(data): any;

  static async get(id: string): Promise<QuoteIussed>;
}

export default QuoteIussedById;
