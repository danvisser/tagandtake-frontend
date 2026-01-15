"use client";

import Header from "@src/components/Header";
import { useAuth } from "@src/providers/AuthProvider";
import { UserRoles } from "@src/types/roles";
import { useEffect } from "react";

export default function HeaderWithAuth() {
  const { role, isLoading, error } = useAuth();

  useEffect(() => {
    if (error) {
      console.error("Auth error in HeaderWithAuth:", error);
    }
  }, [error]);

  if (isLoading) {
    return null;
  }

  return (
    <Header
      variant={
        role === UserRoles.MEMBER || role === UserRoles.STORE ? role : UserRoles.GUEST
      }
    />
  );
}
