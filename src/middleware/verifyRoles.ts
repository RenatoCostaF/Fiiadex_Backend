import { NextFunction, Request, Response } from "express";

import { decode } from "jsonwebtoken";

export function VerifyRoles(allowedRoles: string[]) {
  return function (request: Request, response: Response, next: NextFunction) {
    const authToken = request.headers.authorization;

    if (!authToken) {
      return response
        .status(401)
        .json({ message: "Sem token de autorização!" });
    }

    const [, token] = authToken.split(" ");

    try {
      const tokenDecoded: any = decode(token);

      const userRole = tokenDecoded.role;

      if (!allowedRoles.includes(userRole)) {
        return response.status(403).json({ message: "Perfil não autorizado!" });
      }
      return next();
    } catch (err) {
      return response.status(401).json({ message: "Token inválido!" });
    }
  };
}
