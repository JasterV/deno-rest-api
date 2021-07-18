import { Product } from "../types/product.ts";
import { Body, RouterContext } from "https://deno.land/x/oak/mod.ts";

const text = await Deno.readTextFile("data/products.json");
let products: Product[] = JSON.parse(text);

// @description Get all products
// @route GET /api/v1/products
const getProducts = ({ response }: RouterContext) => {
  response.body = {
    success: true,
    data: products,
  };
};

// @description Get one product
// @route GET /api/v1/product/:id
const getProduct = ({ response, params }: RouterContext) => {
  const { id } = params;
  const product = products.find((p) => p.id == id);

  if (!product) {
    response.status = 404;
    response.body = {
      success: false,
      msg: "No product found",
    };
    return;
  }

  response.body = {
    success: true,
    data: product,
  };
};

// @description Create one product
// @route POST /api/v1/product
const addProduct = async ({ response, request }: RouterContext) => {
  const payload: Body = await request.body();

  if (!request.hasBody) {
    response.status = 400;
    response.body = {
      success: false,
      msg: "No data",
    };
  } else {
    const product: Product = await payload.value;
    const id = globalThis.crypto.randomUUID();
    const newProduct = { ...product, id };
    products.push(newProduct);
    response.status = 201;
    response.body = {
      success: true,
      data: newProduct,
    };
  }
};

// @description Update one product
// @route PUT /api/v1/product/:id
const updateProduct = async ({ response, request, params }: RouterContext) => {
  const payload: Body = await request.body();
  const { id } = params;
  const product = products.find((p) => p.id === id);

  if (!product) {
    response.status = 404;
    response.body = {
      success: false,
      msg: "Product not found",
    };
  } else if (!request.hasBody) {
    response.status = 400;
    response.body = {
      success: false,
      msg: "No data",
    };
  } else {
    const values: { name?: string; description?: string; price?: number } =
      await payload.value;
    products = products.map((p) => p.id === id ? { ...p, ...values } : p);
    response.status = 201;
    response.body = {
      success: true,
      data: products,
    };
  }
};

// @description Update one product
// @route DELETE /api/v1/product/:id
const deleteProduct = ({ response, params }: RouterContext) => {
  const { id } = params;
  products = products.filter((p) => p.id !== id);
  response.status = 201;
  response.body = {
    success: true,
    data: products,
  };
};

export default {
  getProducts,
  getProduct,
  addProduct,
  updateProduct,
  deleteProduct,
};
