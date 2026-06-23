import { AppShell } from "@/components/app-shell";
import { FamilyGate } from "@/components/family-gate";

export default function AppShellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <FamilyGate>
      <AppShell>{children}</AppShell>
    </FamilyGate>
  );
}
