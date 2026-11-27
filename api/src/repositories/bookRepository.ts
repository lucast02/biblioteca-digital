import { prisma } from "../lib/prisma";

const includeAuthor = { author: { select: { id: true, name: true } } };
export const bookRepository = {
  findAll: () => prisma.book.findMany({ include: includeAuthor, orderBy: { title: "asc" } }),
  findById: (id: number) => prisma.book.findUnique({ where: { id }, include: includeAuthor }),
  create: (data: { title: string; isbn: string; publishedYear: number; authorId: number }) => prisma.book.create({ data, include: includeAuthor }),
  update: (id: number, data: { title: string; isbn: string; publishedYear: number; authorId: number }) => prisma.book.update({ where: { id }, data, include: includeAuthor }),
  delete: (id: number) => prisma.book.delete({ where: { id } }),
};
