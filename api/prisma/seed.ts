import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const author = await prisma.author.upsert({
    where: { email: "machado@biblioteca.local" },
    update: {},
    create: {
      name: "Machado de Assis",
      email: "machado@biblioteca.local",
      bio: "Escritor brasileiro, autor de clássicos da literatura nacional.",
    },
  });

  const book = await prisma.book.upsert({
    where: { isbn: "9780000000001" },
    update: {},
    create: {
      title: "Dom Casmurro",
      isbn: "9780000000001",
      publishedYear: 1899,
      authorId: author.id,
    },
  });

  const reader = await prisma.reader.upsert({
    where: { cpf: "11122233344" },
    update: {},
    create: {
      name: "Ana Souza",
      cpf: "11122233344",
      email: "ana@exemplo.com",
      phone: "83999990000",
    },
  });

  const existingLoan = await prisma.loan.findFirst({
    where: { bookId: book.id, readerId: reader.id },
  });
  if (!existingLoan) {
    const today = new Date();
    const due = new Date();
    due.setDate(due.getDate() + 14);
    await prisma.loan.create({
      data: { bookId: book.id, readerId: reader.id, loanDate: today, dueDate: due },
    });
  }

  const passwordHash = await bcrypt.hash("Biblioteca@123", 10);
  await prisma.user.upsert({
    where: { email: "admin@biblioteca.com" },
    update: { passwordHash },
    create: {
      name: "Administrador",
      email: "admin@biblioteca.com",
      passwordHash,
    },
  });

  console.log("Seed concluído. Usuário: admin@biblioteca.com");
}

main()
  .catch((error) => {
    console.error("Erro ao executar seed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
