// components/ui/LoadingOverlay.tsx
"use client";

import { LoadingOverlay as MantineLoadingOverlay } from "@mantine/core";

interface LoadingOverlayProps {
  visible: boolean;
}

export default function LoadingOverlay({ visible }: LoadingOverlayProps) {
  return (
    <MantineLoadingOverlay
      visible={visible}
      zIndex={1000}
      overlayProps={{ radius: "sm", blur: 2 }}
    />
  );
}
