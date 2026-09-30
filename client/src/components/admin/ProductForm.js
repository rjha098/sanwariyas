// // FILE: client/src/components/admin/ProductForm.js

// export default function ProductForm({
//   productForm,
//   setProductForm,
//   handleProductSubmit,
//   productSaving,
//   productMessage,
//   editingProductId,
//   resetProductForm,
//   handleSeedProducts,
//   seeding,
// }) {
//   return (
//     <div className="bg-white border border-brand-lightgold/50 shadow-sm p-6">
//       <div className="flex items-start justify-between gap-4 mb-6">
//         <div>
//           <p
//             className="font-sans text-[11px] tracking-[0.3em] uppercase text-brand-gold mb-2"
//             aria-hidden="true"
//           >
//             Catalog
//           </p>
//           <h2 className="font-display text-2xl">
//             {editingProductId ? "Edit Product" : "Add Product"}
//           </h2>
//         </div>
//         {editingProductId && (
//           <button
//             onClick={resetProductForm}
//             className="font-sans text-xs tracking-[0.2em] uppercase text-brand-coffee"
//             aria-label="Cancel editing and create new product"
//           >
//             New Product
//           </button>
//         )}
//       </div>

//       <form onSubmit={handleProductSubmit} className="space-y-4">
//         <div className="grid sm:grid-cols-2 gap-4">
//           <input
//             type="text"
//             aria-label="Product name"
//             placeholder="Product name"
//             value={productForm.name}
//             onChange={(e) =>
//               setProductForm((prev) => ({ ...prev, name: e.target.value }))
//             }
//             className="border border-brand-lightgold/60 px-4 py-3 text-sm focus:outline-none focus:border-brand-coffee"
//             required
//           />
//           <input
//             type="text"
//             aria-label="Product slug"
//             placeholder="Slug"
//             value={productForm.slug}
//             onChange={(e) =>
//               setProductForm((prev) => ({ ...prev, slug: e.target.value }))
//             }
//             className="border border-brand-lightgold/60 px-4 py-3 text-sm focus:outline-none focus:border-brand-coffee"
//           />
//         </div>

//         {/* STOCK INPUT ADDED HERE (Changed grid from 3 to 4 columns) */}
//         <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
//           <input
//             type="text"
//             aria-label="Product category"
//             placeholder="Category"
//             value={productForm.category}
//             onChange={(e) =>
//               setProductForm((prev) => ({ ...prev, category: e.target.value }))
//             }
//             className="border border-brand-lightgold/60 px-4 py-3 text-sm focus:outline-none focus:border-brand-coffee"
//           />
//           <input
//             type="number"
//             aria-label="Product price"
//             min="0"
//             placeholder="Price"
//             value={productForm.price}
//             onChange={(e) =>
//               setProductForm((prev) => ({ ...prev, price: e.target.value }))
//             }
//             className="border border-brand-lightgold/60 px-4 py-3 text-sm focus:outline-none focus:border-brand-coffee"
//             required
//           />
//           <input
//             type="number"
//             aria-label="Original price"
//             min="0"
//             placeholder="Original price"
//             value={productForm.originalPrice}
//             onChange={(e) =>
//               setProductForm((prev) => ({
//                 ...prev,
//                 originalPrice: e.target.value,
//               }))
//             }
//             className="border border-brand-lightgold/60 px-4 py-3 text-sm focus:outline-none focus:border-brand-coffee"
//           />
//           <input
//             type="number"
//             aria-label="Stock quantity"
//             min="0"
//             placeholder="Stock (Empty = Unlimited)"
//             value={productForm.stock}
//             onChange={(e) =>
//               setProductForm((prev) => ({ ...prev, stock: e.target.value }))
//             }
//             className="border border-brand-lightgold/60 px-4 py-3 text-sm focus:outline-none focus:border-brand-coffee placeholder:text-[11px]"
//           />
//         </div>

//         {/* ✅ Directory Upload — Main Image */}
//         <div>
//           <label className="block font-sans text-xs text-brand-mud mb-1">
//             Main Image {!editingProductId && "*"}
//           </label>
//           <input
//             type="file"
//             accept="image/*"
//             aria-label="Upload main product image"
//             onChange={(e) => {
//               const file = e.target.files?.[0] || null;
//               if (file && file.size > 2 * 1024 * 1024) {
//                 alert("Image size must be under 2MB.");
//                 e.target.value = "";
//                 return;
//               }
//               setProductForm((prev) => ({ ...prev, imageFile: file }));
//             }}
//             className="w-full border border-brand-lightgold/60 px-4 py-3 text-sm focus:outline-none focus:border-brand-coffee bg-white"
//           />
//           {(productForm.imageFile || productForm.image) && (
//             // eslint-disable-next-line @next/next/no-img-element
//             <img
//               src={
//                 productForm.imageFile
//                   ? URL.createObjectURL(productForm.imageFile)
//                   : productForm.image
//               }
//               alt="Main image preview"
//               className="mt-2 w-28 h-28 object-cover rounded-md border border-brand-lightgold/40"
//             />
//           )}
//         </div>
//         {/* Directory Upload — Gallery Images */}

//         {/*        
//         <div>
//           <label className="block font-sans text-xs text-brand-mud mb-1">
//             Gallery Images (optional, up to 8)
//           </label>
//           <input
//             type="file"
//             accept="image/*"
//             multiple
//             aria-label="Upload additional gallery images"
//             onChange={(e) => {
              
//               let files = Array.from(e.target.files || []).slice(0, 4);

              
//               const mainImgName = productForm.imageFile?.name;
//               if (mainImgName) {
//                 files = files.filter((f) => f.name !== mainImgName);
//               }

             
//               const tooBig = files.find((f) => f.size > 2 * 1024 * 1024);
//               if (tooBig) {
//                 alert("Each gallery image must be under 2MB.");
//                 e.target.value = ""; // Reset the file input field
//                 return; // Stop further execution
//               }

//               setProductForm((prev) => ({ ...prev, galleryFiles: files }));
//             }}
//             className="w-full border border-brand-lightgold/60 px-4 py-3 text-sm focus:outline-none focus:border-brand-coffee bg-white"
//           />
//           {productForm.galleryFiles?.length > 0 ? (
//             <div className="flex flex-wrap gap-2 mt-2">
//               {productForm.galleryFiles.map((file, idx) => (
//                 // eslint-disable-next-line @next/next/no-img-element
//                 <img
//                   key={idx}
//                   src={URL.createObjectURL(file)}
//                   alt={`Gallery preview ${idx + 1}`}
//                   className="w-16 h-16 object-cover rounded-md border border-brand-lightgold/40"
//                 />
//               ))}
//             </div>
//           ) : (
//             productForm.images && (
//               <p className="font-sans text-[11px] text-brand-mud mt-1">
//                 Existing gallery images will be kept unless you upload new ones.
//               </p>
//             )
//           )}
//         </div>
//  */}

//         {/* ✅ Directory Upload — Gallery Images */}
//         <div>
//           <label className="block font-sans text-xs text-brand-mud mb-1">
//             Gallery Images (optional, up to 4)
//           </label>
//           <input
//             type="file"
//             accept="image/*"
//             multiple
//             aria-label="Upload additional gallery images"
//             onChange={(e) => {
//               // 1. Convert FileList to an array and limit the maximum number of gallery images to 4
//               let files = Array.from(e.target.files || []).slice(0, 4);

//               // 2. Prevent Duplication: Auto-remove the Main Image if it is accidentally selected in the gallery
//               const mainImgName = productForm.imageFile?.name;
//               if (mainImgName) {
//                 files = files.filter((f) => f.name !== mainImgName);
//               }
//               // 3. File Size Validation: Check if any single image exceeds the 2MB size limit
//               const tooBig = files.find((f) => f.size > 2 * 1024 * 1024);
//               if (tooBig) {
//                 alert("Each image must be under 2MB.");
//                 e.target.value = "";
//                 return;
//               }

//               // 4. Update State: Save the cleaned and validated image array into the form state  
              
//               setProductForm((prev) => ({ ...prev, galleryFiles: files }));
//             }}
//             className="w-full border border-brand-lightgold/60 px-4 py-3 text-sm focus:outline-none focus:border-brand-coffee bg-white"
//           />
//           {productForm.galleryFiles?.length > 0 ? (
//             <div className="flex flex-wrap gap-2 mt-2">
//               {productForm.galleryFiles.map((file, idx) => (
//                 // eslint-disable-next-line @next/next/no-img-element
//                 <img
//                   key={idx}
//                   src={URL.createObjectURL(file)}
//                   alt={`Gallery preview ${idx + 1}`}
//                   className="w-16 h-16 object-cover rounded-md border border-brand-lightgold/40"
//                 />
//               ))}
//             </div>
//           ) : (
//             productForm.images && (
//               <p className="font-sans text-[11px] text-brand-mud mt-1">
//                 Existing gallery images will be kept unless you upload new ones.
//               </p>
//             )
//           )}
//         </div>

//         <input
//           type="text"
//           aria-label="Short description"
//           placeholder="Short description"
//           value={productForm.shortDescription}
//           onChange={(e) =>
//             setProductForm((prev) => ({
//               ...prev,
//               shortDescription: e.target.value,
//             }))
//           }
//           className="w-full border border-brand-lightgold/60 px-4 py-3 text-sm focus:outline-none focus:border-brand-coffee"
//         />

//         <textarea
//           rows={5}
//           aria-label="Full description"
//           placeholder="Full description"
//           value={productForm.description}
//           onChange={(e) =>
//             setProductForm((prev) => ({ ...prev, description: e.target.value }))
//           }
//           className="w-full border border-brand-lightgold/60 px-4 py-3 text-sm focus:outline-none focus:border-brand-coffee resize-none"
//           required
//         />

//         <div className="grid sm:grid-cols-3 gap-4">
//           <input
//             type="text"
//             aria-label="Tags, comma separated"
//             placeholder="Tags, comma separated"
//             value={productForm.tags}
//             onChange={(e) =>
//               setProductForm((prev) => ({ ...prev, tags: e.target.value }))
//             }
//             className="border border-brand-lightgold/60 px-4 py-3 text-sm focus:outline-none focus:border-brand-coffee"
//           />
//           <input
//             type="text"
//             aria-label="Fabric"
//             placeholder="Fabric"
//             value={productForm.fabric}
//             onChange={(e) =>
//               setProductForm((prev) => ({ ...prev, fabric: e.target.value }))
//             }
//             className="border border-brand-lightgold/60 px-4 py-3 text-sm focus:outline-none focus:border-brand-coffee"
//           />
//           <input
//             type="text"
//             aria-label="Occasion"
//             placeholder="Occasion"
//             value={productForm.occasion}
//             onChange={(e) =>
//               setProductForm((prev) => ({ ...prev, occasion: e.target.value }))
//             }
//             className="border border-brand-lightgold/60 px-4 py-3 text-sm focus:outline-none focus:border-brand-coffee"
//           />
//         </div>

//         <div className="grid sm:grid-cols-2 gap-4">
//           <input
//             type="text"
//             aria-label="Meta title for SEO"
//             placeholder="Meta title"
//             value={productForm.metaTitle}
//             onChange={(e) =>
//               setProductForm((prev) => ({ ...prev, metaTitle: e.target.value }))
//             }
//             className="border border-brand-lightgold/60 px-4 py-3 text-sm focus:outline-none focus:border-brand-coffee"
//           />
//           <input
//             type="text"
//             aria-label="Meta description for SEO"
//             placeholder="Meta description"
//             value={productForm.metaDescription}
//             onChange={(e) =>
//               setProductForm((prev) => ({
//                 ...prev,
//                 metaDescription: e.target.value,
//               }))
//             }
//             className="border border-brand-lightgold/60 px-4 py-3 text-sm focus:outline-none focus:border-brand-coffee"
//           />
//         </div>

//         <div className="flex flex-wrap gap-6 pt-1">
//           <label className="flex items-center gap-2 font-sans text-sm text-brand-mud">
//             <input
//               type="checkbox"
//               checked={productForm.isFeatured}
//               onChange={(e) =>
//                 setProductForm((prev) => ({
//                   ...prev,
//                   isFeatured: e.target.checked,
//                 }))
//               }
//               aria-label="Mark product as featured"
//             />
//             Featured product
//           </label>
//           <label className="flex items-center gap-2 font-sans text-sm text-brand-mud">
//             <input
//               type="checkbox"
//               checked={productForm.isAvailable}
//               onChange={(e) =>
//                 setProductForm((prev) => ({
//                   ...prev,
//                   isAvailable: e.target.checked,
//                 }))
//               }
//               aria-label="Mark product as available on site"
//             />
//             Available on site
//           </label>
//         </div>

//         {productMessage && (
//           <p
//             aria-live="polite"
//             role="status"
//             className="font-sans text-xs bg-brand-parchment border border-brand-lightgold/60 text-brand-coffee px-4 py-3"
//           >
//             {productMessage}
//           </p>
//         )}

//         <div className="flex flex-wrap gap-3">
//           <button
//             type="submit"
//             disabled={productSaving}
//             aria-busy={productSaving}
//             className="bg-brand-coffee text-brand-cream px-5 py-3 font-sans text-xs tracking-[0.3em] uppercase disabled:opacity-60"
//           >
//             {productSaving
//               ? "Saving..."
//               : editingProductId
//                 ? "Update Product"
//                 : "Create Product"}
//           </button>
//           <button
//             type="button"
//             onClick={handleSeedProducts}
//             disabled={seeding}
//             aria-busy={seeding}
//             className="border border-brand-coffee text-brand-coffee px-5 py-3 font-sans text-xs tracking-[0.3em] uppercase disabled:opacity-60"
//           >
//             {seeding ? "Seeding..." : "Seed Samples"}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }



// FILE: client/src/components/admin/ProductForm.js

export default function ProductForm({
  productForm,
  setProductForm,
  handleProductSubmit,
  productSaving,
  productMessage,
  editingProductId,
  resetProductForm,
  handleSeedProducts,
  seeding,
}) {
  return (
    <div className="bg-white border border-brand-lightgold/50 shadow-sm p-6">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <p
            className="font-sans text-[11px] tracking-[0.3em] uppercase text-brand-gold mb-2"
            aria-hidden="true"
          >
            Catalog
          </p>
          <h2 className="font-display text-2xl">
            {editingProductId ? "Edit Product" : "Add Product"}
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
            onChange={(e) =>
              setProductForm((prev) => ({ ...prev, name: e.target.value }))
            }
            className="border border-brand-lightgold/60 px-4 py-3 text-sm focus:outline-none focus:border-brand-coffee"
            required
          />
          <input
            type="text"
            aria-label="Product slug"
            placeholder="Slug"
            value={productForm.slug}
            onChange={(e) =>
              setProductForm((prev) => ({ ...prev, slug: e.target.value }))
            }
            className="border border-brand-lightgold/60 px-4 py-3 text-sm focus:outline-none focus:border-brand-coffee"
          />
        </div>

        {/* STOCK INPUT ADDED HERE (Changed grid from 3 to 4 columns) */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <input
            type="text"
            aria-label="Product category"
            placeholder="Category"
            value={productForm.category}
            onChange={(e) =>
              setProductForm((prev) => ({ ...prev, category: e.target.value }))
            }
            className="border border-brand-lightgold/60 px-4 py-3 text-sm focus:outline-none focus:border-brand-coffee"
          />
          <input
            type="number"
            aria-label="Product price"
            min="0"
            placeholder="Price"
            value={productForm.price}
            onChange={(e) =>
              setProductForm((prev) => ({ ...prev, price: e.target.value }))
            }
            className="border border-brand-lightgold/60 px-4 py-3 text-sm focus:outline-none focus:border-brand-coffee"
            required
          />
          <input
            type="number"
            aria-label="Original price"
            min="0"
            placeholder="Original price"
            value={productForm.originalPrice}
            onChange={(e) =>
              setProductForm((prev) => ({
                ...prev,
                originalPrice: e.target.value,
              }))
            }
            className="border border-brand-lightgold/60 px-4 py-3 text-sm focus:outline-none focus:border-brand-coffee"
          />
          <input
            type="number"
            aria-label="Stock quantity"
            min="0"
            placeholder="Stock (Empty = Unlimited)"
            value={productForm.stock}
            onChange={(e) =>
              setProductForm((prev) => ({ ...prev, stock: e.target.value }))
            }
            className="border border-brand-lightgold/60 px-4 py-3 text-sm focus:outline-none focus:border-brand-coffee placeholder:text-[11px]"
          />
        </div>

        {/* Bulk Discount Tiers — "order N+ pieces, get X% off" */}
        <div className="border border-brand-lightgold/50 rounded-md p-4">
          <div className="flex items-center justify-between mb-3">
            <label className="block font-sans text-xs text-brand-mud">
              Bulk Discount Tiers (optional)
            </label>
            <button
              type="button"
              onClick={() =>
                setProductForm((prev) => ({
                  ...prev,
                  bulkDiscountTiers: [
                    ...prev.bulkDiscountTiers,
                    { minPieces: "", discountPercent: "" },
                  ],
                }))
              }
              className="font-sans text-[11px] tracking-widest uppercase text-brand-coffee border border-brand-coffee px-3 py-1.5 rounded-md hover:bg-brand-coffee hover:text-white transition-colors"
            >
              + Add Tier
            </button>
          </div>

          {productForm.bulkDiscountTiers.length === 0 ? (
            <p className="font-sans text-[11px] text-brand-mud/70">
              No tiers set — full price applies at every quantity.
            </p>
          ) : (
            <div className="space-y-2">
              {productForm.bulkDiscountTiers.map((tier, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    aria-label={`Tier ${idx + 1} minimum pieces`}
                    placeholder="Min pieces (e.g. 50)"
                    value={tier.minPieces}
                    onChange={(e) => {
                      const value = e.target.value;
                      setProductForm((prev) => ({
                        ...prev,
                        bulkDiscountTiers: prev.bulkDiscountTiers.map((t, i) =>
                          i === idx ? { ...t, minPieces: value } : t,
                        ),
                      }));
                    }}
                    className="flex-1 border border-brand-lightgold/60 px-3 py-2 text-sm focus:outline-none focus:border-brand-coffee"
                  />
                  <input
                    type="number"
                    min="0"
                    max="100"
                    aria-label={`Tier ${idx + 1} discount percent`}
                    placeholder="Discount % (e.g. 10)"
                    value={tier.discountPercent}
                    onChange={(e) => {
                      const value = e.target.value;
                      setProductForm((prev) => ({
                        ...prev,
                        bulkDiscountTiers: prev.bulkDiscountTiers.map((t, i) =>
                          i === idx ? { ...t, discountPercent: value } : t,
                        ),
                      }));
                    }}
                    className="flex-1 border border-brand-lightgold/60 px-3 py-2 text-sm focus:outline-none focus:border-brand-coffee"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setProductForm((prev) => ({
                        ...prev,
                        bulkDiscountTiers: prev.bulkDiscountTiers.filter(
                          (_, i) => i !== idx,
                        ),
                      }))
                    }
                    aria-label={`Remove tier ${idx + 1}`}
                    className="font-sans text-xs text-red-600 border border-red-200 px-3 py-2 rounded-md hover:bg-red-50 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <p className="font-sans text-[10px] text-brand-mud/70 pt-1">
                Example: 50 pieces → 10% off means orders of 50+ pieces of
                this product get 10% off the per-piece price.
              </p>
            </div>
          )}
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
        {/* Directory Upload — Gallery Images */}

        {/*        
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
              
              let files = Array.from(e.target.files || []).slice(0, 4);

              
              const mainImgName = productForm.imageFile?.name;
              if (mainImgName) {
                files = files.filter((f) => f.name !== mainImgName);
              }

             
              const tooBig = files.find((f) => f.size > 2 * 1024 * 1024);
              if (tooBig) {
                alert("Each gallery image must be under 2MB.");
                e.target.value = ""; // Reset the file input field
                return; // Stop further execution
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
 */}

        {/* ✅ Directory Upload — Gallery Images */}
        <div>
          <label className="block font-sans text-xs text-brand-mud mb-1">
            Gallery Images (optional, up to 4)
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            aria-label="Upload additional gallery images"
            onChange={(e) => {
              // 1. Convert FileList to an array and limit the maximum number of gallery images to 4
              let files = Array.from(e.target.files || []).slice(0, 4);

              // 2. Prevent Duplication: Auto-remove the Main Image if it is accidentally selected in the gallery
              const mainImgName = productForm.imageFile?.name;
              if (mainImgName) {
                files = files.filter((f) => f.name !== mainImgName);
              }
              // 3. File Size Validation: Check if any single image exceeds the 2MB size limit
              const tooBig = files.find((f) => f.size > 2 * 1024 * 1024);
              if (tooBig) {
                alert("Each image must be under 2MB.");
                e.target.value = "";
                return;
              }

              // 4. Update State: Save the cleaned and validated image array into the form state  
              
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
          onChange={(e) =>
            setProductForm((prev) => ({
              ...prev,
              shortDescription: e.target.value,
            }))
          }
          className="w-full border border-brand-lightgold/60 px-4 py-3 text-sm focus:outline-none focus:border-brand-coffee"
        />

        <textarea
          rows={5}
          aria-label="Full description"
          placeholder="Full description"
          value={productForm.description}
          onChange={(e) =>
            setProductForm((prev) => ({ ...prev, description: e.target.value }))
          }
          className="w-full border border-brand-lightgold/60 px-4 py-3 text-sm focus:outline-none focus:border-brand-coffee resize-none"
          required
        />

        <div className="grid sm:grid-cols-3 gap-4">
          <input
            type="text"
            aria-label="Tags, comma separated"
            placeholder="Tags, comma separated"
            value={productForm.tags}
            onChange={(e) =>
              setProductForm((prev) => ({ ...prev, tags: e.target.value }))
            }
            className="border border-brand-lightgold/60 px-4 py-3 text-sm focus:outline-none focus:border-brand-coffee"
          />
          <input
            type="text"
            aria-label="Fabric"
            placeholder="Fabric"
            value={productForm.fabric}
            onChange={(e) =>
              setProductForm((prev) => ({ ...prev, fabric: e.target.value }))
            }
            className="border border-brand-lightgold/60 px-4 py-3 text-sm focus:outline-none focus:border-brand-coffee"
          />
          <input
            type="text"
            aria-label="Occasion"
            placeholder="Occasion"
            value={productForm.occasion}
            onChange={(e) =>
              setProductForm((prev) => ({ ...prev, occasion: e.target.value }))
            }
            className="border border-brand-lightgold/60 px-4 py-3 text-sm focus:outline-none focus:border-brand-coffee"
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <input
            type="text"
            aria-label="Meta title for SEO"
            placeholder="Meta title"
            value={productForm.metaTitle}
            onChange={(e) =>
              setProductForm((prev) => ({ ...prev, metaTitle: e.target.value }))
            }
            className="border border-brand-lightgold/60 px-4 py-3 text-sm focus:outline-none focus:border-brand-coffee"
          />
          <input
            type="text"
            aria-label="Meta description for SEO"
            placeholder="Meta description"
            value={productForm.metaDescription}
            onChange={(e) =>
              setProductForm((prev) => ({
                ...prev,
                metaDescription: e.target.value,
              }))
            }
            className="border border-brand-lightgold/60 px-4 py-3 text-sm focus:outline-none focus:border-brand-coffee"
          />
        </div>

        <div className="flex flex-wrap gap-6 pt-1">
          <label className="flex items-center gap-2 font-sans text-sm text-brand-mud">
            <input
              type="checkbox"
              checked={productForm.isFeatured}
              onChange={(e) =>
                setProductForm((prev) => ({
                  ...prev,
                  isFeatured: e.target.checked,
                }))
              }
              aria-label="Mark product as featured"
            />
            Featured product
          </label>
          <label className="flex items-center gap-2 font-sans text-sm text-brand-mud">
            <input
              type="checkbox"
              checked={productForm.isAvailable}
              onChange={(e) =>
                setProductForm((prev) => ({
                  ...prev,
                  isAvailable: e.target.checked,
                }))
              }
              aria-label="Mark product as available on site"
            />
            Available on site
          </label>
        </div>

        {productMessage && (
          <p
            aria-live="polite"
            role="status"
            className="font-sans text-xs bg-brand-parchment border border-brand-lightgold/60 text-brand-coffee px-4 py-3"
          >
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
            {productSaving
              ? "Saving..."
              : editingProductId
                ? "Update Product"
                : "Create Product"}
          </button>
          <button
            type="button"
            onClick={handleSeedProducts}
            disabled={seeding}
            aria-busy={seeding}
            className="border border-brand-coffee text-brand-coffee px-5 py-3 font-sans text-xs tracking-[0.3em] uppercase disabled:opacity-60"
          >
            {seeding ? "Seeding..." : "Seed Samples"}
          </button>
        </div>
      </form>
    </div>
  );
}