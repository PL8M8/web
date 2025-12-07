"use client"
import { useState } from "react"
import { supabase } from "@/utils/supabase/client"
import { useProfileStore } from "@/modules/profile"

export const VehicleImageUpload = () => {
    const [imageFiles, setImageFiles] = useState<File[]>([])
    const [uploads, setUploads] = useState<string[]>([])
    const [previews, setPreviews] = useState<string[]>([])
    const [uploading, setUploading] = useState(false)

    const user = useProfileStore(state => state.user)   // ✅ Get user from store

    const handleImageChange = ({ target }: any) => {
        const files = Array.from(target.files) as File[]
        setImageFiles(files)
        setPreviews(files.map(file => URL.createObjectURL(file)))
    }

    const uploadVehicleImages = async (files: File[]) => {
        if (!files.length || !user) return []

        setUploading(true)
        const uploadedFiles: string[] = []

        try {
            for (const file of files) {
                const fileName = `${user.id}/${Date.now()}-${file.name}`

                const { error } = await supabase.storage
                    .from("vehicle-images")
                    .upload(fileName, file, { upsert: false })

                if (error) throw error
                uploadedFiles.push(fileName)
            }

            setUploads(prev => [...prev, ...uploadedFiles])
        } catch (err) {
            console.error("Upload error:", err)
        } finally {
            setUploading(false)
        }
    }

    const handleImageSaving = () => {
        uploadVehicleImages(imageFiles)
    }

    const removePreview = (index: number) => {
        setImageFiles(prev => prev.filter((_, i) => i !== index))
        setPreviews(prev => prev.filter((_, i) => i !== index))
    }

    return (
        <div>
            <input 
                type="file" 
                accept="image/*"
                onChange={handleImageChange}
            />

            {previews.length > 0 && (
                <div>
                    <button onClick={handleImageSaving} disabled={uploading}>
                        {uploading ? "Uploading..." : "Submit Images"}
                    </button>
                </div>
            )}
        </div>
    )
}
