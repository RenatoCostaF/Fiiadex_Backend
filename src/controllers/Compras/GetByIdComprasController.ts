import { Request, Response } from "express";

import { prismaClient } from "../../database/prismaClient";

export class GetComprasByIdController {
  async handle(request: Request, response: Response) {
    const { id } = request.params;

    try {
      const compra = await prismaClient.compra.findUnique({ where: { id } });

      if (compra) {
        return response.status(200).json({ data: compra });
      }

      if (!compra) {
        return response.status(400).json({ message: "Compra não existe!" });
      }
    } catch (err) {
      return response.status(400).json({ message: err });
    }
  }
}
