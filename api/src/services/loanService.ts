import type { EmprestimoInput } from "@biblioteca/shared";
import { loanRepository } from "../repositories/loanRepository";
import { ensureExists } from "./crudHelpers";

function toDatabaseData(data: EmprestimoInput) {
  return {
    bookId: data.bookId,
    readerId: data.readerId,
    loanDate: new Date(data.loanDate),
    dueDate: new Date(data.dueDate),
    returnDate: data.returnDate ? new Date(data.returnDate) : null,
  };
}

export const loanService = {
  list: () => loanRepository.findAll(),
  get: (id: number) => ensureExists(() => loanRepository.findById(id), "Empréstimo não encontrado."),
  create: (data: EmprestimoInput) => loanRepository.create(toDatabaseData(data)),
  update: async (id: number, data: EmprestimoInput) => {
    await ensureExists(() => loanRepository.findById(id), "Empréstimo não encontrado.");
    return loanRepository.update(id, toDatabaseData(data));
  },
  remove: async (id: number) => {
    await ensureExists(() => loanRepository.findById(id), "Empréstimo não encontrado.");
    return loanRepository.delete(id);
  },
};
