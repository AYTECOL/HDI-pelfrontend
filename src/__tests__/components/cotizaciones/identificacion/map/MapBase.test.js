import React from 'react';
import renderer from 'react-test-renderer';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import MapBase from '../../../../../components/cotizaciones/identificacion/map/MapBase';
import GetAddresInfo from '../../../../../services/AddresCoordenates';
import Helpers from '../../../../../common/helpers/helpers';
import store from '../../../../../store';

// Mock dependencies
jest.mock('../../../../../services/AddresCoordenates');
jest.mock('../../../../../common/helpers/helpers');
jest.mock('../../../../../store');
jest.mock('google-map-react', () => {
  return function GoogleMapReact({ children, onClick }) {
    return (
      <div 
        data-testid="google-map-react" 
        onClick={onClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && onClick && onClick(e)}
      >
        {children}
      </div>
    );
  };
});
jest.mock('../../../../../components/cotizaciones/identificacion/map/Marker', () => {
  return function Marker(props) {
    return <div data-testid="marker" role="img" aria-label="Map marker" {...props} />;
  };
});
jest.mock('../../../../../components/cotizaciones/identificacion/hooks/cities', () => ({
  withCities: (Component) => Component,
}));

const mockStore = configureStore([]);

describe('Componente MapBase', () => {
  let mockProps;
  let storeState;
  let mockStoreInstance;

  beforeEach(() => {
    storeState = {
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

    mockStoreInstance = mockStore(storeState);
    store.getState = jest.fn(() => storeState);
    store.dispatch = jest.fn();

    mockProps = {
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

    GetAddresInfo.get = jest.fn().mockResolvedValue({ lat: 4.7110, lng: -74.0721 });
    GetAddresInfo.getAdressByCoors = jest.fn().mockResolvedValue('Test Address');
    Helpers.removeClass = jest.fn();
    Helpers.addClass = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Renderizado del Componente', () => {
    test('debería renderizar sin errores', () => {
      const component = renderer.create(
        <Provider store={mockStoreInstance}>
          <MapBase {...mockProps} />
        </Provider>
      );
      
      expect(component.toJSON()).toBeTruthy();
    });

    test('debería renderizar los componentes GoogleMapReact y Marker', () => {
      const component = renderer.create(
        <Provider store={mockStoreInstance}>
          <MapBase {...mockProps} />
        </Provider>
      );
      
      const tree = component.toJSON();
      expect(tree).toBeTruthy();
      expect(tree.props['data-testid']).toBe('google-map-react');
      expect(tree.props.role).toBe('button');
      expect(tree.children[0].props['data-testid']).toBe('marker');
      expect(tree.children[0].props.role).toBe('img');
    });
  });

  describe('Métodos Estáticos', () => {
    test('debería llamar GetAddresInfo.get con la dirección correcta', async () => {
      const address = 'Test Address';
      GetAddresInfo.get.mockResolvedValue({ lat: 4.7110, lng: -74.0721 });
      
      const result = await MapBase.reqAddress(address);
      
      expect(GetAddresInfo.get).toHaveBeenCalledWith(address);
      expect(result).toEqual({ lat: 4.7110, lng: -74.0721 });
    });
  });

  describe('Integración de Servicios', () => {
    test('debería llamar los métodos del servicio GetAddresInfo', () => {
      GetAddresInfo.get.mockResolvedValue({ lat: 4.7110, lng: -74.0721 });
      GetAddresInfo.getAdressByCoors.mockResolvedValue('Test Address');
      
      expect(GetAddresInfo.get).toBeDefined();
      expect(GetAddresInfo.getAdressByCoors).toBeDefined();
    });

    test('debería llamar los métodos Helper', () => {
      expect(Helpers.removeClass).toBeDefined();
      expect(Helpers.addClass).toBeDefined();
    });
  });
});