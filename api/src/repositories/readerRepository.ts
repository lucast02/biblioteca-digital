import { prisma } from "../lib/prisma";

export const readerRepository = {
  findAll: () => prisma.reader.findMany({ orderBy: { name: "asc" } }),
  findById: (id: number) => prisma.reader.findUnique({ where: { id } }),
  create: (data: { name: string; cpf: string; email: string; phone: string }) => prisma.reader.create({ data }),
  update: (id: number, data: { name: string; cpf: string; email: string; phone: string }) => prisma.reader.update({ where: { id }, data }),
  delete: (id: number) => prisma.reader.delete({ where: { id } }),
};
