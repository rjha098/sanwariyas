// FILE: server/controllers/blogController.js

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Blog from '../models/Blog.js';
import Category from '../models/Category.js';

// ES6 environment mein __dirname setup (sabse upar rahega)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ════════════════════════════════════════════════════════════════
// BULLETPROOF SLUG GENERATOR (SINGLE SOURCE OF TRUTH)
// ════════════════════════════════════════════════════════════════
const generateBulletproofSlug = (text) => {
  return text
    .toLowerCase()
    .trim()
    .normalize('NFKD')                 // handles accented characters safely
    .replace(/[\u0300-\u036f]/g, '')   // strip diacritics
    .replace(/[^a-z0-9\s-]/g, '')      // remove all non-alphanumeric except space/hyphen
    .replace(/\s+/g, '-')              // spaces to hyphens
    .replace(/-+/g, '-')               // collapse multiple hyphens
    .replace(/^-+|-+$/g, '');          // strip leading/trailing hyphens
};

// ── GET all blogs (public) ────────────────────────────────────────────────────
export const getAllBlogs = async (req, res) => {
  try {
    const { page = 1, limit = 10, category, status = 'published' } = req.query;
    const query = {};
    if (status)   query.status   = status;
    if (category) query.category = category;

    const skip  = (parseInt(page) - 1) * parseInt(limit);
    const total = await Blog.countDocuments(query);
    const blogs = await Blog.find(query)
      .populate('category', 'name slug')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .select('-content') // listing mein full content nahi chahiye
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

// ── GET single blog by slug (public) ─────────────────────────────────────────

export const getBlogBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    // Seedha URL se param pakdo
    const preview = req.query.preview === 'true';

    console.log(`[Backend] Hit Slug: "${slug}" | Preview Mode: ${preview}`);

    const blog = await Blog.findOne({ slug }).populate('category', 'name slug').lean();

    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found.' });
    }

    // Agar blog published nahi hai AUR URL mein preview=true nahi laga hai, toh security block laga do
    if (blog.status !== 'published' && !preview) {
      console.log(`[Backend] Blocked Draft for Slug: "${slug}"`);
      return res.status(404).json({
        success: false,
        message: 'Blog exists but is not published.',
      });
    }

    res.json({ success: true, data: blog });
  } catch (err) {
    console.error('[getBlogBySlug] Error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};


// ── GET all blogs for admin (includes drafts) ─────────────────────────────────
export const getAdminBlogs = async (req, res) => {
  try {
    const { page = 1, limit = 20, search, id } = req.query;
    const query = {};
        
    if (id) {
      query._id = id;
    }

    if (search) {
      query.$or = [
        { title:    { $regex: search, $options: 'i' } },
        { slug:     { $regex: search, $options: 'i' } },
      ];
    }
    
    const skip  = (parseInt(page) - 1) * parseInt(limit);
    const total = await Blog.countDocuments(query);
    
    let dbQuery = Blog.find(query)
      .populate('category', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    if (!id) {
      dbQuery = dbQuery.select('-content');
    }

    const blogs = await dbQuery;

    res.json({
      success: true,
      data: blogs,
      pagination: { total, page: parseInt(page), limit: parseInt(limit), pages: Math.ceil(total / parseInt(limit)) },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── CREATE blog ───────────────────────────────────────────────────────────────
export const createBlog = async (req, res) => {
  try {
    const { title, content, category, excerpt, metaTitle, metaDescription, status, tags } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: 'Title and content are required.',
      });
    }

    // Backend ALWAYS regenerates the slug from title
    let finalSlug = generateBulletproofSlug(title);

    if (!finalSlug) {
      return res.status(400).json({
        success: false,
        message: 'Title must contain at least one valid character to generate a URL.',
      });
    }

    // Ensure uniqueness
    const existing = await Blog.findOne({ slug: finalSlug });
    if (existing) {
      finalSlug = `${finalSlug}-${Date.now().toString().slice(-5)}`;
    }

    const featuredImage = req.file ? `/uploads/blogs/${req.file.filename}` : '';

    // ✅ FIX: Sanitize status — empty string from FormData treated as missing
    const validStatuses = ['published', 'draft'];
    const finalStatus = validStatuses.includes(status) ? status : 'published';

    const blog = await Blog.create({
      title,
      slug: finalSlug,
      content,
      category: category || null,
      featuredImage,
      excerpt: excerpt || '',
      metaTitle: metaTitle || title,
      metaDescription: metaDescription || '',
      status: finalStatus,
      tags: tags ? JSON.parse(tags) : [],
    });

    // Return the FINAL slug back to frontend
    return res.status(201).json({ success: true, data: blog });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'A blog with this slug already exists. Please try again.',
      });
    }
    return res.status(400).json({ success: false, message: err.message });
  }
};
// ── UPDATE blog ───────────────────────────────────────────────────────────────
export const updateBlog = async (req, res) => {
  try {
    const { title, slug, content, category, excerpt, metaTitle, metaDescription, status, tags } = req.body;
    
    const cleanSlug = slug ? generateBulletproofSlug(slug) : undefined;

    // ✅ FIX: Same sanitization as createBlog
    const validStatuses = ['published', 'draft'];
    const finalStatus = validStatuses.includes(status) ? status : undefined;

    const update = { 
      title, 
      slug: cleanSlug, 
      content, 
      category: category || null, 
      excerpt, 
      metaTitle, 
      metaDescription, 
      ...(finalStatus && { status: finalStatus }), // ✅ only set if valid
    };

    if (tags) update.tags = JSON.parse(tags);

    const oldBlog = await Blog.findById(req.params.id);
    if (!oldBlog) return res.status(404).json({ success: false, message: 'Blog not found.' });

    if (req.file) {
      update.featuredImage = `/uploads/blogs/${req.file.filename}`;

      if (oldBlog.featuredImage) {
        const cleanImageName = oldBlog.featuredImage.replace(/^\//, ''); 
        const oldImagePath = path.join(__dirname, '..', cleanImageName);
        
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
    }

    const blog = await Blog.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
    
    res.json({ success: true, data: blog });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// ── DELETE blog ───────────────────────────────────────────────────────────────
export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ success: false, message: 'Blog not found.' });

    if (blog.featuredImage) {
      const cleanImageName = blog.featuredImage.replace(/^\//, ''); 
      const imagePath = path.join(__dirname, '..', cleanImageName);
      
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      } 
    }

    await Blog.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Blog and its associated image deleted successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── CATEGORIES ────────────────────────────────────────────────────────────────
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
    if (!name) return res.status(400).json({ success: false, message: 'Category name is required.' });
    
    // Use the bulletproof slug generator for categories as well!
    const slug = generateBulletproofSlug(name);
    
    const cat  = await Category.create({ name: name.trim(), slug });
    res.status(201).json({ success: true, data: cat });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ success: false, message: 'Category already exists.' });
    }
    res.status(400).json({ success: false, message: err.message });
  }
};