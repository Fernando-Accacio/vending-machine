🛍 Vending Machine Social

Este projeto implementa um sistema Full-Stack de **Vending Machine Social**, simulando um modelo de **gestão social** onde os produtos retirados são registrados, contabilizados e o custo é rastreado para cobrança posterior de ONGs parceiras.

🌐 **Site em Produção:** [Acessar Site](https://vending-social.vercel.app/)  
⚙️ **API em Produção:** [Acessar API](https://vending-machine-z87w.onrender.com)

---

## ✅ Funcionalidades Principais

O sistema foi estruturado para atender a todas as demandas de um projeto em produção, com divisões claras entre as responsabilidades de cada usuário.

### 👨‍💻 Lado do Cliente (Público)
* **Itens e Cesta:** Catálogo de itens e cálculo do total da retirada.
* **Cálculo de Lead Time Dinâmico:** O carrinho calcula o tempo de retirada baseado na fórmula: `10 min (Fixo) + (Quantidade Solicitada × Tempo de Reposição do Item)`.
* **Histórico de Retiradas:** Usuários logados podem ver seu histórico de pedidos (`/minhas-retiradas`).
* **Autenticação Segura:** Registro e Login por Documento (CPF) e Senha, com proteção de rota para troca de senha.

### 🔐 Lado do Admin (Gerente/ONG)
* **Acesso Restrito:** Painel protegido que exige a role **`GERENTE`**.
* **Gerenciamento de Itens (CRUD):** O gerente pode **Criar, Ler, Atualizar e Deletar** itens do catálogo.
* **Relatórios:** Exibe **todas as retiradas** do sistema, detalhando usuário, itens e o custo total (`/relatorios`).

---

## 📖 Manual de Uso (Cliente) - Vending Machine Social

Este site permite que você selecione e retire itens essenciais (como alimentos, fraldas e produtos de higiene) sem custo. O "Custo Real" que você vê é o valor que será coberto por uma ONG parceira, e o "Valor a Pagar" para você será sempre R$ 0,00.

Veja como usar o sistema:

### 1. Acesso ao Site e Login

Para começar, você deve acessar o site e fazer o login usando suas credenciais (normalmente seu Documento/CPF e uma senha pessoal) para garantir a segurança e o registro de suas retiradas.

### 2. Navegação Principal

Após o login, você verá o menu principal:

* **Home (Itens):** A página principal onde você vê todos os "Itens Disponíveis" para retirada.
* **Minhas Retiradas:** O seu histórico de todos os pedidos que você já fez.
* **Olá, Cliente:** Um menu para gerenciar sua conta.
    * **Mudar Senha e usuário:** Permite atualizar suas informações de login.
    * **Sair:** Desconecta você do sistema com segurança.

### 3. Como Fazer uma Retirada (Passo a Passo)

Este é o processo principal para selecionar e confirmar seus itens.

#### Passo 1: Escolher os Itens (Home)

Na página **Home**, você verá a lista de "Itens Disponíveis". Cada item mostra:
* **Nome e Descrição:** O que é o produto (Ex: Leite em Pó (Lata 400g)).
* **Custo Real:** O valor que a ONG parceira cobrirá (Ex: R$ 15.00).
* **Valor a Pagar:** O custo para você, que será sempre **R$ 0,00**.

Para selecionar um produto, clique no botão **"Adicionar à cesta"**.

#### Passo 2: Gerenciar sua Cesta

Assim que você adiciona um item, o painel **"Minha Cesta"** aparecerá:
* **Ajustar Quantidade:** Você pode usar os botões **`+`** (mais) e **`-`** (menos) para definir quantas unidades de cada item você precisa.
* **Verificar Totais:** A cesta calcula automaticamente o "Custo total (ONG)" e o seu "Total a pagar" (R$ 0,00).
* **Tempo de Retirada:** O sistema mostra um tempo estimado para sua retirada (Ex: 40 min). Esse tempo é calculado dinamicamente com base nos itens e quantidades que você selecionou.

#### Passo 3: Confirmar a Retirada

Quando sua cesta estiver com todos os itens que você precisa, revise o pedido e clique no botão **"Confirmar Retirada"** para finalizar.

### 4. Verificando seu Histórico ("Minhas Retiradas")

Ao clicar em **"Minhas Retiradas"** no menu, você acessa seu histórico completo.
* Cada pedido é listado como uma "Retirada" (Ex: Retirada #1).
* Você pode ver a data, hora, o custo total para a ONG e a lista detalhada de itens que você retirou (Ex: 2x Leite em Pó, 1x Fralda Infantil).

### 5. Gerenciando sua Conta

#### Alterar Senha ou Usuário

1.  Clique no menu **"Olá, Cliente"** e escolha **"Mudar Senha e usuário"**.
2.  Você **deve** digitar sua **"Senha Atual"** para confirmar que é você.
3.  Preencha os campos "Novo Nome de Usuário" ou "Nova Senha" (você pode mudar só um ou os dois).
4.  Clique em **"Salvar Alterações"**.

#### Sair do Sistema

Para proteger sua conta, sempre clique em **"Sair"** no menu quando terminar de usar o site.

---

## 📜 Manual de Uso (Administrador / Gerente ONG)

Este manual é destinado aos usuários com perfil de **Gerente** ou **ONG**, que possuem acesso ao painel de administração para gerenciar o sistema.

### 1. Acesso ao Painel de Admin

O login é feito pela mesma tela do cliente, mas o sistema identificará sua permissão de "GERENTE" e liberará o acesso às áreas restritas.

### 2. Gerenciamento de Itens (CRUD)

Como administrador, você tem controle total sobre o catálogo de produtos disponíveis no site. Você pode:

* **Criar (Create):** Adicionar novos itens ao catálogo, definindo nome, descrição e o "Custo Real" (o valor que será cobrado da ONG).
* **Ler (Read):** Visualizar todos os itens atualmente disponíveis.
* **Atualizar (Update):** Editar informações de itens existentes (Ex: corrigir o custo de um item ou alterar sua descrição).
* **Deletar (Delete):** Remover itens que não serão mais oferecidos.

### 3. Relatórios de Retirada

A seção **"Relatórios"** (/relatorios) é a sua principal ferramenta de gestão e prestação de contas. Nela, você pode visualizar **todas as retiradas** feitas no sistema por todos os usuários.

Os relatórios detalham:
* O usuário que fez a retirada.
* A data e hora do pedido.
* Todos os itens e quantidades de cada retirada.
* O **Custo Total** daquela retirada (o valor a ser cobrado da ONG).

Isso permite um rastreamento completo dos custos e da distribuição dos itens.

---

## 🌐 Arquitetura, Hosting e Estrutura de Pastas

O projeto utiliza uma arquitetura Full-Cloud com as seguintes plataformas:

| Camada | Tecnologia | Plataforma de Publicação |
| :--- | :--- | :--- |
| **Banco de Dados** | **MySQL 8** | **Railway** |
| **Back-end (API)** | **Java 17 / Spring Boot 3** | **Render** |
| **Front-end (Web)** | **Angular 17** | **Vercel** |

### Estrutura de Pastas

O projeto é um **monorepo** com separação clara entre as aplicações:

```

dish-app-java/
├── backend/                  \# Aplicação Spring Boot
│   ├── src/main/java/        \# Código Java (Controladores, Serviços, Configurações)
│   ├── src/main/resources/   \# Arquivos de Configuração (.properties)
│   └── pom.xml               \# Dependências Maven
└── frontend/                 \# Aplicação Angular
├── src/app/
│   ├── components/       \# Componentes reutilizáveis (Formulários, Listas)
│   ├── pages/            \# Componentes de rotas (Login, Gerente, Cliente)
│   ├── services/         \# Lógica de negócio e comunicação com a API
│   └── app.config.ts     \# Configurações de rotas e injeção (Interceptors, Guards)
└── angular.json          \# Configuração do Workspace Angular

Este repositório inclui a pasta screenshots/, contendo imagens de exemplo do site em funcionamento, e o arquivo schema.sql, que contém a exportação completa do banco de dados (estrutura e dados) para importação e teste local.

---

## ⚙️ Configuração (Local vs. Nuvem)

Para alternar entre ambientes de desenvolvimento (local) e produção (nuvem), é necessário configurar a URL da API e as credenciais do banco.

### 1. Configuração do Back-end (Conexão com Banco)

Para rodar o back-end (`/backend`), as credenciais do banco de dados são injetadas através de **Variáveis de Ambiente**.

| Variável | Uso |
| :--- | :--- |
| `DB_URL` | Endereço (`shortline.proxy.rlwy.net:30748`) |
| `DB_NAME` | Nome do Schema (`railway`) |
| `DB_USER` | Usuário do MySQL (root) |
| `DB_PASS` | Senha do MySQL |

> **Para rodar LOCALMENTE (Eclipse/IntelliJ):** Estas variáveis devem ser configuradas na aba **Environment Variables** da sua **Run Configuration**.

> **Para rodar na NUVEM (Render):** Estas variáveis devem ser configuradas na seção **Environment** do seu Web Service no Render.

### 2. Configuração do Front-end (`env.ts`)

O arquivo `frontend/src/app/services/config/env.ts` define a URL da API que o Angular deve utilizar:

| Ambiente | `production` | `apiUrl` |
| :--- | :--- | :--- |
| **TESTE LOCAL** | `false` | `'http://localhost:8081'` |
| **PRODUÇÃO** | `true` | `'https://vending-machine-z87w.onrender.com'` |

**Instrução de Uso:**
* **Ao desenvolver (local):** Mantenha `production: false` e `apiUrl` apontando para `localhost`.
* **Ao publicar (Vercel):** Mude para `production: true` e `apiUrl` para a URL do Render, e então faça o `commit` e `push`.

---

## 🛠️ Como Rodar o Projeto Localmente

### 1. Iniciar Back-end

1.  Configure as **Environment Variables** na sua IDE (conforme instrução acima).
2.  Rode a `ComandaDigitalApplication.java` no Eclipse/IntelliJ.
3.  O servidor estará em `http://localhost:8081`.

### 2. Iniciar Front-end

1.  Ajuste o `frontend/src/app/services/config/env.ts` para o modo **Local** (`localhost:8081`).
2.  No terminal, na pasta `frontend/`:
    ```bash
    npm install
    ng serve
    ```
3.  O aplicativo estará em `http://localhost:4200/`.