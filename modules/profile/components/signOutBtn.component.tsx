"use client";

import { useProfileStore } from "@/modules/profile";
import { useRouter } from "next/navigation";

export default function SignOutButton() {
    const user = useProfileStore((state) => state.user);
    const logout = useProfileStore((state) => state.logout);

    const router = useRouter();

    if (!user) return null;

    const handleSignOut = async () => {
        await logout();
        router.replace("/");
    };

    return <button onClick={handleSignOut}>Sign Out</button>;
}
