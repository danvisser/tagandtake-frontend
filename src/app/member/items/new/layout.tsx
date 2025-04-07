import PermissionGate from "@src/components/PermissionGate";
import { UserRoles } from "@src/types/roles";

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PermissionGate allowedRole={UserRoles.MEMBER}>{children}</PermissionGate>
  );
}
