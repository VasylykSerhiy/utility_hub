import { Router } from "express";

import testRouter from "./test";

const router = Router();

router.get("/", function (_req, res) {
  res.send("Express API is running");
});

router.use("/test", testRouter);

export default router;
