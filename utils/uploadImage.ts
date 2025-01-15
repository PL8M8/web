import { v4 as uuidv4 } from 'uuid';
import { supabase } from './supabase'; // Assuming Supabase is initialized here
import imageCompression from 'browser-image-compression'

type UploadProps = {
    file: File;
    bucket: string;
    folder?: string;
};

export async function uploadImage({ file, bucket, folder }: UploadProps) {
    const fileName = file.name
    const fileExtension = fileName.slice(fileName.lastIndexOf(".") + 1)
    const path = `${folder ? folder + "/" : ""}${uuidv4()}.${fileExtension}`

    // compress the image
    try {
        file = await imageCompression(file, {
            maxSizeMB: 1
        })
    } catch (error) {
        console.error(error)
        return { imageUrl: "", error: "Image compression failed"}
    }

    console.log(' file after compression ', file)

    const { data, error } = await supabase.storage.from(bucket).upload(path, file)

    if (error) {
        return { imageUrl: "", error: "Image upload failed"}
    }

    const imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL!}/storage/v1/object/public/${bucket}/${data?.path}`

    return { 
        imageUrl, 
        error: null 
    }
}

// add ispending as disabled states to inputs