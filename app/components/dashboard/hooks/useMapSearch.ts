/* eslint-disable @typescript-eslint/no-unused-vars */
import { useCallback } from "react";
import L from "leaflet";
import { FeatureCollection } from "geojson";
import {
  Product,
  Store,
  ProductSearchResult,
} from "@/app/components/dashboard/types/map.types";
import { ProductSearchPopup } from "@/app/components/dashboard/components/map/ProductSearchPopup";

export const useMapSearch = (
  mapRef: React.MutableRefObject<L.Map | null>,
  districts: string[],
  malangBoundaries: FeatureCollection,
  storeLayerRef: React.MutableRefObject<L.LayerGroup | null>,
  partnerLayerRef: React.MutableRefObject<L.LayerGroup | null>,
  productLayerRef: React.MutableRefObject<L.LayerGroup | null>,
  showStores: boolean,
  showPartners: boolean
) => {
  // Enhanced product search with flexible matching
  const searchProducts = async (query: string): Promise<Product[]> => {
    try {
      console.log("Searching products with query:", query);

      const response = await fetch(
        `/api/products/search?q=${encodeURIComponent(query)}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const products = data.products || [];

      console.log("Search results:", products);
      return products;
    } catch (error) {
      console.error("Error searching products:", error);
      return [];
    }
  };

  const getStoresByProduct = async (
    productId: string
  ): Promise<{ stores: Store[]; product: Product | null }> => {
    try {
      console.log("Getting stores for product ID:", productId);
      const response = await fetch(
        `/api/stores/by-product?productId=${productId}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Stores by product API response:", data);
      return { stores: data.stores || [], product: data.product };
    } catch (error) {
      console.error("Error getting stores by product:", error);
      return { stores: [], product: null };
    }
  };

  const handleSearch = useCallback(
    async (query: string, searchType: "location" | "product" = "location") => {
      console.log("=== SEARCH DEBUG START ===");
      console.log("handleSearch called with:", {
        query,
        searchType,
        searchTypeType: typeof searchType,
        mapExists: !!mapRef.current,
        productLayerExists: !!productLayerRef.current,
      });

      if (!query || !mapRef.current) {
        console.log("Early return: no query or map");
        return;
      }

      if (!query.trim()) {
        console.log("Early return: empty query after trim");
        return;
      }

      // PRODUCT SEARCH LOGIC
      console.log(
        'Checking if searchType === "product":',
        searchType === "product"
      );
      if (searchType === "product") {
        console.log("Executing enhanced product search...");

        try {
          const products = await searchProducts(query);
          console.log("Found products:", products);

          if (products.length === 0) {
            const suggestions = [
              "Coba gunakan kata kunci yang lebih umum (misal: 'plastik' bukan 'botol plastik')",
              "Periksa ejaan kata kunci",
              "Coba kata kunci dalam bahasa Indonesia",
              "Gunakan kategori produk (misal: 'organik', 'plastik', 'kertas')",
            ];

            throw new Error(
              `Produk "${query}" tidak ditemukan.\n\nSaran pencarian:\n${suggestions
                .map((s) => `• ${s}`)
                .join("\n")}`
            );
          }

          // Clear existing product markers
          if (productLayerRef.current) {
            console.log("Clearing previous product markers");
            productLayerRef.current.clearLayers();
          } else {
            console.error("productLayerRef is null!");
            return;
          }

          // Get all stores for all matching products
          const allStores: Store[] = [];
          const productStoreMap = new Map<string, Store[]>();

          for (const product of products) {
            const result = await getStoresByProduct(product.id);
            const stores = result.stores;

            if (stores.length > 0) {
              allStores.push(...stores);
              productStoreMap.set(product.id, stores);
            }
          }

          console.log("All stores selling matching products:", allStores);

          if (allStores.length === 0) {
            throw new Error(
              `Produk dengan kata kunci "${query}" ditemukan, tetapi belum ada toko yang menjualnya.\n\nSilakan coba produk lain atau hubungi admin untuk menambahkan toko.`
            );
          }

          // Remove duplicates based on store ID
          const uniqueStores = allStores.filter(
            (store, index, self) =>
              index === self.findIndex((s) => s.id === store.id)
          );

          // Create product markers for all unique stores
          uniqueStores.forEach((store, index) => {
            console.log(`Creating marker ${index + 1} for store:`, store);

            if (store.latitude && store.longitude && productLayerRef.current) {
              const markerIcon = L.icon({
                iconUrl: "/marker/products.svg",
                iconSize: [32, 32],
                iconAnchor: [16, 32],
                popupAnchor: [0, -32],
                shadowUrl: undefined,
                className: "product-search-marker",
              });

              let marker;
              try {
                marker = L.marker([store.latitude, store.longitude], {
                  icon: markerIcon,
                });
              } catch (iconError) {
                console.warn("Product icon failed, using default:", iconError);
                marker = L.marker([store.latitude, store.longitude]);
              }

              // Find which products this store sells from our search
              const storeProducts = products.filter((product) => {
                const productStores = productStoreMap.get(product.id) || [];
                return productStores.some((s) => s.id === store.id);
              });

              // Generate popup content using the FIXED component with cache busting
              const timestamp = Date.now();
              console.log(
                `Generating popup content for store ${store.id} at timestamp ${timestamp}`
              );

              const popupContent = ProductSearchPopup.generatePopupContent({
                store,
                products: storeProducts,
                query,
                totalProductsFound: products.length,
              });

              // Add timestamp to ensure popup content is not cached
              const finalPopupContent = `
                <div data-timestamp="${timestamp}">
                  ${popupContent}
                </div>
              `;

              marker.bindPopup(finalPopupContent, {
                minWidth: 600,
                maxWidth: 600,
                className: `custom-popup popup-${timestamp}`,
              });

              // Add event listener to force content refresh when popup opens
              marker.on("popupopen", function (e) {
                console.log(
                  `Popup opened for store ${
                    store.id
                  } at ${new Date().toISOString()}`
                );
                // Force a small delay to ensure DOM is ready
                setTimeout(() => {
                  const popup = e.popup;
                  if (popup && popup.update) {
                    popup.update();
                  }
                }, 50);
              });

              marker.addTo(productLayerRef.current);
              console.log(
                `Added marker for store ${store.id} with ${storeProducts.length} products`
              );
            } else {
              console.warn(`Store ${index + 1} missing coordinates:`, store);
            }
          });

          // Fit map to show all stores
          if (uniqueStores.length > 0) {
            const validStores = uniqueStores.filter(
              (store) => store.latitude && store.longitude
            );
            if (validStores.length > 0) {
              const bounds = L.latLngBounds(
                validStores.map((store) => [store.latitude, store.longitude])
              );
              mapRef.current.fitBounds(bounds, { padding: [20, 20] });
              console.log(
                `Map fitted to bounds for ${validStores.length} stores selling ${products.length} matching products`
              );
            }
          }

          console.log("Enhanced product search completed successfully");
          return;
        } catch (error) {
          console.error("Product search error:", error);
          throw error;
        }
      }

      // ENHANCED LOCATION SEARCH LOGIC
      console.log("Executing enhanced location search...");

      // Make location search more flexible too
      const normalizeQuery = (text: string) =>
        text.toLowerCase().replace(/[^a-z0-9]/g, "");
      const normalizedQuery = normalizeQuery(query);

      // Search in districts with flexible matching
      const foundDistrict = districts.find((d) => {
        const normalizedDistrict = normalizeQuery(d);
        return (
          normalizedDistrict.includes(normalizedQuery) ||
          normalizedQuery.includes(normalizedDistrict) ||
          d.toLowerCase().includes(query.toLowerCase())
        );
      });

      if (foundDistrict) {
        console.log("Found district:", foundDistrict);
        const feature = malangBoundaries.features.find(
          (f) => f.properties?.wadmkc === foundDistrict
        );
        if (feature && mapRef.current) {
          const bounds = L.geoJSON(feature).getBounds();
          mapRef.current.fitBounds(bounds);
          console.log("Map fitted to district bounds");
        }
        return;
      }

      let found = false;

      // Enhanced store search with flexible matching
      if (storeLayerRef.current && showStores) {
        console.log("Searching in stores with flexible matching...");
        const layers = storeLayerRef.current.getLayers() as L.Marker[];
        const foundStore = layers.find((layer) => {
          const popup = layer.getPopup();
          if (!popup) return false;
          const content = popup.getContent();
          if (typeof content !== "string") return false;

          const normalizedContent = normalizeQuery(content);
          return (
            normalizedContent.includes(normalizedQuery) ||
            content.toLowerCase().includes(query.toLowerCase())
          );
        });

        if (foundStore) {
          const latLng = foundStore.getLatLng();
          mapRef.current.setView(latLng, 18);
          foundStore.openPopup();
          found = true;
          console.log("Found and opened store popup");
          return;
        }
      }

      // Enhanced partner search with flexible matching
      if (partnerLayerRef.current && showPartners) {
        console.log("Searching in partners with flexible matching...");
        const layers = partnerLayerRef.current.getLayers() as L.Marker[];
        const foundPartner = layers.find((layer) => {
          const popup = layer.getPopup();
          if (!popup) return false;
          const content = popup.getContent();
          if (typeof content !== "string") return false;

          const normalizedContent = normalizeQuery(content);
          return (
            normalizedContent.includes(normalizedQuery) ||
            content.toLowerCase().includes(query.toLowerCase())
          );
        });

        if (foundPartner) {
          const latLng = foundPartner.getLatLng();
          mapRef.current.setView(latLng, 18);
          foundPartner.openPopup();
          found = true;
          console.log("Found and opened partner popup");
          return;
        }
      }

      if (!found) {
        console.log("Location not found");
        throw new Error(
          `Lokasi "${query}" tidak ditemukan.\n\nSaran:\n• Coba nama kecamatan yang lebih lengkap\n• Periksa ejaan nama lokasi\n• Pastikan toko/mitra sudah ditampilkan di peta`
        );
      }
    },
    [
      mapRef,
      districts,
      malangBoundaries,
      storeLayerRef,
      partnerLayerRef,
      productLayerRef,
      showStores,
      showPartners,
    ]
  );

  return { handleSearch };
};
