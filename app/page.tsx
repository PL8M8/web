"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useProfileStore } from "@/modules/profile";

export default function Page() {
  const router = useRouter();
  const { user } = useProfileStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      if (user) {
        setLoading(false);
        router.replace(`/${user.id}`);
        return;
      }

      setLoading(false);
    };

    init();
  }, [user, router]);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Car Listing Tool v1</h1>
      <p>
        Ditch the struggle of writing the perfect vehicle listing. Add your car details once, 
        and we’ll craft a ready-to-go listing for anywhere you want to sell.
      </p>
      <p>
        Keep all your car listings in one spot—easy to copy, reference, and manage.
      </p>
      <Link href="/signin">Sign in to get Started</Link>
    </div>
  );
}
