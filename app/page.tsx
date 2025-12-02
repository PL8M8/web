import Link from 'next/link'

export default function Home() {
  return (
    <div>
      <h1>Car Listing Tool v1</h1>
      <ul>
        <li>
          <Link href="/signup">Sign Up</Link>
        </li>
        <li>
          <Link href="/login">Log In</Link>
        </li>
      </ul>
    </div>
  )
}