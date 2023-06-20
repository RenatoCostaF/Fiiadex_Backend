import { Request, Response } from "express";

import { Compra } from "../../utils/types/compra";
import { prismaClient } from "../../database/prismaClient";

export class CreateComprasController {
  async handle(request: Request, response: Response) {
    const { userId, parcelas, valorTotal, dataCompra }: Compra = request.body;

    try {
      await prismaClient.$transaction(async (prismaClient: any) => {
        const compra = await prismaClient.compra.create({
          data: {
            userId,
            parcelas: parcelas,
            valorTotal: valorTotal,
            dataCompra: dataCompra,
            status: "DEVENDO",
          },
        });

        for (let i = 1; i <= parcelas; i++) {
          await prismaClient.compraParcela.create({
            data: {
              status: "DEVENDO",
              compraId: compra.id,
              valorParcela: valorTotal / parcelas,
              dataPagamento: new Date(
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
      console.log(err);
      return response
        .status(400)
        .json({ message: "Erro ao finalizar compra!" });
    }
  }
}
