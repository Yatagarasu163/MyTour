'use client';

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

export default function ClientRedirect() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const searchParams = useSearchParams();
    const error = searchParams.get("error");

    useEffect(() => {
        if (status === "loading") return;

        if (session?.user?.role === "admin") {
            router.push("/admin/dashboard");
        } else if (session?.user?.role === "superadmin") {
            router.push("/admin/dashboard");
        } else if (session?.user?.role === "user") {
            router.push("/user/test");
        }
    }, [session, status, error, router]);

    return null;
}
