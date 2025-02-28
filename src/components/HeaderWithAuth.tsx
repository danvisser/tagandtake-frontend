"use client";

import { useEffect, useState } from "react";
import Header from "@src/components/Header";
import { useAuthStore } from "@src/stores/authStore";

export default function HeaderWithAuth() {
  const { role, initializeAuth } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      await initializeAuth();
      setIsLoading(false);
    };

    init();
  }, [initializeAuth]);

  if (isLoading) {
    return <Header variant="public" />;
  }

  return (
    <Header variant={role === "member" || role === "store" ? role : "public"} />
  );
}
