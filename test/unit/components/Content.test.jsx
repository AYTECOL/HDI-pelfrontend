import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Content from '../../../src/components/emisiones/informacion/Content';

jest.mock('assets/images/informative.svg', () => 'mocked-svg');
// Mock de las dependencias
jest.mock('common/helpers/masknumbermoney/Masknumbermoney', () => ({
  formatToMask: jest.fn((value) => value),
  formatToNumber: jest.fn((value) => parseFloat(value) || 0),
}));

describe('Content Component', () => {
  const mockProps = {
    content: {
      type: '1',
      caracte: 'Test item',
      value: '1000',
      real_value: '1000',
    },
    items: [
      { id: '1', label: 'Item 1' },
      { id: '2', label: 'Item 2' },
    ],
    item: { id: '1', label: 'Item 1', max: 5000 },
    handleChange: jest.fn(),
    updateContent: jest.fn(),
    removeContent: jest.fn(),
    changeTextFile: jest.fn(),
    maximum: 10000,
    getErrors: jest.fn(() => null),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render correctly', () => {
    render(<Content {...mockProps} />);
    expect(screen.getByText('Tipo de item')).toBeInTheDocument();
    expect(screen.getByText('Características')).toBeInTheDocument();
    expect(screen.getByText('Valor')).toBeInTheDocument();
    expect(screen.getByText('Valor real')).toBeInTheDocument();
  });

  describe('Content Component - Filtrado de valores', () => {
    it('should filter non-numeric characters from value input (Valor asegurado)', () => {
      console.log('🧪 === TEST: Campo VALOR (Asegurado) ===');

      const { container } = render(<Content {...mockProps} />);

      const valueInput = container.querySelector('input[name="value"]');
      const inputValue = '1000abc123';
      const expectedValue = '1000123';

      console.log('�� Campo: Valor asegurado');
      console.log('📥 Input original:', inputValue);
      console.log('🎯 Valor esperado:', expectedValue);

      fireEvent.change(valueInput, { target: { value: inputValue } });

      expect(mockProps.handleChange).toHaveBeenCalledWith({
        value: expectedValue,
        type: 'INSURED',
      });

      console.log('✅ Test PASÓ - Campo Valor asegurado');
    });

    it('should filter non-numeric characters from real value input (Valor real)', () => {
      console.log('🧪 === TEST: Campo VALOR REAL ===');

      const { container } = render(<Content {...mockProps} />);

      const allValueInputs = container.querySelectorAll('input[name="value"]');
      const realValueInput = allValueInputs[1]; // Segundo input

      const inputValue = '2000xyz456';
      const expectedValue = '2000456';

      console.log('🔍 Campo: Valor real');
      console.log('📥 Input original:', inputValue);
      console.log('🎯 Valor esperado:', expectedValue);

      fireEvent.change(realValueInput, { target: { value: inputValue } });

      expect(mockProps.handleChange).toHaveBeenCalledWith({
        value: expectedValue,
        type: 'REAL_VALUE',
      });

      console.log('✅ Test PASÓ - Campo Valor real');
    });
  });
});
