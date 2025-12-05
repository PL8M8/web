import { getPublicBucketUrls } from "@/helpers/getPublicBucketUrls.helper";
import { supabase } from "@/utils/supabase/client";

const TABLE = "profiles";

export async function sendOTP(email: string) {
    const { data, error } = await supabase.auth.signInWithOtp({ email, options: { shouldCreateUser: true }, });
    if (error) throw new Error(error.message);
    return data;
}

export async function verifyOTP(email: string, token: string) {
    const { data, error } = await supabase.auth.verifyOtp({ email, token, type: "magiclink",});
    if (error) throw new Error(error.message);
    return data.user;
}

export async function closeSession() {
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(error.message);
    return true;
}

export async function getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error && !error.message?.includes("session")) { throw new Error(error.message); }
    return user;
}

export async function getProfileByUsername(username: string) {
    const { data, error } = await supabase
        .from(TABLE)
        .select("*")
        .eq("username", username)
        .single();
    
    if (error) {
        if (error.code === 'PGRST116') { return null;}
        throw new Error(error.message);
    }

    const profileWithImages = {
        ...data,
        vehicle_images: getPublicBucketUrls("vehicle-images", data.vehicle_images)
    }

    return profileWithImages;
}

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
    
    const profileWithImages = {
        ...data,
        vehicle_images: getPublicBucketUrls("vehicle-images", data.vehicle_images)
    }

    return profileWithImages;
}

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

export async function updateProfileTable(userId: string, payload: any) {
    const { data, error } = await supabase
        .from(TABLE)
        .update(payload)
        .eq("id", userId)
        .select()
        .single();
    
    if (error) throw new Error(error.message);
    return data;
}

export async function uploadVehicleImages(files: File[]): Promise<string[]> {
    if (!files.length) return [];
    
    const uploadedFiles: string[] = [];
    
    try {
        for (const file of files) {
            const fileName = `temp/${Date.now()}-${file.name}`;
            const { error } = await supabase.storage
                .from("vehicle-images")
                .upload(fileName, file, {
                    upsert: false
                });

            if (error) throw error;
            uploadedFiles.push(fileName);
        }
        return uploadedFiles;
    } catch (error) {
        console.error('Upload error:', error);
        throw error;
    }
}