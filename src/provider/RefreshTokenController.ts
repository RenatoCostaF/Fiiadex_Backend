import { Request, Response } from "express";

import dayjs from "dayjs";
import { prismaClient } from "../database/prismaClient";
import { sign } from "jsonwebtoken";

class RefreshTokenController {
  async handle(request: Request, response: Response) {
    const { refresh_token } = request.body;

    const refreshToken = await prismaClient.refreshToken.findFirst({
      where: { id: refresh_token },
    });

    if (!refreshToken) {
      return response.status(400).json({ message: "Refresh token invalido!" });
    }

    const token = sign({}, process.env.JWT_SECRET!, {
      subject: refreshToken.userId,
      expiresIn: "20s",
    });

    const refreshTokenExpired = dayjs().isAfter(
      dayjs.unix(refreshToken.expireIn)
    );

    if (refreshTokenExpired) {
      await prismaClient.refreshToken.deleteMany({
        where: { userId: refreshToken.userId },
      });

      const expireIn = dayjs().add(15, "second").unix();
      const generateRefreshToken = await prismaClient.refreshToken.create({
        data: {
          userId: refreshToken.userId,
          expireIn,
        },
      });

      return response
        .status(200)
        .json({ token: token, refresh_token: generateRefreshToken });
    }

    return response.status(200).json({ token: token });
  }
}

export { RefreshTokenController };
