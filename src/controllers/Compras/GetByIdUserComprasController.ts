import { Request, Response } from "express";

import { prismaClient } from "../../database/prismaClient";

export class GetComprasUserByIdController {
  async handle(request: Request, response: Response) {
    const { userId } = request.body;

    try {
      const compra = await prismaClient.compra.findMany({
        where: { userId },
        include: {
          CompraParcela: true,
          user: {
            select: {
              name: true,
            },
          },
        },
      });

      if (compra) {
        return response.status(200).json({ data: compra });
      }

      if (!compra) {
        return response
          .status(400)
          .json({ message: "Não existe compras para esse usuário!" });
      }
    } catch (err) {
      return response.status(400).json({ message: err });
    }
  }
}
