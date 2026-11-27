import { prisma } from "../lib/prisma";

const includeRelations = {
  book: { select: { id: true, title: true } },
  reader: { select: { id: true, name: true } },
};
export const loanRepository = {
  findAll: () => prisma.loan.findMany({ include: includeRelations, orderBy: { loanDate: "desc" } }),
  findById: (id: number) => prisma.loan.findUnique({ where: { id }, include: includeRelations }),
  create: (data: { bookId: number; readerId: number; loanDate: Date; dueDate: Date; returnDate: Date | null }) => prisma.loan.create({ data, include: includeRelations }),
  update: (id: number, data: { bookId: number; readerId: number; loanDate: Date; dueDate: Date; returnDate: Date | null }) => prisma.loan.update({ where: { id }, data, include: includeRelations }),
  delete: (id: number) => prisma.loan.delete({ where: { id } }),
};
