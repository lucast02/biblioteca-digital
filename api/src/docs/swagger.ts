const idParameter = {
  name: "id", in: "path", required: true,
  schema: { type: "integer", minimum: 1 },
  description: "Identificador do registro.",
};

function crudPaths(path: string, tag: string, inputSchema: string, outputSchema: string) {
  const collection = `/${path}`;
  const item = `/${path}/{id}`;
  const ref = (name: string) => ({ $ref: `#/components/schemas/${name}` });
  const jsonBody = { required: true, content: { "application/json": { schema: ref(inputSchema) } } };
  const responses = {
    badRequest: { description: "Dados inválidos ou relacionamento incorreto." },
    unauthorized: { description: "Token ausente ou inválido." },
    notFound: { description: "Registro não encontrado." },
  };
  return {
    [collection]: {
      get: { tags: [tag], summary: `Listar ${tag.toLowerCase()}`, security: [{ bearerAuth: [] }], responses: { "200": { description: "Lista de registros", content: { "application/json": { schema: { type: "array", items: ref(outputSchema) } } } }, "401": responses.unauthorized } },
      post: { tags: [tag], summary: `Criar ${tag.slice(0, -1).toLowerCase()}`, security: [{ bearerAuth: [] }], requestBody: jsonBody, responses: { "201": { description: "Registro criado", content: { "application/json": { schema: ref(outputSchema) } } }, "400": responses.badRequest, "409": { description: "Valor único já cadastrado." }, "401": responses.unauthorized } },
    },
    [item]: {
      parameters: [idParameter],
      get: { tags: [tag], summary: "Buscar por ID", security: [{ bearerAuth: [] }], responses: { "200": { description: "Registro encontrado", content: { "application/json": { schema: ref(outputSchema) } } }, "404": responses.notFound, "401": responses.unauthorized } },
      put: { tags: [tag], summary: "Editar registro", security: [{ bearerAuth: [] }], requestBody: jsonBody, responses: { "200": { description: "Registro atualizado", content: { "application/json": { schema: ref(outputSchema) } } }, "400": responses.badRequest, "404": responses.notFound, "409": { description: "Valor único já cadastrado." }, "401": responses.unauthorized } },
      delete: { tags: [tag], summary: "Remover registro", security: [{ bearerAuth: [] }], responses: { "204": { description: "Registro removido; sem conteúdo." }, "404": responses.notFound, "401": responses.unauthorized } },
    },
  };
}

export const swaggerDocument = {
  openapi: "3.0.3",
  info: {
    title: "Biblioteca Digital API",
    version: "1.0.0",
    description: "API para gerenciamento de autores, livros, leitores e empréstimos. As rotas de CRUD exigem autenticação Bearer.",
  },
  servers: [{ url: "http://localhost:3333", description: "Servidor local" }],
  components: {
    securitySchemes: { bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" } },
    schemas: {
      AuthorInput: { type: "object", required: ["name", "email"], properties: { name: { type: "string", minLength: 2, example: "Machado de Assis" }, email: { type: "string", format: "email", example: "machado@exemplo.com" }, bio: { type: "string", maxLength: 500, nullable: true } } },
      Author: { allOf: [{ $ref: "#/components/schemas/AuthorInput" }, { type: "object", properties: { id: { type: "integer" }, createdAt: { type: "string", format: "date-time" } } }] },
      BookInput: { type: "object", required: ["title", "isbn", "publishedYear", "authorId"], properties: { title: { type: "string", example: "Dom Casmurro" }, isbn: { type: "string", example: "9780000000001" }, publishedYear: { type: "integer", example: 1899 }, authorId: { type: "integer", example: 1 } } },
      Book: { allOf: [{ $ref: "#/components/schemas/BookInput" }, { type: "object", properties: { id: { type: "integer" }, author: { type: "object", properties: { id: { type: "integer" }, name: { type: "string" } } } } }] },
      ReaderInput: { type: "object", required: ["name", "cpf", "email", "phone"], properties: { name: { type: "string", example: "Ana Souza" }, cpf: { type: "string", example: "11122233344" }, email: { type: "string", format: "email" }, phone: { type: "string", example: "83999990000" } } },
      Reader: { allOf: [{ $ref: "#/components/schemas/ReaderInput" }, { type: "object", properties: { id: { type: "integer" }, createdAt: { type: "string", format: "date-time" } } }] },
      LoanInput: { type: "object", required: ["bookId", "readerId", "loanDate", "dueDate"], properties: { bookId: { type: "integer", example: 1 }, readerId: { type: "integer", example: 1 }, loanDate: { type: "string", format: "date", example: "2026-11-27" }, dueDate: { type: "string", format: "date", example: "2026-12-11" }, returnDate: { type: "string", format: "date", nullable: true } } },
      Loan: { allOf: [{ $ref: "#/components/schemas/LoanInput" }, { type: "object", properties: { id: { type: "integer" }, book: { type: "object", properties: { id: { type: "integer" }, title: { type: "string" } } }, reader: { type: "object", properties: { id: { type: "integer" }, name: { type: "string" } } } } }] },
      RegisterInput: { type: "object", required: ["name", "email", "password"], properties: { name: { type: "string", minLength: 2 }, email: { type: "string", format: "email" }, password: { type: "string", minLength: 8, writeOnly: true } } },
      LoginInput: { type: "object", required: ["email", "password"], properties: { email: { type: "string", format: "email" }, password: { type: "string", writeOnly: true } } },
      AuthResponse: { type: "object", properties: { token: { type: "string" }, user: { type: "object", properties: { id: { type: "integer" }, name: { type: "string" }, email: { type: "string" } } } } },
      Error: { type: "object", properties: { message: { type: "string" }, errors: { type: "object", additionalProperties: { type: "string" } } } },
    },
  },
  paths: {
    "/api/auth/register": {
      post: {
        tags: ["Autenticação"],
        summary: "Cadastrar usuário",
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/RegisterInput" } } },
        },
        responses: {
          "201": {
            description: "Usuário criado e autenticado",
            content: { "application/json": { schema: { $ref: "#/components/schemas/AuthResponse" } } },
          },
          "400": {
            description: "Dados inválidos",
            content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } },
          },
          "409": { description: "E-mail já cadastrado" },
        },
      },
    },
    "/api/auth/login": {
      post: {
        tags: ["Autenticação"],
        summary: "Entrar no sistema",
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/LoginInput" } } },
        },
        responses: {
          "200": {
            description: "Login realizado",
            content: { "application/json": { schema: { $ref: "#/components/schemas/AuthResponse" } } },
          },
          "400": { description: "Dados inválidos" },
          "401": { description: "E-mail ou senha incorretos" },
        },
      },
    },
    ...crudPaths("autores", "Autores", "AuthorInput", "Author"),
    ...crudPaths("livros", "Livros", "BookInput", "Book"),
    ...crudPaths("leitores", "Leitores", "ReaderInput", "Reader"),
    ...crudPaths("emprestimos", "Empréstimos", "LoanInput", "Loan"),
  },
};
