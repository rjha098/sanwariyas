// FILE: client/src/components/admin/ProductForm.js

export default function ProductForm({
  productForm, setProductForm, handleProductSubmit, productSaving, productMessage,
  editingProductId, resetProductForm, handleSeedProducts, seeding
}) {
  return (
    <div className="bg-white border border-brand-lightgold/50 shadow-sm p-6">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <p className="font-sans text-[11px] tracking-[0.3em] uppercase text-brand-gold mb-2" aria-hidden="true">Catalog</p>
          <h2 className="font-display text-2xl">
            {editingProductId ? 'Edit Product' : 'Add Product'}
          </h2>
        </div>
        {editingProductId && (
          <button
            onClick={resetProductForm}
            className="font-sans text-xs tracking-[0.2em] uppercase text-brand-coffee"
            aria-label="Cancel editing and create new product"
          >
            New Product
          </button>
        )}
      </div>

      <form onSubmit={handleProductSubmit} className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <input
            type="text"
            aria-label="Product name"
            placeholder="Product name"
            value={productForm.name}
            onChange={(e) => setProductForm((prev) => ({ ...prev, name: e.target.value }))}
            className="border border-brand-lightgold/60 px-4 py-3 text-sm focus:outline-none focus:border-brand-coffee"
            required
          />
          <input
            type="text"
            aria-label="Product slug"
            placeholder="Slug"
            value={productForm.slug}
            onChange={(e) => setProductForm((prev) => ({ ...prev, slug: e.target.value }))}
            className="border border-brand-lightgold/60 px-4 py-3 text-sm focus:outline-none focus:border-brand-coffee"
          />
        </div>

        {/* ✅ STOCK INPUT ADDED HERE (Changed grid from 3 to 4 columns) */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <input
            type="text"
            aria-label="Product category"
            placeholder="Category"
            value={productForm.category}
            onChange={(e) => setProductForm((prev) => ({ ...prev, category: e.target.value }))}
            className="border border-brand-lightgold/60 px-4 py-3 text-sm focus:outline-none focus:border-brand-coffee"
          />
          <input
            type="number"
            aria-label="Product price"
            min="0"
            placeholder="Price"
            value={productForm.price}
            onChange={(e) => setProductForm((prev) => ({ ...prev, price: e.target.value }))}
            className="border border-brand-lightgold/60 px-4 py-3 text-sm focus:outline-none focus:border-brand-coffee"
            required
          />
          <input
            type="number"
            aria-label="Original price"
            min="0"
            placeholder="Original price"
            value={productForm.originalPrice}
            onChange={(e) => setProductForm((prev) => ({ ...prev, originalPrice: e.target.value }))}
            className="border border-brand-lightgold/60 px-4 py-3 text-sm focus:outline-none focus:border-brand-coffee"
          />
          <input
            type="number"
            aria-label="Stock quantity"
            min="0"
            placeholder="Stock (Empty = Unlimited)"
            value={productForm.stock}
            onChange={(e) => setProductForm((prev) => ({ ...prev, stock: e.target.value }))}
            className="border border-brand-lightgold/60 px-4 py-3 text-sm focus:outline-none focus:border-brand-coffee placeholder:text-[11px]"
          />
        </div>

        {/* ✅ Directory Upload — Main Image */}
        <div>
          <label className="block font-sans text-xs text-brand-mud mb-1">
            Main Image {!editingProductId && "*"}
          </label>
          <input
            type="file"
            accept="image/*"
            aria-label="Upload main product image"
            onChange={(e) => {
              const file = e.target.files?.[0] || null;
              if (file && file.size > 2 * 1024 * 1024) {
                alert("Image size must be under 2MB.");
                e.target.value = "";
                return;
              }
              setProductForm((prev) => ({ ...prev, imageFile: file }));
            }}
            className="w-full border border-brand-lightgold/60 px-4 py-3 text-sm focus:outline-none focus:border-brand-coffee bg-white"
          />
          {(productForm.imageFile || productForm.image) && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={
                productForm.imageFile
                  ? URL.createObjectURL(productForm.imageFile)
                  : productForm.image
              }
              alt="Main image preview"
              className="mt-2 w-28 h-28 object-cover rounded-md border border-brand-lightgold/40"
            />
          )}
        </div>

        {/* ✅ Directory Upload — Gallery Images */}
        <div>
          <label className="block font-sans text-xs text-brand-mud mb-1">
            Gallery Images (optional, up to 8)
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            aria-label="Upload additional gallery images"
            onChange={(e) => {
              const files = Array.from(e.target.files || []).slice(0, 8);
              const tooBig = files.find((f) => f.size > 2 * 1024 * 1024);
              if (tooBig) {
                alert("Each image must be under 2MB.");
                e.target.value = "";
                return;
              }
              setProductForm((prev) => ({ ...prev, galleryFiles: files }));
            }}
            className="w-full border border-brand-lightgold/60 px-4 py-3 text-sm focus:outline-none focus:border-brand-coffee bg-white"
          />
          {productForm.galleryFiles?.length > 0 ? (
            <div className="flex flex-wrap gap-2 mt-2">
              {productForm.galleryFiles.map((file, idx) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={idx}
                  src={URL.createObjectURL(file)}
                  alt={`Gallery preview ${idx + 1}`}
                  className="w-16 h-16 object-cover rounded-md border border-brand-lightgold/40"
                />
              ))}
            </div>
          ) : (
            productForm.images && (
              <p className="font-sans text-[11px] text-brand-mud mt-1">
                Existing gallery images will be kept unless you upload new ones.
              </p>
            )
          )}
        </div>

        <input
          type="text"
          aria-label="Short description"
          placeholder="Short description"
          value={productForm.shortDescription}
          onChange={(e) => setProductForm((prev) => ({ ...prev, shortDescription: e.target.value }))}
          className="w-full border border-brand-lightgold/60 px-4 py-3 text-sm focus:outline-none focus:border-brand-coffee"
        />

        <textarea
          rows={5}
          aria-label="Full description"
          placeholder="Full description"
          value={productForm.description}
          onChange={(e) => setProductForm((prev) => ({ ...prev, description: e.target.value }))}
          className="w-full border border-brand-lightgold/60 px-4 py-3 text-sm focus:outline-none focus:border-brand-coffee resize-none"
          required
        />

        <div className="grid sm:grid-cols-3 gap-4">
          <input
            type="text"
            aria-label="Tags, comma separated"
            placeholder="Tags, comma separated"
            value={productForm.tags}
            onChange={(e) => setProductForm((prev) => ({ ...prev, tags: e.target.value }))}
            className="border border-brand-lightgold/60 px-4 py-3 text-sm focus:outline-none focus:border-brand-coffee"
          />
          <input
            type="text"
            aria-label="Fabric"
            placeholder="Fabric"
            value={productForm.fabric}
            onChange={(e) => setProductForm((prev) => ({ ...prev, fabric: e.target.value }))}
            className="border border-brand-lightgold/60 px-4 py-3 text-sm focus:outline-none focus:border-brand-coffee"
          />
          <input
            type="text"
            aria-label="Occasion"
            placeholder="Occasion"
            value={productForm.occasion}
            onChange={(e) => setProductForm((prev) => ({ ...prev, occasion: e.target.value }))}
            className="border border-brand-lightgold/60 px-4 py-3 text-sm focus:outline-none focus:border-brand-coffee"
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <input
            type="text"
            aria-label="Meta title for SEO"
            placeholder="Meta title"
            value={productForm.metaTitle}
            onChange={(e) => setProductForm((prev) => ({ ...prev, metaTitle: e.target.value }))}
            className="border border-brand-lightgold/60 px-4 py-3 text-sm focus:outline-none focus:border-brand-coffee"
          />
          <input
            type="text"
            aria-label="Meta description for SEO"
            placeholder="Meta description"
            value={productForm.metaDescription}
            onChange={(e) => setProductForm((prev) => ({ ...prev, metaDescription: e.target.value }))}
            className="border border-brand-lightgold/60 px-4 py-3 text-sm focus:outline-none focus:border-brand-coffee"
          />
        </div>

        <div className="flex flex-wrap gap-6 pt-1">
          <label className="flex items-center gap-2 font-sans text-sm text-brand-mud">
            <input
              type="checkbox"
              checked={productForm.isFeatured}
              onChange={(e) => setProductForm((prev) => ({ ...prev, isFeatured: e.target.checked }))}
              aria-label="Mark product as featured"
            />
            Featured product
          </label>
          <label className="flex items-center gap-2 font-sans text-sm text-brand-mud">
            <input
              type="checkbox"
              checked={productForm.isAvailable}
              onChange={(e) => setProductForm((prev) => ({ ...prev, isAvailable: e.target.checked }))}
              aria-label="Mark product as available on site"
            />
            Available on site
          </label>
        </div>

        {productMessage && (
          <p aria-live="polite" role="status" className="font-sans text-xs bg-brand-parchment border border-brand-lightgold/60 text-brand-coffee px-4 py-3">
            {productMessage}
          </p>
        )}

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={productSaving}
            aria-busy={productSaving}
            className="bg-brand-coffee text-brand-cream px-5 py-3 font-sans text-xs tracking-[0.3em] uppercase disabled:opacity-60"
          >
            {productSaving ? 'Saving...' : editingProductId ? 'Update Product' : 'Create Product'}
          </button>
          <button
            type="button"
            onClick={handleSeedProducts}
            disabled={seeding}
            aria-busy={seeding}
            className="border border-brand-coffee text-brand-coffee px-5 py-3 font-sans text-xs tracking-[0.3em] uppercase disabled:opacity-60"
          >
            {seeding ? 'Seeding...' : 'Seed Samples'}
          </button>
        </div>
      </form>
    </div>
  );
}
