import { Router, Request, Response, NextFunction } from "express";
import {
  BadRequestError,
  ConflictError,
  createCategory,
  deleteCategory,
  getCategory,
  listCategories,
  NotFoundError,
  updateCategory,
} from "../services/categories.service.js";

const categoriesRouter = Router();

categoriesRouter.post(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name } = req.body ?? {};
      if (!name === undefined)
        return res.status(400).json({
          error: "name é obrigatorios",
        });
      const category = await createCategory({ name });
      return res.status(201).json(category);
    } catch (err: any) {
      next(err);
    }
  }
);

categoriesRouter.get(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { page, size, q, categoryId } = req.query as any;
      const result = await listCategories({
        page: Number(page) || 1,
        size: Number(size) || 20,
        q: q as string | undefined,
      });
      res.json(result);
    } catch (err) {
      next(err);
    }
  }
);

categoriesRouter.get(
  "/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.json(await getCategory(req.params.id));
    } catch (err) {
      next(err);
    }
  }
);

categoriesRouter.put(
  "/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.json(await updateCategory(req.params.id, req.body ?? {}));
    } catch (e) {
      next(e);
    }
  }
);

categoriesRouter.delete(
  "/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await deleteCategory(req.params.id);
      res.status(204).send();
    } catch (e) {
      next(e);
    }
  }
);

categoriesRouter.use(
  (err: any, _req: Request, res: Response, next: NextFunction) => {
    if (err instanceof NotFoundError)
      return res.status(404).json({ error: err.message });
    if (err instanceof ConflictError)
      return res.status(409).json({ error: err.message });
    if (err instanceof BadRequestError)
      return res.status(400).json({ error: err.message });
    next(err);
  }
);

export default categoriesRouter;
