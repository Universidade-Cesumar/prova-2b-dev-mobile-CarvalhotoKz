# SysAlmoxarifado

Aplicativo mobile desenvolvido com React Native e Expo para controle de materiais de almoxarifado da enfermagem. O sistema permite cadastrar, consultar, editar, excluir e baixar itens de estoque, com busca dinamica, alertas visuais de criticidade e tratamento de falhas de rede.

## Objetivo do projeto

Centralizar o gerenciamento de materiais em uma interface simples, rapida e resiliente, reduzindo erros operacionais e dando visibilidade imediata do estado do estoque.

## Principais funcionalidades

- Cadastro de material com nome e quantidade.
- Edicao e exclusao de materiais existentes.
- Baixa de estoque com validacao de retirada.
- Busca em tempo real por nome do material.
- Filtro por status: todos, baixo estoque e normal.
- Dashboard com total de itens visiveis, quantidade total e total de itens criticos.
- Indicador visual para estoque critico quando a quantidade for menor que 10.
- Tratamento de erros de rede com alerta amigavel para o usuario.

## Contrato tecnico implementado

- Campo de busca com `testID="input-busca"`.
- Totalizador com `testID="total-itens"`.
- Itens com quantidade menor que 10 destacados com estilo diferenciado no conteiner.
- Conteiner de item critico com `accessibilityLabel="estoque-critico"`.
- Requisicoes de rede com `try/catch` para evitar fechamento inesperado do app.

## Tecnologias utilizadas

- React Native
- Expo
- JavaScript (ES6+)
- Jest
- Testing Library para React Native

## Estrutura do projeto

```text
.
|-- App.js
|-- index.js
|-- package.json
|-- __tests__/
|   |-- sprint1.test.js
|   |-- sprint2.test.js
|   `-- sprint3.test.js
`-- src/
	`-- utils/
		`-- validacoes.js
```

## Como executar localmente

1. Instale as dependencias:

```bash
npm install
```

2. Inicie o projeto:

```bash
npm start
```

3. Opcoes de execucao:

- Web: `npm start -- --web`
- Android: `npm run android`
- iOS: `npm run ios`

4. No mobile, abra o Expo Go e leia o QR Code exibido no terminal.

## Scripts disponiveis

- `npm start`: inicia o Expo.
- `npm run android`: abre no emulador/dispositivo Android.
- `npm run ios`: abre no simulador iOS.
- `npm run web`: abre no navegador.
- `npm test -- --watchAll=false`: executa os testes automatizados.

## Regras de negocio

- `validarRetirada(estoque, quantidade)` retorna verdadeiro apenas quando a retirada e maior que zero e menor ou igual ao estoque atual.
- O status de estoque critico e ativado quando `quantidade < 10`.
- O totalizador principal considera apenas os itens atualmente visiveis (apos busca e filtro).

## Tratamento de erros e resiliencia

- Todas as operacoes de rede sao protegidas por `try/catch`.
- Em falhas de conectividade, o app exibe alerta amigavel com orientacao para tentar novamente.
- O app aplica fallback local em operacoes de cadastro, edicao, exclusao e baixa para reduzir interrupcao de uso.

## Testes automatizados

Para executar:

```bash
npm test -- --watchAll=false
```

Os testes cobrem:

- Presenca de componentes obrigatorios e `testID`s.
- Comportamento dos campos de entrada.
- Validacao da regra de retirada.
- Busca e totalizador.

## Evidencias visuais (screenshots)

Crie uma pasta `docs/screenshots/` e adicione capturas reais do app em execucao.

Sugestao de capturas:

- Tela inicial com lista de materiais.
- Busca em tempo real filtrando itens.
- Item com estoque critico destacado.
- Alerta exibido em falha de rede.

Exemplo de inclusao no README:

```md
![Tela principal](docs/screenshots/tela-principal.png)
![Busca em tempo real](docs/screenshots/busca-tempo-real.png)
![Estoque critico](docs/screenshots/estoque-critico.png)
![Erro de rede](docs/screenshots/erro-rede.png)
```

## Publicacao

Repositorio: `https://github.com/Universidade-Cesumar/prova-2b-dev-mobile-CarvalhotoKz`

Para entrega final:

- Mantenha este README atualizado.
- Publique o codigo no GitHub.
- Publique um relato no LinkedIn sobre a trajetoria do projeto.
