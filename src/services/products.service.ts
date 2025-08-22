import { Prisma, Product } from "@prisma/client";
import { prisma } from "../lib/db.js";

export class NotFoundError extends Error {}
export class ConflictError extends Error {}
export class BadRequestError extends Error {}

function toDecimal(input: unknown): Prisma.Decimal {
  if (input === null || input === undefined) throw new Error("price_required");
  const raw = String(input).replace(",", ".");
  const number = Number(raw);
  if (!isFinite(number)) throw new Error("price_invalid");
  return new Prisma.Decimal(raw);
}

export async function createProduct(input: {
  name: string;
  sku: string;
  price: string | number;
  description?: string | null;
  categoryId?: string | null;
}): Promise<Product> {
  const data: Prisma.ProductCreateInput = {
    name: input.name,
    sku: input.sku,
    price: toDecimal(input.price),
    description: input.description ?? null,
    ...(input.categoryId
      ? { category: { connect: { id: input.categoryId } } }
      : {}),
  };

  try {
    return await prisma.product.create({ data });
  } catch (err: any) {
    if (err?.code === "P2003") throw new BadRequestError("categoryId inválido");
    if (err?.code === "P2002") throw new ConflictError("sku já exisste");
    throw err;
  }
}

export async function listProducts(params: {
  page?: number;
  size?: number;
  q?: string;
  categoryId?: string;
}) {
  const take = Math.max(1, Math.min(100, params.size ?? 20));
  const page = Math.max(1, params.page ?? 1);
  const skip = (page - 1) * take;

  const where: Prisma.ProductWhereInput = {
    ...(params.categoryId ? { categoryId: params.categoryId } : {}),
    ...(params.q
      ? {
          OR: [
            { name: { contains: params.q, mode: "insensitive" } },
            { sku: { contains: params.q, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const [items, total] = await Promise.all([
    prisma.product.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: "desc" },
      include: { category: true },
    }),
    prisma.product.count({ where }),
  ]);

  return { items, total, page, size: take, pages: Math.ceil(total / take) };
}

export async function getProduct(id: string) {
  const p = await prisma.product.findUnique({
    where: { id },
    include: { category: true },
  });
  if (!p) throw new NotFoundError("Produto não encontrado");
  return p;
}

export async function updateProduct(
  id: string,
  input: {
    name?: string;
    sku?: string;
    price?: string | number;
    description?: string | null;
    categoryId?: string | null;
  }
) {
  const data: Prisma.ProductUpdateInput = {};
  if (input.name !== undefined) data.name = input.name;
  if (input.sku !== undefined) data.sku = input.sku;
  if (input.price !== undefined) data.price = toDecimal(input.price);
  if (input.description !== undefined)
    data.description = input.description ?? null;
  if (input.categoryId !== undefined) {
    data.category = input.categoryId
      ? { connect: { id: input.categoryId } }
      : { disconnect: true };
  }

  try {
    return await prisma.product.update({ where: { id }, data });
  } catch (e: any) {
    if (e?.code === "P2025") throw new NotFoundError("produto não encontrado");
    if (e?.code === "P2002") throw new ConflictError("sku já existe");
    if (e?.code === "P2003") throw new BadRequestError("categoryId inválido");
    throw e;
  }
}

export async function deleteProduct(id: string) {
  try {
    await prisma.product.delete({ where: { id } });
  } catch (e: any) {
    if (e?.code === "P2025") throw new NotFoundError("produto não encontrado");
    throw e;
  }
}
