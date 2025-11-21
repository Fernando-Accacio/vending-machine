# 🛍 Vending Machine Social

Este projeto implementa um sistema **Full-Stack** que simula uma **Vending Machine Social**, onde os produtos retirados são registrados, contabilizados e o custo é repassado para ONGs parceiras. O usuário final sempre paga **R$ 0,00**.

🌐 **Site em Produção:** [*Acessar Site*](https://vending-social.vercel.app/)

---

## ✅ Funcionalidades Principais

O sistema foi construído com foco em produção real, separando claramente as responsabilidades entre Cliente e Admin.

### 👨‍💻 Lado do Cliente (Público)

- **Itens com Imagem:** Catálogo visual de produtos.
- **Cesta e Retirada:** Seleção de itens, cálculo automático e custo sempre zerado para o usuário.
- **Cálculo de Lead Time:** `10 min + (Quantidade × Tempo de Reposição)`.
- **Histórico de Retiradas:** Tela completa com todas as retiradas feitas.
- **Gestão de Conta:** Editar dados, trocar senha e desativar conta.
- **Autenticação Segura:** Login por CPF e senha.

### 🔐 Lado do Admin (Gerente/ONG)

- **Acesso Restrito:** Painel liberado apenas para usuários com role `GERENTE`.
- **CRUD de Itens:** Criar/editar/deletar produtos com imagem.
- **Upload de Imagens:** Via Cloudinary ou link direto.
- **Gestão de Beneficiários:** Bloquear/Ativar usuários, visualizar histórico individual.
- **Relatórios Gerais:** Todas as retiradas do sistema, com detalhes completos.

---

# 📖 Manual do Cliente

Este site permite a retirada de itens essenciais gratuitamente. O custo real é pago por uma ONG parceira.

### 1. Acesso e Login
Entre no site e faça login com seu CPF e senha.

### 2. Navegação
- **Home:** Lista de itens disponíveis.
- **Minhas Retiradas:** Histórico completo.
- **Olá, Cliente:** Mudar senha, editar dados, desativar conta ou sair.

### 3. Como Fazer uma Retirada

#### Passo 1 – Escolher Itens
Cada item exibe:
- Foto  
- Nome/descrição  
- Custo Real (ONG)  
- Valor a pagar (sempre R$ 0,00)

Clique em **Adicionar à cesta**.

#### Passo 2 – Gerenciar a Cesta
- Ajuste quantidades (+ / -).  
- Totais calculados automaticamente.  
- Lead Time exibido baseado na fórmula do sistema.

#### Passo 3 – Confirmar Retirada
Revise e clique em **Confirmar Retirada**.

### 4. Minhas Retiradas
Lista completa com:
- Data e hora  
- Itens retirados  
- Custo total da ONG  

### 5. Gerenciar Conta
- **Alterar senha/usuário**  
- **Desativar conta**  
- **Sair** com segurança  

---

# 📜 Manual do Administrador / Gerente ONG

### 1. Acesso ao Painel
Login é o mesmo do cliente, mas com permissões elevadas.

### 2. Gerenciamento de Itens
- CRUD completo  
- Upload via Cloudinary ou link externo  

### 3. Gestão de Beneficiários
- Listagem geral  
- Bloquear/Ativar contas  
- Histórico individual por cliente  

### 4. Relatórios Gerais
Visualização completa de todas as retiradas do sistema.

---

# 🌐 Arquitetura, Hosting e Infraestrutura

| Camada                 | Tecnologia            | Plataforma | Detalhes |
|------------------------|-----------------------|-----------|----------|
| Banco de Dados         | MySQL 8               | Railway   | Hospedagem principal |
| Back-end (API)         | Java 17 / Spring Boot | Render    | Usa variáveis de ambiente e Cloudinary |
| Front-end (Web)        | Angular 17            | Vercel    | Cliente/Admin |
| Armazenamento Imagens  | Cloudinary            | —         | URLs públicas das imagens |

---

# 📁 Estrutura de Pastas

```txt
dish-app-java/
├── backend/                     # Aplicação Spring Boot
│   ├── src/main/java/           # Controladores, Serviços, Configurações
│   ├── src/main/resources/      # application-*.properties
│   └── pom.xml                  # Dependências Maven
└── frontend/                    # Aplicação Angular
    ├── src/app/
    │   ├── components/          # Componentes reutilizáveis
    │   ├── pages/               # Telas Cliente/Admin
    │   ├── services/            # Comunicação com API
    │   └── app.config.ts        # Rotas, Guards e Interceptors
    └── angular.json             # Config do workspace
````

O repositório também inclui:

* `screenshots/` – prints do sistema
* `schema.sql` – estrutura completa do banco

---

# ⚙️ Configuração de Ambiente e Segurança

### 1. Variáveis de Ambiente (Back-end)

| Variável                             | Uso                            |
| ------------------------------------ | ------------------------------ |
| DB_URL / DB_NAME / DB_USER / DB_PASS | Banco MySQL                    |
| CLOUDINARY_CLOUD_NAME                | Nuvem Cloudinary               |
| CLOUDINARY_API_KEY                   | Chave pública                  |
| CLOUDINARY_API_SECRET                | Chave secreta (NUNCA commitar) |

### Como usar:

* **Local:** preencher `application-local.properties`
* **Render:** configurar em *Environment Variables*

---

### 2. Config Angular (env.ts)

| Ambiente | production | apiUrl                                         |
| -------- | ---------- | ---------------------------------------------- |
| Local    | false      | [http://localhost:8081](http://localhost:8081) |
| Produção | true       | URL do Render                                  |

---

# 🛠️ Como Rodar Localmente

### 1. Backend

* Preencher `application-local.properties`
* Rodar `ComandaDigitalApplication.java`
* Servidor em: `http://localhost:8081`

### 2. Frontend

```bash
npm install
ng serve
```

👉 Acessar em: `http://localhost:4200/`