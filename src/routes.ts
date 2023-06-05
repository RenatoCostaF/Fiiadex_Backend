import { Anthenthicated } from "./middleware/auth";
import { Authenticate } from "./provider/Authenticate";
import { CreateComprasController } from "./controllers/Compras/CreateComprasController";
import { CreateUserController } from "./controllers/CreateUserController";
import { DeleteComprasByIdController } from "./controllers/Compras/DeleteByIdComprasController";
import { GetComprasByIdController } from "./controllers/Compras/GetByIdComprasController";
import { GetComprasController } from "./controllers/Compras/GetAllComprasController";
import { GetUserController } from "./controllers/Users/GetUserController";
import { RefreshToken } from "./provider/RefreshToken";
import { Router } from "express";
import { UpdateComprasController } from "./controllers/Compras/UpdateComprasController";

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

// AUTHENTICATE
router.post("/login", authenticate.handle);
router.post("/refresh-token", refreshToken.handle);

// USER
router.post("/user", Anthenthicated, createUser.handle);
router.get("/user", Anthenthicated, getUser.handle);

//COMPRA
// router.post("/compra", Anthenthicated, creatCompra.handle);
router.get("/compra", getAllCompra.handle);
router.get("/compra/:id", getbyIdCompra.handle);
router.post("/compra", creatCompra.handle);
router.post("/compra/:id", updateCompra.handle);
router.delete("/compra/:id", deletebyIdCompra.handle);

export { router };
