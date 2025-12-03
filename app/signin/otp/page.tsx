"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/utils/supabase/client";

export default function VerifyOTPPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get("email") || "";

    const [otpCode, setOtpCode] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

const handleVerifyOTP = async () => {
    setLoading(true);
    setMessage("");

    const { data, error } = await supabase.auth.verifyOtp({
        email,
        token: otpCode,
        type: "magiclink",
    });

        if (error) {
        setMessage(error.message);
    } else {
        setMessage("Signed in successfully!");
        router.push("/listings");
    }

        setLoading(false);
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

        {message && <p>{message}</p>}
        </div>
    );
}
