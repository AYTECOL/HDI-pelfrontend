require('@testing-library/jest-dom');

// Mock store
jest.mock('../src/store', () => ({
  getState: jest.fn(() => ({
    mapsOptions: {
      longitude: 0,
      latitude: 0,
    },
  })),
  dispatch: jest.fn(),
}));

// Mock Loading
jest.mock('../src/components/globals/loading/Loading', () => ({
  toggle: jest.fn(),
}));

// Mock  validaciones
jest.mock('../src/common/validations', () => ({
  isValidDirection: jest.fn(() => true),
}));

// Mock componentes
jest.mock(
  '../src/components/cotizaciones/identificacion/forms/name/Name',
  () => ({
    toggleDisable: jest.fn(),
    limit: jest.fn(() => 50),
  })
);

jest.mock(
  '../src/components/cotizaciones/identificacion/forms/lastname/Lastname',
  () => ({
    toggleDisable: jest.fn(),
    limit: jest.fn(() => 50),
  })
);

jest.mock(
  '../src/components/cotizaciones/identificacion/forms/razonsocial/Razonsocial',
  () => ({
    toggleDisable: jest.fn(),
    limit: jest.fn(() => 100),
  })
);

jest.mock(
  '../src/components/cotizaciones/identificacion/forms/numeroidentificacion/NumeroIdentificacion',
  () => ({
    toggleDisable: jest.fn(),
  })
);

jest.mock(
  '../src/components/cotizaciones/identificacion/forms/tipodocumento/TipoDocumento',
  () => ({
    toggleDisable: jest.fn(),
  })
);

jest.mock(
  '../src/components/cotizaciones/identificacion/popups/validaridentificacion/Validaridentificacion',
  () => ({
    toggle: jest.fn(),
  })
);

// Mock imágenes SVG
jest.mock(
  '../src/assets/images/informative.svg',
  () => 'mocked-informative-svg'
);
jest.mock('../src/assets/images/hdi_loader.svg', () => 'mocked-hdi-loader-svg');
jest.mock('../src/assets/images/loader.svg', () => 'mocked-loader-svg');
jest.mock('../src/assets/images/icon-back.svg', () => 'mocked-icon-back-svg');
jest.mock('assets/images/informative.svg', () => 'mocked-svg');

// Mock módulos tests
jest.mock('../src/common/helpers/masknumbermoney/Masknumbermoney', () => ({
  formatToMask: jest.fn((value) => value),
  formatToNumber: jest.fn((value) => parseFloat(value) || 0),
}));
