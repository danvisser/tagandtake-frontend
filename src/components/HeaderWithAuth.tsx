"use client";

import Header from "@src/components/Header";
import { useAuth } from "@src/providers/AuthProvider";
import { UserRoles } from "@src/types/roles";

export default function HeaderWithAuth() {
  const { role, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  return (
    <Header
      variant={
        role === UserRoles.MEMBER || role === UserRoles.STORE ? role : "public"
      }
    />
  );
}
