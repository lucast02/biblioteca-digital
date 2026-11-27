import { app } from "./app";
import { env } from "./config/env";
import { prisma } from "./lib/prisma";

const server = app.listen(env.port, () => {
  console.log(`API disponível em http://localhost:${env.port}`);
  console.log(`Swagger disponível em http://localhost:${env.port}/docs`);
});

async function shutdown() {
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
}
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
