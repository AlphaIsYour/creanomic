import {
  Pengepul,
  Pengrajin,
  WasteFacility,
  WasteOffer,
  TPST3RProperties,
} from "@/app/components/dashboard/types/map.types";

export const createPopupContent = {
  // PENGEPUL POPUP
  pengepul: (pengepul: Pengepul) => {
    const profileImage = pengepul.user.image || "/images/photo-placeholder.svg";
    const companyName =
      pengepul.companyName || pengepul.user.name || "Pengepul";
    const rating =
      pengepul.averageRating > 0 ? pengepul.averageRating.toFixed(1) : "N/A";
    const materials = pengepul.specializedMaterials.slice(0, 3).join(", ");
    const operatingArea = pengepul.operatingArea.slice(0, 2).join(", ");

    return `
      <div class="w-75 bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-100 font-sans antialiased">
        <div class="relative h-32 bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
          <div class="relative z-10 text-center">
            <svg class="w-12 h-12 text-white opacity-80 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
            <div class="text-white text-xs font-medium opacity-75">Pengepul Sampah</div>
          </div>
          <div class="absolute top-3 right-3">
            <div class="bg-white bg-opacity-90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center space-x-1">
              <svg class="w-3 h-3 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
              <span class="text-xs font-semibold text-gray-800">${rating}</span>
            </div>
          </div>
        </div>
        <div class="p-4 space-y-3">
          <div class="flex items-center space-x-3">
            <img src="${profileImage}" alt="${companyName}" class="w-12 h-12 rounded-full border-2 border-green-200 object-cover bg-gray-100" onerror="this.src='/images/photo-placeholder.svg'" />
            <div class="flex-1 min-w-0">
              <h3 class="font-bold text-base text-gray-900 leading-tight truncate" title="${companyName}">${companyName}</h3>
              ${
                pengepul.totalReviews > 0
                  ? `<p class="text-xs text-gray-500">${pengepul.totalReviews} ulasan</p>`
                  : ""
              }
            </div>
          </div>
          
          ${
            materials
              ? `
            <div class="bg-green-50 rounded-lg p-2 border border-green-200">
              <p class="text-xs font-medium text-green-700 mb-1">Material Spesialisasi:</p>
              <p class="text-xs text-green-600">${materials}</p>
            </div>
          `
              : ""
          }
          
          ${
            pengepul.totalCollections > 0
              ? `
            <div class="flex items-center space-x-4 text-xs">
              <div class="flex items-center space-x-1 text-gray-600">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
                </svg>
                <span>${pengepul.totalCollections} pickup</span>
              </div>
              ${
                pengepul.totalWeight > 0
                  ? `
                <div class="flex items-center space-x-1 text-gray-600">
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clip-rule="evenodd"/>
                  </svg>
                  <span>${pengepul.totalWeight.toFixed(1)} kg</span>
                </div>
              `
                  : ""
              }
            </div>
          `
              : ""
          }
          
          ${
            pengepul.user.address
              ? `
            <div class="flex items-start space-x-2 text-xs text-gray-600">
              <svg class="w-3.5 h-3.5 text-gray-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"></path>
              </svg>
              <span class="line-clamp-2" title="${pengepul.user.address}">${pengepul.user.address}</span>
            </div>
          `
              : ""
          }
          
          ${
            operatingArea
              ? `
            <div class="text-xs text-gray-500">
              <span class="font-medium">Area Operasi:</span> ${operatingArea}
            </div>
          `
              : ""
          }
          
          <div class="flex space-x-2 pt-1">
            <button onclick="window.open('/pengepul/${
              pengepul.userId
            }', '_blank')" class="flex-1 bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white text-xs font-semibold py-2.5 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center justify-center space-x-2">
              <span>Lihat Profil</span>
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
              </svg>
            </button>
            ${
              pengepul.user.latitude && pengepul.user.longitude
                ? `
              <button onclick="window.showRoute && window.showRoute(${
                pengepul.user.latitude
              }, ${pengepul.user.longitude}, '${companyName.replace(
                    /'/g,
                    "\\'"
                  )}')" class="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-2.5 px-3 rounded-lg transition-colors duration-150 shadow-sm flex items-center justify-center" title="Tampilkan Rute">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/>
                </svg>
              </button>
            `
                : ""
            }
          </div>
        </div>
      </div>
    `;
  },

  // PENGRAJIN POPUP
  pengrajin: (pengrajin: Pengrajin) => {
    const profileImage =
      pengrajin.user.image || "/images/photo-placeholder.svg";
    const crafterName = pengrajin.user.name || "Pengrajin";
    const rating =
      pengrajin.averageRating > 0 ? pengrajin.averageRating.toFixed(1) : "N/A";
    const craftTypes = pengrajin.craftTypes.slice(0, 2).join(", ");
    const portfolioImage = pengrajin.portfolio[0] || null;
    const materials = pengrajin.specializedMaterials.slice(0, 3).join(", ");

    return `
      <div class="w-75 bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-100 font-sans antialiased">
        ${
          portfolioImage
            ? `
          <div class="relative h-32 bg-cover bg-center" style="background-image: url('${portfolioImage}');">
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
            <div class="absolute top-3 right-3">
              <div class="bg-white bg-opacity-90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center space-x-1">
                <svg class="w-3 h-3 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
                <span class="text-xs font-semibold text-gray-800">${rating}</span>
              </div>
            </div>
            <div class="absolute bottom-3 left-3 right-3">
              <div class="text-white font-bold text-sm drop-shadow-lg">${crafterName}</div>
              <div class="text-white text-xs opacity-90">Pengrajin</div>
            </div>
          </div>
        `
            : `
          <div class="relative h-32 bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center">
            <div class="relative z-10 text-center">
              <svg class="w-12 h-12 text-white opacity-80 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path>
              </svg>
              <div class="text-white text-xs font-medium opacity-75">Pengrajin</div>
            </div>
            <div class="absolute top-3 right-3">
              <div class="bg-white bg-opacity-90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center space-x-1">
                <svg class="w-3 h-3 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
                <span class="text-xs font-semibold text-gray-800">${rating}</span>
              </div>
            </div>
          </div>
        `
        }
        
        <div class="p-4 space-y-3">
          ${
            !portfolioImage
              ? `
            <div class="flex items-center space-x-3">
              <img src="${profileImage}" alt="${crafterName}" class="w-12 h-12 rounded-full border-2 border-orange-200 object-cover bg-gray-100" onerror="this.src='/images/photo-placeholder.svg'" />
              <div class="flex-1 min-w-0">
                <h3 class="font-bold text-base text-gray-900 leading-tight truncate" title="${crafterName}">${crafterName}</h3>
                ${
                  pengrajin.totalReviews > 0
                    ? `<p class="text-xs text-gray-500">${pengrajin.totalReviews} ulasan</p>`
                    : ""
                }
              </div>
            </div>
          `
              : pengrajin.totalReviews > 0
              ? `
            <div class="text-xs text-gray-500 -mt-1">${pengrajin.totalReviews} ulasan</div>
          `
              : ""
          }
          
          ${
            craftTypes
              ? `
            <div class="bg-orange-50 rounded-lg p-2 border border-orange-200">
              <p class="text-xs font-medium text-orange-700 mb-1">Jenis Kerajinan:</p>
              <p class="text-xs text-orange-600">${craftTypes}</p>
            </div>
          `
              : ""
          }
          
          ${
            materials
              ? `
            <div class="text-xs">
              <span class="font-medium text-gray-700">Material:</span>
              <span class="text-gray-600"> ${materials}</span>
            </div>
          `
              : ""
          }
          
          <div class="flex items-center space-x-4 text-xs">
            ${
              pengrajin.totalProducts > 0
                ? `
              <div class="flex items-center space-x-1 text-gray-600">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"/>
                </svg>
                <span>${pengrajin.totalProducts} produk</span>
              </div>
            `
                : ""
            }
            ${
              pengrajin.totalSales > 0
                ? `
              <div class="flex items-center space-x-1 text-gray-600">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"/>
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clip-rule="evenodd"/>
                </svg>
                <span>${pengrajin.totalSales} terjual</span>
              </div>
            `
                : ""
            }
            ${
              pengrajin.yearsOfExperience
                ? `
              <div class="flex items-center space-x-1 text-gray-600">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"/>
                </svg>
                <span>${pengrajin.yearsOfExperience} tahun</span>
              </div>
            `
                : ""
            }
          </div>
          
          ${
            pengrajin.workshopAddress
              ? `
            <div class="flex items-start space-x-2 text-xs text-gray-600">
              <svg class="w-3.5 h-3.5 text-gray-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"></path>
              </svg>
              <span class="line-clamp-2" title="${pengrajin.workshopAddress}">${pengrajin.workshopAddress}</span>
            </div>
          `
              : ""
          }
          
          <div class="flex space-x-2 pt-1">
            <button onclick="window.open('/pengrajin/${
              pengrajin.userId
            }', '_blank')" class="flex-1 bg-gradient-to-r from-orange-600 to-amber-700 hover:from-orange-700 hover:to-amber-800 text-white text-xs font-semibold py-2.5 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center justify-center space-x-2">
              <span>Lihat Profil</span>
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
              </svg>
            </button>
            ${
              pengrajin.workshopLatitude && pengrajin.workshopLongitude
                ? `
              <button onclick="window.showRoute && window.showRoute(${
                pengrajin.workshopLatitude
              }, ${pengrajin.workshopLongitude}, '${crafterName.replace(
                    /'/g,
                    "\\'"
                  )}')" class="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-2.5 px-3 rounded-lg transition-colors duration-150 shadow-sm flex items-center justify-center" title="Tampilkan Rute">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/>
                </svg>
              </button>
            `
                : ""
            }
          </div>
        </div>
      </div>
    `;
  },

  // WASTE FACILITY POPUP (TPST3R)
  wasteFacility: (facility: WasteFacility, properties?: TPST3RProperties) => {
    const facilityName = properties?.nama || facility.name;
    const desa = properties?.desa || "";
    const kecamatan = properties?.kecamatan || "";
    const kapasitas = properties?.kapasitas_ || "";

    return `
      <div class="w-72 bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-100 font-sans antialiased">
        <div class="relative h-28 bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
          <div class="relative z-10 text-center">
            <svg class="w-10 h-10 text-white opacity-80 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
            </svg>
            <div class="text-white text-xs font-medium opacity-75">Fasilitas Pengolahan Sampah</div>
          </div>
        </div>
        
        <div class="p-4 space-y-3">
          <div>
            <h3 class="font-bold text-base text-gray-900 leading-tight">${facilityName}</h3>
            <p class="text-xs text-gray-500 mt-0.5">${facility.type}</p>
          </div>
          
          ${
            desa || kecamatan
              ? `
            <div class="bg-blue-50 rounded-lg p-2 border border-blue-200">
              ${
                desa
                  ? `<p class="text-xs text-blue-700"><span class="font-medium">Desa:</span> ${desa}</p>`
                  : ""
              }
              ${
                kecamatan
                  ? `<p class="text-xs text-blue-700 ${
                      desa ? "mt-1" : ""
                    }"><span class="font-medium">Kecamatan:</span> ${kecamatan}</p>`
                  : ""
              }
            </div>
          `
              : ""
          }
          
          ${
            kapasitas
              ? `
            <div class="flex items-center space-x-2 text-xs">
              <svg class="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
              </svg>
              <span class="text-gray-700"><span class="font-medium">Kapasitas:</span> ${kapasitas}</span>
            </div>
          `
              : ""
          }
          
          ${
            facility.address
              ? `
            <div class="flex items-start space-x-2 text-xs text-gray-600">
              <svg class="w-3.5 h-3.5 text-gray-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"></path>
              </svg>
              <span class="line-clamp-2" title="${facility.address}">${facility.address}</span>
            </div>
          `
              : ""
          }
          
          ${
            facility.latitude && facility.longitude
              ? `
            <div class="pt-1">
              <button onclick="window.showRoute && window.showRoute(${
                facility.latitude
              }, ${facility.longitude}, '${facilityName.replace(
                  /'/g,
                  "\\'"
                )}')" class="w-full bg-gradient-to-r from-blue-600 to-cyan-700 hover:from-blue-700 hover:to-cyan-800 text-white text-xs font-semibold py-2.5 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center justify-center space-x-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/>
                </svg>
                <span>Tampilkan Rute</span>
              </button>
            </div>
          `
              : ""
          }
        </div>
      </div>
    `;
  },

  // Tambahkan function ini ke file popupTemplates.ts (setelah wasteFacility)

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
    <div class="w-72 bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-100 font-sans antialiased">
      <div class="relative h-28 bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center">
        <div class="relative z-10 text-center">
          <svg class="w-10 h-10 text-white opacity-80 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
          </svg>
          <div class="text-white text-xs font-medium opacity-75">Fasilitas Pengolahan Sampah</div>
        </div>
      </div>
      
      <div class="p-4 space-y-3">
        <div>
          <h3 class="font-bold text-base text-gray-900 leading-tight">${facilityName}</h3>
          ${
            facilityAddress
              ? `<p class="text-xs text-gray-500 mt-1">${facilityAddress}</p>`
              : ""
          }
        </div>
        
        ${
          props.desa || props.kecamatan
            ? `
          <div class="bg-teal-50 rounded-lg p-2.5 border border-teal-200">
            ${
              props.desa
                ? `<p class="text-xs text-teal-700"><span class="font-medium">Desa:</span> ${props.desa}</p>`
                : ""
            }
            ${
              props.kecamatan
                ? `<p class="text-xs text-teal-700 ${
                    props.desa ? "mt-1" : ""
                  }"><span class="font-medium">Kecamatan:</span> ${
                    props.kecamatan
                  }</p>`
                : ""
            }
          </div>
        `
            : ""
        }
        
        ${
          props.kapasitas_
            ? `
          <div class="flex items-center space-x-2 text-xs">
            <svg class="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
            </svg>
            <span class="text-gray-700"><span class="font-medium">Kapasitas:</span> ${props.kapasitas_}</span>
          </div>
        `
            : ""
        }
        
        ${
          latitude && longitude
            ? `
          <div class="pt-1">
            <button onclick="window.showRoute && window.showRoute(${latitude}, ${longitude}, '${facilityName.replace(
                /'/g,
                "\\'"
              )}')" class="w-full bg-gradient-to-r from-teal-600 to-cyan-700 hover:from-teal-700 hover:to-cyan-800 text-white text-xs font-semibold py-2.5 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center justify-center space-x-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/>
              </svg>
              <span>Tampilkan Rute</span>
            </button>
          </div>
        `
            : ""
        }
      </div>
    </div>
  `;
  },

  wasteOffer: (offer: WasteOffer) => {
    const offerImage = offer.images[0] || "/images/photo-placeholder.svg";
    const userName = offer.user.name || "Anonymous";
    const userImage = offer.user.image || "/images/photo-placeholder.svg";
    const offerTypeText = offer.offerType === "SELL" ? "Dijual" : "Donasi";
    const offerTypeBg =
      offer.offerType === "SELL"
        ? "bg-green-100 text-green-700"
        : "bg-blue-100 text-blue-700";
    const offerTypeGradient =
      offer.offerType === "SELL"
        ? "from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800"
        : "from-blue-600 to-cyan-700 hover:from-blue-700 hover:to-cyan-800";
    const weight = offer.weight ? `${offer.weight} kg` : "N/A";

    return `
    <div class="w-75 bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-100 font-sans antialiased">
      <div class="relative h-40 bg-cover bg-center" style="background-image: url('${offerImage}');">
        <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
        <div class="absolute top-3 left-3">
          <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${offerTypeBg} backdrop-blur-sm">
            ${offerTypeText}
          </span>
        </div>
        ${
          offer.weight
            ? `
          <div class="absolute top-3 right-3">
            <div class="bg-white bg-opacity-90 backdrop-blur-sm rounded-full px-2.5 py-1 flex items-center space-x-1">
              <svg class="w-3 h-3 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clip-rule="evenodd"/>
              </svg>
              <span class="text-xs font-semibold text-gray-800">${weight}</span>
            </div>
          </div>
        `
            : ""
        }
        <div class="absolute bottom-3 left-3 right-3">
          <h3 class="text-white font-bold text-base drop-shadow-lg line-clamp-2" title="${
            offer.title
          }">${offer.title}</h3>
        </div>
      </div>
      
      <div class="p-4 space-y-3">
        <div class="flex items-center space-x-3 pb-3 border-b border-gray-100">
          <img src="${userImage}" alt="${userName}" class="w-10 h-10 rounded-full border-2 border-gray-200 object-cover bg-gray-100" onerror="this.src='/images/photo-placeholder.svg'" />
          <div class="flex-1 min-w-0">
            <p class="text-sm font-semibold text-gray-900 truncate">${userName}</p>
            <p class="text-xs text-gray-500">Pemilik</p>
          </div>
        </div>
        
        <div class="bg-gray-50 rounded-lg p-2.5 border border-gray-200">
          <div class="flex items-center justify-between mb-1.5">
            <span class="text-xs font-medium text-gray-700">Material</span>
            <span class="text-xs font-semibold text-gray-900">${
              offer.materialType
            }</span>
          </div>
          ${
            offer.weight
              ? `
            <div class="flex items-center justify-between">
              <span class="text-xs font-medium text-gray-700">Berat</span>
              <span class="text-xs font-semibold text-gray-900">${weight}</span>
            </div>
          `
              : ""
          }
        </div>
        
        ${
          offer.description
            ? `
          <div class="text-xs text-gray-600 line-clamp-3" title="${offer.description}">
            ${offer.description}
          </div>
        `
            : ""
        }
        
        ${
          offer.address
            ? `
          <div class="flex items-start space-x-2 text-xs text-gray-600">
            <svg class="w-3.5 h-3.5 text-gray-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"></path>
            </svg>
            <span class="line-clamp-2" title="${offer.address}">${offer.address}</span>
          </div>
        `
            : ""
        }
        
        <div class="flex space-x-2 pt-1">
          <button onclick="window.open('/waste-offers/${
            offer.id
          }', '_blank')" class="flex-1 bg-gradient-to-r ${offerTypeGradient} text-white text-xs font-semibold py-2.5 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center justify-center space-x-2">
            <span>Lihat Detail</span>
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
            </svg>
          </button>
          ${
            offer.latitude && offer.longitude
              ? `
            <button onclick="window.showRoute && window.showRoute(${
              offer.latitude
            }, ${offer.longitude}, '${offer.title.replace(
                  /'/g,
                  "\\'"
                )}', 'waste-offer')" class="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-2.5 px-3 rounded-lg transition-colors duration-150 shadow-sm flex items-center justify-center" title="Tampilkan Rute">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/>
              </svg>
            </button>
          `
              : ""
          }
        </div>
      </div>
    </div>
  `;
  },
};
