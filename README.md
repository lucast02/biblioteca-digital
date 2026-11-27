# Biblioteca Digital

**Projeto final — Desenvolvimento Web (A2)**

## Integrante

- Lucas Teves Dalia Morais — RGM:42783062

## Tema e tabelas

Sistema web para gerenciamento de uma biblioteca. O projeto possui quatro tabelas principais e uma tabela separada para autenticação:

| Tabela | Campos principais | Relacionamentos |
|---|---|---|
| Autor | nome, e-mail, biografia | Um autor pode ter vários livros |
| Livro | título, ISBN, ano de publicação, autorId | Cada livro pertence a um autor |
| Leitor | nome, CPF, e-mail, telefone | Um leitor pode ter vários empréstimos |
| Empréstimo | livroId, leitorId, data do empréstimo, devolução prevista e data de devolução | Cada empréstimo pertence a um livro e a um leitor |
| Usuário | nome, e-mail, senhaHash | Usada somente para cadastro e login |

Os campos `email` de Autor e Usuário, `isbn` de Livro, e `cpf`/`email` de Leitor são únicos. A senha da tabela Usuário é armazenada somente como hash bcrypt.

## Tecnologias

- PostgreSQL e Docker Compose
- Prisma ORM
- Node.js, Express e TypeScript
- Zod em `shared`, consumido pela API e pelo frontend
- React, Vite e TypeScript
- Axios
- bcryptjs para hash de senhas
- Swagger UI em `/docs`

## Requisitos

- Node.js 20.19 ou superior (recomendado Node 22 LTS)
- npm 10 ou superior
- Docker Desktop com Docker Compose

## Como executar do zero

Execute os comandos na pasta raiz do projeto.

### 1. Instalar as dependências

```bash
npm install
```

### 2. Configurar as variáveis da API

Crie uma cópia de `api/.env.example` com o nome `api/.env`.

No Windows PowerShell:

```powershell
Copy-Item api/.env.example api/.env
```

No Linux/macOS:

```bash
cp api/.env.example api/.env
```

O arquivo `.env` real não deve ser enviado ao GitHub.

### 3. Subir o PostgreSQL

```bash
docker compose up -d
```

Aguarde o container `biblioteca-postgres` ficar saudável. O banco criado chama-se `biblioteca`.

### 4. Gerar o Prisma Client, aplicar as migrations e inserir os dados

```bash
npm run db:generate
npm run db:migrate
npm run db:seed
```

A migration inicial já está versionada em `api/prisma/migrations`. O comando `db:migrate` usa `prisma migrate dev` para aplicar as migrations e manter o histórico local.

### 5. Iniciar API e frontend

```bash
npm run dev
```

- Frontend: http://localhost:5173
- API: http://localhost:3333
- Swagger: http://localhost:3333/docs
- Verificação da API: http://localhost:3333/health

Para encerrar, use `Ctrl + C`. O banco pode continuar ativo; para desligá-lo:

```bash
docker compose down
```

Para apagar também os dados persistidos localmente (operação irreversível):

```bash
docker compose down -v
```

## Acesso de demonstração

- **E-mail:** `admin@biblioteca.com`
- **Senha:** `Biblioteca@123`

O seed cria também autores, livros, leitores e um empréstimo de exemplo. O cadastro pela tela cria novos usuários.

## Funcionalidades

- Cadastro e login de usuário.
- CRUD de autores, livros, leitores e empréstimos.
- Select de autor no formulário de livro.
- Select de livro e leitor no formulário de empréstimo.
- Listagem de empréstimos com os nomes do livro e do leitor.
- Busca por texto nas listas.
- Validação no frontend e na API usando os mesmos schemas do pacote `shared`.
- Mensagens de validação e de valores únicos exibidas na interface.
- Rotas protegidas por token JWT depois do login.

## Builds exigidos

Na raiz do projeto, execute:

```bash
npm run build --workspace api
npm run build --workspace frontend
```

O primeiro comando compila a API. O segundo compila o frontend. Para garantir que o pacote compartilhado esteja compilado, execute antes `npm run build --workspace shared` ou rode `npm run build` na raiz, que compila os três pacotes na ordem correta.

## Organização do repositório

```text
biblioteca-digital/
├── shared/       # Schemas Zod compartilhados
├── api/          # Express, Prisma, autenticação e Swagger
├── frontend/     # React, Vite, Axios e telas
├── docker-compose.yml
└── README.md
```

## Observações da entrega

Este projeto foi preparado para entrega individual. O vídeo obrigatório não foi produzido. Antes de enviar, preencha o RGM acima e confira o prazo e o formato de envio no Blackboard.
