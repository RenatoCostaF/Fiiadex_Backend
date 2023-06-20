import { Request, Response } from "express";

import { prismaClient } from "../../database/prismaClient";

export class CreateUserController {
  async handle(request: Request, response: Response) {
    const { name, email, password, role } = request.body;

    const emailExist = await prismaClient.user.findFirst({ where: { email } });

    if (!emailExist) {
      await prismaClient.user.create({
        data: { name, email, password, role },
      });

      return response.status(200).json({ message: "Cadastro realizado!" });
    }

    if (emailExist) {
      return response
        .status(400)
        .json({ message: "Email ou Senha já cadastrado!" });
    }
  }
}
