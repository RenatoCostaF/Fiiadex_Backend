import { Request, Response } from "express";

import bcrypt from "bcrypt";
import dayjs from "dayjs";
import { prismaClient } from "../database/prismaClient";
import { sign } from "jsonwebtoken";

class Authenticate {
  async handle(request: Request, response: Response) {
    const { email, password } = request.body;

    try {
      // Verifica se existe usuário
      const userAlreadyExist = await prismaClient.user.findFirst({
        where: { email },
      });

      if (!userAlreadyExist) {
        return response
          .status(400)
          .json({ message: "Email ou Senha incorreta!" });
      }

      // Verifica se a senha está correta
      const passwordMatch = await bcrypt.compare(
        password,
        userAlreadyExist.password
      );

      if (!passwordMatch) {
        return response
          .status(400)
          .json({ message: "Email ou Senha incorreta!" });
      }

      // Gera token pro usuário
      const token = sign(
        {
          userId: userAlreadyExist.id,
          user: userAlreadyExist.name,
          email: userAlreadyExist.email,
          role: userAlreadyExist.role,
        },
        process.env.JWT_SECRET as string,
        {
          subject: userAlreadyExist.id,
          expiresIn: "3600s",
        }
      );

      // gera e salva o refresh token na base, deleta caso já exista um com mesmo userId pois é único
      await prismaClient.refreshTokenSchema.deleteMany({
        where: { userId: userAlreadyExist.id },
      });
      const expireIn = dayjs().add(3600, "second").unix();

      const generateRefreshToken = await prismaClient.refreshTokenSchema.create(
        {
          data: {
            userId: userAlreadyExist.id,
            expireIn,
          },
        }
      );

      const data = {
        token: token,
        refresh_token: generateRefreshToken.id,
        user: {
          name: userAlreadyExist.name,
          email: userAlreadyExist.email,
          id: userAlreadyExist.id,
          role: userAlreadyExist.role,
        },
      };

      return response.status(200).json(data);
    } catch (error) {
      return error;
    }
  }
}

export { Authenticate };
