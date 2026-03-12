import Coberturas from '../../../src/components/cotizaciones/cotizacion/coberturas/Coberturas';
import Masknumbermoney from '../../../src/common/helpers/masknumbermoney/Masknumbermoney';

jest.mock('../../../src/common/helpers/masknumbermoney/Masknumbermoney', () => ({
  formatToNumber: jest.fn((val) => parseFloat(val) || 0),
  formatToMask: jest.fn((val) => val),
}));

describe('Validación de Blindaje: getErrorsCoverage + Masknumbermoney', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Debe llamar a Masknumbermoney con "0" cuando el valor de Inmueble es undefined', () => {
    // Escenario: El store tiene un valor undefined para Inmueble (9667)
    const mockPlan = {
      coverages: [
        {
          code_content: 9667,
          values: [{ id: 10, value_show: undefined }]
        }
      ]
    };

    const planValue = { code: 3008, value_show: '500000', id: 10 };

    Coberturas.getErrorsCoverage(mockPlan, planValue, 0, 1);

    // Si el parche (value_show || '0') funciona, Masknumbermoney NO debe recibir undefined.
    // Debe haber sido llamado con '0' o ignorado por la validación de existencia.

    const llamadasConUndefined = Masknumbermoney.formatToNumber.mock.calls.filter(call => call[0] === undefined);

    expect(llamadasConUndefined.length).toBe(0);
    console.log(':white_check_mark: Masknumbermoney nunca recibió undefined.');
  });

  test('showItem debe procesar todo el plan sin romperse cuando hay datos nulos', () => {
    // Mock de las funciones necesarias de la instancia del componente
    const mockComponent = {
      setState: jest.fn((state, cb) => cb && cb()),
      toggleValid: jest.fn(),
    };

    const planCorrupto = {
      coverages: [
        {
          code_content: 9667,
          values: [{ id: 1, value_show: undefined }]
        }
      ]
    };

    // Ejecutamos showItem
    expect(() => {
      Coberturas.prototype.showItem.call(mockComponent, planCorrupto);
    }).not.toThrow();

    // Verificamos que Masknumbermoney fue llamado con el fallback '0'
    expect(Masknumbermoney.formatToNumber).toHaveBeenCalledWith('0');
    console.log(':white_check_mark: showItem completó el ciclo usando el fallback "0"');
  });

  test('Caso Retoma: No debe generar errores si el Inmueble no está en el plan', () => {
    const planSinInmueble = { coverages: [] };
    const planValue = { code: 9692, value_show: '1000' };

    const errors = Coberturas.getErrorsCoverage(planSinInmueble, planValue, 0, 1);

    // No debe haber crash y debe retornar un array vacío (permitiendo el flujo)
    expect(Array.isArray(errors)).toBe(true);
    expect(errors.length).toBe(0);
  });
});