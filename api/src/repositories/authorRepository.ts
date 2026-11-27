import { prisma } from "../lib/prisma";

export const authorRepository = {
  findAll: () => prisma.author.findMany({ orderBy: { name: "asc" } }),
  findById: (id: number) => prisma.author.findUnique({ where: { id } }),
  create: (data: { name: string; email: string; bio?: string }) => prisma.author.create({ data }),
  update: (id: number, data: { name: string; email: string; bio?: string }) => prisma.author.update({ where: { id }, data }),
  delete: (id: number) => prisma.author.delete({ where: { id } }),
};
