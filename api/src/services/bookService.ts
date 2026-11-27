import type { LivroInput } from "@biblioteca/shared";
import { bookRepository } from "../repositories/bookRepository";
import { ensureExists } from "./crudHelpers";

export const bookService = {
  list: () => bookRepository.findAll(),
  get: (id: number) => ensureExists(() => bookRepository.findById(id), "Livro não encontrado."),
  create: (data: LivroInput) => bookRepository.create(data),
  update: async (id: number, data: LivroInput) => {
    await ensureExists(() => bookRepository.findById(id), "Livro não encontrado.");
    return bookRepository.update(id, data);
  },
  remove: async (id: number) => {
    await ensureExists(() => bookRepository.findById(id), "Livro não encontrado.");
    return bookRepository.delete(id);
  },
};
