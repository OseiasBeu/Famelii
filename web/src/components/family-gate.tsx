"use client";

import { useEffect, useState } from "react";
import { isFamilySetup } from "@/lib/storage/family";
import { FamilySetup } from "./family-setup";

export function FamilyGate({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [hasFamily, setHasFamily] = useState(false);

  useEffect(() => {
    isFamilySetup().then((ok) => {
      setHasFamily(ok);
      setReady(true);
    });
  }, []);

  function handleComplete() {
    setHasFamily(true);
  }

  if (!ready) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <p className="text-sm text-[var(--nu-muted)]">A carregar…</p>
      </div>
    );
  }

  if (!hasFamily) {
    return <FamilySetup onComplete={handleComplete} />;
  }

  return <>{children}</>;
}
