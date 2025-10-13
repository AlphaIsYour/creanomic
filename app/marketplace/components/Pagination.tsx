// app/marketplace/components/Pagination.tsx
"use client";

import { Pagination as MantinePagination } from "@mantine/core";
import { useRouter, useSearchParams } from "next/navigation";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

export default function Pagination({
  currentPage,
  totalPages,
}: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`?${params.toString()}`);
  };

  if (totalPages <= 1) return null;

  return (
    <MantinePagination
      value={currentPage}
      onChange={handlePageChange}
      total={totalPages}
      siblings={1}
      boundaries={1}
      mt="xl"
    />
  );
}
