import { Request, Response } from "express";

import { prismaClient } from "../../database/prismaClient";

export class UpdateComprasController {
  async handle(request: Request, response: Response) {
    const { parcelas, valorParcela, valorTotal, userId } = request.body;
    const { id } = request.params;

    try {
      await prismaClient.$transaction(async (prismaClient) => {
        const newBase = await prismaClient.compra.update({
          where: { id },
          data: {
            parcelas,
            valorParcela,
            valorTotal,
            status: "ATIVO",
            userId,
          },
        });

        await prismaClient.compraParcela.deleteMany({
          where: { compraId: newBase?.id },
        });

        for (let i = 1; i <= parcelas; i++) {
          await prismaClient.compraParcela.create({
            data: {
              status: "ATIVO",
              compraId: newBase.id,
              valor: valorParcela,
              dataVencimento: new Date(
                new Date().setMonth(new Date().getMonth() + i)
              ),
            },
          });
        }

        return response
          .status(200)
          .json({ message: "Alteração realizada com sucesso!" });
      });
    } catch (err) {
      return response.status(400).json({ message: err });
    }
  }
}
