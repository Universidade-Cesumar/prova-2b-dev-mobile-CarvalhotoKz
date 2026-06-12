import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import App from '../App';

describe('🚀 Testes Automatizados - Sprint 3 (Dashboard e Alertas)', () => {

  test('👉 [0,5 pt] Deve conter o campo de busca e o contador de totalizador de itens', () => {
    const { getByTestId } = render(<App />);
    
    expect(getByTestId('input-busca')).toBeTruthy();
    expect(getByTestId('total-itens')).toBeTruthy();
  });

  test('👉 [0,5 pt] Campo de busca deve aceitar digitação para filtragem dinâmica', () => {
    const { getByTestId } = render(<App />);
    const inputBusca = getByTestId('input-busca');
    
    fireEvent.changeText(inputBusca, 'Luva');
    expect(inputBusca.props.value).toBe('Luva');
  });
});