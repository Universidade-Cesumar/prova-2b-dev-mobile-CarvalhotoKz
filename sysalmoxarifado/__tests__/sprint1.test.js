import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import App from '../App';

describe('🚀 Testes Automatizados - Sprint 1 (Fundação e Inventário)', () => {
  
  test('👉 [0,5 pt] Deve conter todos os elementos obrigatórios com os testIDs corretos', () => {
    const { getByTestId } = render(<App />);
    
    expect(getByTestId('input-nome')).toBeTruthy();
    expect(getByTestId('input-quantidade')).toBeTruthy();
    expect(getByTestId('btn-cadastrar')).toBeTruthy();
    expect(getByTestId('lista-materials')).toBeTruthy(); // Ajustado conforme nomenclatura do contrato
  });

  test('👉 [0,5 pt] Inputs devem aceitar a digitação dos dados normalmente', () => {
    const { getByTestId } = render(<App />);
    
    const inputNome = getByTestId('input-nome');
    const inputQuantidade = getByTestId('input-quantidade');
    
    fireEvent.changeText(inputNome, 'Seringa 10ml');
    fireEvent.changeText(inputQuantidade, '50');
    
    expect(inputNome.props.value).toBe('Seringa 10ml');
    expect(inputQuantidade.props.value).toBe('50');
  });
});