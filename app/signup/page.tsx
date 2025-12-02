"use client"
import { useState } from 'react'
import Link from 'next/link'

export default function Page() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [contactInfo, setContactInfo] = useState('')

  const handleSubmit = () => {
    console.log({ email, password, name, contactInfo })
    // Add your signup logic here
  }

  return (
    <div>
      <h1>Sign Up</h1>
      
      <section>
        <div>
          <label htmlFor="name">Name</label>
          <input 
            id="name"
            type="text" 
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="email">Email</label>
          <input 
            id="email"
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <input 
            id="password"
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="contactInfo">Preferred Listing Contact Info</label>
          <input 
            id="contactInfo"
            type="text" 
            value={contactInfo}
            onChange={(e) => setContactInfo(e.target.value)}
          />
        </div>

        <button onClick={handleSubmit}>Sign Up</button>
      </section>

      <p>Already have an account? <Link href="/login">Log In</Link></p>
      <Link href="/">Go to Home</Link>
    </div>
  )
}