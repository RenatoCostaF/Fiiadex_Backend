import {
  Create,
  Get,
  GetById,
  Update,
} from "./controllers/Customers/customersController";
import { Request, RequestHandler, Response } from "express";

import { Anthenthicated } from "./middleware/auth";
import { Authenticate } from "./provider/Authenticate";
import { CreateUserController } from "./controllers/Users/CreateUserController";
import { GetAllUserController } from "./controllers/Users/GetAllUserController";
import { GetUserController } from "./controllers/Users/GetUserController";
import { RefreshToken } from "./provider/RefreshToken";
import { Router } from "express";
import { VerifyRoles } from "./middleware/verifyRoles";

const router = Router();

const createUser = new CreateUserController();
const getUser = new GetUserController();
const authenticate = new Authenticate();
const refreshToken = new RefreshToken();
const getAllUser = new GetAllUserController();
const getCustomers = new Get();
const createCustomers = new Create();
const updateCustomers = new Update();
const getByIdCustomers = new GetById();

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

// CUSTOMERS
router.get(
  "/customers",
  Anthenthicated,
  VerifyRoles(["ADMIN", "USER"]),
  getCustomers.handle
);
router.get(
  "/customers/:id",
  Anthenthicated,
  VerifyRoles(["ADMIN", "USER"]),
  getByIdCustomers.handle
);
router.post(
  "/customers",
  Anthenthicated,
  VerifyRoles(["ADMIN"]),
  createCustomers.handle
);
router.patch(
  "/customers/:id",
  Anthenthicated,
  VerifyRoles(["ADMIN"]),
  updateCustomers.handle
);

export { router };
