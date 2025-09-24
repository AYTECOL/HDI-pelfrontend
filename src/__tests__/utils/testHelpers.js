import configureStore from 'redux-mock-store';

export const createMockStore = (initialState = {}) => {
  const mockStore = configureStore([]);
  return mockStore(initialState);
};

export const mockMapProps = {
  googleMapURL: 'test-api-key',
  cotizacion: {
    identification: {
      address: 'Test Address',
      city: 'Bogotá',
      department: 'Cundinamarca',
    },
  },
  citiesProps: {
    getCity: jest.fn().mockResolvedValue({
      code_city: 1,
      code_department: 1,
      city: 'Bogotá',
      department: 'Cundinamarca',
    }),
  },
};

export const mockStoreState = {
  mapsOptions: {
    longitude: -74.0721,
    latitude: 4.7110,
    options: { zoom: 10 },
  },
  cityDescription: {},
  cotizacion: {
    identification: {
      address: 'Test Address',
      city: 'Bogotá',
      department: 'Cundinamarca',
    },
  },
};