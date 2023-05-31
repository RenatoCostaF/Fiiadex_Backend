import { Request, Response } from "express";

import { prismaClient } from "../database/prismaClient";

export class GetUserController {
  async handle(request: Request, response: Response) {
    const user = await prismaClient.user.findMany();

    return response.status(200).json(user);
  }
}
