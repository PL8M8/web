import React from 'react'
import { uploadImage } from '@utils/uploadImage'

// finish
// https://www.youtube.com/watch?v=87JAdYPC2n0&t=439s

export default function ImageUploader() {
    const [imageUrls, setImageUrls] = React.useState([])
    const [isPending, startTransition] = React.useTransition()

    const convertLocalFilesToTemporaryBlobs = files => {
        // console.log('we have files', files)
        const filesArray = Array.from(files)
        // console.log('Files Array Bruh', filesArray)
        const convertedImageUrls = filesArray.map(file => URL.createObjectURL(file))
        // console.log('We have URLs Bruh', newImageUrls)
        return convertedImageUrls
    }


    const handleImageOnChange = e => {
        const files = e.target?.files
        if (files) {
            console.log('files before url conversion is', files)
            const newImageUrls = convertLocalFilesToTemporaryBlobs(files)
            setImageUrls([...imageUrls, ...newImageUrls])
        }
    }

    const fetchTemporaryBlobAndConvertToFileForUpload = async temporaryBlobUrl => {
        const response = await fetch(temporaryBlobUrl)
        console.log("Response of fetching blob is ", response)
        const blob = await response.blob()
        console.log("Blob after fetch is ", blob)
        const fileName = Math.random().toString(36).slice(2,9)
        console.log('File name before interpolation:', fileName)
        const mimeType = blob.type || "application/octet-stream"
        console.log('mime type is', mimeType)
        const file = new File([blob], `${fileName}.${mimeType.split("/")[1]}`,{ type: mimeType })
        console.log('final file is', file)
        return file
    }

    const handleImageUploadBtn = () => {
        console.log('image upload button clicked')
        startTransition(async () => {
            let urls = []
            for (const url of imageUrls) {
                const imageFile = await fetchTemporaryBlobAndConvertToFileForUpload(url)
                console.log('imageFile for upload is', imageFile)
                const { imageUrl, error } = uploadImage({
                    file: imageFile,
                    bucket: "listing_images"
                })

                if (error) {
                    console.error(error)
                    return
                }

                urls.push(imageUrl)
            }

            console.log("image urls are", urls)
        })
    }



    console.log('image URLS are', imageUrls)

    if (imageUrls.length) {
        // Testing Conversion then going home
        (async () => {
            console.log(await fetchTemporaryBlobAndConvertToFileForUpload(imageUrls[0]))
        })()
    }

    return (
        <div>
            <h2>Images Bruh</h2>
            <h3>JPG or PNG only!!!</h3>
            <input type="file" multiple onChange={handleImageOnChange}/>
            <button onClick={handleImageUploadBtn}>upload images</button>
            <div>
                { imageUrls.map((url, index)=> {
                    return <img
                        src={url}
                        height={300}
                        width={300}
                        key={url}
                        alt={`image-${index}`}
                    />
                })}
            </div>
        </div>
    )
}
