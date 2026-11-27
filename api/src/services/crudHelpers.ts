import { ApiError } from "../errors/ApiError";

export async function ensureExists<T>(find: () => Promise<T | null>, message = "Registro não encontrado."): Promise<T> {
  const record = await find();
  if (!record) throw new ApiError(404, message);
  return record;
}
