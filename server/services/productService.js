// PURPOSE: All database logic for products lives HERE

import Product from '../models/Product.js';
import slugify from 'slugify';


// Fetch products with optional filters and pagination
// Default: page 1, 12 products per page

const getAllProducts = async ({ category, featured, page = 1, limit = 12 }) => {
    // Start with: only show products that are in stock
  const query = { isAvailable: true };
    // If category filter sent, add it to the query
  if (category) query.category = category;
   // If featured=true sent, only show featured products
  // String 'true' not Boolean — URL params are always strings
  if (featured === 'true') query.isFeatured = true;



    // PAGINATION math:
  // Page 1 → skip 0  (show products 1–12)
  // Page 2 → skip 12 (show products 13–24)
  // Page 3 → skip 24 (show products 25–36)

  const skip = (parseInt(page) - 1) * parseInt(limit);
    // Count matching products — needed to calculate total pages
  // countDocuments is fast — only counts, doesn't fetch data
  const total = await Product.countDocuments(query);
  const products = await Product.find(query)
      // Sort: featured products first, then newest first
    .sort({ isFeatured: -1, createdAt: -1 })
     // Skip products from previous pages
    .skip(skip)
      // Only return this many products
    .limit(parseInt(limit))
        // .lean() = return plain JS object, not Mongoose document
    // Faster and uses less memory
    .lean();

  return {
    products,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(total / parseInt(limit)),
    },
  };
};

const getProductBySlug = async (slug) => {

   // distinct = get all UNIQUE values of the 'category' field
  // Returns: ["Sarees", "Lehengas", "Suits", "Gowns"]
  // No duplicates even if 20 products have category "Sarees"

  const product = await Product.findOne({ slug, isAvailable: true }).lean();
  if (!product) throw new Error('Product not found');
  return product;
};

const getCategories = async () => {
  const categories = await Product.distinct('category', { isAvailable: true });
  return categories;
};

const getAdminProducts = async ({ page = 1, limit = 20, category, search, isAvailable }) => {
  const query = {};

  if (category) query.category = category;
  if (typeof isAvailable !== 'undefined' && isAvailable !== '') {
    query.isAvailable = isAvailable === 'true';
  }

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { category: { $regex: search, $options: 'i' } },
      { slug: { $regex: search, $options: 'i' } },
    ];
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const total = await Product.countDocuments(query);
  const products = await Product.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit))
    .lean();

  return {
    products,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(total / parseInt(limit)),
    },
  };
};

const getAdminProductById = async (id) => {
  const product = await Product.findById(id).lean();
  if (!product) throw new Error('Product not found');
  return product;
};

const normalizeProductPayload = (payload = {}, { isUpdate = false } = {}) => {
  const cleanString = (value) => (typeof value === 'string' ? value.trim() : '');
  const cleanNumber = (value, fallback = null) => {
    if (value === '' || value === null || typeof value === 'undefined') return fallback;
    const parsed = Number(value);
    return Number.isNaN(parsed) ? fallback : parsed;
  };

  const tagsInput = Array.isArray(payload.tags)
    ? payload.tags
    : cleanString(payload.tags).split(',');

  const imagesInput = Array.isArray(payload.images)
    ? payload.images
    : cleanString(payload.images).split('\n');

  const data = {
    name: cleanString(payload.name),
    slug: cleanString(payload.slug) || slugify(cleanString(payload.name), { lower: true, strict: true }),
    description: cleanString(payload.description),
    shortDescription: cleanString(payload.shortDescription),
    price: cleanNumber(payload.price, isUpdate ? undefined : 0),
    originalPrice: cleanNumber(payload.originalPrice, null),
    image: cleanString(payload.image),
    images: imagesInput.map((item) => cleanString(item)).filter(Boolean),
    category: cleanString(payload.category) || 'General',
    tags: tagsInput.map((item) => cleanString(item)).filter(Boolean),
    fabric: cleanString(payload.fabric),
    occasion: cleanString(payload.occasion),
    isAvailable: typeof payload.isAvailable === 'boolean' ? payload.isAvailable : payload.isAvailable === 'true',
    isFeatured: typeof payload.isFeatured === 'boolean' ? payload.isFeatured : payload.isFeatured === 'true',
    metaTitle: cleanString(payload.metaTitle),
    metaDescription: cleanString(payload.metaDescription),
  };

  if (!data.images.length && data.image) {
    data.images = [data.image];
  }

  if (isUpdate) {
    Object.keys(data).forEach((key) => {
      if (typeof data[key] === 'undefined') delete data[key];
    });
  }

  return data;
};

const ensureValidProduct = async (data, currentId = null) => {
  if (!data.name) throw new Error('Product name is required');
  if (!data.slug) throw new Error('Product slug is required');
  if (!data.description) throw new Error('Description is required');
  if (!data.image) throw new Error('Main image URL is required');
  if (typeof data.price !== 'number' || data.price < 0) throw new Error('Valid price is required');

  const existing = await Product.findOne({ slug: data.slug });
  if (existing && String(existing._id) !== String(currentId)) {
    throw new Error('A product with this slug already exists');
  }
};

const createProduct = async (payload) => {
  const data = normalizeProductPayload(payload);
  await ensureValidProduct(data);
  const product = await Product.create(data);
  return product.toObject();
};

const updateProduct = async (id, payload) => {
  const existing = await Product.findById(id);
  if (!existing) throw new Error('Product not found');

  const data = normalizeProductPayload(payload, { isUpdate: true });
  const merged = {
    ...existing.toObject(),
    ...data,
  };

  await ensureValidProduct(merged, id);

  Object.assign(existing, data);
  await existing.save();
  return existing.toObject();
};

const deleteProduct = async (id) => {
  const product = await Product.findByIdAndDelete(id);
  if (!product) throw new Error('Product not found');
  return { deleted: true };
};


// Add sample products to empty database — for testing only

const seedProducts = async () => {
  const count = await Product.countDocuments();
    // If products already exist, do nothing — prevent duplicates

  if (count > 0) return;

  const sampleProducts = [
    {
      name: 'Royal Banarasi Silk Saree',
      slug: 'royal-banarasi-silk-saree',
      description: 'A stunning Banarasi silk saree with intricate gold zari work. This masterpiece of Indian weaving tradition features elaborate floral motifs and a rich pallu with temple border. Perfect for weddings and festive occasions. The saree comes with a matching unstitched blouse piece.',
      shortDescription: 'Exquisite gold zari Banarasi silk saree for weddings',
      price: 12500,
      originalPrice: 18000,
      image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80',
      images: [
        'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80',
        'https://images.unsplash.com/photo-1583391733956-6c5b800ee1c6?w=800&q=80',
      ],
      category: 'Sarees',
      tags: ['banarasi', 'silk', 'wedding', 'festive'],
      fabric: 'Pure Silk',
      occasion: 'Wedding',
      isFeatured: true,
      metaTitle: 'Royal Banarasi Silk Saree | Premium Wedding Sarees',
      metaDescription: 'Buy authentic Royal Banarasi Silk Saree with intricate gold zari work. Perfect for weddings and festive occasions.',
    },
    {
      name: 'Anarkali Embroidered Suit',
      slug: 'anarkali-embroidered-suit',
      description: 'A floor-length Anarkali suit crafted with heavy embroidery and mirror work. Features a flared silhouette with a fitted bodice, adorned with delicate sequin and thread embroidery. Comes with churidar and dupatta. This ensemble radiates elegance and grace.',
      shortDescription: 'Stunning floor-length Anarkali with heavy embroidery',
      price: 8900,
      originalPrice: 12000,
      image: 'https://images.unsplash.com/photo-1614519379172-32183e78b3b6?w=800&q=80',
      images: [
        'https://images.unsplash.com/photo-1614519379172-32183e78b3b6?w=800&q=80',
      ],
      category: 'Suits',
      tags: ['anarkali', 'embroidery', 'festive', 'ethnic'],
      fabric: 'Georgette',
      occasion: 'Festive',
      isFeatured: true,
      metaTitle: 'Anarkali Embroidered Suit | Designer Ethnic Wear',
      metaDescription: 'Elegant Anarkali Embroidered Suit with heavy mirror work and sequin embroidery. Perfect for festive occasions.',
    },
    {
      name: 'Chanderi Cotton Silk Saree',
      slug: 'chanderi-cotton-silk-saree',
      description: 'Lightweight and lustrous Chanderi cotton silk saree with delicate silver zari border. The subtle sheen and soft drape make it perfect for daytime events and office wear. Features traditional butis scattered across the body with a refined border.',
      shortDescription: 'Lightweight Chanderi silk with silver zari border',
      price: 4500,
      originalPrice: 6000,
      image: 'https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?w=800&q=80',
      images: [
        'https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?w=800&q=80',
      ],
      category: 'Sarees',
      tags: ['chanderi', 'cotton', 'silk', 'casual', 'office'],
      fabric: 'Cotton Silk',
      occasion: 'Casual',
      isFeatured: false,
      metaTitle: 'Chanderi Cotton Silk Saree | Casual & Office Wear',
      metaDescription: 'Elegant Chanderi Cotton Silk Saree with silver zari border. Lightweight and perfect for daily and office wear.',
    },
    {
      name: 'Bridal Lehenga Choli',
      slug: 'bridal-lehenga-choli',
      description: 'An opulent bridal lehenga featuring extensive hand embroidery with gold and silver threads, kundan work, and delicate mirror embellishments. The lehenga has a full flared skirt with multiple layers, paired with a heavily embroidered choli and a matching dupatta with scalloped borders.',
      shortDescription: 'Opulent hand-embroidered bridal lehenga with kundan work',
      price: 45000,
      originalPrice: 65000,
      image: 'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=800&q=80',
      images: [
        'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=800&q=80',
      ],
      category: 'Lehengas',
      tags: ['bridal', 'lehenga', 'wedding', 'kundan', 'premium'],
      fabric: 'Velvet & Net',
      occasion: 'Bridal',
      isFeatured: true,
      metaTitle: 'Bridal Lehenga Choli | Premium Wedding Lehengas',
      metaDescription: 'Opulent bridal lehenga choli with hand embroidery, kundan work, and mirror embellishments. Your dream wedding outfit.',
    },
    {
      name: 'Kantha Stitch Silk Saree',
      slug: 'kantha-stitch-silk-saree',
      description: 'A beautiful Bengal silk saree featuring the traditional Kantha embroidery stitch. Hand-stitched by skilled artisans, each saree tells a story through its intricate running stitch patterns depicting nature, mythology, and folk tales. A true collector\'s piece.',
      shortDescription: 'Handcrafted Bengal silk with traditional Kantha embroidery',
      price: 7800,
      originalPrice: 10500,
      image: 'https://images.unsplash.com/photo-1601933973783-43cf8a7d4c5f?w=800&q=80',
      images: [
        'https://images.unsplash.com/photo-1601933973783-43cf8a7d4c5f?w=800&q=80',
      ],
      category: 'Sarees',
      tags: ['kantha', 'bengal', 'silk', 'handcrafted', 'artisan'],
      fabric: 'Pure Silk',
      occasion: 'Festive',
      isFeatured: false,
      metaTitle: 'Kantha Stitch Silk Saree | Handcrafted Bengal Artisan Sarees',
      metaDescription: 'Authentic Kantha Stitch Silk Saree handcrafted by Bengal artisans. Each piece is unique with traditional running stitch patterns.',
    },
    {
      name: 'Palazzo Printed Kurti Set',
      slug: 'palazzo-printed-kurti-set',
      description: 'A chic contemporary kurti set featuring a flowy printed kurti paired with wide-leg palazzo pants. The set uses premium rayon fabric with vibrant block prints inspired by Rajasthani motifs. Comfortable for all-day wear and stylish enough for casual outings.',
      shortDescription: 'Flowy Rajasthani block-print kurti with wide palazzo',
      price: 2800,
      originalPrice: 3800,
      image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80',
      images: [
        'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80',
      ],
      category: 'Kurtis',
      tags: ['kurti', 'palazzo', 'printed', 'casual', 'daily wear'],
      fabric: 'Rayon',
      occasion: 'Casual',
      isFeatured: false,
      metaTitle: 'Palazzo Printed Kurti Set | Casual Ethnic Wear',
      metaDescription: 'Trendy Palazzo Printed Kurti Set with Rajasthani block prints. Comfortable rayon fabric perfect for daily and casual wear.',
    },
    {
      name: 'Heavy Embellished Gown',
      slug: 'heavy-embellished-gown',
      description: 'A show-stopping evening gown with heavy stone work and sequin embellishments across the bodice and flowing skirt. This Indo-western fusion piece combines the elegance of Western silhouette with traditional Indian embroidery work. Features a dramatic train and off-shoulder design.',
      shortDescription: 'Indo-western sequin gown with dramatic stone embellishments',
      price: 22000,
      originalPrice: 30000,
      image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&q=80',
      images: [
        'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&q=80',
      ],
      category: 'Gowns',
      tags: ['gown', 'indo-western', 'sequin', 'party', 'evening'],
      fabric: 'Net & Silk',
      occasion: 'Party',
      isFeatured: true,
      metaTitle: 'Heavy Embellished Gown | Indo-Western Party Wear',
      metaDescription: 'Stunning Indo-western embellished gown with heavy stone work and sequins. Perfect for receptions and evening parties.',
    },
    {
      name: 'Tussar Silk Salwar Kameez',
      slug: 'tussar-silk-salwar-kameez',
      description: 'An elegant Tussar silk salwar kameez with hand-painted madhubani motifs. The natural texture of Tussar silk gives it an earthy, authentic appeal. Features a straight-cut kameez with side slits and a matching straight salwar. A perfect blend of art and fashion.',
      shortDescription: 'Natural Tussar silk with hand-painted Madhubani art',
      price: 6500,
      originalPrice: 8800,
      image: 'https://images.unsplash.com/photo-1583391733956-6c5b800ee1c6?w=800&q=80',
      images: [
        'https://images.unsplash.com/photo-1583391733956-6c5b800ee1c6?w=800&q=80',
      ],
      category: 'Suits',
      tags: ['tussar', 'silk', 'madhubani', 'handpainted', 'artisan'],
      fabric: 'Tussar Silk',
      occasion: 'Semi-Formal',
      isFeatured: false,
      metaTitle: 'Tussar Silk Salwar Kameez | Madhubani Hand-painted Ethnic Wear',
      metaDescription: 'Authentic Tussar Silk Salwar Kameez with hand-painted Madhubani motifs. Unique artisan piece blending art and fashion.',
    },
  ];

     // insertMany = add multiple documents at once — faster than one by one
  await Product.insertMany(sampleProducts);
  console.log('Sample products seeded successfully');
};

export {
  createProduct,
  deleteProduct,
  getAdminProductById,
  getAdminProducts,
  getAllProducts,
  getProductBySlug,
  getCategories,
  seedProducts,
  updateProduct,
};
