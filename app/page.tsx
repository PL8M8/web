"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useProfileStore } from "@/modules/profile";

export default function Page() {
  const router = useRouter();
  const { user, profile, initialized, initialize } = useProfileStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (initialized && user && profile?.username) {
      router.replace(`/${profile.username}`);
    }
  }, [initialized, user, profile, router]);

  if (!initialized) return <div>Loading...</div>;

  return (
    <div>
      <h1>Car Listing Tool v1</h1>
      <p>
        Ditch the struggle of writing the perfect vehicle listing. Add your car details once, 
        and we'll craft a ready-to-go listing for anywhere you want to sell.
      </p>
      <p>
        Keep all your car listings in one spot—easy to copy, reference, and manage.
      </p>
      <Link href="/signin">Sign in to get Started</Link>
    </div>
  );
}