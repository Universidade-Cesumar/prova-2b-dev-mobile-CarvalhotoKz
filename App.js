import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { validarRetirada } from './src/utils/validacoes';

const API_URL = 'https://6a2b38bcb687a7d5cbc4f81a.mockapi.io/api/Materiais';
const ESTOQUE_BAIXO_LIMITE = 100;

export default function App() {
  const [nome, setNome] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [retiradas, setRetiradas] = useState({});
  const [busca, setBusca] = useState('');
  const [materiais, setMateriais] = useState([]);
  const [loading, setLoading] = useState(true);

  const normalizarMaterial = (item) => ({
    id: item.id ?? item._id ?? String(Date.now()),
    nome: item.Nome ?? item.nome ?? 'Material',
    quantidade: Number(item.Quantidade ?? item.quantidade ?? 0),
  });

  const carregarMateriais = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Erro ao carregar materiais');
      const dados = await response.json();
      setMateriais(Array.isArray(dados) ? dados.map(normalizarMaterial) : []);
    } catch (error) {
      setMateriais([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarMateriais();
  }, []);

  const cadastrarMaterial = async () => {
    if (!nome.trim() || !quantidade.trim()) return;

    const novoMaterial = {
      Nome: nome.trim(),
      Quantidade: Number(quantidade),
    };

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novoMaterial),
      });

      if (!response.ok) throw new Error('Falha no cadastro');
      const materialCriado = normalizarMaterial(await response.json());
      setMateriais((prev) => [materialCriado, ...prev]);
      setNome('');
      setQuantidade('');
    } catch (error) {
      setMateriais((prev) => [
        { id: Date.now().toString(), ...novoMaterial },
        ...prev,
      ]);
      setNome('');
      setQuantidade('');
    }
  };

  const iniciarEdicao = (item) => {
    setEditingId(item.id);
    // preencher inputs com valores existentes (usar campos maiúsculos do schema quando presentes)
    setNome(item.nome || item.Nome || '');
    setQuantidade(String(item.quantidade ?? item.Quantidade ?? ''));
  };

  const cancelarEdicao = () => {
    setEditingId(null);
    setNome('');
    setQuantidade('');
  };

  const atualizarRetirada = (id, valor) => {
    setRetiradas((prev) => ({
      ...prev,
      [id]: valor,
    }));
  };

  const salvarEdicao = async () => {
    if (!editingId) return;
    if (!nome.trim() || !quantidade.trim()) return;

    const atualizado = {
      Nome: nome.trim(),
      Quantidade: Number(quantidade),
    };

    try {
      const response = await fetch(`${API_URL}/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(atualizado),
      });
      if (!response.ok) throw new Error('Falha ao atualizar');
      const data = normalizarMaterial(await response.json());
      setMateriais((prev) => prev.map((m) => (m.id === editingId ? data : m)));
    } catch (error) {
      setMateriais((prev) => prev.map((m) => (m.id === editingId ? { id: editingId, nome: nome.trim(), quantidade: Number(quantidade) } : m)));
    } finally {
      cancelarEdicao();
    }
  };

  const deletarMaterial = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Falha ao deletar');
      setMateriais((prev) => prev.filter((m) => m.id !== id));
    } catch (error) {
      // fallback: remover localmente mesmo em erro de rede
      setMateriais((prev) => prev.filter((m) => m.id !== id));
    }
  };

  const baixarMaterial = async (item) => {
    const quantidadeRetirada = Number(retiradas[item.id] ?? 0);
    if (!validarRetirada(item.quantidade, quantidadeRetirada)) return;

    const novaQuantidade = item.quantidade - quantidadeRetirada;
    const atualizado = {
      Nome: item.nome,
      Quantidade: novaQuantidade,
    };

    try {
      const response = await fetch(`${API_URL}/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(atualizado),
      });
      if (!response.ok) throw new Error('Falha ao baixar estoque');
      const data = normalizarMaterial(await response.json());
      setMateriais((prev) => prev.map((m) => (m.id === item.id ? data : m)));
    } catch (error) {
      setMateriais((prev) =>
        prev.map((m) => (m.id === item.id ? { ...m, quantidade: novaQuantidade } : m))
      );
    } finally {
      setRetiradas((prev) => ({
        ...prev,
        [item.id]: '',
      }));
    }
  };

  const materiaisFiltrados = materiais.filter((item) =>
    item.nome.toLowerCase().includes(busca.toLowerCase())
  );

  const estaComEstoqueBaixo = (quantidadeAtual) => quantidadeAtual <= ESTOQUE_BAIXO_LIMITE;
  const totalQuantidade = materiaisFiltrados.reduce((total, item) => total + item.quantidade, 0);
  const totalEstoqueBaixo = materiaisFiltrados.filter((item) => estaComEstoqueBaixo(item.quantidade)).length;

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Almoxarifado - Enfermagem</Text>
      <Text style={styles.description}>
        Controle rápido de materiais, cadastro de novos itens e visão do estoque em tempo real.
      </Text>

      <TextInput
        testID="input-nome"
        style={styles.input}
        placeholder="Nome do material"
        value={nome}
        onChangeText={setNome}
      />

      <TextInput
        testID="input-quantidade"
        style={styles.input}
        placeholder="Quantidade"
        keyboardType="numeric"
        value={quantidade}
        onChangeText={setQuantidade}
      />

      <View style={{flexDirection: 'row', gap: 8}}>
        <TouchableOpacity
          testID="btn-cadastrar"
          style={[styles.button, {flex: 1}]}
          onPress={editingId ? salvarEdicao : cadastrarMaterial}
        >
          <Text style={styles.buttonText}>{editingId ? 'Salvar' : 'Cadastrar'}</Text>
        </TouchableOpacity>
        {editingId ? (
          <TouchableOpacity testID="btn-cancelar" style={[styles.button, {flex: 0.4, backgroundColor: '#aaa'}]} onPress={cancelarEdicao}>
            <Text style={styles.buttonText}>Cancelar</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      <TextInput
        testID="input-busca"
        style={styles.input}
        placeholder="Buscar material"
        value={busca}
        onChangeText={setBusca}
      />

      <View style={styles.summaryRow}>
        <Text testID="total-itens" style={styles.summaryText}>
          Total de itens: {materiaisFiltrados.length}
        </Text>
        <Text style={styles.summaryText}>Quantidade total: {totalQuantidade}</Text>
        <Text style={styles.summaryText}>Itens com estoque baixo: {totalEstoqueBaixo}</Text>
      </View>

      <View testID="lista-materials" style={styles.listBox}>
        {loading ? (
          <ActivityIndicator size="small" color="#2F6FED" />
        ) : (
          <FlatList
            testID="lista-materiais"
            data={materiaisFiltrados}
            keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
            renderItem={({ item }) => (
              <View style={styles.itemCard}>
                <View style={styles.itemHeader}>
                  <View>
                    <Text style={styles.itemName}>{item.nome}</Text>
                    <Text style={styles.itemQty}>Qtd: {item.quantidade}</Text>
                    {estaComEstoqueBaixo(item.quantidade) ? (
                      <Text style={styles.lowStockText}>Estoque baixo</Text>
                    ) : null}
                  </View>
                  <View style={styles.itemActions}>
                    <TouchableOpacity onPress={() => iniciarEdicao(item)} style={styles.actionButton}>
                      <Text style={styles.actionEditText}>Editar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity testID={`btn-excluir-${item.id}`} onPress={() => deletarMaterial(item.id)} style={styles.actionButton}>
                      <Text style={styles.actionDeleteText}>Excluir</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.retiradaRow}>
                  <TextInput
                    testID="input-retirada"
                    style={styles.retiradaInput}
                    placeholder="Retirar"
                    keyboardType="numeric"
                    value={String(retiradas[item.id] ?? '')}
                    onChangeText={(value) => atualizarRetirada(item.id, value)}
                  />
                  <TouchableOpacity
                    testID="btn-baixar"
                    style={styles.baixarButton}
                    onPress={() => baixarMaterial(item)}
                    disabled={!validarRetirada(item.quantidade, Number(retiradas[item.id] ?? 0))}
                  >
                    <Text style={styles.buttonText}>Baixar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
            ListEmptyComponent={<Text style={styles.emptyText}>Nenhum material encontrado.</Text>}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FB',
    paddingTop: 24,
    paddingHorizontal: 18,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#23395B',
    marginBottom: 6,
  },
  description: {
    fontSize: 13,
    color: '#5B6B85',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 18,
  },
  input: {
    backgroundColor: '#FFF',
    borderColor: '#D8E1F0',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#2F6FED',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: '700',
  },
  summaryRow: {
    marginBottom: 8,
  },
  summaryText: {
    color: '#23395B',
    fontWeight: '600',
  },
  listBox: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 10,
  },
  itemCard: {
    borderBottomWidth: 1,
    borderBottomColor: '#EDF2F7',
    paddingVertical: 10,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
  },
  actionEditText: {
    color: '#2F6FED',
  },
  actionDeleteText: {
    color: '#D9534F',
  },
  retiradaRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
    alignItems: 'center',
  },
  retiradaInput: {
    flex: 1,
    backgroundColor: '#FFF',
    borderColor: '#D8E1F0',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  baixarButton: {
    backgroundColor: '#1E8E5A',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  itemName: {
    fontSize: 16,
    color: '#23395B',
    fontWeight: '600',
  },
  itemQty: {
    fontSize: 13,
    color: '#5B6B85',
  },
  lowStockText: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: '700',
    color: '#D97706',
  },
  emptyText: {
    color: '#5B6B85',
    textAlign: 'center',
    paddingVertical: 12,
  },
});