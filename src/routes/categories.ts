import { Router } from "express";

const router = Router();

// GET /categories
router.get("/", (_req, res) => {
  res.json({ items: [], total: 0 });
});

export default router;
