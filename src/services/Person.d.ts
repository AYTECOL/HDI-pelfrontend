export interface ResConsultarPersonaRs {
  consultarPersonaRs: ConsultarPersonaRs;
}

export interface ConsultarPersonaRs {
  personaRestringida: boolean;
  informacionExperian: InformacionExperian;
  scoreEncontradoIAXIS: boolean;
  persona: Persona;
  personaEncontradaIAXIS: boolean;
  infoResponse: InfoResponse;
  informacionSARLAFT: InformacionSARLAFT;
}

export interface InfoResponse {
  estado: Estado;
  requestID: number;
}

export interface Estado {
  descripcionEstado: string;
  severidad: string;
  codigoEstado: number;
  codigoEstadoServidor: number;
}

export interface InformacionExperian {
  puntaje: number;
  fechaIAXIS: string;
}

export interface InformacionSARLAFT {
  vigente: boolean;
}

export interface Persona {
  tipoDocumento: TipoDocumento;
  contacto: Contacto[];
  tipoPersona: TipoDocumento;
  personaNatural: PersonaNatural;
  direccion: Direccion[];
  codigoPersona: number;
  numeroDocumento: number;
}

export interface Contacto {
  idContacto: number;
  textoContacto: number;
  tipoContacto: TipoDocumento;
}

export interface TipoDocumento {
  nombre: null | string;
  codigo: number | null;
}

export interface Direccion {
  tipoDireccion: TipoDocumento;
  departamento: TipoDocumento;
  idDireccion: number;
  ciudad: TipoDocumento;
  pais: TipoDocumento;
  textoDireccion: string;
}

export interface PersonaNatural {
  segundoNombre: string;
  primerApellido: string;
  primerNombre: string;
  fechaNacimiento: null;
  genero: TipoDocumento;
  segundoApellido: null;
  estadoCivil: TipoDocumento;
  ocupacion: TipoDocumento;
}
