import { Router } from "express";

const router = Router();

// GET /products
router.get("/", (_req, res) => {
  res.json({ items: [], total: 0 });
});

// TODO: POST/PUT/DELETE
export default router;
