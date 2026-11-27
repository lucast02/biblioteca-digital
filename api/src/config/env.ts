import "dotenv/config";

const required = (key: string, fallback?: string): string => {
  const value = process.env[key] ?? fallback;
  if (!value) throw new Error(`A variável ${key} não foi configurada. Confira api/.env.`);
  return value;
};

export const env = {
  port: Number(process.env.PORT ?? 3333),
  jwtSecret: required("JWT_SECRET"),
};
