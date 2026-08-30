// FILE: server/controllers/blogController.js

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Blog from "../models/Blog.js";
import Category from "../models/Category.js";

import sanitizeHtml from "sanitize-html";

const sanitizeBlogContent = (html = "") =>
  sanitizeHtml(html, {
    allowedTags: [
      "p",
      "br",
      "b",
      "strong",
      "i",
      "em",
      "u",
      "s",
      "blockquote",
      "h1",
      "h2",
      "h3",
      "h4",
      "ul",
      "ol",
      "li",
      "a",
      "img",
      "figure",
      "figcaption",
      "code",
      "pre",
      "span",
    ],
    allowedAttributes: {
      a: ["href", "target", "rel"],
      img: ["src", "alt", "width", "height"],
      "*": ["class"],
    },
    allowedSchemes: ["http", "https", "mailto"],
    transformTags: {
      a: sanitizeHtml.simpleTransform("a", { rel: "noopener noreferrer" }),
    },
  });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const generateBulletproofSlug = (text) => {
  return text
    .toLowerCase()
    .trim()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
};

export const getAllBlogs = async (req, res) => {
  try {

    const { status, category } = req.query;
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 10, 1), 50);

    const query = {};
    if (status) query.status = status;
    if (category) query.category = category;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Blog.countDocuments(query);
    const blogs = await Blog.find(query)
      .populate("category", "name slug")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .select("-content")
      .lean();

    res.json({
      success: true,
      data: blogs,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getBlogBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const preview = req.query.preview === "true";

    const blog = await Blog.findOne({ slug })
      .populate("category", "name slug")
      .lean();

    if (!blog) {
      return res
        .status(404)
        .json({ success: false, message: "Blog not found." });
    }

    if (blog.status !== "published" && !preview) {
      return res.status(404).json({
        success: false,
        message: "Blog exists but is not published.",
      });
    }

    res.json({ success: true, data: blog });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getAdminBlogs = async (req, res) => {
  try {
    const { search, id } = req.query;
    
    //  FIX 1: Hard cap limit to prevent DB crash (DoS protection)
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 20, 1), 100);

    const query = {};

    if (id) {
      query._id = id;
    }

    //  FIX 2: Escaped search regex (ReDoS protection)
    const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    
    if (search) {
      const safeSearch = escapeRegex(search); // Special characters neutral ho jayenge
      query.$or = [
        { title: { $regex: safeSearch, $options: "i" } },
        { slug: { $regex: safeSearch, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;
    const total = await Blog.countDocuments(query);

    let dbQuery = Blog.find(query)
      .populate("category", "name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    if (!id) {
      dbQuery = dbQuery.select("-content");
    }

    const blogs = await dbQuery;

    res.json({
      success: true,
      data: blogs,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const createBlog = async (req, res) => {
  try {
    const {
      title,
      content,
      category,
      excerpt,
      metaTitle,
      metaDescription,
      status,
      tags,
    } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: "Title and content are required.",
      });
    }

    let finalSlug = generateBulletproofSlug(title);

    if (!finalSlug) {
      return res.status(400).json({
        success: false,
        message:
          "Title must contain at least one valid character to generate a URL.",
      });
    }

    const existing = await Blog.findOne({ slug: finalSlug });
    if (existing) {
      finalSlug = `${finalSlug}-${Date.now().toString().slice(-5)}`;
    }

    const featuredImage =
      req.files && req.files["image"]
        ? `/uploads/blogs/${req.files["image"][0].filename}`
        : "";

    const bannerImage =
      req.files && req.files["bannerImage"]
        ? `/uploads/blogs/${req.files["bannerImage"][0].filename}`
        : "";

    const validStatuses = ["published", "draft"];
    const finalStatus = validStatuses.includes(status) ? status : "published";

     let parsedTags = [];
    if (tags) {
      try {
        parsedTags = JSON.parse(tags);
        if (!Array.isArray(parsedTags)) throw new Error();
      } catch {
        return res.status(400).json({ success: false, message: "Tags must be a valid array." });
      }
    }


    const blog = await Blog.create({
      title,
      slug: finalSlug,
      content: sanitizeBlogContent(content),
      category: category || null,
      featuredImage,
      bannerImage,
      excerpt: excerpt || "",
      metaTitle: metaTitle || title,
      metaDescription: metaDescription || "",
      status: finalStatus,
      tags: parsedTags,
    });

    return res.status(201).json({ success: true, data: blog });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "A blog with this slug already exists. Please try again.",
      });
    }
    return res.status(400).json({ success: false, message: err.message });
  }
};

export const updateBlog = async (req, res) => {
  try {
    const {
      title,
      slug,
      content,
      category,
      excerpt,
      metaTitle,
      metaDescription,
      status,
      tags,
    } = req.body;

    const cleanSlug = slug ? generateBulletproofSlug(slug) : undefined;
    const validStatuses = ["published", "draft"];
    const finalStatus = validStatuses.includes(status) ? status : undefined;

    const update = {};
    if (title !== undefined) update.title = title;
    if (cleanSlug !== undefined) update.slug = cleanSlug;
    if (content !== undefined) update.content = sanitizeBlogContent(content);
    if (category !== undefined) update.category = category || null;
    if (excerpt !== undefined) update.excerpt = excerpt;
    if (metaTitle !== undefined) update.metaTitle = metaTitle;
    if (metaDescription !== undefined) update.metaDescription = metaDescription;
    if (finalStatus) update.status = finalStatus;

    if (tags) {
      try {
        const parsedTags = JSON.parse(tags);
        if (!Array.isArray(parsedTags)) throw new Error();
        update.tags = parsedTags;
      } catch {
        return res.status(400).json({ success: false, message: "Tags must be a valid array." });
      }
    }


    const oldBlog = await Blog.findById(req.params.id);
    if (!oldBlog) {
      return res
        .status(404)
        .json({ success: false, message: "Blog not found." });
    }

    if (req.files) {
      if (req.files["image"]) {
        update.featuredImage = `/uploads/blogs/${req.files["image"][0].filename}`;
        if (oldBlog.featuredImage) {
          const cleanImageName = oldBlog.featuredImage.replace(/^\//, "");
          const oldImagePath = path.join(__dirname, "..", cleanImageName);
          if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);
        }
      }

      if (req.files["bannerImage"]) {
        update.bannerImage = `/uploads/blogs/${req.files["bannerImage"][0].filename}`;
        if (oldBlog.bannerImage) {
          const cleanBannerName = oldBlog.bannerImage.replace(/^\//, "");
          const oldBannerPath = path.join(__dirname, "..", cleanBannerName);
          if (fs.existsSync(oldBannerPath)) fs.unlinkSync(oldBannerPath);
        }
      }
    }

    const blog = await Blog.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true,
    });

    res.json({ success: true, data: blog });
 } catch (err) {
    if (err.code === 11000) {  
      return res.status(409).json({
        success: false,
        message: "A blog with this slug already exists. Please try again.",
      });
    }
    res.status(400).json({ success: false, message: err.message });
  }
};

export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res
        .status(404)
        .json({ success: false, message: "Blog not found." });
    }

    if (blog.featuredImage) {
      const cleanImageName = blog.featuredImage.replace(/^\//, "");
      const imagePath = path.join(__dirname, "..", cleanImageName);
      if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
    }

    if (blog.bannerImage) {
      const cleanBannerName = blog.bannerImage.replace(/^\//, "");
      const bannerPath = path.join(__dirname, "..", cleanBannerName);
      if (fs.existsSync(bannerPath)) fs.unlinkSync(bannerPath);
    }

    await Blog.findByIdAndDelete(req.params.id);
    res.json({
      success: true,
      message: "Blog and its associated image deleted successfully.",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getCategories = async (req, res) => {
  try {
    const cats = await Category.find().lean();
    res.json({ success: true, data: cats });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res
        .status(400)
        .json({ success: false, message: "Category name is required." });
    }

    const slug = generateBulletproofSlug(name);
    const cat = await Category.create({ name: name.trim(), slug });
    res.status(201).json({ success: true, data: cat });
  } catch (err) {
    if (err.code === 11000) {
      return res
        .status(409)
        .json({ success: false, message: "Category already exists." });
    }
    res.status(400).json({ success: false, message: err.message });
  }
};

// NEW FIX: Delete Category Function
export const deleteCategory = async (req, res) => {
  try {
    const cat = await Category.findById(req.params.id);
    if (!cat) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found." });
    }

    await Category.findByIdAndDelete(req.params.id);

    // Safely remove this category from any blogs that were using it
    await Blog.updateMany({ category: req.params.id }, { category: null });

    res.json({ success: true, message: "Category deleted successfully." });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
