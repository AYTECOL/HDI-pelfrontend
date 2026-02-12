import {
    hasValidCoordinates,
    isInvalidAddress,
    normalize,
  } from '../../../src/common/helpers/coordenates/validationCoord';
  
  describe('normalize', () => {
    test('convierte null/undefined en string vacío', () => {
      expect(normalize(null)).toBe('');
      expect(normalize(undefined)).toBe('');
    });
  
    test('trim y lower-case', () => {
      expect(normalize('  Hola MUNDO ')).toBe('hola mundo');
    });
  });
  
  describe('hasValidCoordinates', () => {
    test('devuelve false si mapsOptions es null', () => {
      expect(hasValidCoordinates(null)).toBe(false);
    });
  
    test('devuelve false si latitude o longitude son null o vacíos', () => {
      expect(hasValidCoordinates({ latitude: null, longitude: 10 })).toBe(false);
      expect(hasValidCoordinates({ latitude: '', longitude: '10' })).toBe(false);
    });
  
    test('devuelve false si latitude o longitude son 0 (número o string)', () => {
      expect(hasValidCoordinates({ latitude: 0, longitude: 10 })).toBe(false);
      expect(hasValidCoordinates({ latitude: '0', longitude: '10' })).toBe(false);
      expect(hasValidCoordinates({ latitude: '4.65', longitude: '0' })).toBe(false);
    });
  
    test('devuelve false si latitude o longitude no son numéricos', () => {
      expect(hasValidCoordinates({ latitude: 'abc', longitude: '-74.08' })).toBe(
        false
      );
    });
  
    test('devuelve true cuando latitude y longitude son válidos y distintos de 0 (number)', () => {
      expect(hasValidCoordinates({ latitude: 4.65, longitude: -74.08 })).toBe(true);
    });
  
    test('devuelve true cuando latitude y longitude son válidos y distintos de 0 (string)', () => {
      expect(hasValidCoordinates({ latitude: '4.65', longitude: '-74.08' })).toBe(
        true
      );
    });
  });
  
  describe('isInvalidAddress', () => {
    test('devuelve true para palabras clave inválidas (0, null, etc.)', () => {
      expect(isInvalidAddress('0')).toBe(true);
      expect(isInvalidAddress('null')).toBe(true);
      expect(isInvalidAddress('  NULL  ')).toBe(true); // por normalize
    });
  
    test('devuelve true para los textos tipo "sin dirección", "no aplica", etc.', () => {
      expect(isInvalidAddress('sin direccion')).toBe(true);
      expect(isInvalidAddress('Sin Dirección')).toBe(true);
      expect(isInvalidAddress('ninguna')).toBe(true);
      expect(isInvalidAddress('n/a')).toBe(true);
      expect(isInvalidAddress('NA')).toBe(true);
      expect(isInvalidAddress('s/n')).toBe(true);
      expect(isInvalidAddress('nulo')).toBe(true);
    });
  
    test('devuelve false para direcciones válidas', () => {
      expect(isInvalidAddress('Calle 10 # 20-30')).toBe(false);
      expect(isInvalidAddress('cra 50 12-34')).toBe(false);
    });
  });