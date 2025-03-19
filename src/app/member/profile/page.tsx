"use client";

import AuthenticatedPage from "@src/components/AuthenticatedPage";
import { UserRoles } from "@src/types/roles";

export default function MemberProfilePage() {
  return (
    <AuthenticatedPage requiredRole={UserRoles.MEMBER}>
      <div>
        <h1>Member Profile</h1>
        <p>Welcome to your profile.</p>
      </div>
    </AuthenticatedPage>
  );
}
