import { z } from "zod";

export const autorSchema = z.object({
  name: z.string().trim().min(2, "Informe um nome com pelo menos 2 caracteres."),
  email: z.string().trim().email("Informe um e-mail válido."),
  bio: z.string().trim().max(500, "A biografia deve ter no máximo 500 caracteres.").optional(),
});

export const livroSchema = z.object({
  title: z.string().trim().min(2, "Informe o título do livro."),
  isbn: z.string().trim().min(5, "Informe um ISBN válido."),
  publishedYear: z.coerce.number().int("O ano deve ser um número inteiro.").min(0, "O ano não pode ser negativo.").max(3000, "Informe um ano válido."),
  authorId: z.coerce.number().int().positive("Selecione um autor."),
});

export const leitorSchema = z.object({
  name: z.string().trim().min(2, "Informe o nome do leitor."),
  cpf: z.string().regex(/^\d{11}$/, "O CPF deve conter 11 números, sem pontos ou traços."),
  email: z.string().trim().email("Informe um e-mail válido."),
  phone: z.string().trim().min(8, "Informe um telefone válido."),
});

export const emprestimoSchema = z.object({
  bookId: z.coerce.number().int().positive("Selecione um livro."),
  readerId: z.coerce.number().int().positive("Selecione um leitor."),
  loanDate: z.string().refine((value) => !Number.isNaN(Date.parse(value)), "Informe uma data válida para o empréstimo."),
  dueDate: z.string().refine((value) => !Number.isNaN(Date.parse(value)), "Informe uma data válida para a devolução."),
  returnDate: z.string().nullable().optional(),
});

export const cadastroSchema = z.object({
  name: z.string().trim().min(2, "Informe seu nome."),
  email: z.string().trim().email("Informe um e-mail válido."),
  password: z.string().min(8, "A senha deve ter pelo menos 8 caracteres."),
});

export const loginSchema = z.object({
  email: z.string().trim().email("Informe um e-mail válido."),
  password: z.string().min(1, "Informe sua senha."),
});

export type AutorInput = z.infer<typeof autorSchema>;
export type LivroInput = z.infer<typeof livroSchema>;
export type LeitorInput = z.infer<typeof leitorSchema>;
export type EmprestimoInput = z.infer<typeof emprestimoSchema>;
export type CadastroInput = z.infer<typeof cadastroSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
