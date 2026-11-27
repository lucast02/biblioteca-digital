import type { AutorInput } from "@biblioteca/shared";
import { authorRepository } from "../repositories/authorRepository";
import { ensureExists } from "./crudHelpers";

export const authorService = {
  list: () => authorRepository.findAll(),
  get: (id: number) => ensureExists(() => authorRepository.findById(id), "Autor não encontrado."),
  create: (data: AutorInput) => authorRepository.create(data),
  update: async (id: number, data: AutorInput) => {
    await ensureExists(() => authorRepository.findById(id), "Autor não encontrado.");
    return authorRepository.update(id, data);
  },
  remove: async (id: number) => {
    await ensureExists(() => authorRepository.findById(id), "Autor não encontrado.");
    return authorRepository.delete(id);
  },
};
