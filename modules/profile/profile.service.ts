import { supabase } from "@/utils/supabase/client";

export interface Vehicle {
    vin: string;
    year: number;
    make: string;
    model: string;
    color?: string;
    condition?: string;
    mileage?: number;
    listing_price?: number;
    image_uri?: string;
    description?: string;
}

export interface ProfilePayload {
    id?: string;
    username?: string;
    vehicle?: Vehicle;
}

const TABLE = "profiles";

// Auth
export async function sendOTP(email: string) {
    const { data, error } = await supabase.auth.signInWithOtp({
        email,
        options: { shouldCreateUser: true },
    });
    if (error) throw new Error(error.message);
    return data;
}

export async function verifyOTP(email: string, token: string) {
    const { data, error } = await supabase.auth.verifyOtp({
        email,
        token,
        type: "magiclink",
    });
    if (error) throw new Error(error.message);
    return data.user;
}

export async function closeSession() {
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(error.message);
    return true;
}

// Get current authenticated user
export async function getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    // Don't throw error if no session - return null for anonymous users
    if (error && !error.message?.includes("session")) {
        throw new Error(error.message);
    }
    return user;
}

// Profile - by username
export async function getProfileByUsername(username: string) {
    const { data, error } = await supabase
        .from(TABLE)
        .select("*")
        .eq("username", username)
        .single();
    
    if (error) {
        if (error.code === 'PGRST116') {
            return null;
        }
        throw new Error(error.message);
    }
    return data;
}

// Profile - by user ID (for creating default profile)
export async function getProfileByUserId(userId: string) {
    const { data, error } = await supabase
        .from(TABLE)
        .select("*")
        .eq("id", userId)
        .single();
    
    if (error) {
        if (error.code === 'PGRST116') {
            return null;
        }
        throw new Error(error.message);
    }
    return data;
}

// Create default profile (only needs user ID since username has default)
export async function createDefaultProfile(userId: string) {
    const { data, error } = await supabase
        .from(TABLE)
        .insert({ 
            id: userId,
            vehicle: {
                vin: "",
                year: 0,
                make: "",
                model: "",
                description: "",
            }
        })
        .select()
        .single();
    
    if (error) throw new Error(error.message);
    return data;
}

// Update profile by user ID
export async function updateProfileTable(userId: string, payload: ProfilePayload) {
    const updateData: any = {};
    
    if (payload.username !== undefined) {
        updateData.username = payload.username;
    }
    
    if (payload.vehicle !== undefined) {
        updateData.vehicle = payload.vehicle;
    }

    const { data, error } = await supabase
        .from(TABLE)
        .update(updateData)
        .eq("id", userId)
        .select()
        .single();
    
    if (error) throw new Error(error.message);
    return data;
}