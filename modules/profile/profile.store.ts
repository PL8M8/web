import { create } from "zustand";
import type { User } from "@supabase/supabase-js";
import * as ProfileService from "./profile.service";

export const useProfileStore = create<any>((set, get) => ({
    user: null,
    profile: null,
    loading: false,
    error: null,
    initialized: false,

    // ---------------- Initialization ----------------
    initialize: async () => {
        if (get().initialized) return;
        
        try {
            const user = await ProfileService.getCurrentUser();
            
            if (user) {
                const profile = await ProfileService.getProfileByUserId(user.id);
                set({ user, profile, initialized: true });
            } else {
                set({ user: null, profile: null, initialized: true });
            }
        } catch (err: any) {
            console.error("Failed to initialize:", err);
            set({ user: null, profile: null, initialized: true });
        }
    },

    // ---------------- Auth ----------------
    loadCurrentUser: async () => {
        try {
            const user = await ProfileService.getCurrentUser();
            set({ user });
        } catch (err: any) {
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
            
            if (!profile) {
                profile = await ProfileService.createDefaultProfile(userId);
            }
            
            return profile;
        } catch (err: any) {
            throw new Error(`Failed to ensure profile exists: ${err.message}`);
        }
    },

    updateProfileTable: async (userId: string, payload: any) => {
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

    // ---------------- Vehicle Images ----------------
    uploadVehicleImages: async (files: File[]) => {
        set({ loading: true, error: null });
        try {
            const uploadedFiles = await ProfileService.uploadVehicleImages(files);
            return uploadedFiles;
        } catch (err: any) {
            set({ error: err.message });
            throw err;
        } finally {
            set({ loading: false });
        }
    },
}));