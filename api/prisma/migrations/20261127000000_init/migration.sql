CREATE TABLE "Author" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "bio" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Author_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Book" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "isbn" TEXT NOT NULL,
    "publishedYear" INTEGER NOT NULL,
    "authorId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Book_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Reader" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Reader_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Loan" (
    "id" SERIAL NOT NULL,
    "bookId" INTEGER NOT NULL,
    "readerId" INTEGER NOT NULL,
    "loanDate" TIMESTAMP(3) NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "returnDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Loan_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Author_email_key" ON "Author"("email");
CREATE UNIQUE INDEX "Book_isbn_key" ON "Book"("isbn");
CREATE UNIQUE INDEX "Reader_cpf_key" ON "Reader"("cpf");
CREATE UNIQUE INDEX "Reader_email_key" ON "Reader"("email");
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE INDEX "Loan_bookId_idx" ON "Loan"("bookId");
CREATE INDEX "Loan_readerId_idx" ON "Loan"("readerId");

ALTER TABLE "Book" ADD CONSTRAINT "Book_authorId_fkey"
  FOREIGN KEY ("authorId") REFERENCES "Author"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Loan" ADD CONSTRAINT "Loan_bookId_fkey"
  FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Loan" ADD CONSTRAINT "Loan_readerId_fkey"
  FOREIGN KEY ("readerId") REFERENCES "Reader"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
