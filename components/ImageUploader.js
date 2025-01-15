import React from 'react'
import Image from 'next/image'

export default function ImageUploader() {
    const [imageUrls, setImageUrls] = React.useState([])

    const handleImageOnChange = e => {
        const files = e.target?.files
        if (files) {
            // console.log('we have files', files)
            const filesArray = Array.from(files)
            // console.log('Files Array Bruh', filesArray)
            const newImageUrls = filesArray.map(file => URL.createObjectURL(file))
            // console.log('We have URLs Bruh', newImageUrls)
            setImageUrls([...imageUrls, newImageUrls])
        }
    }

    console.log('image URLS are', imageUrls)

    return (
        <div>
            <h2>Images Bruh</h2>
            <input type="file" multiple onChange={handleImageOnChange}/>
            {/* <button>upload images</button> */}
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
