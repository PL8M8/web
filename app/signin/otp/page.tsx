"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useProfileStore } from "@/modules/profile";

function VerifyOTPForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const verifyOTP = useProfileStore((state) => state.verifyOTP);
  const loading = useProfileStore((state) => state.loading);
  const error = useProfileStore((state) => state.error);

  const [otpCode, setOtpCode] = useState("");

  const handleVerifyOTP = async () => {
    try {
      await verifyOTP(email, otpCode);

      // Get the profile that was loaded after verification
      const profile = useProfileStore.getState().profile;
      if (profile?.username) {
        router.push(`/${profile.username}`);
      } else {
        // Fallback: if no profile/username, redirect to home
        router.push("/");
      }
    } catch (err: any) {
      console.error(err);
    }
  };

  return (
    <div>
      <h1>Verify OTP</h1>
      <section>
        <div>
          <label htmlFor="otp">Enter OTP</label>
          <input
            id="otp"
            type="text"
            value={otpCode}
            onChange={(e) => setOtpCode(e.target.value)}
          />
        </div>
        <button onClick={handleVerifyOTP} disabled={loading}>
          {loading ? "Verifying..." : "Verify OTP"}
        </button>
      </section>
      {error && <p>{error}</p>}
    </div>
  );
}

export default function VerifyOTPPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyOTPForm />
    </Suspense>
  );
}