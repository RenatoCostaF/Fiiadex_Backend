import { Request, Response } from "express";

import { Customers } from "../../utils/types/customers";
import { prismaClient } from "../../database/prismaClient";

// GET
export class Get {
  async handle(request: Request, response: Response) {
    try {
      await prismaClient.$transaction(async (prismaClient) => {
        const customers = await prismaClient.customers.findMany();

        return response.status(200).json({ data: customers });
      });
    } catch (err) {
      return response.status(400).json({ message: err });
    }
  }
}

// GET BY ID
export class GetById {
  async handle(request: Request, response: Response) {
    const { id } = request.params;

    try {
      const customers = await prismaClient.customers.findUnique({
        where: { id },
      });

      if (customers) {
        return response.status(200).json({ data: customers });
      }

      if (!customers) {
        return response.status(400).json({ message: "Cliente inexistente!" });
      }
    } catch (err) {
      return response.status(400).json({ message: err });
    }
  }
}

// UPDATE
export class Update {
  async handle(request: Request, response: Response) {
    const {
      email,
      name,
      fantasyName,
      address,
      dateOfBirth,
      phoneOne,
      phoneTwo,
    }: Customers = request.body;

    const { id } = request.params;

    try {
      await prismaClient.$transaction(async (prismaClient) => {
        await prismaClient.customers.update({
          where: { id },
          data: {
            email,
            name,
            fantasyName,
            address,
            dateOfBirth,
            phoneOne,
            phoneTwo,
          },
        });

        return response
          .status(200)
          .json({ message: "Alteração realizada com sucesso!" });
      });
    } catch (err) {
      return response.status(400).json({ message: err });
    }
  }
}

export class Create {
  async handle(request: Request, response: Response) {
    const {
      email,
      name,
      fantasyName,
      address,
      dateOfBirth,
      phoneOne,
      phoneTwo,
    } = request.body;

    try {
      const emailExist = await prismaClient.customers.findFirst({
        where: { email },
      });

      if (!emailExist) {
        await prismaClient.customers.create({
          data: {
            email,
            name,
            fantasyName,
            address,
            dateOfBirth,
            phoneOne,
            phoneTwo,
          },
        });

        return response.status(200).json({ message: "Cadastro realizado!" });
      }

      if (emailExist) {
        return response.status(400).json({ message: "Email já cadastrado!" });
      }
    } catch (err) {
      return response.status(400).json({ message: err });
    }
  }
}
