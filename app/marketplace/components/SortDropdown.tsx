// app/marketplace/components/SortDropdown.tsx
"use client";

import { Select } from "@mantine/core";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { IconArrowsSort } from "@tabler/icons-react";

interface SortDropdownProps {
  initialSort?: string;
}

export default function SortDropdown({ initialSort }: SortDropdownProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [sortBy, setSortBy] = useState(initialSort || "newest");

  useEffect(() => {
    setSortBy(initialSort || "newest");
  }, [initialSort]);

  const handleSortChange = (value: string | null) => {
    const newSort = value || "newest";
    setSortBy(newSort);
    const params = new URLSearchParams(searchParams.toString());
    if (newSort !== "newest") {
      // Only add if not default
      params.set("sort", newSort);
    } else {
      params.delete("sort");
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <Select
      leftSection={<IconArrowsSort size={18} />}
      placeholder="Urutkan"
      data={[
        { value: "newest", label: "Terbaru" },
        { value: "cheapest", label: "Harga Terendah" },
        { value: "expensive", label: "Harga Tertinggi" },
        { value: "popular", label: "Terpopuler" },
      ]}
      value={sortBy}
      onChange={handleSortChange}
      w={200}
    />
  );
}
