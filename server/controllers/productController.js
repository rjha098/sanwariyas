// PURPOSE: Receive HTTP request → call service → send response

import * as productService from "../services/productService.js";


const getProducts = async (req, res) => {
  try {
    const { category, featured, page, limit } = req.query;
    const data = await productService.getAllProducts({
      category,
      featured,
      page,
      limit,
    });
    res.json({ success: true, ...data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// NEW: given a list of product IDs (from a customer's cart), return only
// the ones that are still available. Powers the cart page's orphan-check
// — no pagination limit involved, so it stays correct at any catalog size.
const checkProductsAvailability = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids)) {
      return res
        .status(400)
        .json({ success: false, message: "ids must be an array." });
    }
    const availableIds = await productService.checkProductsAvailability(ids);
    res.json({ success: true, availableIds });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getProductBySlug = async (req, res) => {
  try {
    const product = await productService.getProductBySlug(req.params.slug);
    res.json({ success: true, product });
  } catch (error) {
    const status = error.message === "Product not found" ? 404 : 500;
    res.status(status).json({ success: false, message: error.message });
  }
};

const getCategories = async (req, res) => {
  try {
    const categories = await productService.getCategories();
    res.json({ success: true, categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAdminProducts = async (req, res) => {
  try {
    const { page, limit, category, search, isAvailable } = req.query;
    const data = await productService.getAdminProducts({
      page,
      limit,
      category,
      search,
      isAvailable,
    });
    res.json({ success: true, ...data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAdminProductById = async (req, res) => {
  try {
    const product = await productService.getAdminProductById(req.params.id);
    res.json({ success: true, product });
  } catch (error) {
    const status = error.message === "Product not found" ? 404 : 500;
    res.status(status).json({ success: false, message: error.message });
  }
};

const createProduct = async (req, res) => {
  try {
    //  Directory-based upload — override body.image/images with actual uploaded files, if any
    if (req.files?.image?.[0]) {
      req.body.image = `/uploads/products/${req.files.image[0].filename}`;
    }
    if (req.files?.images?.length) {
      req.body.images = req.files.images.map(
        (f) => `/uploads/products/${f.filename}`,
      );
    }
    const product = await productService.createProduct(req.body);
    res.status(201).json({
      success: true,
      product,
      message: "Product created successfully",
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    if (req.files?.image?.[0]) {
      req.body.image = `/uploads/products/${req.files.image[0].filename}`;
    }
    if (req.files?.images?.length) {
      req.body.images = req.files.images.map(
        (f) => `/uploads/products/${f.filename}`,
      );
    }
    const product = await productService.updateProduct(req.params.id, req.body);
    res.json({
      success: true,
      product,
      message: "Product updated successfully",
    });
  } catch (error) {
    const status = error.message === "Product not found" ? 404 : 400;
    res.status(status).json({ success: false, message: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    await productService.deleteProduct(req.params.id);
    res.json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    const status = error.message === "Product not found" ? 404 : 400;
    res.status(status).json({ success: false, message: error.message });
  }
};

const seedData = async (req, res) => {
  try {
    await productService.seedProducts();
    res.json({ success: true, message: "Products seeded" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export {
  checkProductsAvailability,
  createProduct,
  deleteProduct,
  getAdminProductById,
  getAdminProducts,
  getCategories,
  getProductBySlug,
  getProducts,
  seedData,
  updateProduct,
};
