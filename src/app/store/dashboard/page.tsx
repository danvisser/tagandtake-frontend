"use client";

import AuthenticatedPage from "@src/components/AuthenticatedPage";
import { UserRoles } from "@src/types/roles";

export default function StoreDashboard() {
  return (
    <AuthenticatedPage requiredRole={UserRoles.STORE}>
      <div>
        <h1>Store Dashboard</h1>
        <p>Welcome to your store panel.</p>
      </div>
    </AuthenticatedPage>
  );
}
