/**
 *
 * @param {import('./binaryFileUtilities').FileToSend} param0
 * @param {import('./binaryFileUtilities').AdjuntarDocumentosPolizaBase} param1
 */
export const getArgumentsBinaryFile = (
  { fileKey, ...file },
  { infoRequest, codigoProducto, numeroPoliza }
) => {
  const ficheroDescripcion = { ...file };
  return {
    fileKey,
    infoRequest,
    codigoProducto,
    numeroPoliza,
    ficheroDescripcion,
  };
};
/**
 *
 * @param {import('./binaryFileUtilities').FicheroDescripcion & { value: File; }} param0
 * @param {import('./binaryFileUtilities').AdjuntarDocumentosPolizaBase} param1
 */
export const getFormDataBinaryFile = (
  { value, ...fileToSend },
  { codigoProducto, infoRequest, numeroPoliza }
) => {
  const formdata = new FormData();
  formdata.append('infoRequest', JSON.stringify(infoRequest));
  formdata.append('codigoProducto', JSON.stringify(codigoProducto));
  formdata.append('numeroPoliza', String(numeroPoliza));
  formdata.append('ficheroDescripcion', JSON.stringify(fileToSend));
  formdata.append('file', value);
  return formdata;
};
