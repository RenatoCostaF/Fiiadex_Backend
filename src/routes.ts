import { Request, RequestHandler, Response } from "express";

import { Anthenthicated } from "./middleware/auth";
import { Authenticate } from "./provider/Authenticate";
import { CreateComprasController } from "./controllers/Compras/CreateComprasController";
import { CreateUserController } from "./controllers/Users/CreateUserController";
import { DeleteComprasByIdController } from "./controllers/Compras/DeleteByIdComprasController";
import { GetAllUserController } from "./controllers/Users/GetAllUserController";
import { GetComprasByIdController } from "./controllers/Compras/GetByIdComprasController";
import { GetComprasController } from "./controllers/Compras/GetAllComprasController";
import { GetComprasUserByIdController } from "./controllers/Compras/GetByIdUserComprasController";
import { GetUserController } from "./controllers/Users/GetUserController";
import { RefreshToken } from "./provider/RefreshToken";
import { Router } from "express";
import { UpdateComprasController } from "./controllers/Compras/UpdateComprasController";
import { VerifyRoles } from "./middleware/verifyRoles";

const router = Router();

const createUser = new CreateUserController();
const getUser = new GetUserController();
const authenticate = new Authenticate();
const refreshToken = new RefreshToken();
const creatCompra = new CreateComprasController();
const updateCompra = new UpdateComprasController();
const getAllCompra = new GetComprasController();
const getbyIdCompra = new GetComprasByIdController();
const deletebyIdCompra = new DeleteComprasByIdController();
const getAllUser = new GetAllUserController();
const getbyUserIdCompra = new GetComprasUserByIdController();

//VERIFICAR SE ESTÁ OK
router.get("/", (request: Request, response: Response) => {
  return response.status(200).json({ message: "OK" });
});

// AUTHENTICATE
router.post("/login", authenticate.handle);
router.post("/refresh-token", refreshToken.handle);

// USER
router.get("/user", Anthenthicated, VerifyRoles(["ADMIN"]), getAllUser.handle);
router.post("/user", Anthenthicated, VerifyRoles(["ADMIN"]), createUser.handle);
router.get("/user", Anthenthicated, VerifyRoles(["ADMIN"]), getUser.handle);

//COMPRA
router.get(
  "/compra",
  Anthenthicated,
  VerifyRoles(["ADMIN", "USER"]),
  getAllCompra.handle
);
router.get(
  "/compra/:id",
  Anthenthicated,
  VerifyRoles(["ADMIN", "USER"]),
  getbyIdCompra.handle
);
router.post(
  "/compra",
  Anthenthicated,
  VerifyRoles(["ADMIN", "USER"]),
  getbyUserIdCompra.handle
);
router.post(
  "/create-compra",
  Anthenthicated,
  VerifyRoles(["ADMIN", "USER"]),
  creatCompra.handle
);
router.post(
  "/compra/:id",
  Anthenthicated,
  VerifyRoles(["ADMIN"]),
  updateCompra.handle
);
router.delete(
  "/compra/:id",
  Anthenthicated,
  VerifyRoles(["ADMIN"]),
  deletebyIdCompra.handle
);

export { router };
