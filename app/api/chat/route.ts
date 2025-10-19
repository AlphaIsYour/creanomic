/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */

// app/api/chat/route.ts
import { PrismaClient } from "@prisma/client";
import { createGroq } from "@ai-sdk/groq";
import { streamText, CoreMessage } from "ai";
import Groq from "groq-sdk";

const prisma = new PrismaClient();

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
});

// Helper functions
function formatPrice(price: number): string {
  return `Rp ${price.toLocaleString("id-ID")}`;
}

function truncateText(text: string, maxLength: number = 100): string {
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
}

function getMaterialTypeText(type: string): string {
  const materialMap: { [key: string]: string } = {
    PLASTIC: "Plastik",
    GLASS: "Kaca",
    METAL: "Logam",
    PAPER: "Kertas",
    CARDBOARD: "Kardus",
    ELECTRONIC: "Elektronik",
    TEXTILE: "Tekstil",
    WOOD: "Kayu",
    RUBBER: "Karet",
    ORGANIC: "Organik",
    OTHER: "Lainnya",
  };
  return materialMap[type] || type;
}

export async function POST(req: Request) {
  try {
    const { messages }: { messages: CoreMessage[] } = await req.json();

    console.log("📩 Received messages:", messages.length);

    const lastUserMessage = messages[messages.length - 1];
    let userQueryContent = lastUserMessage.content;

    const originalQuery =
      typeof userQueryContent === "string" ? userQueryContent.trim() : "";

    let userQuery =
      typeof userQueryContent === "string"
        ? userQueryContent
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9\s]/g, "")
        : "";

    console.log("🔍 Cleaned user query:", userQuery);

    // Handle greetings
    const greetingKeywords = [
      "halo",
      "hai",
      "hi",
      "p",
      "assalamualaikum",
      "met pagi",
      "met siang",
      "met sore",
      "met malem",
      "selamat pagi",
      "selamat siang",
      "selamat sore",
      "selamat malam",
    ];

    let directResponseContent: string | null = null;

    const isOnlyGreeting =
      greetingKeywords.includes(userQuery) ||
      (userQuery.split(" ").length <= 2 &&
        greetingKeywords.some((g) => userQuery.includes(g)));

    if (isOnlyGreeting) {
      const greetings = [
        "Hai juga! 👋 Aku Eco Assistant dari Daurin, siap bantu kamu eksplor dunia daur ulang. Ada yang bisa aku bantuin hari ini?",
        "Halo! 🌱 Senang kamu mampir! Aku Eco Assistant Daurin. Kamu lagi nyari info apa nih seputar limbah atau kerajinan?",
        "Wih, halo! Aku Eco Assistant, nih. Ada kabar baik apa nih dari dunia daur ulang yang bisa aku bantu cariin infonya buat kamu?",
        "Eh, ada kamu! 👋 Aku Eco Assistant, nih. Yuk, ngobrolin daur ulang atau apa aja yang kamu mau tahu!",
        "Selamat datang di Daurin! Aku siap bantu kamu dengan info-info seru seputar limbah dan kerajinan. Mau mulai dari mana?",
      ];
      directResponseContent =
        greetings[Math.floor(Math.random() * greetings.length)];
    }

    if (directResponseContent) {
      console.log("↩️ Sending direct response:", directResponseContent);
      const encoder = new TextEncoder();
      const readableStream = new ReadableStream({
        start(controller) {
          controller.enqueue(
            encoder.encode(`data: ${directResponseContent}\n\n`)
          );
          controller.close();
        },
      });
      return new Response(readableStream, {
        headers: {
          "Content-Type": "text/event-stream; charset=utf-8",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        },
      });
    }

    let context = "";
    let structuredData: any = null;
    let dataType: string | null = null;

    try {
      // 1. Limbah/Waste Offers
      if (
        userQuery.includes("limbah") ||
        userQuery.includes("sampah") ||
        userQuery.includes("waste") ||
        userQuery.includes("offer") ||
        userQuery.includes("penawaran")
      ) {
        const wasteOffers = await prisma.wasteOffer.findMany({
          where: { status: "AVAILABLE" },
          orderBy: { createdAt: "desc" },
          take: 8,
          select: {
            id: true,
            title: true,
            description: true,
            materialType: true,
            weight: true,
            offerType: true,
            suggestedPrice: true,
            address: true,
            status: true,
            createdAt: true,
            user: {
              select: {
                name: true,
                phone: true,
              },
            },
          },
        });

        if (wasteOffers.length > 0) {
          // Structured data untuk cards
          structuredData = wasteOffers.map((w) => ({
            id: w.id,
            title: w.title,
            materialType: getMaterialTypeText(w.materialType),
            weight: w.weight || 0,
            offerType: w.offerType,
            price: w.suggestedPrice,
            address: w.address,
            userName: w.user.name || "Pengguna",
            userPhone: w.user.phone || "",
            description: w.description,
          }));
          dataType = "WASTE_OFFERS";

          // Context untuk AI
          context = `DATA PENAWARAN LIMBAH TERBARU:\n\n${wasteOffers
            .map((w, i) => {
              const offerType = w.offerType === "SELL" ? "Dijual" : "Donasi";
              const price = w.suggestedPrice
                ? formatPrice(w.suggestedPrice)
                : "Gratis (Donasi)";
              return `${i + 1}. ${w.title}
   - Jenis: ${getMaterialTypeText(w.materialType)}
   - Berat: ${w.weight ? `${w.weight} kg` : "Belum ditentukan"}
   - ${offerType}: ${price}
   - Lokasi: ${w.address}
   - Penawar: ${w.user.name || "Pengguna"}`;
            })
            .join("\n\n")}`;
        }
      }

      // 2. Pengepul
      else if (
        userQuery.includes("pengepul") ||
        userQuery.includes("collector") ||
        userQuery.includes("ambil limbah") ||
        userQuery.includes("daurin")
      ) {
        const pengepuls = await prisma.pengepulProfile.findMany({
          where: { approvalStatus: "APPROVED" },
          orderBy: { averageRating: "desc" },
          take: 6,
          select: {
            id: true,
            companyName: true,
            specializedMaterials: true,
            operatingArea: true,
            operatingRadius: true,
            description: true,
            whatsappNumber: true,
            averageRating: true,
            totalCollections: true,
            totalWeight: true,
            workingHours: true,
            user: {
              select: {
                name: true,
                phone: true,
                address: true,
              },
            },
          },
        });

        if (pengepuls.length > 0) {
          // Structured data untuk cards
          structuredData = pengepuls.map((p) => ({
            id: p.id,
            name: p.companyName || p.user.name,
            rating: p.averageRating,
            materials: p.specializedMaterials.map((m) =>
              getMaterialTypeText(m)
            ),
            areas: p.operatingArea,
            phone: p.whatsappNumber || p.user.phone || "",
            collections: p.totalCollections,
            totalWeight: p.totalWeight,
            workingHours: p.workingHours,
          }));
          dataType = "PENGEPUL";

          // Context untuk AI
          context = `DATA PENGEPUL TERVERIFIKASI:\n\n${pengepuls
            .map((p, i) => {
              const materials = p.specializedMaterials
                .map((m) => getMaterialTypeText(m))
                .join(", ");
              const areas = p.operatingArea.join(", ");
              return `${i + 1}. ${p.companyName || p.user.name}
   - Rating: ${p.averageRating.toFixed(1)}/5.0 (${p.totalCollections} koleksi)
   - Spesialisasi: ${materials}
   - Area Operasi: ${areas}
   - Total Terkumpul: ${p.totalWeight} kg`;
            })
            .join("\n\n")}`;
        }
      }

      // 3. Pengrajin dan Produk Kerajinan
      else if (
        userQuery.includes("pengrajin") ||
        userQuery.includes("kerajinan") ||
        userQuery.includes("craft") ||
        userQuery.includes("produk") ||
        userQuery.includes("buatan")
      ) {
        const products = await prisma.craftProduct.findMany({
          where: { status: "PUBLISHED", stock: { gt: 0 } },
          orderBy: { createdAt: "desc" },
          take: 8,
          select: {
            id: true,
            title: true,
            description: true,
            price: true,
            materials: true,
            dimensions: true,
            stock: true,
            category: true,
            customizable: true,
            pengrajin: {
              select: {
                user: {
                  select: {
                    name: true,
                  },
                },
                workshopAddress: true,
                averageRating: true,
                instagramHandle: true,
                whatsappNumber: true,
              },
            },
          },
        });

        if (products.length > 0) {
          // Structured data untuk cards
          structuredData = products.map((p) => ({
            id: p.id,
            title: p.title,
            price: p.price,
            materials: p.materials.map((m) => getMaterialTypeText(m)),
            category: p.category,
            stock: p.stock,
            customizable: p.customizable,
            pengrajinName: p.pengrajin.user.name,
            pengrajinRating: p.pengrajin.averageRating,
            pengrajinPhone: p.pengrajin.whatsappNumber || "",
            description: p.description,
          }));
          dataType = "PRODUCTS";

          // Context untuk AI
          context = `DATA PRODUK KERAJINAN DAUR ULANG:\n\n${products
            .map((p, i) => {
              const materials = p.materials
                .map((m) => getMaterialTypeText(m))
                .join(", ");
              return `${i + 1}. ${p.title}
   - Harga: ${formatPrice(p.price)}
   - Bahan: ${materials}
   - Stok: ${p.stock} pcs
   - Pengrajin: ${p.pengrajin.user.name}
   - Rating: ${p.pengrajin.averageRating.toFixed(1)}/5.0`;
            })
            .join("\n\n")}`;
        }
      }

      // 4. Custom/Booking - Pengrajin Profiles
      else if (
        userQuery.includes("custom") ||
        userQuery.includes("booking") ||
        userQuery.includes("pesan") ||
        userQuery.includes("buat") ||
        userQuery.includes("order")
      ) {
        const pengrajins = await prisma.pengrajinProfile.findMany({
          where: { approvalStatus: "APPROVED" },
          orderBy: { averageRating: "desc" },
          take: 6,
          select: {
            id: true,
            craftTypes: true,
            specializedMaterials: true,
            yearsOfExperience: true,
            description: true,
            whatsappNumber: true,
            instagramHandle: true,
            workshopAddress: true,
            averageRating: true,
            totalBookings: true,
            user: {
              select: {
                name: true,
              },
            },
          },
        });

        if (pengrajins.length > 0) {
          // Structured data untuk cards
          structuredData = pengrajins.map((p) => ({
            id: p.id,
            name: p.user.name,
            rating: p.averageRating,
            craftTypes: p.craftTypes,
            materials: p.specializedMaterials.map((m) =>
              getMaterialTypeText(m)
            ),
            experience: p.yearsOfExperience || 0,
            bookings: p.totalBookings,
            phone: p.whatsappNumber || "",
            instagram: p.instagramHandle,
            workshopAddress: p.workshopAddress,
          }));
          dataType = "PENGRAJIN";

          // Context untuk AI
          context = `DATA PENGRAJIN UNTUK LAYANAN CUSTOM:\n\n${pengrajins
            .map((p, i) => {
              const craftTypes = p.craftTypes.join(", ");
              const materials = p.specializedMaterials
                .map((m) => getMaterialTypeText(m))
                .join(", ");
              return `${i + 1}. ${p.user.name}
   - Rating: ${p.averageRating.toFixed(1)}/5.0 (${p.totalBookings} booking)
   - Keahlian: ${craftTypes}
   - Spesialisasi Bahan: ${materials}
   - Pengalaman: ${
     p.yearsOfExperience ? `${p.yearsOfExperience} tahun` : "Berpengalaman"
   }`;
            })
            .join("\n\n")}`;
        }
      }

      // 5. Statistik Platform
      else if (
        userQuery.includes("statistik") ||
        userQuery.includes("berapa") ||
        userQuery.includes("total") ||
        userQuery.includes("data") ||
        userQuery.includes("jumlah")
      ) {
        const [
          totalWasteOffers,
          totalPengepuls,
          totalPengrajins,
          totalProducts,
          totalUsers,
          totalWasteCollected,
        ] = await Promise.all([
          prisma.wasteOffer.count({ where: { status: "AVAILABLE" } }),
          prisma.pengepulProfile.count({
            where: { approvalStatus: "APPROVED" },
          }),
          prisma.pengrajinProfile.count({
            where: { approvalStatus: "APPROVED" },
          }),
          prisma.craftProduct.count({ where: { status: "PUBLISHED" } }),
          prisma.user.count({ where: { isActive: true } }),
          prisma.pengepulProfile.aggregate({
            _sum: { totalWeight: true },
          }),
        ]);

        const materialStats = await prisma.wasteOffer.groupBy({
          by: ["materialType"],
          where: { status: { in: ["AVAILABLE", "RESERVED", "TAKEN"] } },
          _count: { materialType: true },
          orderBy: { _count: { materialType: "desc" } },
          take: 5,
        });

        const materialList = materialStats
          .map(
            (m, i) =>
              `${i + 1}. ${getMaterialTypeText(m.materialType)}: ${
                m._count.materialType
              } penawaran`
          )
          .join("\n");

        context = `STATISTIK PLATFORM Daurin:

Limbah & Daur Ulang:
- Penawaran Limbah Aktif: ${totalWasteOffers}
- Total Limbah Terkumpul: ${totalWasteCollected._sum.totalWeight || 0} kg
- Pengepul Terverifikasi: ${totalPengepuls}

Kerajinan:
- Produk Tersedia: ${totalProducts}
- Pengrajin Terverifikasi: ${totalPengrajins}

Komunitas:
- Total Pengguna Aktif: ${totalUsers}

Jenis Limbah Populer:
${materialList}`;
      }

      // 6. Lokasi
      else if (
        userQuery.includes("terdekat") ||
        userQuery.includes("dekat") ||
        userQuery.includes("lokasi") ||
        userQuery.includes("sekitar")
      ) {
        context = `Untuk mencari yang terdekat, aku butuh tahu lokasi kamu sekarang. Bisa kasih tahu kota/kabupaten atau izinkan akses lokasi? 😉`;
      }

      // 7. Tips
      else if (
        userQuery.includes("tips") ||
        userQuery.includes("cara") ||
        userQuery.includes("bagaimana") ||
        userQuery.includes("tutorial") ||
        userQuery.includes("info daur ulang")
      ) {
        context = `TIPS DAUR ULANG & PENGELOLAAN LIMBAH DARI Daurin:

Memilah Limbah Itu Penting! 🗑️
- Pisahkan berdasarkan jenis (plastik, kertas, logam, organik, dll.).
- Pastikan limbah bersih dari sisa makanan/cairan biar nggak bau dan lebih gampang diproses.
- Kalau bisa, lipat atau kempa limbah yang besar (misal botol plastik) untuk menghemat ruang.
- Simpan di tempat kering dan tertutup sampai siap dikumpulkan.

Jual atau Donasikan Limbahmu! 💰💖
- Kumpulkan dalam jumlah yang cukup (biasanya minimal 5-10kg baru layak diangkut).
- Ambil foto limbahmu dengan jelas untuk penawaran di platform.
- Tentukan harga yang wajar atau pilih opsi donasi untuk kebaikan lingkungan.
- Hubungi pengepul terverifikasi di Daurin yang dekat dengan lokasimu.

Kreasikan Limbah Jadi Kerajinan! 🎨✨
- Butuh inspirasi? Yuk, cek produk-produk pengrajin kami di platform!
- Pilih bahan limbah yang masih bagus dan punya potensi untuk diubah.
- Kalau mau bikin yang unik, konsultasi aja dengan pengrajin kami untuk custom order.
- Mulai dari proyek sederhana dulu, siapa tahu jadi hobi baru!

Manfaat Daur Ulang yang Keren! 🌍💚
- Mengurangi volume sampah di TPA (Tempat Pemrosesan Akhir), bumi jadi lebih lega!
- Menghemat sumber daya alam baru karena kita pakai ulang bahan yang sudah ada.
- Membuka lapangan kerja baru di sektor ekonomi kreatif dan pengelolaan limbah.
- Menghasilkan produk unik, kreatif, dan bernilai jual tinggi.

Yuk, mulai aksi daur ulangmu sekarang! 😉`;
      }
    } catch (dbError) {
      console.error("❌ Database query error:", dbError);
      context =
        "SYSTEM_ERROR: Database tidak dapat diakses saat ini. Maaf ya, aku lagi ada kendala teknis dari sisi database. Coba lagi nanti ya!";
    }

    console.log("📊 Context fetched:", context ? "Yes" : "No");
    console.log("📏 Context length:", context.length);
    console.log("🎴 Structured data:", structuredData ? dataType : "None");

    // System message untuk AI
    const systemMessage: CoreMessage = {
      role: "system",
      content: `Kamu adalah Eco Assistant dari Daurin yang ramah, asik, dan suka membantu! 🌱

PERSONALITY:
- Pakai "aku/kamu".
- Respon dengan antusias tentang sustainability dan daur ulang.
- Sering pakai emoji yang relevan (tapi jangan berlebihan).
- Gunakan bahasa yang casual dan dekat dengan anak muda (misal: "yuk", "spill aja", "mantap").
- Jika diberikan data, jelaskan dengan natural dan helpful.
- Jika tidak ada data spesifik, jelaskan tentang Daurin dan fitur-fiturnya dengan engaging.

TENTANG Daurin:
Daurin adalah platform ekonomi sirkular untuk daur ulang limbah di Indonesia. Di sini pengguna bisa:
- Jual atau donasikan limbah ke pengepul terverifikasi
- Beli produk kerajinan unik dari bahan daur ulang
- Pesan custom craft dari pengrajin berpengalaman
- Dapat tips dan edukasi tentang pengelolaan limbah

CAPABILITIES:
- Info pengepul limbah terverifikasi
- Produk kerajinan daur ulang
- Custom craft booking
- Tips daur ulang & pengelolaan limbah
- Statistik platform Daurin

RESPONSE STYLE:
- Natural & conversational
- Variasi jawaban, jangan monoton
- Gunakan markdown untuk struktur rapi
- Selalu helpful dan encouraging
- Jika ada card data yang ditampilkan, sebutkan bahwa user bisa langsung klik untuk info lebih lanjut

${
  context
    ? `\nDATA TERSEDIA:\n${context}\n\nJelaskan data ini dengan cara yang menarik dan mudah dipahami! ${
        structuredData
          ? "Card visual sudah ditampilkan untuk user, jadi fokus jelaskan informasi penting dan ajak mereka untuk mengeksplorasi card tersebut."
          : ""
      }`
    : "\nBelum ada data spesifik yang diminta. Jawab pertanyaan user dengan informasi umum tentang Daurin atau bantu arahkan mereka untuk bertanya lebih spesifik."
}`,
    };

    console.log("🤖 Calling Groq API...");

    const result = await streamText({
      model: groq("llama-3.1-8b-instant"),
      messages: [systemMessage, ...messages],
      temperature: 0.8,
      maxRetries: 3,
    });

    console.log("✅ Groq API success");

    // Kumpulkan semua text dulu
    let fullText = "";
    for await (const chunk of result.textStream) {
      fullText += chunk;
    }

    // Kirim sebagai SSE dengan structured data
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      start(controller) {
        // Kirim structured data dulu jika ada
        if (structuredData && dataType) {
          controller.enqueue(
            encoder.encode(
              `data: __CARD_DATA__${dataType}__${JSON.stringify(
                structuredData
              )}\n\n`
            )
          );
        }

        // Kirim text response
        controller.enqueue(encoder.encode(`data: ${fullText}\n\n`));
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("❌ Error dari Groq API atau server:", error);

    if (error instanceof Groq.APIError) {
      console.error("Groq API Error details:", {
        status: error.status,
        message: error.message,
        code: (error as any).code,
      });
      return new Response(
        JSON.stringify({
          error: true,
          message: `Duh, ada masalah dari Groq nih: ${error.message}. Coba lagi bentar ya! 🙏`,
        }),
        {
          status: error.status || 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    console.error("Unknown error type:", error);
    return new Response(
      JSON.stringify({
        error: true,
        message:
          "Oops, AI-ku lagi ada kendala teknis nih. Coba lagi sebentar ya! 🤖💫",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
