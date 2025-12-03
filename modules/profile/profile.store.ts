import { create } from "zustand";
import type { User } from "@supabase/supabase-js";
import type { ProfilePayload, Vehicle } from "./profile.service";
import * as ProfileService from "./profile.service";

interface ProfileState {
    user: User | null;
    profile: ProfilePayload | null;
    loading: boolean;
    error: string | null;

    loadCurrentUser: () => Promise<void>;
    sendOTP: (email: string) => Promise<void>;
    verifyOTP: (email: string, token: string) => Promise<void>;
    logout: () => Promise<void>;

    loadProfileByUsername: (username: string) => Promise<void>;
    ensureProfileExists: (userId: string) => Promise<ProfilePayload>;
    updateProfileTable: (userId: string, payload: ProfilePayload) => Promise<ProfilePayload>;
}

export const useProfileStore = create<ProfileState>((set, get) => ({
    user: null,
    profile: null,
    loading: false,
    error: null,

    // ---------------- Auth ----------------
    loadCurrentUser: async () => {
        try {
            const user = await ProfileService.getCurrentUser();
            set({ user });
        } catch (err: any) {
            // Silently handle no session - this is fine for public access
            if (err.message?.includes("session") || err.message?.includes("Auth")) {
                set({ user: null });
            } else {
                console.error("Failed to load current user:", err);
                set({ user: null });
            }
        }
    },
    sendOTP: async (email: string) => {
        set({ loading: true, error: null });
        try {
            await ProfileService.sendOTP(email);
        } catch (err: any) {
            set({ error: err.message });
        } finally {
            set({ loading: false });
        }
    },

    verifyOTP: async (email: string, token: string) => {
        set({ loading: true, error: null });
        try {
            const user = await ProfileService.verifyOTP(email, token);
            set({ user });
            
            // Ensure profile exists for this user
            if (user) {
                const profile = await get().ensureProfileExists(user.id);
                set({ profile });
            }
        } catch (err: any) {
            set({ error: err.message });
        } finally {
            set({ loading: false });
        }
    },

    logout: async () => {
        set({ loading: true, error: null });
        try {
            await ProfileService.closeSession();
            set({ user: null, profile: null });
        } catch (err: any) {
            set({ error: err.message });
        } finally {
            set({ loading: false });
        }
    },

    // ---------------- Profile ----------------
    loadProfileByUsername: async (username: string) => {
        set({ loading: true, error: null });
        try {
            const data = await ProfileService.getProfileByUsername(username);
            
            if (!data) {
                set({ error: "Profile not found", profile: null });
            } else {
                set({ profile: data });
            }
        } catch (err: any) {
            set({ error: err.message, profile: null });
        } finally {
            set({ loading: false });
        }
    },

    ensureProfileExists: async (userId: string) => {
        try {
            let profile = await ProfileService.getProfileByUserId(userId);
            
            // If no profile exists, create a default one
            if (!profile) {
                profile = await ProfileService.createDefaultProfile(userId);
            }
            
            return profile;
        } catch (err: any) {
            throw new Error(`Failed to ensure profile exists: ${err.message}`);
        }
    },

    updateProfileTable: async (userId: string, payload: ProfilePayload) => {
        set({ loading: true, error: null });
        try {
            const data = await ProfileService.updateProfileTable(userId, payload);
            set({ profile: data });
            return data;
        } catch (err: any) {
            set({ error: err.message });
            throw err;
        } finally {
            set({ loading: false });
        }
    },
}));