/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@mantine/core";
import { IconBrandWhatsapp } from "@tabler/icons-react";

interface CartItem {
  id: string;
  quantity: number;
  product: {
    id: string;
    title: string;
    price: number;
    images: string[];
    pengrajin: {
      whatsappNumber: string;
      user: {
        name: string;
      };
    };
  };
}

interface WhatsAppCheckoutButtonProps {
  cartItems: CartItem[];
  subtotal: number;
}

export default function WhatsAppCheckoutButton({
  cartItems,
  subtotal,
}: WhatsAppCheckoutButtonProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleCheckout = () => {
    if (!cartItems || cartItems.length === 0) {
      alert("Keranjang kosong!");
      return;
    }

    // Group items by pengrajin
    const itemsByPengrajin = cartItems.reduce((acc, item) => {
      const pengrajinId = item.product.pengrajin.user.name;
      if (!acc[pengrajinId]) {
        acc[pengrajinId] = {
          whatsapp: item.product.pengrajin.whatsappNumber,
          name: item.product.pengrajin.user.name,
          items: [],
        };
      }
      acc[pengrajinId].items.push(item);
      return acc;
    }, {} as Record<string, any>);

    // Jika hanya 1 pengrajin, langsung buka WhatsApp
    const pengrajinList = Object.values(itemsByPengrajin);

    if (pengrajinList.length === 1) {
      const pengrajin = pengrajinList[0];
      openWhatsApp(pengrajin.whatsapp, pengrajin.items, pengrajin.name);
    } else {
      // Jika multiple pengrajin, tanya user mau checkout yang mana
      const pengrajinNames = pengrajinList.map((p: any) => p.name).join(", ");
      alert(
        `Produk dari ${pengrajinList.length} pengrajin berbeda: ${pengrajinNames}.\n\nAnda akan diarahkan ke WhatsApp pengrajin pertama.`
      );
      const firstPengrajin = pengrajinList[0];
      openWhatsApp(
        firstPengrajin.whatsapp,
        firstPengrajin.items,
        firstPengrajin.name
      );
    }
  };

  const openWhatsApp = (
    whatsappNumber: string,
    items: CartItem[],
    pengrajinName: string
  ) => {
    if (!whatsappNumber) {
      alert(
        `Pengrajin ${pengrajinName} belum memiliki nomor WhatsApp. Silakan hubungi admin.`
      );
      return;
    }

    // Clean phone number (remove +, spaces, etc)
    const cleanNumber = whatsappNumber.replace(/[^0-9]/g, "");

    // Build message
    let message = `Halo ${pengrajinName}! \n\n`;
    message += `Saya ingin memesan produk berikut:\n\n`;

    items.forEach((item, index) => {
      const itemTotal = item.quantity * item.product.price;
      message += `${index + 1}. *${item.product.title}*\n`;
      message += `   Jumlah: ${item.quantity} pcs\n`;
      message += `   Harga: ${formatPrice(item.product.price)}\n`;
      message += `   Subtotal: ${formatPrice(itemTotal)}\n\n`;
    });

    const totalAmount = items.reduce(
      (sum, item) => sum + item.quantity * item.product.price,
      0
    );

    message += `━━━━━━━━━━━━━━━━━━\n`;
    message += `*TOTAL: ${formatPrice(totalAmount)}*\n\n`;
    message += `Mohon informasi ketersediaan stok dan estimasi pengiriman. Terima kasih!`;

    // Encode message for URL
    const encodedMessage = encodeURIComponent(message);

    // Open WhatsApp
    const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <Button
      fullWidth
      size="lg"
      color="green"
      leftSection={<IconBrandWhatsapp size={20} />}
      onClick={handleCheckout}
      disabled={!cartItems || cartItems.length === 0}
    >
      Checkout via WhatsApp
    </Button>
  );
}
