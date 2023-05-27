import cors from "cors";
import express from "express";
import { router } from "./routes";

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(router);

app.listen(3099, () => console.log("Server rodando na porta 3099!"));
