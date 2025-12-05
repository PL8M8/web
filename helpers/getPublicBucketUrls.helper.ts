import { supabase } from "@/utils/supabase/client"

export function getPublicBucketUrls(bucket: string, paths: string[]) {
    // guard clause bruh
    if (!paths || !paths.length) return []

    return paths.map(path => {
        return supabase.storage
            .from(bucket)
            .getPublicUrl(path)
            .data
            .publicUrl
    })
}