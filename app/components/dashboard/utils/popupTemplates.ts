/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Store,
  Partner,
  WasteFacility,
  TPST3RProperties,
  Product,
} from "@/app/components/dashboard/types/map.types";

export const createPopupContent = {
  store: (store: Store) => {
    const bannerColors = [
      "bg-gradient-to-br from-pink-500 to-rose-500",
      "bg-gradient-to-br from-purple-500 to-indigo-500",
      "bg-gradient-to-br from-cyan-500 to-blue-500",
      "bg-gradient-to-br from-green-400 to-teal-500",
      "bg-gradient-to-br from-yellow-400 to-orange-500",
      "bg-gradient-to-br from-red-500 to-pink-600",
      "bg-slate-700",
      "bg-sky-600",
    ];

    const getRandomBannerClass = () => {
      return bannerColors[Math.floor(Math.random() * bannerColors.length)];
    };

    let bannerElement;
    if (store.bannerUrl) {
      bannerElement = `<div class="h-24 bg-cover bg-center" style="background-image: url('${store.bannerUrl}');"></div>`;
    } else {
      const randomColorClass = getRandomBannerClass();
      bannerElement = `<div class="h-24 flex items-center justify-center ${randomColorClass}"></div>`;
    }

    const storeLogoUrl = store.logoUrl || "/images/placeholder-product.svg";
    const storeLink = store.userId ? `/store/${store.userId}` : "#";

    return `
      <div class="w-64 overflow-hidden rounded-lg shadow-lg bg-white font-sans antialiased">
        ${bannerElement}
        <div class="p-4">
          <div class="flex items-center mb-3">
            <img src="${storeLogoUrl}" alt="Logo ${
      store.storeName
    }" class="w-15 h-15 rounded-full border-2 border-white object-cover mr-3 shadow-sm bg-gray-200" />
            <div>
              <h3 class="font-bold text-base text-gray-800 leading-tight truncate" title="${
                store.storeName
              }">${store.storeName || "Nama Toko"}</h3>
            </div>
          </div>
          ${
            store.location
              ? `
            <div class="flex items-start text-xs text-gray-600 mb-3">
              <svg class="w-4 h-4 mr-1 mt-0.5 text-gray-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"></path>
              </svg>
              <p class="leading-snug line-clamp-2" title="${store.location}">${store.location}</p>
            </div>
          `
              : ""
          }
          <div class="flex space-x-2">
            <button onclick="window.open('${storeLink}', '_blank')" class="flex-1 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold text-center py-2 px-3 rounded-md transition-colors duration-150 shadow-sm ${
      !store.userId ? "opacity-50 cursor-not-allowed" : ""
    }" ${
      !store.userId
        ? "onclick=\"event.preventDefault(); alert('Link toko tidak tersedia.'); return false;\""
        : ""
    }>
              <span class="text-white">Kunjungi Toko</span>
            </button>
            <button onclick="window.showRoute && window.showRoute(${
              store.latitude
            }, ${store.longitude}, '${
      store.storeName
    }')" class="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-2 px-3 rounded-md transition-colors duration-150 shadow-sm flex items-center justify-center" title="Tampilkan Rute ke ${
      store.storeName
    }">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    `;
  },

  // NEW: Template for product search results
  productStore: (store: Store, product: Product) => {
    const storeLogoUrl = store.logoUrl || "/images/placeholder-product.svg";
    const storeLink = store.userId ? `/store/${store.userId}` : "#";
    const productImage = product.image || "/images/placeholder-product.svg";

    return `
      <div class="w-64 overflow-hidden rounded-lg shadow-lg bg-white font-sans antialiased">
        <div class="h-20 bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center relative">
          <div class="text-white text-center">
            <svg class="w-8 h-8 mx-auto mb-1" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
            </svg>
            <div class="text-xs font-medium">Menjual Produk</div>
          </div>
          <div class="absolute top-2 right-2">
            <div class="bg-white bg-opacity-20 rounded-full p-1">
              <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
          </div>
        </div>
        <div class="p-4">
          <!-- Product Info -->
          <div class="mb-3 p-2 bg-orange-50 rounded-md border border-orange-200">
            <div class="flex items-center space-x-2">
              <img src="${productImage}" alt="${
      product.name
    }" class="w-8 h-8 rounded object-cover bg-gray-200" />
              <div>
                <div class="text-sm font-semibold text-orange-700">🛒 ${
                  product.name
                }</div>
                ${
                  product.description
                    ? `<div class="text-xs text-orange-600">${product.description}</div>`
                    : ""
                }
              </div>
            </div>
          </div>
          
          <!-- Store Info -->
          <div class="flex items-center mb-3">
            <img src="${storeLogoUrl}" alt="Logo ${
      store.storeName
    }" class="w-12 h-12 rounded-full border-2 border-white object-cover mr-3 shadow-sm bg-gray-200" />
            <div>
              <h3 class="font-bold text-base text-gray-800 leading-tight truncate" title="${
                store.storeName
              }">${store.storeName || "Nama Toko"}</h3>
            </div>
          </div>
          
          ${
            store.location
              ? `
            <div class="flex items-start text-xs text-gray-600 mb-3">
              <svg class="w-4 h-4 mr-1 mt-0.5 text-gray-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"></path>
              </svg>
              <p class="leading-snug line-clamp-2" title="${store.location}">${store.location}</p>
            </div>
          `
              : ""
          }
          
          <div class="flex space-x-2">
            <button onclick="window.open('${storeLink}', '_blank')" class="flex-1 bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold py-2 px-3 rounded-md transition-colors duration-150 shadow-sm ${
      !store.userId ? "opacity-50 cursor-not-allowed" : ""
    }" ${
      !store.userId
        ? "onclick=\"event.preventDefault(); alert('Link toko tidak tersedia.'); return false;\""
        : ""
    }>
              <div class="flex items-center justify-center space-x-1">
                <span>Toko</span>
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                </svg>
              </div>
            </button>
            <button onclick="window.showRoute && window.showRoute(${
              store.latitude
            }, ${store.longitude}, '${
      store.storeName
    }')" class="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-2 px-3 rounded-md transition-colors duration-150 shadow-sm flex items-center justify-center" title="Tampilkan Rute ke ${
      store.storeName
    }">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    `;
  },

  partner: (partner: Partner) => {
    const partnerBannerColors = [
      "bg-gradient-to-br from-blue-500 to-sky-500",
      "bg-gradient-to-br from-emerald-500 to-green-500",
      "bg-gradient-to-br from-amber-500 to-yellow-500",
      "bg-gradient-to-br from-slate-600 to-gray-700",
      "bg-rose-600",
      "bg-fuchsia-600",
    ];

    const getRandomPartnerBannerClass = () => {
      return partnerBannerColors[
        Math.floor(Math.random() * partnerBannerColors.length)
      ];
    };

    let mainImageUrl: string | null = null;
    if (partner.image && typeof partner.image === "string") {
      mainImageUrl = partner.image;
    } else if (partner.image) {
      try {
        const parsedImages = JSON.parse(partner.image);
        if (Array.isArray(parsedImages) && parsedImages.length > 0) {
          mainImageUrl = parsedImages[0];
        }
      } catch (e) {
        if (partner.image.startsWith("http")) {
          mainImageUrl = partner.image;
        }
      }
    }

    let bannerElement;
    if (mainImageUrl) {
      bannerElement = `
        <div class="relative h-32 bg-cover bg-center rounded-t-xl overflow-hidden" style="background-image: url('${mainImageUrl}');">
          <div class="absolute inset-0 bg-transparent bg-opacity-20"></div>
          <div class="absolute top-3 right-3">
            <div class="bg-white bg-opacity-90 backdrop-blur-sm rounded-full p-1.5">
              <svg class="w-4 h-4 text-sky-600" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm12 12V6H4v10h12z" clip-rule="evenodd"/>
              </svg>
            </div>
          </div>
        </div>
      `;
    } else {
      const randomColorClass = getRandomPartnerBannerClass();
      bannerElement = `
        <div class="relative h-32 flex items-center justify-center ${randomColorClass} rounded-t-xl overflow-hidden">
          <div class="relative z-10 text-center">
            <svg class="w-12 h-12 text-white opacity-80 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
            </svg>
            <div class="text-white text-xs font-medium opacity-75">Mitra Partner</div>
          </div>
        </div>
      `;
    }

    return `
      <div class="w-75 bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-100 font-sans antialiased">
        ${bannerElement}
        <div class="p-4 space-y-3">
          <div class="space-y-2">
            <h3 class="font-bold text-base text-gray-900 leading-tight line-clamp-2" title="${
              partner.businessName
            }">${partner.businessName || "Nama Mitra"}</h3>
            ${
              partner.expertise
                ? `
              <div class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-sky-50 text-sky-700 border border-sky-200">
                <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
                ${partner.expertise}
              </div>
            `
                : ""
            }
          </div>
          ${
            partner.address
              ? `
            <div class="flex items-center space-x-2 text-xs text-gray-600">
              <svg class="w-3.5 h-3.5 text-gray-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"></path>
              </svg>
              <span class="truncate" title="${partner.address}">${partner.address}</span>
            </div>
          `
              : ""
          }
          <div class="flex space-x-2 pt-1">
            <button onclick="window.open('/mitra/${
              partner.id
            }', '_blank')" class="flex-1 bg-gradient-to-r from-sky-600 to-sky-700 hover:from-sky-700 hover:to-sky-800 text-white text-xs font-semibold py-2.5 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center justify-center space-x-2">
              <span>Lihat Detail</span>
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
              </svg>
            </button>
            <button onclick="window.showRoute && window.showRoute(${
              partner.latitude
            }, ${partner.longitude}, '${
      partner.businessName
    }')" class="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-2.5 px-3 rounded-lg transition-colors duration-150 shadow-sm flex items-center justify-center" title="Tampilkan Rute ke ${
      partner.businessName
    }">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    `;
  },

  wasteFacility: (facility: WasteFacility) => {
    return `
      <div class="p-4 bg-white rounded-lg shadow-lg font-sans antialiased">
        <div class="text-center mb-3">
          <h3 class="font-bold text-lg text-gray-800 mb-2">${facility.name}</h3>
          <p class="text-sm text-gray-600 mb-1">${facility.address}</p>
          <p class="text-sm text-gray-500">${facility.type}</p>
        </div>
        <div class="flex justify-center">
          <button onclick="window.showRoute && window.showRoute(${facility.latitude}, ${facility.longitude}, '${facility.name}')" class="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-2 px-4 rounded-lg transition-colors duration-150 shadow-sm flex items-center space-x-2" title="Tampilkan Rute ke ${facility.name}">
            
            <span>Lihat Rute</span>
          </button>
        </div>
      </div>
    `;
  },

  facility: (props: TPST3RProperties) => {
    const facilityName = props.nama || "Tidak ada nama";
    const facilityAddress = `${props.desa ? `Desa ${props.desa}` : ""}${
      props.desa && props.kecamatan ? ", " : ""
    }${props.kecamatan ? `Kecamatan ${props.kecamatan}` : ""}`;

    // Parse coordinates if available
    let latitude: number | null = null;
    let longitude: number | null = null;

    if (props.lat_1 && props.long_1) {
      latitude = parseFloat(props.lat_1);
      longitude = parseFloat(props.long_1);
    } else if (props.lat_2 && props.long_2) {
      latitude = parseFloat(props.lat_2);
      longitude = parseFloat(props.long_2);
    }

    return `
      <div class="p-4 bg-white rounded-lg shadow-lg font-sans antialiased" style="min-width: 220px;">
        <div class="text-center mb-3">
          <h3 class="font-bold text-lg text-gray-800 mb-2">${facilityName}</h3>
          ${
            facilityAddress
              ? `<p class="text-sm text-gray-600 mb-2">${facilityAddress}</p>`
              : ""
          }
          ${
            props.kapasitas_
              ? `<p class="text-sm text-gray-500 mb-3">Kapasitas: ${props.kapasitas_} kg/tahun</p>`
              : ""
          }
        </div>
        ${
          latitude && longitude
            ? `
          <div class="flex justify-center">
            <button onclick="window.showRoute && window.showRoute(${latitude}, ${longitude}, '${facilityName}')" class="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-2 px-4 rounded-lg transition-colors duration-150 shadow-sm flex items-center space-x-2" title="Tampilkan Rute ke ${facilityName}">
              
              <span>Lihat Rute</span>
            </button>
          </div>
        `
            : ""
        }
      </div>
    `;
  },

  district: (props: any) => {
    const districtName = props.wadmkc;
    const jumlahKelurahan = props["jumlah kel"] || 0;
    const jumlahDesa = props["jumlah k_1"] || 0;
    const luasArea = props.luas_ha;

    const normalizedDistrictName = districtName
      ? districtName.toLowerCase().replace(/\s+/g, "_")
      : "default";
    const districtImagePath = `/kecamatan/${normalizedDistrictName}.jpg`;
    const districtIdForLink = districtName
      ? encodeURIComponent(districtName)
      : "tidak-diketahui";
    const detailLink = `/kecamatan/${districtIdForLink}`;

    return `
      <div class="w-64 sm:w-72 overflow-hidden rounded-xl shadow-2xl bg-white font-sans antialiased text-gray-800 transform transition-all duration-300">
        <div class="relative h-36 w-full overflow-hidden">
          <img src="${districtImagePath}" alt="Kecamatan ${districtName}" class="w-full h-full object-cover transition-transform duration-500 hover:scale-110" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
          <div class="absolute inset-0 bg-gradient-to-br from-blue-500 to-teal-600 hidden items-center justify-center" style="display: none;">
            <div class="text-white text-center">
              <svg class="w-12 h-12 mx-auto mb-2 opacity-75" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd"/>
              </svg>
              <p class="text-sm font-medium">No Image</p>
            </div>
          </div>
          <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
          <div class="absolute bottom-0 left-0 right-0 p-4">
            <h3 class="font-bold text-xl text-white drop-shadow-lg leading-tight">Kec. ${
              districtName || "Tidak Diketahui"
            }</h3>
          </div>
        </div>
        <div class="p-4 space-y-4">
          <div class="grid grid-cols-2 gap-3">
            <div class="bg-gradient-to-br from-blue-50 to-blue-100 p-3 rounded-lg border border-blue-200">
              <div class="text-xs font-medium text-blue-600 uppercase tracking-wide mb-1">Kelurahan</div>
              <div class="text-lg font-bold text-blue-800">${jumlahKelurahan}</div>
            </div>
            <div class="bg-gradient-to-br from-green-50 to-green-100 p-3 rounded-lg border border-green-200">
              <div class="text-xs font-medium text-green-600 uppercase tracking-wide mb-1">Desa</div>
              <div class="text-lg font-bold text-green-800">${jumlahDesa}</div>
            </div>
          </div>
          ${
            luasArea
              ? `
            <div class="bg-gradient-to-r from-purple-50 to-pink-50 p-3 rounded-lg border border-purple-200">
              <div class="text-xs font-medium text-purple-600 uppercase tracking-wide mb-1">Luas Wilayah</div>
              <div class="text-sm font-semibold text-purple-800">${parseFloat(
                luasArea
              ).toLocaleString("id-ID")} hectare</div>
            </div>
          `
              : ""
          }
          <button onclick="window.open('${detailLink}', '_blank')" class="group w-full bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg active:scale-95 focus:outline-none focus:ring-4 focus:ring-sky-300">
            <div class="flex items-center justify-center space-x-2">
              <span class="text-sm">Lihat Detail Kecamatan</span>
              <svg class="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
              </svg>
            </div>
          </button>
        </div>
      </div>
    `;
  },
};
