import { Request, Response } from "express";

import { prismaClient } from "../../database/prismaClient";

export class GetAllUserController {
  async handle(request: Request, response: Response) {
    try {
      await prismaClient.$transaction(async (prismaClient) => {
        const user = await prismaClient.user.findMany({
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        });

        return response.status(200).json({ data: user });
      });
    } catch (err) {
      return response.status(400).json({ message: err });
    }
  }
}
