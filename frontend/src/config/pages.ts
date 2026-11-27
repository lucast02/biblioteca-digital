import {
  autorSchema,
  livroSchema,
  leitorSchema,
  emprestimoSchema,
} from "../../../shared/src/index.ts";

import type { Resource } from "../types";

export const pageConfigs = {
  autores: {
    title: "Autores",
    singular: "Autor",
    resource: "autores" as Resource,
    schema: autorSchema,
    fields: [
      { name: "name", label: "Nome" },
      { name: "email", label: "E-mail", type: "email" as const },
      { name: "bio", label: "Biografia", type: "textarea" as const },
    ],
    columns: [
      { label: "Nome", key: "name" },
      { label: "E-mail", key: "email" },
      { label: "Biografia", key: "bio" },
    ],
  },

  livros: {
    title: "Livros",
    singular: "Livro",
    resource: "livros" as Resource,
    schema: livroSchema,
    fields: [
      { name: "title", label: "Título" },
      { name: "isbn", label: "ISBN" },
      {
        name: "publishedYear",
        label: "Ano de publicação",
        type: "number" as const,
      },
      {
        name: "authorId",
        label: "Autor",
        type: "select" as const,
        optionsKey: "autores" as Resource,
      },
    ],
    columns: [
      { label: "Título", key: "title" },
      { label: "ISBN", key: "isbn" },
      { label: "Autor", key: "author.name" },
      { label: "Ano", key: "publishedYear" },
    ],
  },

  leitores: {
    title: "Leitores",
    singular: "Leitor",
    resource: "leitores" as Resource,
    schema: leitorSchema,
    fields: [
      { name: "name", label: "Nome" },
      { name: "cpf", label: "CPF (somente números)" },
      { name: "email", label: "E-mail", type: "email" as const },
      { name: "phone", label: "Telefone" },
    ],
    columns: [
      { label: "Nome", key: "name" },
      { label: "CPF", key: "cpf" },
      { label: "E-mail", key: "email" },
      { label: "Telefone", key: "phone" },
    ],
  },

  emprestimos: {
    title: "Empréstimos",
    singular: "Empréstimo",
    resource: "emprestimos" as Resource,
    schema: emprestimoSchema,
    fields: [
      {
        name: "bookId",
        label: "Livro",
        type: "select" as const,
        optionsKey: "livros" as Resource,
      },
      {
        name: "readerId",
        label: "Leitor",
        type: "select" as const,
        optionsKey: "leitores" as Resource,
      },
      { name: "loanDate", label: "Data do empréstimo", type: "date" as const },
      { name: "dueDate", label: "Devolução prevista", type: "date" as const },
      {
        name: "returnDate",
        label: "Data da devolução (se devolvido)",
        type: "date" as const,
        optional: true,
      },
    ],
    columns: [
      { label: "Livro", key: "book.title" },
      { label: "Leitor", key: "reader.name" },
      { label: "Empréstimo", key: "loanDate" },
      { label: "Devolução prevista", key: "dueDate" },
      { label: "Devolvido em", key: "returnDate" },
    ],
  },
};
