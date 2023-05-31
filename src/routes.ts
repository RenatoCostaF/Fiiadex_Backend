import { Anthenthicated } from "./middleware/Auth";
import { AuthenticateController } from "./provider/AuthenticateController";
import { CreateUserController } from "./controllers/CreateUserController";
import { GetUserController } from "./controllers/GetUserController";
import { RefreshTokenController } from "./provider/RefreshTokenController";
import { Router } from "express";

const router = Router();

const createUser = new CreateUserController();
const getUser = new GetUserController();
const authenticate = new AuthenticateController();
const refreshToken = new RefreshTokenController();

// AUTHENTICATE
router.post("/login", authenticate.handle);
router.post("/refresh-token", refreshToken.handle);

// USER
router.post("/user", Anthenthicated, createUser.handle);
router.get("/user", Anthenthicated, getUser.handle);

export { router };
