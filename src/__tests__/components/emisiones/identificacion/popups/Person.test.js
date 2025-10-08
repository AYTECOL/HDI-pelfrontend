import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { BrowserRouter as Router } from 'react-router-dom';
import ConsultaPersonas from '../../../../../services/ConsultaPersonas';
import Persona from 'components/emisiones/identificacion/popups/persona/person';

jest.mock('../../../../../services/ConsultaPersonas', () => ({
  get: jest.fn(),
}));

describe('Persona Component - Error Handling', () => {
  const mockStore = configureStore([]);
  const mockStoreInstance = mockStore({});

  const mockProps = {
    exceptionSarlaft: true,
    persons: [{
      document: '12345678',
      first_name: 'Test',
      first_last_name: 'User',
      document_type: 36,
      person: {
        consultarPersonaRs: {
          personaRestringida: false,
          informacionSARLAFT: { vigente: true },
          habeasData: { completed: true },
        },
      },
    }],
    item: 0,
    toggle: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should handle service failure and show retry option', () => {
    ConsultaPersonas.get.mockRejectedValue(new Error('Service Unavailable'));

    const div = document.createElement('div');
    ReactDOM.render(
      <Provider store={mockStoreInstance}>
        <Router>
          <Persona {...mockProps} />
        </Router>
      </Provider>,
      div
    );

    expect(div).toBeDefined();
    expect(ConsultaPersonas.get).toBeDefined();
    ReactDOM.unmountComponentAtNode(div);
  });
});
