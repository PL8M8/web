"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useProfileStore } from "@/modules/profile";

export default function OTP() {
  const router = useRouter();
  const sendOTP = useProfileStore((state) => state.sendOTP);
  const loading = useProfileStore((state) => state.loading);
  const error = useProfileStore((state) => state.error);

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSendOTP = async () => {
    setMessage("");
    
    try {
      await sendOTP(email);
      setMessage("OTP sent! Check your email.");
      router.push("/signin/otp?email=" + encodeURIComponent(email));
    } catch (err: any) {
      setMessage(err.message || "Error sending OTP");
    }
  };

  return (
    <div>
      <h1>Sign In</h1>

      <section>
        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <button onClick={handleSendOTP} disabled={loading}>
          {loading ? "Sending..." : "Send OTP"}
        </button>
      </section>

      {(message || error) && <p>{message || error}</p>}
    </div>
  );
}
