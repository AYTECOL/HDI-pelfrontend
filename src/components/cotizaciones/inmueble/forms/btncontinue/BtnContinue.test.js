import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import BtnContinue from './BtnContinue'; // Ajusta el path de importación según el nombre de tu archivo

// 1. Mockeamos el store global
jest.mock('../../../../../store', () => ({
    dispatch: jest.fn(),
    getState: jest.fn(() => ({
        cotizacion: {},
        Inmueble: {}
    }))
}));

// 2. Mockeamos los servicios para que no intenten ejecutar HTTP requests al montar
jest.mock('services/CreateOrUpdateValoration', () => ({ save: jest.fn() }));
jest.mock('services/Quote', () => ({ save: jest.fn() }));
jest.mock('services/Audit', () => ({ createDataAudit: jest.fn() }));
jest.mock('common/helpers/helpers', () => ({
    goToHome: jest.fn(),
    addClass: jest.fn(),
    removeClass: jest.fn()
}));

// 3. Mock estratégico del ModalAlert
// Reemplazamos el modal real por un div estático que simplemente imprime la propiedad "message"
jest.mock('components/globals/Modal', () => {
    return function DummyModal({ message }) {
        return <div data-testid="modal-alert-mock">{message}</div>;
    };
});

describe('Pruebas en el componente <BtnContinue />', () => {

    it('Debe contener el texto de alerta de riesgo actualizado sin mencionar al asesor comercial', () => {
        // Renderizamos el componente envuelto en un Router porque usa "withRouter"
        render(
            <BrowserRouter>
                <BtnContinue />
            </BrowserRouter>
        );

        // Verificamos que las nuevas líneas de texto existan en el DOM
        expect(
            screen.getByText(/No es posible continuar con la cotización por/i)
        ).toBeInTheDocument();

        expect(
            screen.getByText(/la ubicación en donde se encuentra el riesgo./i)
        ).toBeInTheDocument();

        // Verificamos estrictamente que el texto anterior ya NO exista
        expect(
            screen.queryByText(/contactar con su asesor comercial/i)
        ).not.toBeInTheDocument();
    });
});