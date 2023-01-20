import cors from "cors";
import express from "express";

import MovimentationsRoutes from "../routes/movimentations.js";
import UserRoutes from "../routes/user.js";
import { closeDbConnection } from "./database.js";

const app = express();
let server = null;

async function onShutDownServer() {
    if (server) {
        closeDbConnection((error) => {
            if (error) throw Error("Falha ao desconectar do banco de dados!");
            server.close(() => {
                process.exit(0);
            });
        });
    }
}

function initializeServer() {
    if (!server) {
        app.use(cors());
        app.use(express.json());

        app.use(MovimentationsRoutes);
        app.use(UserRoutes);

        server = app.listen(5000);
    }

    process.on("SIGTERM", onShutDownServer);
    process.on("SIGINT", onShutDownServer);
}

export default initializeServer;