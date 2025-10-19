// app/marketplace/page.tsx
export const dynamic = "force-dynamic";
import ProductCard from "@/app/marketplace/components/ProductCard";
import { fetchProducts } from "@/lib/api/marketplace";

export default async function MarketplaceHomePage() {
  try {
    // Ambil beberapa produk untuk ditampilkan di homepage
    const result = await fetchProducts({ limit: 8, sort: "newest" });

    console.log("RESULT:", result);
    console.log("PRODUCTS:", result.data);

    const products = result.data;

    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="flex flex-col items-center justify-center h-52 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg mb-12">
          <h1 className="text-4xl font-bold text-blue-900 mb-2">
            Selamat Datang di Daurin Marketplace!
          </h1>
          <p className="text-lg text-blue-700">
            Temukan produk kerajinan unik dan ramah lingkungan.
          </p>
        </div>

        {/* Products Section */}
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Produk Terbaru
        </h2>

        {products && products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <p className="text-gray-500">Belum ada produk terbaru saat ini.</p>
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error("ERROR FETCHING:", error);
    return <div>Error loading products</div>;
  }
}
