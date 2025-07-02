"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SessionChecking() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Only redirect after loading is complete
    if (status === "unauthenticated") {
      router.push("/landing");
    }
  }, [status, router]);

  return null; // No UI needed, this is a guard component
}