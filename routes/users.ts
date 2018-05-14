import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.send({ testUser: "test user" });
});
export default router;
