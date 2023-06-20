import { Request, Response } from "express";

import { Compra } from "../../utils/types/compra";
import { prismaClient } from "../../database/prismaClient";

export class UpdateComprasController {
  async handle(request: Request, response: Response) {
    const { userId, parcelas, valorTotal, status }: Compra = request.body;

    const { id } = request.params;

    try {
      await prismaClient.$transaction(async (prismaClient) => {
        const newCompra = await prismaClient.compra.update({
          where: { id },
          data: {
            parcelas,
            valorTotal,
            status: status ? status : "DEVENDO",
            userId,
          },
        });

        await prismaClient.compraParcela.deleteMany({
          where: { compraId: newCompra?.id },
        });

        for (let i = 1; i <= parcelas; i++) {
          await prismaClient.compraParcela.create({
            data: {
              status: "ATIVO",
              compraId: newCompra.id,
              valorParcela: valorTotal / parcelas,
              dataPagamento: new Date(
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
