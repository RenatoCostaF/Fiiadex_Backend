import { NextFunction, Request, Response } from "express";

import { verify } from "jsonwebtoken";

export function Anthenthicated(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const authToken = request.headers.authorization;

  if (!authToken) {
    return response.status(401).json({ message: "Sem token de autorização!" });
  }

  const [, token] = authToken.split(" ");

  try {
    verify(token, process.env.JWT_SECRET as string);

    return next();
  } catch (err) {
    return response.status(401).json({ message: "Token invalido!" });
  }
}
