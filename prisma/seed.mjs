// prisma/seed.mjs
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

await prisma.category.createMany({
  data: [
    { name: "Eletrônicos" },
    { name: "Ferramentas" },
    { name: "Automotivo" },
    { name: "Informática" },
    { name: "Escritório" },
  ],
  skipDuplicates: true,
});

const categorias = await prisma.category.findMany();

await prisma.product.createMany({
  data: [
    {
      sku: "SKU-001",
      name: "Chave de Fenda",
      price: 19.9,
      categoryId: categorias.find((c) => c.name === "Ferramentas")?.id,
    },
    {
      sku: "SKU-002",
      name: "Notebook",
      price: 3599.0,
      categoryId: categorias.find((c) => c.name === "Informática")?.id,
    },
    {
      sku: "SKU-003",
      name: "Cadeira Gamer",
      price: 899.0,
      categoryId: categorias.find((c) => c.name === "Escritório")?.id,
    },
    {
      sku: "SKU-004",
      name: "Multímetro Digital",
      price: 120.0,
      categoryId: categorias.find((c) => c.name === "Eletrônicos")?.id,
    },
    {
      sku: "SKU-005",
      name: "Pneu Aro 17",
      price: 550.0,
      categoryId: categorias.find((c) => c.name === "Automotivo")?.id,
    },
    {
      sku: "SKU-006",
      name: "Desktop Gamer",
      price: 8431.0,
      categoryId: categorias.find((c) => c.name === "Informática")?.id,
    },
    {
      sku: "SKU-007",
      name: "Martelo",
      price: 35.9,
      categoryId: categorias.find((c) => c.name === "Ferramentas")?.id,
    },
    {
      sku: "SKU-008",
      name: "Iphone",
      price: 6550.9,
      categoryId: categorias.find((c) => c.name === "Eletrônicos")?.id,
    },
    {
      sku: "SKU-009",
      name: "Makita",
      price: 250.0,
      categoryId: categorias.find((c) => c.name === "Ferramentas")?.id,
    },
    {
      sku: "SKU-010",
      name: "Mesa Gamer",
      price: 1500.0,
      categoryId: categorias.find((c) => c.name === "Escritório")?.id,
    },
  ],
  skipDuplicates: true,
});

await prisma.$disconnect();
console.log("Seed ok 🚀");
