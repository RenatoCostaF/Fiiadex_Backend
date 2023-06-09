import { Request, Response } from "express";

import { prismaClient } from "../../database/prismaClient";

export class DeleteComprasByIdController {
  async handle(request: Request, response: Response) {
    const { id } = request.params;

    try {
      await prismaClient.$transaction(async (prismaClient: any) => {
        const compra = await prismaClient.compra.findUnique({ where: { id } });

        if (compra) {
          await prismaClient.compraParcela.deleteMany({
            where: { compraId: id },
          });
          await prismaClient.compra.delete({
            where: { id },
          });
        }

        return response.status(200).json({ message: "Deletado com sucesso!" });
      });
    } catch (err) {
      return response.status(400).json({ message: err });
    }
  }
}
