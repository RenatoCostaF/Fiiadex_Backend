import { Request, Response } from "express";

import dayjs from "dayjs";
import { prismaClient } from "../database/prismaClient";
import { sign } from "jsonwebtoken";

export class AuthenticateController {
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
      const passwordMatch =
        password === userAlreadyExist.password ? true : false;

      if (!passwordMatch) {
        return response
          .status(400)
          .json({ message: "Email ou Senha incorreta!" });
      }

      // Gera token pro usuário
      const token = sign({}, process.env.JWT_SECRET!, {
        subject: userAlreadyExist.id,
        expiresIn: "20s",
      });

      // gera e salva o refresh token na base, deleta caso já exista um com mesmo userId pois é único
      await prismaClient.refreshToken.deleteMany({
        where: { userId: userAlreadyExist.id },
      });
      const expireIn = dayjs().add(15, "second").unix();

      const generateRefreshToken = await prismaClient.refreshToken.create({
        data: {
          userId: userAlreadyExist.id,
          expireIn,
        },
      });

      return response
        .status(200)
        .json({ token: token, refresh_token: generateRefreshToken });
    } catch (error) {
      console.log(error);
      return error;
    }
  }
}
