# Alankar — Ethnic Luxury Clothing Business Website
## Full Stack: Next.js (App Router) + Express.js + MongoDB

---

## 📁 COMPLETE FOLDER STRUCTURE

```
project-root/
├── README.md
│
├── server/
│   ├── index.js                    ← Express entry point
│   ├── package.json
│   ├── .env.example
│   ├── config/
│   │   └── db.js                   ← MongoDB connection
│   ├── models/
│   │   ├── Product.js
│   │   └── Inquiry.js
│   ├── services/
│   │   ├── productService.js
│   │   └── inquiryService.js
│   ├── controllers/
│   │   ├── productController.js
│   │   └── inquiryController.js
│   └── routes/
│       ├── productRoutes.js
│       └── inquiryRoutes.js
│
└── client/
    ├── package.json
    ├── next.config.js
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── next-sitemap.config.js
    ├── .env.local.example
    └── src/
        ├── app/
        │   ├── layout.js             ← Root layout + metadata + schema
        │   ├── page.js               ← Home page
        │   ├── globals.css
        │   ├── not-found.js          ← 404 page
        │   ├── sitemap.js            ← Dynamic sitemap
        │   ├── products/
        │   │   ├── page.js           ← Products listing
        │   │   └── [slug]/
        │   │       └── page.js       ← Product detail (SSG + SEO)
        │   ├── contact/
        │   │   └── page.js           ← Contact / Inquiry page
        │   └── admin/
        │       └── page.js           ← Admin dashboard
        ├── components/
        │   ├── layout/
        │   │   ├── Navbar.js
        │   │   └── Footer.js
        │   └── ui/
        │       ├── ProductCard.js
        │       ├── InquiryForm.js
        │       └── LoadingSkeleton.js
        ├── lib/
        │   └── api.js                ← Axios API calls
        └── public/
            └── robots.txt
```

---

## ⚙️ PREREQUISITES

- Node.js v18+ installed
- MongoDB running locally OR MongoDB Atlas URI ready
- Git (optional)

---

## 🚀 STEP-BY-STEP SETUP

### STEP 1 — Clone / Create project root

```bash
mkdir project-root
cd project-root
```

---

### STEP 2 — Setup Backend (Express)

```bash
cd project-root
mkdir server
cd server
```

Copy all server files into their respective folders, then:

```bash
npm install
```

This installs: `express`, `mongoose`, `cors`, `dotenv`, `nodemailer`, `slugify`, `nodemon`

Create your `.env` file:

```bash
cp .env.example .env
```

Edit `.env`:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/clothing_business
CLIENT_URL=http://localhost:3000

# Optional email notifications
EMAIL_USER=your@gmail.com
EMAIL_PASS=your_app_password
ADMIN_EMAIL=admin@yourstore.com
```

---

### STEP 3 — Setup Frontend (Next.js)

```bash
cd ..
# From project-root:
npx create-next-app@latest client --js --app --no-typescript --tailwind --eslint --src-dir --no-import-alias
cd client
```

> **Note:** If you used `create-next-app`, it auto-installs Tailwind. Otherwise install manually.

Install additional dependencies:

```bash
npm install axios next-sitemap
```

Copy all client files into their respective folders (overwrite the defaults).

Create your `.env.local` file:

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SITE_URL=https://yourclothingstore.com
NEXT_PUBLIC_SITE_NAME=Alankar - Ethnic Luxury
```

---

### STEP 4 — Install All Dependencies (explicit commands)

**Backend:**
```bash
cd project-root/server
npm install express mongoose cors dotenv nodemailer slugify
npm install --save-dev nodemon
```

**Frontend:**
```bash
cd project-root/client
npm install next react react-dom axios next-sitemap
npm install --save-dev tailwindcss postcss autoprefixer
```

---

### STEP 5 — Run the Application

**Terminal 1 — Start Backend:**
```bash
cd project-root/server
npm run dev
# Server running on http://localhost:5000
```

**Terminal 2 — Start Frontend:**
```bash
cd project-root/client
npm run dev
# Frontend running on http://localhost:3000
```

---

### STEP 6 — Seed Sample Products

Once both servers are running, open your browser and visit:

```
http://localhost:5000/api/products/seed
```

This seeds 8 sample Indian ethnic wear products into MongoDB.

Then visit:
```
http://localhost:3000
```

---

## 📄 PAGES

| URL | Description |
|---|---|
| `http://localhost:3000/` | Home page with hero, categories, featured products |
| `http://localhost:3000/products` | All products with category filters |
| `http://localhost:3000/products/[slug]` | Product detail with inquiry form |
| `http://localhost:3000/contact` | Contact & inquiry form |
| `http://localhost:3000/admin` | Admin dashboard (view/manage inquiries) |
| `http://localhost:3000/sitemap.xml` | Auto-generated sitemap |

---

## 🔌 API ENDPOINTS

| Method | URL | Description |
|---|---|---|
| GET | `/api/products` | Get all products (supports ?category=, ?featured=true, ?page=, ?limit=) |
| GET | `/api/products/categories` | Get all categories |
| GET | `/api/products/:slug` | Get single product by slug |
| GET | `/api/products/seed` | Seed sample data (remove in production) |
| POST | `/api/inquiry` | Submit inquiry |
| GET | `/api/inquiry` | Get all inquiries (admin) |
| PATCH | `/api/inquiry/:id/status` | Update inquiry status |
| GET | `/api/health` | Health check |

---

## 🏗️ BUILD FOR PRODUCTION

**Backend:**
```bash
cd server
npm start
```

**Frontend:**
```bash
cd client
npm run build
npm start

# Generate sitemap after build
npm run postbuild
# (Add to package.json scripts: "postbuild": "next-sitemap")
```

---

## 🌐 SEO FEATURES IMPLEMENTED

- ✅ Next.js Metadata API (title, description, OG tags, Twitter cards)
- ✅ Dynamic per-product metadata with `generateMetadata()`
- ✅ Static site generation for product pages with `generateStaticParams()`
- ✅ Canonical URLs on all pages
- ✅ `sitemap.js` — dynamic sitemap including all product URLs
- ✅ `robots.txt` — blocks admin/api routes
- ✅ Organization Schema (JSON-LD)
- ✅ Product Schema (JSON-LD) on each product page
- ✅ FAQ Schema on home page
- ✅ WebSite Schema with SearchAction
- ✅ `next/image` with automatic optimization and lazy loading
- ✅ SEO-friendly URLs: `/products/royal-banarasi-silk-saree`
- ✅ Open Graph images
- ✅ Security headers

---

## 🎨 COLOR THEME

```
African Brown: #574325  (Primary)
Coffee:        #6F4E37  (Buttons, accents)
Old Brown:     #634236
Dark Brown:    #5D432C
Chocolate:     #713600
Taupe:         #483C32  (Footer bg)
Mud:           #70543E  (Body text)
Cream:         #F5EFE6  (Light bg)
Gold:          #C9A84C  (Accent, badges)
Parchment:     #FAF3E8  (Page bg)
```

---

## 📦 TECH STACK SUMMARY

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router), JavaScript, Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB with Mongoose ODM |
| HTTP Client | Axios |
| Images | next/image (optimized) |
| Email | Nodemailer (optional) |
| SEO | Next.js Metadata API, JSON-LD |
| Sitemap | next-sitemap + sitemap.js route |
