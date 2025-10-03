import cors from "cors";
import express from "express";
import morgan from "morgan";

import routes from "./routes";

const app: express.Express = express();

app.use(morgan("tiny"));

app.use(express.json({ limit: "100mb" }));

app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:3000"],
  })
);

app.use("/v1", routes);

export default app;
