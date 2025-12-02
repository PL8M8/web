"use client"
import { useState } from 'react'
import Link from 'next/link'

export default function AddCarImage() {
  const [images, setImages] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      setImages(files)
      
      const previews = files.map(file => URL.createObjectURL(file))
      setImagePreviews(previews)
    }
  }

  return (
    <div>
      <h1>Step 1: Add Car Image</h1>
      
      <form>
        <input 
          type="file" 
          accept="image/*" 
          multiple 
          onChange={handleImageUpload}
        />
      </form>

      <div>
        {imagePreviews.map((preview, index) => (
          <img 
            key={index}
            src={preview} 
            alt={`Preview ${index + 1}`}
            width={250}
            height={250}
          />
        ))}
      </div>

      <ul>
        <li>
            <Link href="/listings/create/vehicle-details">Step 2: Add vehicle details</Link>
        </li>
        <li>
            <Link href="/">Reset and go to Home</Link>
        </li>
      </ul>
    </div>
  )
}