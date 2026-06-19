// FILE: server/controllers/blogController.js

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Blog from '../models/Blog.js';
import Category from '../models/Category.js';

// ES6 environment mein __dirname setup (sabse upar rahega)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
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
    const blog = await Blog.findOne({ slug: req.params.slug, status: 'published' })
      .populate('category', 'name slug')
      .lean();

    if (!blog) return res.status(404).json({ success: false, message: 'Blog not found.' });
    res.json({ success: true, data: blog });
  } catch (err) {
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
    const { title, slug, content, category, excerpt, metaTitle, metaDescription, status, tags } = req.body;

    if (!title || !slug || !content) {
      return res.status(400).json({ success: false, message: 'Title, slug, and content are required.' });
    }

    const featuredImage = req.file ? `/uploads/blogs/${req.file.filename}` : '';

    const blog = await Blog.create({
      title,
      slug,
      content,
      category:        category || null,
      featuredImage,
      excerpt:         excerpt || '',
      metaTitle:       metaTitle || title,
      metaDescription: metaDescription || '',
      status:          status || 'published',
      tags:            tags ? JSON.parse(tags) : [],
    });

    res.status(201).json({ success: true, data: blog });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ success: false, message: 'A blog with this slug already exists. Please use a different URL slug.' });
    }
    res.status(400).json({ success: false, message: err.message });
  }
};


// ── UPDATE blog ───────────────────────────────────────────────────────────────
export const updateBlog = async (req, res) => {
  try {
    const { title, slug, content, category, excerpt, metaTitle, metaDescription, status, tags } = req.body;
    
    // ✅ FIX: category || null because  objid  not  crash   
    const update = { 
      title, 
      slug, 
      content, 
      category: category || null, 
      excerpt, 
      metaTitle, 
      metaDescription, 
      status 
    };

    if (tags) update.tags = JSON.parse(tags);

    const oldBlog = await Blog.findById(req.params.id);
    if (!oldBlog) return res.status(404).json({ success: false, message: 'Blog not found.' });

    // ✅ for  old  image  deleting  logic
    if (req.file) {
      update.featuredImage = `/uploads/blogs/${req.file.filename}`;

      if (oldBlog.featuredImage) {
        const cleanImageName = oldBlog.featuredImage.replace(/^\//, ''); 
        const oldImagePath = path.join(__dirname, '..', cleanImageName); // server/uploads target karne ke liye
        
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
    // 1. Find the blog first to get the image filename before deleting the document
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ success: false, message: 'Blog not found.' });

    // 2. Delete the physical image file from the server
    if (blog.featuredImage) {
      // Remove leading slash to prevent path resolution issues on Windows
      const cleanImageName = blog.featuredImage.replace(/^\//, ''); 
      
      // Resolve the exact path in the server/uploads directory
      const imagePath = path.join(__dirname, '..', cleanImageName);
      
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      } 
    }

    // 3. Delete the blog document from the database
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
    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const cat  = await Category.create({ name: name.trim(), slug });
    res.status(201).json({ success: true, data: cat });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ success: false, message: 'Category already exists.' });
    }
    res.status(400).json({ success: false, message: err.message });
  }
};
