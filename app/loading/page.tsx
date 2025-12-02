import Link from 'next/link'
import React from 'react'

export default function Loading() {
  return (
    <div>
      <h1>Preparing Listing</h1>
      <p>Saving listing then navigating to listing page</p>
      <p>This page shoudl aultimatically redirect in...if not click this link below</p>
      <ul>
        <li>
            <Link href="/listings">Go to Listings</Link>
        </li>
      </ul>
    </div>
  )
}