import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { CadastroInput, LoginInput } from "@biblioteca/shared";
import { env } from "../config/env";
import { ApiError } from "../errors/ApiError";
import { userRepository } from "../repositories/userRepository";

function createToken(userId: number) {
  return jwt.sign({}, env.jwtSecret, { subject: String(userId), expiresIn: "8h" });
}

export const authService = {
  register: async (data: CadastroInput) => {
    const passwordHash = await bcrypt.hash(data.password, 10);
    const user = await userRepository.create({ name: data.name, email: data.email, passwordHash });
    return { token: createToken(user.id), user };
  },
  login: async (data: LoginInput) => {
    const user = await userRepository.findByEmail(data.email);
    if (!user || !(await bcrypt.compare(data.password, user.passwordHash))) {
      throw new ApiError(401, "E-mail ou senha incorretos.");
    }
    return {
      token: createToken(user.id),
      user: { id: user.id, name: user.name, email: user.email, createdAt: user.createdAt },
    };
  },
};
