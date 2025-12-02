"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Page() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = () => {
    console.log({ email, password })
    // Add your login logic here
    // After successful login:
    router.push('/listings/create')
  }

  return (
    <div>
      <h1>Log In</h1>
      
      <section>
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

        <button onClick={handleLogin}>Log In</button>
      </section>

      <p>Don't have an account? <Link href="/signup">Sign Up</Link></p>
      <Link href="/">Go to Home</Link>
    </div>
  )
}