"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/utils/supabase/client";

export default function Page() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [welcome, setWelcome] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        // show welcome message briefly
        setWelcome(true);
        setLoading(false);

        // wait 1.5 seconds before redirect
        setTimeout(() => {
          router.replace("/listings");
        }, 1500);
      } else {
        setLoading(false);
      }
    };

    checkUser();
  }, [router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (welcome) {
    return <div>Welcome back!</div>;
  }

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
