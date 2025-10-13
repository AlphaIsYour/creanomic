/* eslint-disable @typescript-eslint/no-unused-vars */
// app/marketplace/components/FilterSidebar.tsx
"use client";

import {
  Paper,
  Title,
  Checkbox,
  RangeSlider,
  Button,
  Group,
  Text,
  Box,
} from "@mantine/core";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { IconFilter } from "@tabler/icons-react";

interface FilterSidebarProps {
  initialParams?: Record<string, string | string[] | undefined>;
}

export default function FilterSidebar({ initialParams }: FilterSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // State untuk filter
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000]); // Example range
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);

  // Dummy data untuk filter
  const categories = [
    "Dekorasi",
    "Perhiasan",
    "Pakaian",
    "Alat Dapur",
    "Furniture",
    "Lainnya",
  ];
  const materials = ["PLASTIC", "GLASS", "METAL", "PAPER", "WOOD", "TEXTILE"]; // Dari MaterialType enum

  useEffect(() => {
    // Initialize filters from URL params
    setSelectedCategories(searchParams.getAll("category"));
    setSelectedMaterials(searchParams.getAll("material"));
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    setPriceRange([
      minPrice ? parseFloat(minPrice) : 0,
      maxPrice ? parseFloat(maxPrice) : 1000000,
    ]);
  }, [searchParams]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleMaterialChange = (material: string) => {
    setSelectedMaterials((prev) =>
      prev.includes(material)
        ? prev.filter((m) => m !== material)
        : [...prev, material]
    );
  };

  const applyFilters = () => {
    const newParams = new URLSearchParams(searchParams.toString());

    // Apply categories
    newParams.delete("category");
    selectedCategories.forEach((c) => newParams.append("category", c));

    // Apply materials
    newParams.delete("material");
    selectedMaterials.forEach((m) => newParams.append("material", m));

    // Apply price range
    newParams.set("minPrice", priceRange[0].toString());
    newParams.set("maxPrice", priceRange[1].toString());

    router.push(`${pathname}?${newParams.toString()}`);
  };

  const resetFilters = () => {
    setSelectedCategories([]);
    setPriceRange([0, 1000000]);
    setSelectedMaterials([]);
    router.push(pathname); // Clear all params
  };

  return (
    <Paper withBorder p="md" radius="md">
      <Title order={4} mb="md" mt={0}>
        <Group gap="xs">
          <IconFilter size={18} /> Filter Produk
        </Group>
      </Title>

      <Box mb="lg">
        <Text fw={500} mb="xs">
          Kategori
        </Text>
        {categories.map((cat) => (
          <Checkbox
            key={cat}
            label={cat}
            checked={selectedCategories.includes(cat)}
            onChange={() => handleCategoryChange(cat)}
            mb={4}
          />
        ))}
      </Box>

      <Box mb="lg">
        <Text fw={500} mb="xs">
          Bahan
        </Text>
        {materials.map((mat) => (
          <Checkbox
            key={mat}
            label={mat}
            checked={selectedMaterials.includes(mat)}
            onChange={() => handleMaterialChange(mat)}
            mb={4}
          />
        ))}
      </Box>

      <Box mb="lg">
        <Text fw={500} mb="xs">
          Harga (Rp)
        </Text>
        <RangeSlider
          value={priceRange}
          onChange={setPriceRange}
          min={0}
          max={2000000}
          step={50000}
          label={(value) => `Rp${value.toLocaleString("id-ID")}`}
          thumbSize={14}
          marks={[
            { value: 0, label: "0" },
            { value: 500000, label: "500k" },
            { value: 1000000, label: "1M" },
            { value: 2000000, label: "2M+" },
          ]}
        />
        <Group justify="space-between" mt="xs">
          <Text size="sm">Min: Rp{priceRange[0].toLocaleString("id-ID")}</Text>
          <Text size="sm">Max: Rp{priceRange[1].toLocaleString("id-ID")}</Text>
        </Group>
      </Box>

      <Group grow mt="lg">
        <Button onClick={applyFilters}>Terapkan</Button>
        <Button variant="outline" onClick={resetFilters}>
          Reset
        </Button>
      </Group>
    </Paper>
  );
}
