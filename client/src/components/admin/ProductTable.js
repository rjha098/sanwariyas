import Image from "next/image";

export default function ProductTable({
  products,
  productsLoading,
  productPagination,
  productPage,
  setProductPage,
  productSearch,
  setProductSearch,
  handleEditProduct,
  handleDeleteProduct,
  deletingProductId,
  loadProducts,
  token,
}) {
  return (
    <div className="bg-white border border-brand-lightgold/50 shadow-sm p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <p
            className="font-sans text-[11px] tracking-[0.3em] uppercase text-brand-gold mb-2"
            aria-hidden="true"
          >
            Inventory
          </p>
          <h2 className="font-display text-2xl">Manage Products</h2>
        </div>
        <div className="flex gap-3">
          <input
            type="search"
            aria-label="Search products by name, slug, or category"
            placeholder="Search by name, slug, category"
            value={productSearch}
            onChange={(e) => setProductSearch(e.target.value)}
            className="border border-brand-lightgold/60 px-4 py-3 text-sm focus:outline-none focus:border-brand-coffee w-full md:w-72"
          />
          <button
            onClick={() => {
              setProductPage(1);
              loadProducts(token, 1, productSearch);
            }}
            className="bg-brand-african text-brand-cream px-4 py-3 font-sans text-xs tracking-[0.2em] uppercase"
            aria-label="Submit search"
          >
            Search
          </button>
        </div>
      </div>

      {productsLoading ? (
        <div
          className="py-16 text-center font-sans text-sm text-brand-mud/60"
          aria-live="polite"
          aria-busy="true"
        >
          Loading products...
        </div>
      ) : products.length === 0 ? (
        <div
          className="py-16 text-center font-sans text-sm text-brand-mud/60"
          aria-live="polite"
        >
          No products found.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px]" aria-label="Products Table">
            <thead className="border-b border-brand-lightgold/60">
              <tr>
                {[
                  "Product",
                  "Category",
                  "Price",
                  "Status",
                  "Updated",
                  "Actions",
                ].map((heading) => (
                  <th
                    key={heading}
                    scope="col"
                    className="text-left py-3 pr-4 font-sans text-[10px] tracking-[0.25em] uppercase text-brand-mud/70"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-lightgold/40">
              {products.map((product) => (
                <tr key={product._id}>
                  <td className="py-4 pr-4">
                    <div className="flex items-center gap-3">
                      <Image
                        src={product.image}
                        alt={`Thumbnail for ${product.name}`}
                        width={56}
                        height={56}
                        className="w-14 h-14 object-cover border border-brand-lightgold/50"
                      />

                      <div>
                        <p className="font-sans text-sm text-brand-african">
                          {product.name}
                        </p>
                        <p className="font-sans text-xs text-brand-mud/60">
                          {product.slug}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 pr-4 font-sans text-sm text-brand-mud">
                    {product.category}
                  </td>
                  <td className="py-4 pr-4 font-sans text-sm text-brand-mud">
                    Rs. {Number(product.price || 0).toLocaleString("en-IN")}
                  </td>
                  <td className="py-4 pr-4">
                    <div className="flex flex-wrap gap-2">
                      <span
                        className={`px-2 py-1 text-[10px] tracking-[0.2em] uppercase border ${product.isAvailable ? "border-green-300 text-green-700 bg-green-50" : "border-gray-300 text-gray-600 bg-gray-50"}`}
                      >
                        {product.isAvailable ? "Live" : "Hidden"}
                      </span>
                      {product.isFeatured && (
                        <span className="px-2 py-1 text-[10px] tracking-[0.2em] uppercase border border-brand-gold/50 text-brand-coffee bg-brand-parchment">
                          Featured
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 pr-4 font-sans text-xs text-brand-mud/70">
                    {new Date(
                      product.updatedAt || product.createdAt,
                    ).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="py-4 pr-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditProduct(product)}
                        aria-label={`Edit product: ${product.name}`}
                        className="px-3 py-2 text-[10px] tracking-[0.2em] uppercase border border-brand-coffee text-brand-coffee"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product._id)}
                        disabled={deletingProductId === product._id}
                        aria-label={`Delete product: ${product.name}`}
                        className="px-3 py-2 text-[10px] tracking-[0.2em] uppercase border border-red-200 text-red-700 disabled:opacity-60"
                      >
                        {deletingProductId === product._id
                          ? "Deleting..."
                          : "Delete"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {productPagination.pages > 1 && (
        <nav
          aria-label="Product pagination"
          className="flex flex-wrap gap-2 mt-6"
        >
          {Array.from(
            { length: productPagination.pages },
            (_, index) => index + 1,
          ).map((pg) => (
            <button
              key={pg}
              onClick={() => setProductPage(pg)}
              aria-current={pg === productPage ? "page" : undefined}
              aria-label={`Go to page ${pg}`}
              className={`w-10 h-10 font-sans text-xs ${
                pg === productPage
                  ? "bg-brand-coffee text-brand-cream"
                  : "border border-brand-lightgold/60 text-brand-mud"
              }`}
            >
              {pg}
            </button>
          ))}
        </nav>
      )}
    </div>
  );
}
