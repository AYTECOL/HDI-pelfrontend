import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

import Coberturas from '../../../src/components/cotizaciones/cotizacion/coberturas/Coberturas';

// ===================== Mocks de wrappers =====================
jest.mock('react-router-dom', () => ({
  withRouter: (Component) => Component,
}));

jest.mock('react-redux', () => ({
  connect: () => (Component) => (props) =>
    <Component {...props} index={0} match={{ params: { id: 'Q-123' } }} />,
}));

// ===================== Mocks de dependencias =====================
jest.mock('../../../src/common/helpers/helpers', () => ({
  disabled: jest.fn(),
  enabled: jest.fn(),
  toggleSlide: jest.fn(() => () => {}),
}));

jest.mock('../../../src/components/RateNotCalculated', () => () => null);

jest.mock('../../../src/components/cotizaciones/cotizacion/plans/Plans', () => ({
  sendAndValidate: jest.fn(() => Promise.resolve()),
}));

jest.mock('../../../src/store/actions', () => ({
  AllPlans: (plans) => ({ type: 'SET_ALLPLANS', payload: plans }),
}));

jest.mock('../../../src/common', () => ({
  getRulesByCode: jest.fn(() => null), // para que no meta reglas extra
  getTotalCoverage: jest.fn(() => 0),
  getValue: jest.fn((v) => v),
  stateCoverage: jest.fn(() => true),
}));

jest.mock('../../../src/components/cotizaciones/inmueble/forms/MobileContents', () => ({
  nameModel: 'mobile_enabled',
  nameModelValue: 'mobile_value',
}));

// ===================== Mock del store (con subscribe realista) =====================
let storeState;
let listeners = [];

jest.mock('../../../src/store', () => ({
  getState: jest.fn(() => storeState),
  subscribe: jest.fn((cb) => {
    listeners.push(cb);
    // IMPORTANTE: dispara una vez para que showItem corra en mount
    cb();
    return () => {
      listeners = listeners.filter((l) => l !== cb);
    };
  }),
  dispatch: jest.fn((actionOrThunk) => {
    // soporte thunk
    if (typeof actionOrThunk === 'function') {
      return actionOrThunk((action) => {
        // dispatch interno
        if (action?.type === 'SET_ALLPLANS') {
          storeState = { ...storeState, AllPlans: action.payload };
          listeners.forEach((l) => l());
        }
      });
    }

    // soporte action directo
    if (actionOrThunk?.type === 'SET_ALLPLANS') {
      storeState = { ...storeState, AllPlans: actionOrThunk.payload };
      listeners.forEach((l) => l());
    }

    return Promise.resolve();
  }),
}));

// =============================================================

describe('Coberturas - La validación NO debe desaparecer al cambiar un droplist', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    listeners = [];

    // Armamos un plan mínimo que genere el error REAL:
    // getErrorsCoverage() cuando planValue.code es 9692/3017/3008 y NO existe cobertura 9667,
    // compara contra "otrosContenidos" code_content = 9670 y si value_show > valueContenido:
    // error => "Valor asegurado es mayor al reportado en Contenidos"
    const plan = {
      coverages: [
        {
          name: 'Cobertura INPUT (la que queda inválida)',
          code_content: 1111,
          optional: true,
          checked: true,
          values: [
            {
              id: 2,
              hired: true,
              name: 'Valor asegurado',
              code: 9692,          // ✅ fuerza la regla especial
              value_show: '0',
              value_to_quotate: 0,
            },
          ],
        },
        {
          name: 'Otros contenidos (base de comparación)',
          code_content: 9670,     // ✅ buscada por getErrorsCoverage()
          optional: true,
          checked: true,
          values: [
            {
              id: 0,
              hired: true,
              name: 'Contenido base',
              value_show: '100',
              value_to_quotate: 100, // ✅ valueContenido = 100
            },
          ],
        },
        {
          name: 'Cobertura SELECT (droplist)',
          code_content: 2222,
          optional: true,
          checked: true,
          values: [
            {
              id: 9,
              hired: true,
              name: 'Seleccionable',
              code: 5000,
              values: [
                { limit: 10, default: true },
                { limit: 20, default: false },
              ],
              value_show: '10',
              value_to_quotate: 10,
              value: 10,
            },
          ],
        },
      ],
    };

    storeState = {
      indexPlan: 0,
      AllPlans: [plan],
      Inmueble: {},
    };
  });

  it('mantiene el mensaje de error aunque se cambie un droplist de otra cobertura', async () => {
    const errorText = 'Valor asegurado es mayor al reportado en Contenidos';

    const { container } = render(<Coberturas />);

    // Espera a que se pinte el input real (porque showItem corre al suscribirse)
    const input = await waitFor(() =>
      container.querySelector('input[name="item0_0"]')
    );

    // 1) hacemos inválida la cobertura input -> value_show = 150 (mayor a 100)
    fireEvent.change(input, { target: { value: '150' } });

    // Debe aparecer el error
    await waitFor(() => {
      expect(container.textContent).toContain(errorText);
    });

    // 2) cambiamos un select en otra cobertura SIN corregir lo anterior
    const select = container.querySelector('select[name="item0_2"]');
    fireEvent.change(select, { target: { value: '1' } }); // elige limit 20

    // ✅ El error debe seguir visible
    await waitFor(() => {
      expect(container.textContent).toContain(errorText);
    });
  });
});
