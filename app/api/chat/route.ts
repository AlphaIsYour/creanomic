/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/chat/route.ts
import { PrismaClient } from "@prisma/client";
import { createGroq } from "@ai-sdk/groq";
import { streamText, CoreMessage } from "ai";
import Groq from "groq-sdk";

const prisma = new PrismaClient();

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
});

// Helper function untuk format harga
function formatPrice(price: number): string {
  return `Rp ${price.toLocaleString("id-ID")}`;
}

// Helper function untuk condition mapping
function getConditionText(condition: string): string {
  const conditionMap: { [key: string]: string } = {
    NEW_SEALED: "Baru/Segel",
    LIKE_NEW: "Seperti Baru",
    VERY_GOOD: "Sangat Bagus",
    GOOD: "Bagus",
    FAIR: "Cukup Bagus",
  };
  return conditionMap[condition] || condition;
}

// Helper function untuk generate product link
function getProductLink(productId: string): string {
  return `https://bekasinaja.com/product/${productId}`;
}

// Helper function untuk generate store link
function getStoreLink(storeSlug: string | null): string {
  return storeSlug ? `https://bekasinaja.com/store/${storeSlug}` : "#";
}

// Helper function untuk truncate text
function truncateText(text: string, maxLength: number = 100): string {
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
}

export async function POST(req: Request) {
  const { messages }: { messages: CoreMessage[] } = await req.json();

  const lastUserMessage = messages[messages.length - 1];
  const userQueryContent = lastUserMessage.content;
  const userQuery =
    typeof userQueryContent === "string" ? userQueryContent.toLowerCase() : "";

  let context = "";
  let definitiveAnswer = "";

  if (userQuery) {
    try {
      // 1. Produk Terbaru
      if (
        userQuery.includes("produk terbaru") ||
        userQuery.includes("barang baru") ||
        userQuery.includes("barang terbaru")
      ) {
        const latestProducts = await prisma.product.findMany({
          where: { isPublished: true, isSold: false },
          orderBy: { createdAt: "desc" },
          take: 8,
          select: {
            id: true,
            title: true,
            price: true,
            description: true,
            condition: true,
            locationCity: true,
            locationProvince: true,
            category: true,
            subcategory: true,
            images: true,
            views: true,
            createdAt: true,
            seller: {
              select: {
                name: true,
                storeProfile: {
                  select: {
                    storeName: true,
                    slug: true,
                  },
                },
              },
            },
          },
        });

        if (latestProducts.length > 0) {
          context = `Berikut adalah ${latestProducts.length} produk terbaru yang tersedia:\n\n${latestProducts
            .map((p, i) => {
              const storeName =
                p.seller.storeProfile?.storeName ||
                p.seller.name ||
                "Toko Pribadi";
              const storeLink = getStoreLink(
                p.seller.storeProfile?.slug || null
              );
              const productLink = getProductLink(p.id);
              const location =
                p.locationCity && p.locationProvince
                  ? `${p.locationCity}, ${p.locationProvince}`
                  : p.locationCity || "Lokasi tidak disebutkan";

              return `${i + 1}. **${p.title}**
   - 💰 Harga: ${formatPrice(p.price)}
   - 📱 Kondisi: ${getConditionText(p.condition)}
   - 📂 Kategori: ${p.category}${p.subcategory ? ` > ${p.subcategory}` : ""}
   - 📍 Lokasi: ${location}
   - 🏪 Toko: [${storeName}](${storeLink})
   - 👀 Views: ${p.views}
   - 🔗 [Lihat Produk](${productLink})
   - 📝 ${truncateText(p.description)}`;
            })
            .join("\n\n")}`;
        }
      }

      // 2. Pencarian Produk Berdasarkan Kategori/Keyword + Filter Harga
      else if (
        userQuery.includes("termurah") ||
        userQuery.includes("termahal") ||
        userQuery.includes("harga") ||
        /\d+\s*(produk|barang)/.test(userQuery) ||
        userQuery.includes("cari") ||
        userQuery.includes("mau")
      ) {
        // Extract keyword
        const keywords = [
          "botol",
          "hp",
          "handphone",
          "smartphone",
          "laptop",
          "sepeda",
          "baju",
          "tas",
          "elektronik",
          "furniture",
          "mainan",
          "buku",
          "kamera",
          "motor",
          "mobil",
          "jam",
          "sepatu",
          "headphone",
        ];
        const foundKeyword = keywords.find((k) => userQuery.includes(k));

        // Extract jumlah yang diminta
        const countMatch = userQuery.match(/(\d+)\s*(produk|barang)/);
        const requestedCount = countMatch ? parseInt(countMatch[1]) : 6;

        const sortOrder = userQuery.includes("termurah")
          ? "asc"
          : userQuery.includes("termahal")
            ? "desc"
            : "desc";

        let whereCondition: any = {
          isPublished: true,
          isSold: false,
        };

        if (foundKeyword) {
          whereCondition.OR = [
            { title: { contains: foundKeyword, mode: "insensitive" } },
            { description: { contains: foundKeyword, mode: "insensitive" } },
            { category: { contains: foundKeyword, mode: "insensitive" } },
            { subcategory: { contains: foundKeyword, mode: "insensitive" } },
          ];
        }

        const products = await prisma.product.findMany({
          where: whereCondition,
          orderBy: { price: sortOrder },
          take: requestedCount,
          select: {
            id: true,
            title: true,
            price: true,
            condition: true,
            locationCity: true,
            locationProvince: true,
            category: true,
            subcategory: true,
            views: true,
            seller: {
              select: {
                name: true,
                storeProfile: {
                  select: {
                    storeName: true,
                    slug: true,
                  },
                },
              },
            },
          },
        });

        if (products.length > 0) {
          const sortText = userQuery.includes("termurah")
            ? "termurah"
            : userQuery.includes("termahal")
              ? "termahal"
              : "terbaru";
          const keywordText = foundKeyword ? ` "${foundKeyword}"` : "";

          context = `Berikut adalah ${products.length} produk${keywordText} ${sortText}:\n\n${products
            .map((p, i) => {
              const storeName =
                p.seller.storeProfile?.storeName ||
                p.seller.name ||
                "Toko Pribadi";
              const storeLink = getStoreLink(
                p.seller.storeProfile?.slug || null
              );
              const productLink = getProductLink(p.id);
              const location =
                p.locationCity && p.locationProvince
                  ? `${p.locationCity}, ${p.locationProvince}`
                  : p.locationCity || "Lokasi tidak disebutkan";

              return `${i + 1}. **${p.title}**
   - 💰 ${formatPrice(p.price)}
   - 📱 ${getConditionText(p.condition)}
   - 📂 ${p.category}${p.subcategory ? ` > ${p.subcategory}` : ""}
   - 📍 ${location}
   - 🏪 [${storeName}](${storeLink})
   - 👀 ${p.views} views
   - 🔗 [Lihat Detail](${productLink})`;
            })
            .join("\n\n")}`;
        }
      }

      // 3. Mitra/Partner Terbaru
      else if (
        userQuery.includes("mitra terbaru") ||
        userQuery.includes("partner terbaru") ||
        userQuery.includes("petani terbaru") ||
        userQuery.includes("servis terbaru")
      ) {
        const latestPartners = await prisma.partner.findMany({
          where: { status: "APPROVED" },
          orderBy: { createdAt: "desc" },
          take: 6,
          select: {
            id: true,
            businessName: true,
            location: true,
            expertise: true,
            description: true,
            phoneNumber: true,
            email: true,
            website: true,
            instagram: true,
            facebook: true,
            user: {
              select: {
                name: true,
              },
            },
            services: {
              select: {
                name: true,
                price: true,
              },
              take: 3,
            },
            works: {
              select: {
                title: true,
                category: true,
              },
              take: 2,
            },
          },
        });

        if (latestPartners.length > 0) {
          context = `Berikut adalah ${latestPartners.length} mitra terbaru yang bergabung:\n\n${latestPartners
            .map((p, i) => {
              const expertise = Array.isArray(p.expertise)
                ? p.expertise.join(", ")
                : "Tidak disebutkan";
              const services =
                p.services.length > 0
                  ? p.services
                      .map((s) => `${s.name}${s.price ? ` (${s.price})` : ""}`)
                      .join(", ")
                  : "Tidak ada layanan terdaftar";

              return `${i + 1}. **${p.businessName}**
   - 👤 Pemilik: ${p.user.name || "Tidak disebutkan"}
   - 📍 Lokasi: ${p.location}
   - 🔧 Keahlian: ${expertise}
   - 📞 Kontak: ${p.phoneNumber}
   - 📧 Email: ${p.email}
   ${p.website ? `- 🌐 Website: ${p.website}` : ""}
   ${p.instagram ? `- 📸 Instagram: @${p.instagram}` : ""}
   - 🛠️ Layanan: ${services}
   - 📝 ${truncateText(p.description, 120)}`;
            })
            .join("\n\n")}`;
        }
      }

      // 4. Mitra/Servis berdasarkan lokasi atau keahlian
      else if (
        userQuery.includes("mitra") ||
        userQuery.includes("servis") ||
        userQuery.includes("partner") ||
        userQuery.includes("reparasi") ||
        userQuery.includes("perbaikan")
      ) {
        // Extract location or service type
        const locations = [
          "jakarta",
          "bekasi",
          "tangerang",
          "depok",
          "bogor",
          "bandung",
          "surabaya",
        ];
        const services = [
          "elektronik",
          "hp",
          "laptop",
          "ac",
          "kulkas",
          "motor",
          "mobil",
          "furniture",
        ];

        const foundLocation = locations.find((loc) => userQuery.includes(loc));
        const foundService = services.find((svc) => userQuery.includes(svc));

        let whereCondition: any = { status: "APPROVED" };

        if (foundLocation) {
          whereCondition.location = {
            contains: foundLocation,
            mode: "insensitive",
          };
        }

        const partners = await prisma.partner.findMany({
          where: whereCondition,
          take: 6,
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            businessName: true,
            location: true,
            expertise: true,
            phoneNumber: true,
            email: true,
            description: true,
            services: {
              select: {
                name: true,
                price: true,
              },
              take: 3,
            },
            works: {
              select: {
                title: true,
                views: true,
              },
              orderBy: { views: "desc" },
              take: 2,
            },
          },
        });

        if (partners.length > 0) {
          const locationText = foundLocation
            ? ` di ${foundLocation.charAt(0).toUpperCase() + foundLocation.slice(1)}`
            : "";
          const serviceText = foundService ? ` untuk ${foundService}` : "";

          context = `Berikut mitra${serviceText}${locationText} yang tersedia:\n\n${partners
            .map((p, i) => {
              const expertise = Array.isArray(p.expertise)
                ? p.expertise.join(", ")
                : "Tidak disebutkan";
              const services =
                p.services.length > 0
                  ? p.services
                      .map((s) => `${s.name}${s.price ? ` (${s.price})` : ""}`)
                      .join(", ")
                  : "Hubungi untuk info layanan";
              const popularWork =
                p.works.length > 0 ? p.works[0].title : "Belum ada portfolio";

              return `${i + 1}. **${p.businessName}**
   - 📍 ${p.location}
   - 🔧 Keahlian: ${expertise}
   - 📞 ${p.phoneNumber}
   - 📧 ${p.email}
   - 🛠️ Layanan: ${services}
   - 🏆 Portfolio Populer: ${popularWork}
   - 📝 ${truncateText(p.description, 100)}`;
            })
            .join("\n\n")}`;
        }
      }

      // 5. Statistik/Info Umum
      else if (
        userQuery.includes("berapa") ||
        userQuery.includes("total") ||
        userQuery.includes("jumlah") ||
        userQuery.includes("statistik") ||
        userQuery.includes("data")
      ) {
        const [
          totalProducts,
          totalSoldProducts,
          totalPartners,
          totalUsers,
          totalOrders,
          totalArticles,
          popularCategories,
        ] = await Promise.all([
          prisma.product.count({ where: { isPublished: true, isSold: false } }),
          prisma.product.count({ where: { isSold: true } }),
          prisma.partner.count({ where: { status: "APPROVED" } }),
          prisma.user.count(),
          prisma.order.count(),
          prisma.article.count({ where: { status: "PUBLISHED" } }),
          prisma.product.groupBy({
            by: ["category"],
            where: { isPublished: true },
            _count: { category: true },
            orderBy: { _count: { category: "desc" } },
            take: 5,
          }),
        ]);

        const categoryStats = popularCategories
          .map(
            (cat, i) =>
              `${i + 1}. ${cat.category}: ${cat._count.category} produk`
          )
          .join("\n");

        context = `📊 **Statistik BekasinAja saat ini:**

🛍️ **Produk:**
- Produk Aktif: ${totalProducts}
- Produk Terjual: ${totalSoldProducts}
- Total Transaksi: ${totalOrders}

👥 **Komunitas:**
- Total Pengguna: ${totalUsers}
- Mitra Terdaftar: ${totalPartners}
- Artikel Dipublikasi: ${totalArticles}

📈 **Kategori Populer:**
${categoryStats}

💡 **Tips:** Bergabunglah dengan komunitas BekasinAja untuk jual-beli barang bekas berkualitas dan temukan mitra terpercaya!`;
      }

      // 6. Artikel Terbaru
      else if (
        userQuery.includes("artikel") ||
        userQuery.includes("berita") ||
        userQuery.includes("blog") ||
        userQuery.includes("tips")
      ) {
        const articles = await prisma.article.findMany({
          where: { status: "PUBLISHED" },
          orderBy: { publishedAt: "desc" },
          take: 5,
          select: {
            id: true,
            title: true,
            slug: true,
            excerpt: true,
            authorName: true,
            publishedAt: true,
            views: true,
            category: {
              select: {
                name: true,
              },
            },
            tags: {
              select: {
                name: true,
              },
              take: 3,
            },
          },
        });

        if (articles.length > 0) {
          context = `📰 **Artikel Terbaru:**\n\n${articles
            .map((a, i) => {
              const articleLink = `https://bekasinaja.com/article/${a.slug}`;
              const tags = a.tags.map((tag) => tag.name).join(", ");
              const publishedDate = new Date(a.publishedAt!).toLocaleDateString(
                "id-ID"
              );

              return `${i + 1}. **${a.title}**
   - ✍️ Penulis: ${a.authorName}
   - 📅 Dipublikasi: ${publishedDate}
   - 📂 Kategori: ${a.category?.name || "Umum"}
   - 🏷️ Tags: ${tags || "Tidak ada tag"}
   - 👀 ${a.views} views
   - 🔗 [Baca Artikel](${articleLink})
   - 📝 ${a.excerpt ? truncateText(a.excerpt, 120) : "Tidak ada ringkasan"}`;
            })
            .join("\n\n")}`;
        }
      }

      // 7. Pencarian berdasarkan lokasi
      else if (
        userQuery.includes("jakarta") ||
        userQuery.includes("bekasi") ||
        userQuery.includes("tangerang") ||
        userQuery.includes("depok") ||
        userQuery.includes("bogor") ||
        userQuery.includes("bandung") ||
        userQuery.includes("surabaya")
      ) {
        const cityKeywords = [
          "jakarta",
          "bekasi",
          "tangerang",
          "depok",
          "bogor",
          "bandung",
          "surabaya",
        ];
        const foundCity = cityKeywords.find((city) => userQuery.includes(city));

        if (foundCity) {
          const [productsInCity, partnersInCity, articlesInCity] =
            await Promise.all([
              prisma.product.findMany({
                where: {
                  isPublished: true,
                  isSold: false,
                  OR: [
                    {
                      locationCity: {
                        contains: foundCity,
                        mode: "insensitive",
                      },
                    },
                    {
                      locationProvince: {
                        contains: foundCity,
                        mode: "insensitive",
                      },
                    },
                  ],
                },
                take: 4,
                orderBy: { createdAt: "desc" },
                select: {
                  id: true,
                  title: true,
                  price: true,
                  condition: true,
                  seller: {
                    select: {
                      storeProfile: {
                        select: { storeName: true, slug: true },
                      },
                    },
                  },
                },
              }),
              prisma.partner.findMany({
                where: {
                  status: "APPROVED",
                  location: { contains: foundCity, mode: "insensitive" },
                },
                take: 3,
                select: {
                  businessName: true,
                  location: true,
                  phoneNumber: true,
                  expertise: true,
                },
              }),
              prisma.article.findMany({
                where: {
                  status: "PUBLISHED",
                  location: { contains: foundCity, mode: "insensitive" },
                },
                take: 2,
                select: {
                  title: true,
                  slug: true,
                  authorName: true,
                },
              }),
            ]);

          const cityName =
            foundCity.charAt(0).toUpperCase() + foundCity.slice(1);
          let locationContext = `🏙️ **Informasi untuk area ${cityName}:**\n\n`;

          if (productsInCity.length > 0) {
            locationContext += `🛍️ **Produk Tersedia:**\n${productsInCity
              .map((p, i) => {
                const storeName =
                  p.seller.storeProfile?.storeName || "Toko Pribadi";
                const productLink = getProductLink(p.id);
                return `${i + 1}. [${p.title}](${productLink}) - ${formatPrice(p.price)} (${getConditionText(p.condition)}) - ${storeName}`;
              })
              .join("\n")}\n\n`;
          }

          if (partnersInCity.length > 0) {
            locationContext += `🔧 **Mitra di Area Ini:**\n${partnersInCity
              .map((p, i) => {
                const expertise = Array.isArray(p.expertise)
                  ? p.expertise.join(", ")
                  : "Berbagai layanan";
                return `${i + 1}. **${p.businessName}** - ${p.location}
   📞 ${p.phoneNumber} | 🔧 ${expertise}`;
              })
              .join("\n")}\n\n`;
          }

          if (articlesInCity.length > 0) {
            locationContext += `📰 **Artikel Terkait:**\n${articlesInCity
              .map(
                (a, i) =>
                  `${i + 1}. [${a.title}](https://bekasinaja.com/article/${a.slug}) - ${a.authorName}`
              )
              .join("\n")}`;
          }

          context = locationContext;
        }
      }

      // 8. Toko/Store Information
      else if (
        userQuery.includes("toko") ||
        userQuery.includes("penjual") ||
        userQuery.includes("seller")
      ) {
        const stores = await prisma.storeProfile.findMany({
          take: 6,
          orderBy: { createdAt: "desc" },
          select: {
            storeName: true,
            slug: true,
            description: true,
            location: true,
            user: {
              select: {
                name: true,
                productsSold: {
                  where: { isPublished: true, isSold: false },
                  select: { id: true },
                },
              },
            },
          },
        });

        if (stores.length > 0) {
          context = `🏪 **Toko-toko Terpercaya:**\n\n${stores
            .map((store, i) => {
              const storeLink = getStoreLink(store.slug);
              const productCount = store.user.productsSold.length;

              return `${i + 1}. **[${store.storeName}](${storeLink})**
   - 👤 Pemilik: ${store.user.name || "Tidak disebutkan"}
   - 📍 Lokasi: ${store.location || "Tidak disebutkan"}
   - 📦 Produk Aktif: ${productCount}
   - 📝 ${store.description ? truncateText(store.description, 100) : "Tidak ada deskripsi"}`;
            })
            .join("\n\n")}`;
        }
      }

      // Jika tidak ada data ditemukan
      if (!context && !definitiveAnswer) {
        definitiveAnswer =
          "Maaf, aku tidak menemukan informasi yang sesuai dengan pertanyaan kamu. Coba tanya dengan kata kunci yang berbeda ya! 🤔\n\nKamu bisa coba tanya tentang:\n- Produk terbaru\n- Mitra di area tertentu\n- Statistik BekasinAja\n- Artikel atau tips\n- Produk berdasarkan kategori\n- Dan masih banyak lagi! 😊";
      }
    } catch (dbError) {
      console.error("Database query error:", dbError);
      definitiveAnswer =
        "Duh, maaf banget, aku lagi ada kendala buat akses database. Coba tanya lagi beberapa saat ya! 🔧";
    }
  }

  // Return definitive answer jika ada
  if (definitiveAnswer) {
    return new Response(JSON.stringify({ text: definitiveAnswer }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  // Generate response dengan AI
  const systemMessage: CoreMessage = {
    role: "system",
    content: `Kamu adalah Eco Helper, chatbot AI dari website BekasinAja yang super ramah dan helpful! 🌟

KEPRIBADIAN:
- Selalu ramah, antusias, dan supportive
- Gunakan emoji yang relevan tapi jangan berlebihan
- Bicara seperti teman yang knowledgeable
- Berikan informasi yang akurat dan berguna

TUGAS UTAMA:
- Membantu user cari produk bekas berkualitas
- Mencarikan mitra reparasi terpercaya
- Memberikan informasi terkini tentang BekasinAja
- Memberikan tips sustainable living

FORMAT RESPONSE:
- Gunakan markdown untuk struktur yang rapi
- Sertakan link yang relevan
- Tampilkan harga dengan format yang benar
- Sebutkan nama toko dan lokasi dengan jelas
- Berikan context yang helpful

PENTING:
- Semua harga sudah dalam format yang benar (jangan tambah nol)
- Semua link sudah valid dan mengarah ke halaman yang tepat
- Data yang diberikan sudah akurat dari database
- Jangan sebutkan "[INFO DARI DATABASE]" atau hal teknis lainnya

${context ? `\nDATA TERKINI:\n${context}` : ""}

Jawab dengan gaya yang natural, informatif, dan engaging! 💫`,
  };

  try {
    const result = await streamText({
      model: groq("llama3-8b-8192"),
      messages: [systemMessage, ...messages],
      temperature: 0.7,
      maxTokens: 1500,
    });
    return result.toDataStreamResponse();
  } catch (error) {
    console.error("Error dari Groq API:", error);
    if (error instanceof Groq.APIError) {
      return new Response(`Error dari Groq: ${error.message}`, {
        status: error.status,
      });
    }
    return new Response(
      "Waduh, maaf banget, server AI lagi ada kendala. 🤖💔",
      {
        status: 500,
      }
    );
  }
}
