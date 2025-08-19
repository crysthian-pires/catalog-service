import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { auth } from "./middlewares/auth";
import products from "./routes/products";
import categories from "./routes/categories";
import { errorHandler } from "./middlewares/error";

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/_health", (_req, res) => res.status(200).json({ status: "ok" }));
app.get("/_ready", (_req, res) => res.status(200).json({ ready: true }));

app.use(auth);
app.use("/products", products);
app.use("/categories", categories);

app.use(errorHandler);

const port = Number(process.env.PORT ?? 3002);
let server: import("http").Server | undefined;

if (process.env.NODE_ENV !== "test") {
  server = app.listen(port, "0.0.0.0", () => {
    console.log(`[catalog-service] listening on port ${port}`);
  });
}

const shutdown = (signal: string) => {
  console.log(`[catalog-service] received ${signal}, shutting down...`);
  server?.close(() => {
    console.log("[catalog-service] http server closed");
    process.exit(0);
  });
  setTimeout(() => process.exit(0), 10_000).unref();
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

export default app;
