import { Request, Response } from "express";

import { prismaClient } from "../../database/prismaClient";

export class GetComprasController {
  async handle(request: Request, response: Response) {
    try {
      const compra = await prismaClient.compra.findMany();

      return response.status(200).json({ data: compra });
    } catch (err) {
      return response.status(400).json({ message: err });
    }
  }
}
