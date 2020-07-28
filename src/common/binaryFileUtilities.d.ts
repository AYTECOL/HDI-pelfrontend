declare type AdjuntarDocumentosPolizaBase = {
  infoRequest: InfoRequest;
  codigoProducto: CodigoProducto;
  numeroPoliza: number | string;
};
declare type FicheroDescripcion = {
  codigo: string | number;
  nombre: string;
  categoria?: string;
};
declare type CodigoProducto = {
  codigo: string | number;
};
declare type InfoRequest = {
  requestID: string;
  fecha: string;
  aplicacionCliente: string;
  terminal: string;
  ip: string;
};
declare type FileToSend = FicheroDescripcion & {
  fileKey: string;
};
export declare const getArgumentsBinaryFile: (
  { fileKey, ...file }: FileToSend,
  { infoRequest, codigoProducto, numeroPoliza }: AdjuntarDocumentosPolizaBase
) => {
  fileKey: string;
  infoRequest: InfoRequest;
  codigoProducto: CodigoProducto;
  numeroPoliza: number;
  ficheroDescripcion: FicheroDescripcion;
};
export declare const getFormDataBinaryFile: (
  {
    value,
    ...fileToSend
  }: FicheroDescripcion & {
    value: File;
  },
  { codigoProducto, infoRequest, numeroPoliza }: AdjuntarDocumentosPolizaBase
) => FormData;
