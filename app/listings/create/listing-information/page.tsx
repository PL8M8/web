"use client"
import { useState } from 'react'
import Link from 'next/link'

export default function ListingInformation() {
  const [location, setLocation] = useState('')
  const [price, setPrice] = useState('')
  const [details, setDetails] = useState('')

  const handleSubmit = () => {
    console.log({ location, price, details })
  }

  const handleReset = () => {
    setLocation('')
    setPrice('')
    setDetails('')
  }

  return (
    <div>
      <h1>Step 3: Listing Information</h1>
      
      <section>
        <h2>Enter Listing Details</h2>
        
        <div>
          <label htmlFor="location">Location</label>
          <input 
            id="location"
            type="text" 
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
        
        <div>
          <label htmlFor="price">Price</label>
          <input 
            id="price"
            type="text" 
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
        
        <div>
          <label htmlFor="details">Details</label>
          <textarea 
            id="details"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
          />
        </div>

        <button onClick={handleSubmit}>Submit</button>
      </section>
      <ul>
        <li><Link href="/loading">prepare listing</Link></li>
        <li><Link href="/listings/create/vehicle-details">Step 2: Vehicle details</Link></li>
        <li><Link href="/">Go Home</Link></li>
        <li><button onClick={handleReset}>Reset</button></li>
      </ul>
    </div>
  )
}