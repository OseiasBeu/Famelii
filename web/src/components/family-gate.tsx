"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isSupabaseConfigured } from "@famelii/core";
import { db } from "@/lib/supabase/db";
import { isFamilySetup } from "@/lib/storage/family";
import { FamilySetup } from "./family-setup";

export function FamilyGate({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [hasFamily, setHasFamily] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function check() {
      if (isSupabaseConfigured()) {
        const supabase = db();
        if (supabase) {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) {
            router.replace("/auth");
            return;
          }
        }
      }
      setAuthChecked(true);

      const ok = await isFamilySetup();
      setHasFamily(ok);
      setReady(true);
    }
    check();
  }, [router]);

  if (!ready) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--nu-accent)] text-lg font-bold text-white">F</span>
          <p className="text-sm text-[var(--nu-muted)]">A carregar…</p>
        </div>
      </div>
    );
  }

  if (!hasFamily) {
    return <FamilySetup onComplete={() => setHasFamily(true)} />;
  }

  return <>{children}</>;
}
