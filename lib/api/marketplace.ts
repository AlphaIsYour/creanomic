// lib/api/marketplace.ts
import { API_BASE_URL } from "@/config/constants";
import {
  CraftProduct,
  CartItem,
  Order,
  OrderItem,
  ServiceBooking,
  Review,
  User,
  PengrajinProfile,
  MaterialType,
  PaymentMethod,
  Transaction,
} from "@prisma/client";

// Extend Prisma types with relations for API responses
export type ProductWithRelations = CraftProduct & {
  pengrajin: {
    id: string;
    user: { name: string; image: string | null };
    totalProducts: number;
    averageRating: number;
    instagramHandle?: string | null;
  };
  reviews: ReviewWithReviewer[];
};

export type ReviewWithReviewer = Review & {
  reviewer: { id: string; name: string | null; image: string | null };
};

export type CartItemWithProduct = CartItem & {
  product: Pick<CraftProduct, "id" | "title" | "price" | "images" | "stock">;
};

export type OrderWithDetails = Order & {
  items: (OrderItem & {
    product: Pick<CraftProduct, "id" | "title" | "images" | "price"> & {
      pengrajin: { user: { name: string | null } };
    };
  })[];
  user: Pick<User, "id" | "name" | "email" | "phone">;
  transactions: Transaction[];
};

export type BookingWithDetails = ServiceBooking & {
  user: Pick<User, "id" | "name" | "email">;
  pengrajin:
    | (Pick<PengrajinProfile, "id" | "craftTypes"> & {
        user: Pick<User, "id" | "name" | "image" | "email">;
      })
    | null;
  transactions: Transaction[];
};

// --- Helper untuk API Requests ---
async function apiFetch<T>(
  url: string,
  options?: RequestInit
): Promise<{ data: T; totalPages?: number; currentPage?: number }> {
  const response = await fetch(`${API_BASE_URL}${url}`, options);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Something went wrong");
  }

  return response.json();
}

// --- Fungsi untuk Products ---

interface FetchProductsParams {
  category?: string | string[];
  material?: MaterialType | MaterialType[];
  minPrice?: number;
  maxPrice?: number;
  sort?: "newest" | "cheapest" | "expensive" | "popular";
  page?: number;
  limit?: number;
  search?: string;
}

export async function fetchProducts(params: FetchProductsParams = {}): Promise<{
  data: ProductWithRelations[];
  totalPages: number;
  currentPage: number;
}> {
  const query = new URLSearchParams();
  if (params.category) {
    (Array.isArray(params.category)
      ? params.category
      : [params.category]
    ).forEach((cat) => query.append("category", cat));
  }
  if (params.material) {
    (Array.isArray(params.material)
      ? params.material
      : [params.material]
    ).forEach((mat) => query.append("material", mat));
  }
  if (params.minPrice !== undefined)
    query.append("minPrice", params.minPrice.toString());
  if (params.maxPrice !== undefined)
    query.append("maxPrice", params.maxPrice.toString());
  if (params.sort) query.append("sort", params.sort);
  if (params.page) query.append("page", params.page.toString());
  if (params.limit) query.append("limit", params.limit.toString());
  if (params.search) query.append("search", params.search);

  const result = await apiFetch<{
    data: ProductWithRelations[];
    totalPages: number;
    currentPage: number;
  }>(`/api/marketplace/products?${query.toString()}`, { cache: "no-store" });

  return result.data;
}

export async function fetchProductById(
  productId: string
): Promise<ProductWithRelations | null> {
  try {
    const { data } = await apiFetch<ProductWithRelations>(
      `/api/marketplace/products/${productId}`
    );
    return data;
  } catch (error) {
    console.error(`Failed to fetch product ${productId}:`, error);
    return null;
  }
}

// --- Fungsi untuk Cart ---

export async function fetchCartItems(): Promise<CartItemWithProduct[]> {
  const { data } = await apiFetch<CartItemWithProduct[]>(
    `/api/marketplace/cart`,
    { cache: "no-store" }
  );
  return data;
}

export async function addToCart(
  productId: string,
  quantity: number
): Promise<CartItem> {
  const { data } = await apiFetch<CartItem>(`/api/marketplace/cart`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ productId, quantity }),
  });
  return data;
}

export async function updateCartItemQuantity(
  cartItemId: string,
  quantity: number
): Promise<CartItem> {
  const { data } = await apiFetch<CartItem>(
    `/api/marketplace/cart/${cartItemId}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity }),
    }
  );
  return data;
}

export async function removeCartItem(
  cartItemId: string
): Promise<{ message: string }> {
  const { data } = await apiFetch<{ message: string }>(
    `/api/marketplace/cart/${cartItemId}`,
    {
      method: "DELETE",
    }
  );
  return data;
}

// --- Fungsi untuk Orders ---

export async function fetchUserOrders(): Promise<OrderWithDetails[]> {
  const { data } = await apiFetch<OrderWithDetails[]>(
    `/api/marketplace/orders`,
    { cache: "no-store" }
  );
  return data;
}

export async function fetchOrderById(
  orderId: string
): Promise<OrderWithDetails | null> {
  try {
    const { data } = await apiFetch<OrderWithDetails>(
      `/api/marketplace/orders/${orderId}`
    );
    return data;
  } catch (error) {
    console.error(`Failed to fetch order ${orderId}:`, error);
    return null;
  }
}

interface CreateOrderPayload {
  shippingAddress: string;
  shippingCity?: string;
  shippingProvince?: string;
  shippingMethod?: string;
  paymentMethod: PaymentMethod;
  orderNotes?: string;
  items: { productId: string; quantity: number; notes?: string }[];
}

export async function createOrder(payload: CreateOrderPayload): Promise<Order> {
  const { data } = await apiFetch<Order>(`/api/marketplace/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return data;
}

// --- Fungsi untuk Bookings ---

export async function fetchUserBookings(): Promise<BookingWithDetails[]> {
  const { data } = await apiFetch<BookingWithDetails[]>(
    `/api/marketplace/bookings`,
    { cache: "no-store" }
  );
  return data;
}

export async function fetchBookingById(
  bookingId: string
): Promise<BookingWithDetails | null> {
  try {
    const { data } = await apiFetch<BookingWithDetails>(
      `/api/marketplace/bookings/${bookingId}`
    );
    return data;
  } catch (error) {
    console.error(`Failed to fetch booking ${bookingId}:`, error);
    return null;
  }
}

interface CreateBookingPayload {
  title: string;
  description: string;
  serviceType: string;
  materialType?: MaterialType;
  budget?: number;
  referenceImages?: string[];
  specifications?: Record<string, unknown>;
  deadline?: Date;
  address?: string;
  latitude?: number;
  longitude?: number;
  pengrajinId?: string;
}

export async function createBooking(
  payload: CreateBookingPayload
): Promise<ServiceBooking> {
  const { data } = await apiFetch<ServiceBooking>(`/api/marketplace/bookings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return data;
}
