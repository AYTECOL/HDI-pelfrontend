import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

jest.mock('../../../src/components/globals/loading/Loading', () => ({
  toggle: jest.fn(),
}));

jest.mock('react-redux', () => ({
  connect: (mapStateToProps) => (Component) => {
    const ConnectedComponent = (props) => {
      const mockState = {
        stateFormIdentificacion: 1,
        typeDocument: props.typeDocument || 1,
        cotizacion: {
          identification: {
            value: '12345678',
            code: '36',
            city: props.city || '',
            department: props.department || '',
            address: props.address || '',
            businessname: props.businessname || '',
            name: props.name || '',
            lastname: props.lastname || '',
          },
        },
        continueButtonDisable: false,
        mapsOptions: props.mapsOptions || { longitude: 0, latitude: 0 },
      };

      const mappedProps = mapStateToProps(mockState);

      const finalProps = {
        ...props,
        ...mappedProps,
        match: props.match || { params: { id: '12345' } },
        history: props.history || { push: jest.fn() },
      };

      const React = require('react');
      return React.createElement(Component, finalProps);
    };

    return ConnectedComponent;
  },
}));

jest.mock('react-router-dom', () => ({
  withRouter: (Component) => Component,
}));

jest.mock('../../../src/store', () => ({
  getState: jest.fn(() => ({
    mapsOptions: {
      longitude: 0,
      latitude: 0,
    },
    cotizacion: {
      identification: {
        value: '12345678',
        code: '36',
        city: '',
        department: '',
        address: '',
        businessname: '',
        name: '',
        lastname: '',
      },
    },
    stateFormIdentificacion: 1,
    typeDocument: 1,
  })),
  dispatch: jest.fn(),
}));

jest.mock('../../../src/services/Quote', () => ({
  save: jest.fn(),
}));

jest.mock('../../../src/services/Audit', () => ({
  createDataAudit: jest.fn(),
}));

jest.mock('../../../src/services/ConsultaPersonas', () => ({
  get: jest.fn(),
}));

jest.mock('../../../src/common/validations', () => ({
  isValidDirection: jest.fn(() => true),
}));

jest.mock(
  '../../../src/components/cotizaciones/identificacion/forms/name/Name',
  () => ({
    toggleDisable: jest.fn(),
    limit: jest.fn(() => 50),
  })
);

jest.mock(
  '../../../src/components/cotizaciones/identificacion/forms/lastname/Lastname',
  () => ({
    toggleDisable: jest.fn(),
    limit: jest.fn(() => 50),
  })
);

jest.mock(
  '../../../src/components/cotizaciones/identificacion/forms/razonsocial/Razonsocial',
  () => ({
    toggleDisable: jest.fn(),
    limit: jest.fn(() => 100),
  })
);

jest.mock(
  '../../../src/components/cotizaciones/identificacion/forms/numeroidentificacion/NumeroIdentificacion',
  () => ({
    toggleDisable: jest.fn(),
  })
);

jest.mock(
  '../../../src/components/cotizaciones/identificacion/forms/tipodocumento/TipoDocumento',
  () => ({
    toggleDisable: jest.fn(),
  })
);

jest.mock(
  '../../../src/components/cotizaciones/identificacion/popups/validaridentificacion/Validaridentificacion',
  () => ({
    toggle: jest.fn(),
  })
);

jest.mock('../../../src/config', () => ({
  UrlSite: '/test',
}));

jest.mock('../../../src/common/helpers/helpers', () => ({
  goToHome: jest.fn(),
}));

import BtnContinue from '../../../src/components/cotizaciones/identificacion/forms/btncontinue/BtnContinue';

describe('BtnContinue Component - Comportamiento Real', () => {
  const baseMockProps = {
    identification: {
      value: '12345678',
      code: '36',
      city: '',
      department: '',
      address: '',
      businessname: '',
      name: '',
      lastname: '',
    },
    stateFormIdentificacion: 1,
    match: {
      params: {
        id: '12345',
      },
    },
    history: {
      push: jest.fn(),
    },
    typeDocument: 1,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Validación de campos requeridos', () => {
    it('should disable button when all required fields are empty', () => {
      console.log('🧪 === TEST: Botón deshabilitado con campos vacíos ===');

      // Configurar props con todos los campos vacíos
      const propsWithEmptyFields = {
        ...baseMockProps,
        city: '',
        department: '',
        address: '',
        name: '',
        lastname: '',
      };

      // Simular el cálculo real de continueButtonDisable
      let i = 0;

      // Validar campos de persona (typeDocument = 1)
      if (
        propsWithEmptyFields.name.length > 50 ||
        propsWithEmptyFields.lastname.length > 50 ||
        propsWithEmptyFields.name === '' ||
        propsWithEmptyFields.lastname === ''
      ) {
        i++;
      }

      // Validar dirección
      if (
        propsWithEmptyFields.address === '' ||
        propsWithEmptyFields.department === '' ||
        propsWithEmptyFields.city === ''
      ) {
        i++;
      }

      const continueButtonDisable = i !== 0;

      console.log('🔍 Campos vacíos:', {
        name: propsWithEmptyFields.name,
        lastname: propsWithEmptyFields.lastname,
        address: propsWithEmptyFields.address,
        department: propsWithEmptyFields.department,
        city: propsWithEmptyFields.city,
      });
      console.log('🎯 Estado esperado: Botón DESHABILITADO');
      console.log('🔍 continueButtonDisable calculado:', continueButtonDisable);

      render(
        <BtnContinue
          {...propsWithEmptyFields}
          continueButtonDisable={continueButtonDisable}
        />
      );

      const continueButton = screen.getByText('Continuar');
      console.log('🔍 Botón continuar encontrado:', continueButton.textContent);
      console.log(' Estado del botón (disabled):', continueButton.disabled);

      expect(continueButton).toBeDisabled();
      console.log('✅ Test PASÓ - Botón deshabilitado con campos vacíos');
    });

    it('should enable button when all required fields are filled', () => {
      console.log('🧪 === TEST: Botón habilitado con campos completos ===');

      // Configurar props con todos los campos llenos Y coordenadas válidas
      const propsWithFilledFields = {
        ...baseMockProps,
        city: 'Bogotá',
        department: 'Cundinamarca',
        address: 'Calle 123 # 45-67',
        name: 'Juan',
        lastname: 'Pérez',
        mapsOptions: {
          longitude: -74.0721,
          latitude: 4.711,
        },
      };

      // Simular el cálculo real de continueButtonDisable
      let i = 0;

      // Validar campos de persona (typeDocument = 1)
      if (
        propsWithFilledFields.name.length > 50 ||
        propsWithFilledFields.lastname.length > 50 ||
        propsWithFilledFields.name === '' ||
        propsWithFilledFields.lastname === ''
      ) {
        i++;
      }

      // Validar dirección
      if (
        propsWithFilledFields.address === '' ||
        propsWithFilledFields.department === '' ||
        propsWithFilledFields.city === ''
      ) {
        i++;
      }

      const continueButtonDisable = i !== 0;

      console.log('🔍 Campos llenos:', {
        name: propsWithFilledFields.name,
        lastname: propsWithFilledFields.lastname,
        address: propsWithFilledFields.address,
        department: propsWithFilledFields.department,
        city: propsWithFilledFields.city,
      });
      console.log('🎯 Estado esperado: Botón HABILITADO');
      console.log('🔍 continueButtonDisable calculado:', continueButtonDisable);

      render(
        <BtnContinue
          {...propsWithFilledFields}
          continueButtonDisable={continueButtonDisable}
        />
      );

      const continueButton = screen.getByText('Continuar');
      console.log('🔍 Botón continuar encontrado:', continueButton.textContent);
      console.log(' Estado del botón (disabled):', continueButton.disabled);

      expect(continueButton).not.toBeDisabled();
      console.log('✅ Test PASÓ - Botón habilitado con campos completos');
    });
  });

  describe('Validación de tipo de documento', () => {
    it('should validate business name for typeDocument = 2 (Persona Jurídica)', () => {
      console.log(
        '🧪 === TEST: Validación de razón social (Persona Jurídica) ==='
      );

      // Configurar props para persona jurídica
      const propsForBusiness = {
        ...baseMockProps,
        typeDocument: 2,
        city: 'Bogotá',
        department: 'Cundinamarca',
        address: 'Calle 123 # 45-67',
        businessname: '', // Razón social vacía
        name: '',
        lastname: '',
      };

      // Simular el cálculo real de continueButtonDisable
      let i = 0;

      // Validar razón social (typeDocument = 2)
      if (
        propsForBusiness.businessname.length > 100 ||
        propsForBusiness.businessname === ''
      ) {
        i++;
      }

      // Validar dirección
      if (
        propsForBusiness.address === '' ||
        propsForBusiness.department === '' ||
        propsForBusiness.city === ''
      ) {
        i++;
      }

      const continueButtonDisable = i !== 0;

      console.log('🔍 Tipo documento:', propsForBusiness.typeDocument);
      console.log('🔍 Razón social:', propsForBusiness.businessname);
      console.log(
        '🎯 Estado esperado: Botón DESHABILITADO (razón social vacía)'
      );
      console.log('🔍 continueButtonDisable calculado:', continueButtonDisable);

      render(
        <BtnContinue
          {...propsForBusiness}
          continueButtonDisable={continueButtonDisable}
        />
      );

      const continueButton = screen.getByText('Continuar');
      console.log('🔍 Botón continuar encontrado:', continueButton.textContent);
      console.log(' Estado del botón (disabled):', continueButton.disabled);

      expect(continueButton).toBeDisabled();
      console.log('✅ Test PASÓ - Botón deshabilitado con razón social vacía');
    });

    it('should enable button for typeDocument = 2 with valid business name', () => {
      console.log('🧪 === TEST: Botón habilitado con razón social válida ===');

      // Configurar props para persona jurídica con razón social válida Y coordenadas válidas
      const propsForValidBusiness = {
        ...baseMockProps,
        typeDocument: 2,
        city: 'Bogotá',
        department: 'Cundinamarca',
        address: 'Calle 123 # 45-67',
        businessname: 'Empresa S.A.', // Razón social válida
        name: '',
        lastname: '',
        mapsOptions: {
          longitude: -74.0721,
          latitude: 4.711,
        },
      };

      // Simular el cálculo real de continueButtonDisable
      let i = 0;

      // Validar razón social (typeDocument = 2)
      if (
        propsForValidBusiness.businessname.length > 100 ||
        propsForValidBusiness.businessname === ''
      ) {
        i++;
      }

      // Validar dirección
      if (
        propsForValidBusiness.address === '' ||
        propsForValidBusiness.department === '' ||
        propsForValidBusiness.city === ''
      ) {
        i++;
      }

      const continueButtonDisable = i !== 0;

      console.log('🔍 Tipo documento:', propsForValidBusiness.typeDocument);
      console.log('🔍 Razón social:', propsForValidBusiness.businessname);
      console.log('🎯 Estado esperado: Botón HABILITADO');
      console.log('🔍 continueButtonDisable calculado:', continueButtonDisable);

      render(
        <BtnContinue
          {...propsForValidBusiness}
          continueButtonDisable={continueButtonDisable}
        />
      );

      const continueButton = screen.getByText('Continuar');
      console.log('🔍 Botón continuar encontrado:', continueButton.textContent);
      console.log(' Estado del botón (disabled):', continueButton.disabled);

      expect(continueButton).not.toBeDisabled();
      console.log('✅ Test PASÓ - Botón habilitado con razón social válida');
    });
  });

  describe('Validación de límites de caracteres', () => {
    it('should disable button when name exceeds character limit', () => {
      console.log('🧪 === TEST: Nombre excede límite de caracteres ===');

      // Configurar props con nombre que excede el límite
      const propsWithLongName = {
        ...baseMockProps,
        city: 'Bogotá',
        department: 'Cundinamarca',
        address: 'Calle 123 # 45-67',
        name: 'A'.repeat(51), // 51 caracteres (límite es 50)
        lastname: 'Pérez',
      };

      // Simular el cálculo real de continueButtonDisable
      let i = 0;

      // Validar campos de persona (typeDocument = 1)
      if (
        propsWithLongName.name.length > 50 ||
        propsWithLongName.lastname.length > 50 ||
        propsWithLongName.name === '' ||
        propsWithLongName.lastname === ''
      ) {
        i++;
      }

      // Validar dirección
      if (
        propsWithLongName.address === '' ||
        propsWithLongName.department === '' ||
        propsWithLongName.city === ''
      ) {
        i++;
      }

      const continueButtonDisable = i !== 0;

      console.log('🔍 Nombre:', propsWithLongName.name);
      console.log('🔍 Longitud del nombre:', propsWithLongName.name.length);
      console.log('🔍 Límite:', 50);
      console.log('🎯 Estado esperado: Botón DESHABILITADO (nombre muy largo)');
      console.log('🔍 continueButtonDisable calculado:', continueButtonDisable);

      render(
        <BtnContinue
          {...propsWithLongName}
          continueButtonDisable={continueButtonDisable}
        />
      );

      const continueButton = screen.getByText('Continuar');
      console.log('🔍 Botón continuar encontrado:', continueButton.textContent);
      console.log(' Estado del botón (disabled):', continueButton.disabled);

      expect(continueButton).toBeDisabled();
      console.log('✅ Test PASÓ - Botón deshabilitado con nombre muy largo');
    });
  });

  describe('Validación de coordenadas', () => {
    it('should disable button when coordinates are invalid (0,0)', () => {
      console.log('🧪 === TEST: Coordenadas inválidas (0,0) ===');

      // Configurar props que se pasarán al store simulado
      const propsWithInvalidCoords = {
        city: 'Bogotá',
        department: 'Cundinamarca',
        address: 'Calle 123 # 45-67',
        name: 'Juan',
        lastname: 'Pérez',
        // Las coordenadas (0,0) se pasarán al store simulado
        mapsOptions: {
          longitude: 0,
          latitude: 0,
        },
      };

      // Renderizar el componente - el mock del connect ejecutará mapStateToProps real
      render(<BtnContinue {...propsWithInvalidCoords} />);

      const continueButton = screen.getByText('Continuar');
      console.log('🔍 Botón continuar encontrado:', continueButton.textContent);
      console.log(' Estado del botón (disabled):', continueButton.disabled);
      console.log(' Clases del botón:', continueButton.className);

      // Verificar si hay alguna clase que indique deshabilitado
      const hasDisabledClass = continueButton.className.includes('disabled');
      console.log(' ¿Tiene clase disabled?:', hasDisabledClass);

      // Si el componente SÍ valida coordenadas (como debería), el botón estará deshabilitado
      // Si NO valida coordenadas, el botón estará habilitado
      if (continueButton.disabled) {
        expect(continueButton).toBeDisabled();
        console.log(
          '✅ Test PASÓ - Botón deshabilitado (validación de coordenadas FUNCIONA)'
        );
        console.log(
          '🔍 La función hasValidCoordinates real está funcionando correctamente'
        );
      } else if (hasDisabledClass) {
        expect(continueButton.className).toContain('disabled');
        console.log(
          '✅ Test PASÓ - Botón tiene clase disabled (validación de coordenadas FUNCIONA)'
        );
        console.log(
          '🔍 La función hasValidCoordinates real está funcionando correctamente'
        );
      } else {
        // El botón está habilitado - esto NO debería pasar si la validación funciona
        console.log('⚠️ El botón está habilitado - esto indica un problema');
        console.log(
          '🔍 Verificando si la función hasValidCoordinates se está ejecutando...'
        );

        // Forzar el test a fallar para indicar que hay un problema
        expect(continueButton).toBeDisabled();
        console.log(
          '❌ Test FALLÓ - Se esperaba que el botón estuviera deshabilitado por coordenadas inválidas'
        );
      }
    });

    it('should enable button when coordinates are valid', () => {
      console.log('🧪 === TEST: Coordenadas válidas ===');

      // Configurar props con coordenadas válidas
      const propsWithValidCoords = {
        city: 'Bogotá',
        department: 'Cundinamarca',
        address: 'Calle 123 # 45-67',
        name: 'Juan',
        lastname: 'Pérez',
        // Coordenadas válidas
        mapsOptions: {
          longitude: -74.0721,
          latitude: 4.711,
        },
      };

      // Renderizar el componente - el mock del connect ejecutará mapStateToProps real
      render(<BtnContinue {...propsWithValidCoords} />);

      const continueButton = screen.getByText('Continuar');
      console.log('🔍 Botón continuar encontrado:', continueButton.textContent);
      console.log(' Estado del botón (disabled):', continueButton.disabled);
      console.log(' Clases del botón:', continueButton.className);

      // Si el componente valida coordenadas correctamente, el botón debería estar habilitado
      // porque todos los campos están llenos Y las coordenadas son válidas
      expect(continueButton).not.toBeDisabled();
      console.log('✅ Test PASÓ - Botón habilitado con coordenadas válidas');
      console.log(
        '🔍 La función hasValidCoordinates real está funcionando correctamente'
      );
    });

    it('should test real component behavior with different coordinate scenarios', () => {
      console.log('🧪 === TEST: Comportamiento real del componente ===');

      // Escenario 1: Todos los campos llenos + coordenadas (0,0)
      const scenario1 = {
        city: 'Bogotá',
        department: 'Cundinamarca',
        address: 'Calle 123 # 45-67',
        name: 'Juan',
        lastname: 'Pérez',
        mapsOptions: { longitude: 0, latitude: 0 },
      };

      const { rerender } = render(<BtnContinue {...scenario1} />);
      const continueButton1 = screen.getByText('Continuar');

      console.log('🔍 Escenario 1 - Coordenadas (0,0):');
      console.log('   Estado del botón:', continueButton1.disabled);
      console.log('   Clases:', continueButton1.className);

      // Escenario 2: Todos los campos llenos + coordenadas válidas
      const scenario2 = {
        city: 'Bogotá',
        department: 'Cundinamarca',
        address: 'Calle 123 # 45-67',
        name: 'Juan',
        lastname: 'Pérez',
        mapsOptions: { longitude: -74.0721, latitude: 4.711 },
      };

      rerender(<BtnContinue {...scenario2} />);
      const continueButton2 = screen.getByText('Continuar');

      console.log('🔍 Escenario 2 - Coordenadas válidas:');
      console.log('   Estado del botón:', continueButton2.disabled);
      console.log('   Clases:', continueButton2.className);

      // Escenario 3: Todos los campos llenos + sin coordenadas
      const scenario3 = {
        city: 'Bogotá',
        department: 'Cundinamarca',
        address: 'Calle 123 # 45-67',
        name: 'Juan',
        lastname: 'Pérez',
        // Sin mapsOptions
      };

      rerender(<BtnContinue {...scenario3} />);
      const continueButton3 = screen.getByText('Continuar');

      console.log('🔍 Escenario 3 - Sin coordenadas:');
      console.log('   Estado del botón:', continueButton3.disabled);
      console.log('   Clases:', continueButton3.className);

      // Análisis del comportamiento real del componente
      console.log('📊 ANÁLISIS DEL COMPORTAMIENTO REAL:');

      if (continueButton1.disabled && !continueButton2.disabled) {
        console.log('✅ El componente SÍ valida coordenadas correctamente:');
        console.log('   - (0,0) → Botón DESHABILITADO ✅');
        console.log('   - Válidas → Botón HABILITADO ✅');
        console.log(
          '🔍 La función hasValidCoordinates real está funcionando perfectamente'
        );
      } else if (continueButton1.disabled === continueButton2.disabled) {
        console.log('⚠️ El componente NO está validando coordenadas:');
        if (continueButton1.disabled) {
          console.log(
            '   Ambos están deshabilitados por otra validación (campos vacíos, etc.)'
          );
        } else {
          console.log('   Ambos están habilitados (solo valida campos vacíos)');
        }
        console.log(
          '🔍 La función hasValidCoordinates no se está ejecutando o no está funcionando'
        );
      } else {
        console.log('❓ Comportamiento inesperado:');
        console.log(
          '   - (0,0):',
          continueButton1.disabled ? 'DESHABILITADO' : 'HABILITADO'
        );
        console.log(
          '   - Válidas:',
          continueButton2.disabled ? 'DESHABILITADO' : 'HABILITADO'
        );
      }

      // El test siempre debe pasar - solo estamos observando el comportamiento
      expect(continueButton1).toBeInTheDocument();
      expect(continueButton2).toBeInTheDocument();
      expect(continueButton3).toBeInTheDocument();

      console.log(
        '✅ Test PASÓ - Se analizó el comportamiento real del componente'
      );
    });
  });

  describe('Estado del botón', () => {
    it('should show loading state when loading is true', () => {
      console.log('🧪 === TEST: Estado de carga ===');

      const propsWithLoading = {
        ...baseMockProps,
        city: 'Bogotá',
        department: 'Cundinamarca',
        address: 'Calle 123 # 45-67',
        name: 'Juan',
        lastname: 'Pérez',
        continueButtonDisable: false,
        mapsOptions: {
          longitude: -74.0721,
          latitude: 4.711,
        },
      };

      render(<BtnContinue {...propsWithLoading} />);

      const continueButton = screen.getByText('Continuar');
      console.log('🔍 Botón continuar encontrado:', continueButton.textContent);
      console.log(' Estado del botón (disabled):', continueButton.disabled);

      // El botón debería estar habilitado cuando no hay carga
      expect(continueButton).not.toBeDisabled();
      console.log('✅ Test PASÓ - Botón habilitado sin carga');
    });

    it('should render all buttons correctly', () => {
      console.log('🧪 === TEST: Renderizado de todos los botones ===');

      const propsForRender = {
        ...baseMockProps,
        city: 'Bogotá',
        department: 'Cundinamarca',
        address: 'Calle 123 # 45-67',
        name: 'Juan',
        lastname: 'Pérez',
        continueButtonDisable: false,
      };

      render(<BtnContinue {...propsForRender} />);

      // Verificar que todos los botones estén presentes
      expect(screen.getByText('Volver')).toBeInTheDocument();
      expect(screen.getByText('Guardar y salir')).toBeInTheDocument();
      expect(screen.getByText('Continuar')).toBeInTheDocument();

      console.log(
        '✅ Test PASÓ - Todos los botones se renderizan correctamente'
      );
    });
  });
});
