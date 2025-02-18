export interface AuditRequest {
  id: number;
  opcion: string;
  respuesta?: Array;
  campo_filtro?: Array;
  fecha_ejecucion?: string;
  clave_broker: string;
  username: string;
  celular: string;
  nombreIntermediario: string;
  sucursal: string;
  identificacion?: string;
  respuesta_identificacion?: Array;
  cotizacion?: string;
  cotizacion_fecha?: any;
  id_ciudad?: string;
  id_departamento?: string;
  riesgo?: string;
  prima?: string;
  poliza?: string;
}

export default class GetQuote {
  static createDataAudit(body: Object, date?: boolean): Promise<AuditRequest[]>;
}

export default GetQuote;
