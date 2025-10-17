// components/map/ProductSearchPopup.ts

import { Product, Store } from "@/app/components/dashboard/types/map.types";

export interface ProductSearchPopupProps {
  store: Store;
  products: Product[];
  query: string;
  totalProductsFound: number;
}

export class ProductSearchPopup {
  private static popupCounter = 0;

  static generatePopupContent(props: ProductSearchPopupProps): string {
    const { store, products, query, totalProductsFound } = props;
    const popupId = `popup-${store.id}-${++this.popupCounter}`;

    return `
<!-- PERUBAHAN 1: Lebar popup dikurangi jadi 600px -->
<div class="popup-container" style="width: 600px; height: 400px; max-width: 70vw;">
  <div class="overflow-hidden rounded-xl shadow-2xl bg-white font-sans antialiased">

    ${this.generateMainContent(
      store,
      products,
      query,
      totalProductsFound,
      popupId
    )}
  </div>
</div>
${this.generateStyles()}
    `;
  }

  private static generateMainContent(
    store: Store,
    products: Product[],
    query: string,
    totalProductsFound: number,
    popupId: string
  ): string {
    return `
    <div class="p-6 flex gap-8 min-h-[280px]">
      ${this.generateStoreInfo(store)}
      ${this.generateProductShowcase(
        products,
        query,
        totalProductsFound,
        popupId
      )}
    </div>
    `;
  }

  private static generateStoreInfo(store: Store): string {
    return `
    <div class="flex-shrink-0 w-48 flex flex-col items-center">
      <div class="w-20 h-20  flex items-center justify-center mb-4 ">
        <img
              src="${store.logoUrl || "/images/placeholder-store.svg"}"
              alt="Logo ${store.storeName}"
              class="w-20 h-20  object-cover mr-3"
            />
      </div>
      
      <h3 class="font-bold text-base text-gray-800 text-center mb-3 leading-tight px-2">
        ${store.storeName || "Nama Toko Tidak Tersedia"}
      </h3>
      
      ${
        store.location
          ? `
        <div class="flex items-start text-xs text-gray-600 mb-6 px-2">
          <svg class="w-3 h-3 mr-1 mt-0.5 text-gray-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"></path>
          </svg>
          <p class="leading-snug text-center">${store.location}</p>
        </div>
      `
          : ""
      }
      

      <div class="mt-3 space-y-2 w-full">
 <button onclick="window.open('/store/${store.userId || store.id}', '_blank')"
         class="w-full bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 hover:from-orange-600 hover:via-red-600 hover:to-pink-600 text-white text-sm font-semibold py-3 px-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform">
   <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
     <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
   </svg>
   Kunjungi Toko
 </button>
 
 <button onclick="window.showRoute && window.showRoute(${store.latitude}, ${
      store.longitude
    }, '${store.storeName}')"
         class="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2.5 px-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform flex items-center justify-center space-x-2"
         title="Tampilkan Rute ke ${store.storeName}">
   <span>Lihat Rute</span>
 </button>
</div>
    </div>
    `;
  }

  private static generateProductShowcase(
    products: Product[],
    query: string,
    totalProductsFound: number,
    popupId: string
  ): string {
    return `
    <div class="flex-1 min-w-0">
      ${this.generateSearchInfo(query)}
      ${this.generateProductCounter(products.length)}
      ${this.generateProductCarousel(products, popupId)}
      ${this.generateAdditionalInfo(totalProductsFound, products.length)}
    </div>
    `;
  }

  private static generateSearchInfo(query: string): string {
    return `
    <div class="flex items-center gap-2 text-xs text-gray-500 mb-2">
      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
      </svg>
      <span>Pencarian: "<strong>${query}</strong>"</span>
    </div>
    `;
  }

  private static generateProductCounter(count: number): string {
    return `
    <div class="flex items-center gap-2 text-sm text-orange-600 font-semibold mb-4">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 12H6L5 9z"/>
      </svg>
      <span>Produk Tersedia (${count})</span>
    </div>
    `;
  }

  private static generateProductCarousel(
    products: Product[],
    popupId: string
  ): string {
    if (products.length === 0) {
      return this.generateEmptyState();
    }

    const carouselId = `carousel-${popupId}`;
    const displayProducts = products.slice(0, 4);

    return `
    <div class="relative bg-gray-50 rounded-xl p-4" style="overflow: hidden;">
      
      ${displayProducts
        .map(
          (_, index) =>
            `<input type="radio" name="${carouselId}" id="${carouselId}-slide-${
              index + 1
            }" ${index === 0 ? "checked" : ""} style="display: none;">`
        )
        .join("")}
      
      <!-- PERUBAHAN 2: Logika Carousel diubah total untuk single view -->
      <!-- Lebar container dikali jumlah produk, misal 4 produk jadi 400% -->
      <div class="${carouselId}-slides" style="display: flex; width: ${
      displayProducts.length * 100
    }%; transition: transform 0.35s ease-in-out;">
        ${displayProducts
          .map((product, index) =>
            this.generateProductSlide(product, index, displayProducts)
          )
          .join("")}
      </div>
      
      ${this.generateCSSNavigation(displayProducts.length, carouselId)}
      ${this.generateCSSIndicators(displayProducts.length, carouselId)}
      
    </div>
    `;
  }

  private static generateProductSlide(
    product: Product,
    index: number,
    displayProducts: Product[]
  ): string {
    // PERUBAHAN 3: Lebar slide sekarang 100% dibagi jumlah total slide (misal 100/4 = 25%)
    // Ini memastikan setiap slide mengambil porsi yang sama dari container 400%
    return `
    <div style="width: calc(100% / ${Math.max(
      1,
      displayProducts.length
    )}); flex-shrink: 0; padding: 8px; display: flex; justify-content: center;">
      <div onclick="window.open('/products/${product.id}', '_blank')" 
           style="background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); cursor: pointer; transition: all 0.3s ease; width: 140px; height: 180px;">
        
        <div style="height: 120px; width: 100%; background: #f3f4f6; position: relative; overflow: hidden; display: flex; align-items: center; justify-content: center;">
          <img src="${
            product.image || "/images/placeholder-product.svg"
          }" alt="${
      product.name || "Produk"
    }" style="width: 100%; height: 100%; object-cover; transition: transform 0.3s;" onerror="this.src='/images/placeholder-product.svg'" loading="lazy">
          <div style="position: absolute; top: 8px; right: 8px; background: rgba(249, 115, 22, 0.9); color: white; font-size: 11px; padding: 4px 8px; border-radius: 12px; font-weight: 600;">
            ${index + 1}
          </div>
        </div>
        
        <div style="padding: 12px; height: 60px; display: flex; flex-direction: column; justify-content: center;">
          <div style="font-weight: 600; font-size: 12px; color: #374151; text-align: center; line-height: 1.3; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
            ${product.name || `Produk ${index + 1}`}
          </div>
          ${
            product.price
              ? `<div style="text-align: center; margin-top: 4px; font-size: 11px; color: #f97316; font-weight: 700;">Rp ${product.price.toLocaleString()}</div>`
              : ""
          }
        </div>
      </div>
    </div>
    `;
  }

  private static generateCSSNavigation(
    productCount: number,
    carouselId: string
  ): string {
    if (productCount <= 1) return "";
    let navigation = "";
    for (let i = 1; i <= productCount; i++) {
      if (i > 1) {
        navigation += `<label for="${carouselId}-slide-${
          i - 1
        }" class="${carouselId}-nav-btn ${carouselId}-prev-${i}to${
          i - 1
        }" style="position: absolute; left: 15px; top: 50%; transform: translateY(-50%); width: 40px; height: 40px; background: rgba(255,255,255,0.95); border: 1px solid #e5e7eb; border-radius: 50%; display: none; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 2px 4px rgba(0,0,0,0.1); transition: all 0.2s;"><svg style="width: 18px; height: 18px; color: #374151;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg></label>`;
      }
      if (i < productCount) {
        navigation += `<label for="${carouselId}-slide-${
          i + 1
        }" class="${carouselId}-nav-btn ${carouselId}-next-${i}to${
          i + 1
        }" style="position: absolute; right: 15px; top: 50%; transform: translateY(-50%); width: 40px; height: 40px; background: rgba(255,255,255,0.95); border: 1px solid #e5e7eb; border-radius: 50%; display: none; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 2px 4px rgba(0,0,0,0.1); transition: all 0.2s;"><svg style="width: 18px; height: 18px; color: #374151;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg></label>`;
      }
    }
    return navigation;
  }

  private static generateCSSIndicators(
    productCount: number,
    carouselId: string
  ): string {
    if (productCount <= 1) return "";
    return `<div style="display: flex; justify-content: center; gap: 8px; margin-top: 16px;">${Array.from(
      { length: productCount },
      (_, index) =>
        `<label for="${carouselId}-slide-${
          index + 1
        }" class="${carouselId}-dot ${carouselId}-dot-${
          index + 1
        }" style="width: 12px; height: 12px; border-radius: 50%; cursor: pointer; transition: all 0.3s; background: #d1d5db; border: 2px solid #f3f4f6;"></label>`
    ).join("")}</div>`;
  }

  private static generateEmptyState(): string {
    return `
    <div class="relative bg-gray-50 rounded-xl p-4">
      <div class="text-center py-12 text-gray-500">
        <svg class="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707.293l-2.414-2.414A1 1 0 006.586 13H4"/>
        </svg>
        <p>Tidak ada produk yang tersedia</p>
      </div>
    </div>
    `;
  }

  private static generateAdditionalInfo(
    totalProducts: number,
    currentProducts: number
  ): string {
    if (totalProducts <= currentProducts) return "";

    return `
    <div class="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-lg">
      <div class="flex items-center gap-2 text-[10px] text-blue-700">
        <svg class="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
        </svg>
        <span><strong>${
          totalProducts - currentProducts
        }</strong> produk serupa lainnya tersedia di toko lain</span>
      </div>
    </div>
    `;
  }

  private static generateStyles(): string {
    return `
<style>
  .popup-container { font-family: system-ui, -apple-system, sans-serif; }
  .popup-container * { box-sizing: border-box; }
  
  /* PERBAIKAN: CSS transform yang dinamis berdasarkan jumlah produk */
  /* Untuk 1 produk - tidak perlu transform */
  [id*="carousel-"][id$="-slide-1"]:checked ~ [class*="-slides"] { transform: translateX(0%); }
  
  /* Untuk 2 produk - setiap slide = 50% dari container */
  [id*="carousel-"][id$="-slide-2"]:checked ~ [class*="-slides"] { transform: translateX(-50%); }
  
  /* Untuk 3 produk - setiap slide = 33.33% dari container */
  [id*="carousel-"][id$="-slide-2"]:checked ~ [class*="-slides"][style*="300%"] { transform: translateX(-33.33%); }
  [id*="carousel-"][id$="-slide-3"]:checked ~ [class*="-slides"][style*="300%"] { transform: translateX(-66.67%); }
  
  /* Untuk 4 produk - setiap slide = 25% dari container */
  [id*="carousel-"][id$="-slide-2"]:checked ~ [class*="-slides"][style*="400%"] { transform: translateX(-25%); }
  [id*="carousel-"][id$="-slide-3"]:checked ~ [class*="-slides"][style*="400%"] { transform: translateX(-50%); }
  [id*="carousel-"][id$="-slide-4"]:checked ~ [class*="-slides"][style*="400%"] { transform: translateX(-75%); }
  
  /* Sembunyikan semua tombol navigasi secara default */
  [class*="-nav-btn"] { display: none !important; }
  
  /* Tampilkan tombol navigasi yang relevan berdasarkan slide yang aktif */
  [id*="carousel-"][id$="-slide-1"]:checked ~ [class*="-next-1to2"] { display: flex !important; }
  [id*="carousel-"][id$="-slide-2"]:checked ~ [class*="-prev-2to1"] { display: flex !important; }
  [id*="carousel-"][id$="-slide-2"]:checked ~ [class*="-next-2to3"] { display: flex !important; }
  [id*="carousel-"][id$="-slide-3"]:checked ~ [class*="-prev-3to2"] { display: flex !important; }
  [id*="carousel-"][id$="-slide-3"]:checked ~ [class*="-next-3to4"] { display: flex !important; }
  [id*="carousel-"][id$="-slide-4"]:checked ~ [class*="-prev-4to3"] { display: flex !important; }
  
  /* Styling untuk dot indicator */
  [class*="-dot"] { background-color: #d1d5db !important; transform: scale(1); transition: all 0.3s ease; }
  [id*="carousel-"][id$="-slide-1"]:checked ~ div [class*="-dot-1"] { background-color: #f97316 !important; }
  [id*="carousel-"][id$="-slide-2"]:checked ~ div [class*="-dot-2"] { background-color: #f97316 !important; }
  [id*="carousel-"][id$="-slide-3"]:checked ~ div [class*="-dot-3"] { background-color: #f97316 !important; }
  [id*="carousel-"][id$="-slide-4"]:checked ~ div [class*="-dot-4"] { background-color: #f97316 !important; }
  
  [class*="-nav-btn"]:hover { background-color: rgba(249, 115, 22, 0.1) !important; }
  [class*="-dot"]:hover { background-color: #fb923c !important; }
  
  [onclick*="/products/"]:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important; }
  [onclick*="/products/"]:hover img { transform: scale(1.03); }
</style>
    `;
  }
}
