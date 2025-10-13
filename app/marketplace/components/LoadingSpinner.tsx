// components/ui/LoadingSpinner.tsx
import { Loader, Center } from "@mantine/core";

export default function LoadingSpinner() {
  return (
    <Center p="xl">
      <Loader size="md" />
    </Center>
  );
}
