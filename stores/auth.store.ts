import { create } from "zustand";
import type { User } from "@supabase/supabase-js";

interface AuthState {
    user: User | null;
    loading: boolean;

    setUser: (user: User | null) => void;
    setLoading: (v: boolean) => void;

    signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    loading: true,

    setUser: (user) => set({ user }),
    setLoading: (v) => set({ loading: v }),

    signOut: async () => {
        const { supabase } = await import("@/utils/supabase/client");

        const { error } = await supabase.auth.signOut();
        if (error) console.error("Sign-out error:", error.message);

        set({ user: null });
    },
}));
