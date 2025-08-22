import { Router, Request, Response, NextFunction } from "express";
import {
  createProduct,
  listProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  NotFoundError,
  ConflictError,
  BadRequestError,
} from "../services/products.service.js";

const productsRouter = Router();

productsRouter.post(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, sku, price, description, categoryId } = req.body ?? {};

      if (!name || !sku || !price === undefined)
        return res.status(400).json({
          error: "name, sku e price são obrigatorios",
        });
      const product = await createProduct({
        name,
        sku,
        price,
        description,
        categoryId,
      });
      return res.status(201).json(product);
    } catch (err: any) {
      next(err);
    }
  }
);

productsRouter.get(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { page, size, q, categoryId } = req.query as any;
      const result = await listProducts({
        page: Number(page) || 1,
        size: Number(size) || 20,
        q: q as string | undefined,
        categoryId: categoryId as string | undefined,
      });
      res.json(result);
    } catch (err) {
      next(err);
    }
  }
);

productsRouter.get(
  "/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.json(await getProduct(req.params.id));
    } catch (err) {
      next(err);
    }
  }
);

productsRouter.put(
  "/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.json(await updateProduct(req.params.id, req.body ?? {}));
    } catch (e) {
      next(e);
    }
  }
);

productsRouter.delete("/:id", async (req, res, next) => {
  try {
    await deleteProduct(req.params.id);
    res.status(204).send();
  } catch (e) {
    next(e);
  }
});

productsRouter.use(
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

export default productsRouter;
