/**
 * Pruebas para Parches 1, 2 y 3.
 * P1: Al presionar Continuar NO se rehidrata con extractDataFromIaxis (no pisa departmentCode/cityCode editados).
 * P2: updatePerson actualiza state.persons (plural) con inmutabilidad (opcional si exportas __TEST_ONLY__ desde Index).
 * P3: nextStep usa person['ciudad'] (no persons['ciudad']).
 */

import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';

// ======================= RUTAS A AJUSTAR =======================
// Desde /test hacia /src es ../src (porque test está fuera de src)
const BTN_CONTINUE_MODULE = '../../../src/components/emisiones/identificacion/forms/btncontinue/BtnContinue';
const INDEX_PAGE_MODULE   = '../../../src/components/emisiones/identificacion/index/Index';
// ===============================================================

let BtnContinue;
try {
  const mod = require(BTN_CONTINUE_MODULE);
  BtnContinue = mod.default || mod.BtnContinue || null;
} catch (_) {
  BtnContinue = null;
}

let TEST_ONLY = null; // para P2 (opcional)
try {
  const modIndex = require(INDEX_PAGE_MODULE);
  TEST_ONLY = modIndex.__TEST_ONLY__ || null;
} catch (_) {
  TEST_ONLY = null;
}

const renderBtnContinue = (props) => {
  if (!BtnContinue) {
    throw new Error(
      `No pude importar ${BTN_CONTINUE_MODULE}. ` +
      `Exporta el componente o ajusta la ruta en este test.`
    );
  }
  return render(<BtnContinue {...props} />);
};

describe('P1 — No rehidratar ni pisar campos editados al Continuar', () => {
  test('Al continuar se preservan departmentCode y cityCode editados por el usuario', () => {
    // Persona ya editada en el modal por el usuario
    const personEdited = {
      id: 'p-1',
      departmentCode: '11', // valor EDITADO
      cityCode: '11001',    // valor EDITADO
      ciudad: 'Bogotá',
      other: 'x',
    };

    // El array persons podría tener otros
    const persons = [
      { id: 'p-1', departmentCode: '11', cityCode: '11001', ciudad: 'Bogotá' },
      { id: 'p-2', departmentCode: '05', cityCode: '05001', ciudad: 'Medellín' }
    ];

    const onNext = jest.fn();

    renderBtnContinue({ person: personEdited, persons, onNext });

    // Recomendado: tu botón Continuar tenga data-testid="btn-continue"
    const btn =
      screen.queryByTestId('btn-continue') ||
      screen.getByRole('button', { name: /continuar/i });

    fireEvent.click(btn);

    expect(onNext).toHaveBeenCalledTimes(1);
    const payload = onNext.mock.calls[0][0] || {};

    // No se pisan los cambios del usuario (no hubo rehidratación)
    expect(payload.person?.departmentCode).toBe('11');
    expect(payload.person?.cityCode).toBe('11001');

    // Asegura que no regresen claves snake_case
    if (payload.person) {
      expect('department_code' in payload.person).toBe(false);
      expect('city_code' in payload.person).toBe(false);
    }
  });
});

describe('P3 — nextStep usa person.ciudad (no persons["ciudad"])', () => {
  test('location del payload refleja la ciudad de `person` actual, no la del array', () => {
    const person = {
      id: 'p-1',
      ciudad: 'Bogotá',     // correcto
      cityCode: '11001',
      departmentCode: '11',
    };

    const persons = [
      // Valor "erróneo" en el array para detectar mal uso
      { id: 'p-1', ciudad: 'ErrorCity-Array', cityCode: 'xxxxx', departmentCode: 'xx' }
    ];

    const onNext = jest.fn();

    renderBtnContinue({ person, persons, onNext });

    const btn =
      screen.queryByTestId('btn-continue') ||
      screen.getByRole('button', { name: /continuar/i });

    fireEvent.click(btn);

    expect(onNext).toHaveBeenCalledTimes(1);
    const payload = onNext.mock.calls[0][0] || {};

    // Toma la ubicación del objeto person actual
    const location =
      payload.location ??
      payload.person?.ciudad ??
      payload.ciudad;

    expect(location).toBe('Bogotá');
  });
});

(TEST_ONLY ? describe : describe.skip)('P2 — updatePerson actualiza state.persons (plural) con inmutabilidad', () => {
  test('Modifica persons[index] sin tocar state.person (singular) ni mutar el estado previo', () => {
    const { updatePerson } = TEST_ONLY;
    if (typeof updatePerson !== 'function') {
      throw new Error(
        'No encontré updatePerson en __TEST_ONLY__. ' +
        'Expórtalo como `export const __TEST_ONLY__ = { updatePerson }` en src/pages/Index.'
      );
    }

    const prevState = {
      person: { // singular
        id: 'p-1',
        cityCode: '11001',
        departmentCode: '11',
      },
      persons: [
        { id: 'p-1', cityCode: '11001', departmentCode: '11', ciudad: 'Bogotá' },
        { id: 'p-2', cityCode: '05001', departmentCode: '05', ciudad: 'Medellín' },
      ],
      meta: { untouched: true },
    };

    const snapshot = JSON.parse(JSON.stringify(prevState));
    const index = 0;

    // Usamos snake_case en la entrada para comprobar que normalizas a camelCase
    const nextState = updatePerson(prevState, {
      index,
      key: 'city_code',
      value: '76001',
    });

    // Inmutabilidad
    expect(nextState).not.toBe(prevState);
    expect(nextState.persons).not.toBe(prevState.persons);
    expect(prevState).toEqual(snapshot);

    // Se actualiza persons[0].cityCode y NO se toca state.person
    expect(nextState.persons[0].cityCode).toBe('76001');
    expect(nextState.person).toEqual(prevState.person);

    // No altera otros elementos/slices
    expect(nextState.persons[1]).toEqual(prevState.persons[1]);
    expect(nextState.meta).toEqual(prevState.meta);

    // Limpieza snake_case
    expect('city_code' in nextState.persons[0]).toBe(false);
  });
});
