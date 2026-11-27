# Biblioteca Digital

Projeto feito para a atividade de Desenvolvimento Web (A2). A ideia é ter um sistema simples para organizar as informações de uma biblioteca, como livros, autores, leitores e empréstimos.

## Integrante

- Lucas Teves Dalia Morais — RGM: 42783062

## Sobre o projeto

O sistema permite cadastrar e consultar os dados de uma biblioteca. Também tem uma parte de login para que o acesso às telas fique protegido.

No banco de dados, foram criadas as seguintes tabelas:

| Tabela | O que guarda |
|---|---|
| Autor | Nome, e-mail e biografia dos autores |
| Livro | Título, ISBN, ano de publicação e autor relacionado |
| Leitor | Nome, CPF, e-mail e telefone |
| Empréstimo | Livro, leitor, data do empréstimo e datas de devolução |
| Usuário | Dados usados para cadastro e login |

Um autor pode ter vários livros, e um leitor pode ter vários empréstimos. Cada empréstimo fica relacionado a um livro e a um leitor.

## Tecnologias utilizadas

- React e Vite na parte visual do sistema.
- Node.js, Express e TypeScript na API.
- PostgreSQL para guardar os dados.
- Prisma para trabalhar com o banco de dados.
- Zod para validar os dados.
- Axios para fazer as chamadas entre o frontend e a API.
- bcryptjs para proteger as senhas.
- Docker Compose para iniciar o banco de dados.
- Swagger para consultar e testar as rotas da API.

## O que o sistema faz

- Permite criar uma conta e fazer login.
- Cadastra, edita, lista e remove autores.
- Cadastra, edita, lista e remove livros.
- Cadastra, edita, lista e remove leitores.
- Cadastra, edita, lista e remove empréstimos.
- Permite escolher o autor ao cadastrar um livro.
- Permite escolher o livro e o leitor ao cadastrar um empréstimo.
- Mostra o nome do livro e do leitor na lista de empréstimos.
- Tem busca nas listagens.
- Faz validação dos dados no frontend e também na API.

## O que é necessário para executar

Antes de iniciar, é preciso ter instalado:

- Node.js 20.19 ou superior (recomendado Node 22 LTS).
- npm 10 ou superior.
- Docker Desktop com Docker Compose.

## Como rodar o projeto

Os comandos abaixo devem ser executados na pasta principal do projeto.

### 1. Instalar as dependências

```bash
npm install
```

### 2. Criar o arquivo de configuração da API

Faça uma cópia do arquivo `api/.env.example` e salve com o nome `api/.env`.

No PowerShell do Windows:

```powershell
Copy-Item api/.env.example api/.env
```

No Linux ou macOS:

```bash
cp api/.env.example api/.env
```

O arquivo `api/.env` contém configurações locais e não deve ser enviado para o GitHub.

### 3. Iniciar o banco de dados

```bash
docker compose up -d
```

O banco utilizado pelo projeto se chama `biblioteca`.

### 4. Preparar o banco e os dados iniciais

```bash
npm run db:generate
npm run db:migrate
npm run db:seed
```

Esses comandos geram o Prisma Client, aplicam as migrations e adicionam alguns dados de exemplo.

### 5. Iniciar o sistema

```bash
npm run dev
```

Depois de iniciar, os endereços são:

- Frontend: http://localhost:5173
- API: http://localhost:3333
- Documentação da API (Swagger): http://localhost:3333/docs
- Verificação da API: http://localhost:3333/health

Para parar a execução, use `Ctrl + C`. Para desligar o banco de dados:

```bash
docker compose down
```

Se também quiser apagar os dados salvos no banco local, use:

```bash
docker compose down -v
```

Atenção: esse último comando apaga os dados persistidos localmente.

## Conta para demonstração

- E-mail: `admin@biblioteca.com`
- Senha: `Biblioteca@123`

O banco também recebe alguns autores, livros, leitores e um empréstimo de exemplo quando o seed é executado.

## Compilação

Para compilar o projeto, execute na pasta principal:

```bash
npm run build
```

Esse comando compila os pacotes compartilhado, API e frontend.

## Pastas principais

```text
biblioteca-digital/
├── shared/       # Validações compartilhadas
├── api/          # API, banco de dados e autenticação
├── frontend/     # Telas do sistema
├── docker-compose.yml
└── README.md
```
