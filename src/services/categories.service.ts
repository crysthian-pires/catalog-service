import { Prisma, Category } from "@prisma/client";
import { prisma } from "../lib/db.js";

export class NotFoundError extends Error {}
export class ConflictError extends Error {}
export class BadRequestError extends Error {}

export async function createCategory(input: {
  name: string;
}): Promise<Category> {
  const data: Prisma.CategoryCreateInput = {
    name: input.name,
  };
  try {
    return await prisma.category.create({ data });
  } catch (err: any) {
    if (err?.code === "P2002") throw new ConflictError("name já exisste");
    throw err;
  }
}

export async function listCategories(params: {
  page?: number;
  size?: number;
  q?: string;
}) {
  const take = Math.max(1, Math.min(100, params.size ?? 20));
  const page = Math.max(1, params.page ?? 1);
  const skip = (page - 1) * take;

  const where: Prisma.CategoryWhereInput = {
    ...(params.q
      ? {
          OR: [{ name: { contains: params.q, mode: "insensitive" } }],
        }
      : {}),
  };

  const [items, total] = await Promise.all([
    prisma.category.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: "desc" },
    }),
    prisma.category.count({ where }),
  ]);

  return { items, total, page, size: take, pages: Math.ceil(total / take) };
}

export async function getCategory(id: string) {
  const c = await prisma.category.findUnique({
    where: { id },
  });
  if (!c) throw new NotFoundError("categoria não encontrada");
  return c;
}

export async function updateCategory(
  id: string,
  input: { name?: string }
): Promise<Category> {
  const data: Prisma.CategoryUpdateInput = {};
  if (input.name !== undefined) data.name = input.name;
  try {
    return await prisma.category.update({ where: { id }, data });
  } catch (err: any) {
    if (err?.code === "P2025")
      throw new NotFoundError("categoria não encontrada");
    if (err?.code === "P2002") throw new ConflictError("nome já existente");
    throw err;
  }
}

export async function deleteCategory(id: string) {
  try {
    await prisma.category.delete({ where: { id } });
  } catch (err: any) {
    if (err?.code === "P2025")
      throw new NotFoundError("categoria não encontrada");
    throw err;
  }
}
