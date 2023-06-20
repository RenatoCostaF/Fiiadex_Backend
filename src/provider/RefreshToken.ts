import { Request, Response } from "express";

import dayjs from "dayjs";
import { prismaClient } from "../database/prismaClient";
import { sign } from "jsonwebtoken";

class RefreshToken {
  async handle(request: Request, response: Response) {
    const { refresh_token } = request.body;

    const refreshToken = await prismaClient.refreshTokenSchema.findFirst({
      where: { id: refresh_token },
    });

    if (!refreshToken) {
      return response.status(400).json({ message: "Refresh token invalido!" });
    }

    const user = await prismaClient.user.findFirst({
      where: { id: refreshToken.userId },
    });

    const token = sign(
      {
        user: user?.name,
        userId: user?.id,
        role: user?.role,
        email: user?.email,
      },
      process.env.JWT_SECRET as string,
      {
        subject: refreshToken.userId,
        expiresIn: "3600s",
      }
    );

    const refreshTokenExpired = dayjs().isAfter(
      dayjs.unix(refreshToken.expireIn)
    );

    if (refreshTokenExpired) {
      await prismaClient.refreshTokenSchema.deleteMany({
        where: { userId: refreshToken.userId },
      });

      const expireIn = dayjs().add(3600, "second").unix();
      const generateRefreshToken = await prismaClient.refreshTokenSchema.create(
        {
          data: {
            userId: refreshToken.userId,
            expireIn,
          },
        }
      );

      const data = {
        token: token,
        refresh_token: generateRefreshToken.id,
      };

      return response.status(200).json(data);
    }

    return response.status(200).json({ token: token });
  }
}

export { RefreshToken };
