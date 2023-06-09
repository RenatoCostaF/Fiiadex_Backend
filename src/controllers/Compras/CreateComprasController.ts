import { Request, Response } from "express";

import { prismaClient } from "../../database/prismaClient";

export class CreateComprasController {
  async handle(request: Request, response: Response) {
    const { parcelas, valorParcela, valorTotal, userId } = request.body;

    try {
      await prismaClient.$transaction(async (prismaClient: any) => {
        const compra = await prismaClient.compra.create({
          data: {
            parcelas: parseInt(parcelas),
            valorParcela: parseInt(valorParcela),
            valorTotal: parseInt(valorTotal),
            status: "ATIVO",
            userId,
          },
        });

        for (let i = 1; i <= parcelas; i++) {
          await prismaClient.compraParcela.create({
            data: {
              status: "ATIVO",
              compraId: compra.id,
              valor: parseInt(valorParcela),
              dataVencimento: new Date(
                new Date().setMonth(new Date().getMonth() + i)
              ),
            },
          });
        }

        return response
          .status(200)
          .json({ message: "Compra realizada com sucesso!" });
      });
    } catch (err) {
      return response
        .status(400)
        .json({ message: "Erro ao finalizar compra!" });
    }
  }
}
