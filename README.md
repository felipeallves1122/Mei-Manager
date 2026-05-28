# MEI Manager 📊

Este repositório contém o **MEI Manager**, um sistema de controle financeiro simplificado projetado para Microempreendedores Individuais (MEI) gerenciarem suas vendas, compras e despesas fixas.

O projeto é dividido em duas partes principais:
1. **`backend`**: API desenvolvida em NestJS conectada a um banco de dados PostgreSQL.
2. **`mei-manager`**: Frontend desenvolvido em Angular.

---

## 🛠️ Pré-requisitos

Para rodar este projeto localmente, você precisará de:
* [Node.js](https://nodejs.org/) (versão 18 ou superior recomendado)
* [PostgreSQL](https://www.postgresql.org/) rodando localmente
* [Angular CLI](https://angular.dev/tools/cli) instalado globalmente (opcional, pode ser executado via `npx` ou scripts do npm)

---

## ⚙️ Configuração e Inicialização

### 1. Banco de Dados (PostgreSQL)
Certifique-se de que o PostgreSQL está ativo e crie um banco de dados chamado `mei_manager`:
```sql
CREATE DATABASE mei_manager;
```
*As credenciais padrão de conexão estão configuradas no arquivo `backend/src/app.module.ts` (host `localhost`, porta `5432`, usuário `postgres`). Se suas credenciais forem diferentes, ajuste as configurações nesse arquivo antes de rodar o backend.*

---

### 2. Inicializando o Backend
Abra o terminal na pasta `backend`, instale as dependências e inicie o servidor:

```bash
cd backend
npm install
npm run start:dev
```
A API estará rodando em `http://localhost:3000/`.

---

### 3. Inicializando o Frontend
Abra outro terminal na pasta `mei-manager`, instale as dependências e inicie o servidor de desenvolvimento:

```bash
cd mei-manager
npm install
npm start
```
O frontend estará acessível em `http://localhost:4200/`.

---

## 🤝 Colaboradores e Edição do Código

Se você deseja permitir que outras pessoas editem este código no GitHub:
1. Suba este repositório para o seu perfil no GitHub.
2. Vá até a aba **Settings** (Configurações) do repositório no GitHub.
3. No menu lateral, clique em **Collaborators** (Colaboradores).
4. Clique no botão **Add people** (Adicionar pessoas) e busque pelo nome de usuário ou e-mail do GitHub de quem você quer dar permissão de edição.
5. A pessoa receberá um convite e, após aceitar, poderá clonar o projeto e enviar commits (`git push`) diretamente.
