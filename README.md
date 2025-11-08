Com certeza\! Aqui está o arquivo `README.md` completo, incluindo a arquitetura de pastas e as instruções de configuração do `env.ts` para ambientes local e de nuvem.

```markdown
# Vending Machine Social (Projeto de Formação Técnica)

![Status](https://img.shields.io/badge/status-CONCLU%C3%8DDO-brightgreen)
![Java](https://img-shields.io/badge/Java-17-blue)
![Spring](https://img.shields.io/badge/Spring_Boot-3.3-green)
![Angular](https://img.shields.io/badge/Angular-17-red)
![MySQL](https://img.shields.io/badge/MySQL-Railway-orange)

Este projeto implementa um sistema Full-Stack de **Vending Machine Social**, simulando um modelo de **gestão social** onde os produtos retirados são registrados, contabilizados e o custo é rastreado para cobrança posterior de ONGs parceiras.

---

## ✅ Funcionalidades Principais

O sistema foi estruturado para atender a todas as demandas de um projeto em produção, com divisões claras entre as responsabilidades de cada usuário.

### 👨‍💻 Lado do Cliente (Público)
* **Cardápio e Carrinho:** Catálogo de itens e cálculo do total da retirada.
* **Cálculo de Lead Time Dinâmico:** O carrinho calcula o tempo de retirada baseado na fórmula: `10 min (Fixo) + (Quantidade Solicitada × Tempo de Reposição do Item)`.
* **Histórico de Retiradas:** Usuários logados podem ver seu histórico de pedidos (`/minhas-retiradas`).
* **Autenticação Segura:** Registro e Login por Documento (CPF) e Senha, com proteção de rota para troca de senha.

### 🔐 Lado do Admin (Gerente/ONG)
* **Acesso Restrito:** Painel protegido que exige a role **`GERENTE`**.
* **Gerenciamento de Itens (CRUD):** O gerente pode **Criar, Ler, Atualizar e Deletar** itens do catálogo.
* **Relatórios:** Exibe **todas as retiradas** do sistema, detalhando usuário, itens e o custo total (`/relatorios`).

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

````

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
```