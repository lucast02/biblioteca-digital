import type { LeitorInput } from "@biblioteca/shared";
import { readerRepository } from "../repositories/readerRepository";
import { ensureExists } from "./crudHelpers";

export const readerService = {
  list: () => readerRepository.findAll(),
  get: (id: number) => ensureExists(() => readerRepository.findById(id), "Leitor não encontrado."),
  create: (data: LeitorInput) => readerRepository.create(data),
  update: async (id: number, data: LeitorInput) => {
    await ensureExists(() => readerRepository.findById(id), "Leitor não encontrado.");
    return readerRepository.update(id, data);
  },
  remove: async (id: number) => {
    await ensureExists(() => readerRepository.findById(id), "Leitor não encontrado.");
    return readerRepository.delete(id);
  },
};
