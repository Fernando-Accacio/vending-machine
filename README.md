# Vending Machine Social (Projeto de Formação Técnica)

![Status](https://img.shields.io/badge/status-conclu%C3%ADdo-brightgreen)
![Java](https://img.shields.io/badge/Java-17-blue)
![Spring](https://img.shields.io/badge/Spring_Boot-3.3-green)
![Angular](https://img.shields.io/badge/Angular-17-red)
![MySQL](https://img.shields.io/badge/MySQL-8.0-orange)

Este projeto é um sistema Full-Stack de **Vending Machine Social**, simulando a distribuição automatizada de produtos essenciais. O sistema implementa um modelo de gestão social onde os produtos retirados são registrados, contabilizados e o custo é rastreado para cobrança posterior de ONGs parceiras.

O projeto foi desenvolvido como parte da Formação Técnica, transformando um antigo projeto de e-commerce ("Los Gourmet") em um sistema de logística social robusto.

---

## 🚀 Funcionalidades Principais

O sistema é dividido em duas frentes: a interface pública (Cliente) e o painel de gestão (Gerente/ONG).

### 👨‍💻 Lado do Cliente (Público)
* **Cardápio de Itens:** Visualização dos itens sociais disponíveis (ex: Fraldas, Absorventes, Arroz) com seus custos.
* **Cálculo de Lead Time:** O carrinho calcula dinamicamente o tempo de retirada baseado na fórmula: `Tempo Fixo da Máquina (10 min) + (Quantidade × Tempo de Reposição do Item)`.
* **Sistema de Conta:**
    * **Registro Seguro:** Usuários podem criar uma conta (com senha criptografada em BCrypt).
    * **Login por Documento:** Autenticação segura usando Documento (CPF) e Senha.
    * **Troca de Senha:** Usuários logados podem alterar a própria senha com segurança (validando a senha antiga).
* **Registro de Retirada:** Ao "Finalizar", a retirada é registrada no banco de dados (tabela `withdrawals`), contabilizando o custo para o usuário.

### 🔐 Lado do Admin (Gerente/ONG)
* **Acesso Seguro:** Painel protegido que só pode ser acessado por usuários com `role` de "gerente".
* **Gerenciamento de Itens (CRUD):** O gerente pode Criar, Ler, Atualizar e Deletar itens do catálogo, incluindo `nome`, `descrição`, `custo` e `tempo de reposição`.
* **Relatório de Retiradas:** O gerente tem acesso a uma página de "Relatórios" que exibe **todas as retiradas** feitas no sistema, mostrando o usuário, os itens, a data e o **custo total para cobrança da ONG**.

---

## 🛠️ Tecnologias Utilizadas

Este projeto é um "monorepo" contendo duas aplicações separadas:

* **Back-end (`/backend`)**
    * **Java 17**
    * **Spring Boot 3** (com `spring-boot-starter-web`)
    * **Spring Security 6** (para segurança de endpoints e criptografia `BCrypt`)
    * **JWT (Java Web Token)** (para autenticação stateless)
    * **Spring Data JPA (Hibernate)** (para comunicação com o banco)
    * **MySQL 8** (Banco de Dados relacional)

* **Front-end (`/frontend`)**
    * **Angular 17** (usando Standalone Components)
    * **TypeScript**
    * **CSS Moderno** (com variáveis e layout Flexbox/Grid)
    * **Angular Router** (para navegação)
    * **Auth0 Angular-JWT** (para interceptar e enviar o token automaticamente)

---

## ⚙️ Como Rodar o Projeto Localmente

Siga estes passos para rodar a aplicação na sua máquina.

### Pré-requisitos
* **Java JDK 17** (ou superior)
* **Node.js 18** (ou superior)
* **MySQL 8** (ou um servidor compatível, como o XAMPP)
* Uma IDE Java (ex: **Eclipse** ou IntelliJ)
* Um editor de código (ex: **VS Code**)
* (Opcional) **HeidiSQL** ou DBeaver para gerenciar o banco.

### 1. Configuração do Back-end (Eclipse)

1.  Abra seu servidor MySQL (XAMPP, MySQL Workbench, etc.).
2.  Usando o HeidiSQL (ou similar), crie um novo banco de dados (schema) chamado `comanda_digital`.
3.  Abra a pasta `backend/` como um projeto Maven existente na sua IDE (Eclipse/IntelliJ).
4.  Vá para o arquivo `backend/src/main/resources/application.properties`.
5.  Altere as linhas `spring.datasource.username` e `spring.datasource.password` para bater com o seu usuário e senha do MySQL (ex: `root` e `root`).
6.  Encontre e rode o arquivo `ComandaDigitalApplication.java`.
7.  O Spring Boot vai iniciar. No console, você verá o Hibernate **criar automaticamente** todas as tabelas (`users`, `dishes`, `withdrawals`, etc.).
8.  O back-end estará rodando em `http://localhost:8081`.

### 2. Configuração do Front-end (VS Code)

1.  Abra a pasta **raiz** do projeto (`dish-app-java/`) no VS Code.
2.  Abra um novo terminal.
3.  Entre na pasta do front-end: `cd frontend`
4.  Instale as dependências: `npm install`
5.  Inicie o servidor de desenvolvimento: `ng serve`
6.  O front-end estará rodando em `http://localhost:4200`.

### 3. Criando Usuários (Importante!)

O sistema não permite que usuários se registrem como "Gerente" por segurança.

1.  **Para criar um Usuário Cliente:**
    * Vá em `http://localhost:4200/register`.
    * Crie uma conta. O `role` será "cliente" por padrão.
2.  **Para criar um Usuário Gerente (Admin):**
    * **Método 1 (Recomendado):** Crie um usuário "cliente" (como no passo 1).
    * Vá no HeidiSQL, abra a tabela `users`.
    * Encontre o usuário que você criou e mude o valor da coluna `role` de "cliente" para "gerente".
    * **Método 2 (SQL):** Rode o script abaixo no seu HeidiSQL para criar um admin (Documento: `123`, Senha: `admin`).
    ```sql
    INSERT INTO users (name, email, password, role, documento) 
    VALUES (
      'Admin Vending', 
      'admin@vending.com', 
      '$2a$10$f/d.m.61KjL/sA.1Nms5vu6.NlqgQ.d1TyN.a2/a/133sJbC.v8s6', 
      'gerente', 
      '123'
    );
    ```