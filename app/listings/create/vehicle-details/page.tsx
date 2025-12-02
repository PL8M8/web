"use client"
import { useState } from 'react'
import Link from 'next/link'

export default function VehicleDetails() {
  const [year, setYear] = useState('')
  const [make, setMake] = useState('')
  const [model, setModel] = useState('')

  const handleSubmit = () => {
    console.log({ year, make, model })
  }

  const handleReset = () => {
    setYear('')
    setMake('')
    setModel('')
  }

  return (
    <div>
      <h1>Step 2: Add Vehicle Details</h1>
      
      <section>
        <h2>Enter Vehicle Information</h2>
        
        <div>
          <label htmlFor="year">Year</label>
          <input 
            id="year"
            type="text" 
            value={year}
            onChange={(e) => setYear(e.target.value)}
          />
        </div>
        
        <div>
          <label htmlFor="make">Make</label>
          <input 
            id="make"
            type="text" 
            value={make}
            onChange={(e) => setMake(e.target.value)}
          />
        </div>
        
        <div>
          <label htmlFor="model">Model</label>
          <input 
            id="model"
            type="text" 
            value={model}
            onChange={(e) => setModel(e.target.value)}
          />
        </div>

        <button onClick={handleSubmit}>Submit</button>
      </section>

      <nav>
        <ul>
          <li><Link href="/listings/create/listing-information">Step 3: Add Listing Info</Link></li>
          <li><Link href="/listings/create">Step 1: Add Images</Link></li>
          <li><button onClick={handleReset}>Reset</button></li>
          <li><Link href="/">Go Home</Link></li>
        </ul>
      </nav>
    </div>
  )
}