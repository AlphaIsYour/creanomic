/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// app/marketplace/components/UserMenu.tsx (Client Component)
"use client";

import { Menu, Avatar, Text, rem, Group, Button } from "@mantine/core";
import {
  IconSettings,
  IconMessageCircle,
  IconLogin,
  IconLogout,
  IconPackage,
  IconTool,
} from "@tabler/icons-react";
import { signIn, signOut } from "next-auth/react";
import Link from "next/link";

interface UserMenuProps {
  session: any; // Sesuaikan tipe dengan Session dari next-auth
}

export default function UserMenu({ session }: UserMenuProps) {
  if (!session?.user) {
    return (
      <Button onClick={() => signIn()} variant="default">
        Login
      </Button>
    );
  }

  return (
    <Menu shadow="md" width={200}>
      <Menu.Target>
        <Avatar
          src={session.user.image || "/images/photo-placeholder.svg"}
          alt={session.user.name || "User"}
          radius="xl"
          style={{ cursor: "pointer" }}
        />
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item disabled>
          <Text size="sm" fw={500}>
            {session.user.name}
          </Text>
          <Text size="xs" c="dimmed">
            {session.user.email}
          </Text>
        </Menu.Item>

        <Menu.Divider />

        <Menu.Item
          leftSection={
            <IconPackage style={{ width: rem(14), height: rem(14) }} />
          }
          component={Link}
          href="/marketplace/my-orders"
        >
          Pesanan Saya
        </Menu.Item>
        <Menu.Item
          leftSection={<IconTool style={{ width: rem(14), height: rem(14) }} />}
          component={Link}
          href="/marketplace/booking"
        >
          Booking Layanan
        </Menu.Item>
        <Menu.Item
          leftSection={
            <IconSettings style={{ width: rem(14), height: rem(14) }} />
          }
          component={Link}
          href="/profile/" // Sesuaikan dengan path profil pengguna Anda
        >
          Pengaturan Akun
        </Menu.Item>
        {/* Tambahkan item menu lain sesuai peran pengguna */}
        {/* Misalnya, jika user adalah PENGRAJIN, tambahkan link ke dashboard pengrajin */}

        <Menu.Divider />

        <Menu.Item
          leftSection={
            <IconLogout style={{ width: rem(14), height: rem(14) }} />
          }
          onClick={() => signOut()}
          color="red"
        >
          Logout
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
