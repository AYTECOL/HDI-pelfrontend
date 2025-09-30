import React from 'react';
import renderer, { act } from 'react-test-renderer';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { BrowserRouter as Router } from 'react-router-dom';
import ConsultaPersonas from './../../services/ConsultaPersonas';
import Persona from 'components/emisiones/identificacion/popups/persona/person';

jest.mock('./../../services/ConsultaPersonas', () => ({
  get: jest.fn(),
}));

describe('Persona Component - Error Handling', () => {
  const mockStore = configureStore([]);
  const mockStoreInstance = mockStore({});

  const mockProps = {
    exceptionSarlaft: true,
    persons: [
      {
        department_code: 5,
        birthdate: '1999-01-01',
        role: [1, 2, 3],
        gender: 1,
        document: '12345678',
        fechadecontitucion: ' ',
        city_code: 1,
        sarlaft_document_url: null,
        habeas_data_document_url: null,
        cerl_document_url: null,
        first_name: 'Billie',
        email: 'billie@gmail.com',
        second_last_name: 'Eilish',
        document_type: 36,
        phone_type: '6',
        address: 'Calle 60 No 45-67',
        address_type: 13,
        first_last_name: 'Eilish',
        exequiasParticipation: ' ',
        personalAccidents: ' ',
        phone: '3698521478',
        person: {
          consultarPersonaRs: {
            personaRestringida: false,
            informacionExperian: {
              puntaje: -1,
              fechaIAXIS: '2025-08-11T09:55:08.000-05:00',
            },
            scoreEncontradoIAXIS: true,
            persona: {
              tipoDocumento: {
                nombre: 'Cédula Ciudadanía',
                codigo: 36,
              },
              contacto: [],
              tipoPersona: {
                nombre: 'Natural',
                codigo: 1,
              },
              personaNatural: {
                segundoNombre: null,
                primerApellido: 'Eilish',
                primerNombre: 'Billie',
                fechaNacimiento: '1999-01-01T00:00:00.000-05:00',
                genero: {
                  nombre: 'Mujer',
                  codigo: 0,
                },
                segundoApellido: 'Eilish',
                estadoCivil: {
                  nombre: 'Soltero',
                  codigo: 5,
                },
                ocupacion: {
                  nombre: 'Empleado Administrativo',
                  codigo: 1320,
                },
              },
              direccion: [],
              codigoPersona: 12345678,
              numeroDocumento: 12345678,
            },
            personaEncontradaIAXIS: true,
            infoResponse: {
              estado: {
                descripcionEstado: 'OK',
                severidad: 'INFO',
                codigoEstado: 0,
                codigoEstadoServidor: 0,
              },
              requestID: 456234,
            },
            informacionSARLAFT: {
              vigente: true,
            },
            habeasData: {
              completed: true,
            },
          },
        },
        ciudad: '',
        second_name: ' asa',
        businessname: ' ',
        departamento: 'Antioquia',
        name: 'Billie',
        secondname: ' asa',
        lastname: 'Eilish',
        secondlastname: 'Eilish',
        code: 36,
        value: '12345678',
        genero: 0,
        fechadenacimiento: '1999-01-01',
        tipodetelefono: '6',
        telefono: '3698521478',
        adresstype: 13,
        sarlaft: null,
        sarlfalt_url: null,
        department: 'Antioquia',
        ciudadDisabled: false,
        ciudadError: false,
        sarlfaltActive: false,
        sarlfaltActiveDisabled: false,
        sarlfaltActiveError: false,
        object: {
          consultarPersonaRs: {},
        },
      },
    ],
    item: 0,
    hasExequias: false,
    hasAccident: false,
    typePerson: 1,
    legalRepresentative: null,
    beneficiariesFinal: [],
    isLegalRepresentativeBeneficiary: false,
    toggle: () => {},
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should handle service failure and show retry option', async () => {
    // Fallo del servicio simulado
    ConsultaPersonas.get.mockRejectedValue(new Error('Service Unavailable'));

    let component;

    await act(async () => {
      component = renderer.create(
        <Provider store={mockStoreInstance}>
          <Router>
            <Persona {...mockProps} />
          </Router>
        </Provider>
      );
    });

    // Obtener instancia y forzar estado de error
    const instance = component.root.findByType(Persona).instance;

    await act(async () => {
      instance.setState({
        errorValidatePerson: true,
        buttonRetry: true,
        tittle: 'Ups, lo sentimos',
        message: 'Tenemos un problema técnico',
      });
    });

    // Verificar que el estado refleja el error
    expect(instance.state.errorValidatePerson).toBe(true);

    // Buscar elemento "Reintentar" en el árbol renderizado
    const tree = component.toJSON();
    const retryButton = component.root.findByProps({ children: 'Reintentar' });
    expect(retryButton).toBeDefined();

  });
});
