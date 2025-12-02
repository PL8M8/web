import Link from 'next/link'
import React from 'react'

export default function Page() {
    return (
        <div>
        <h1>My Current Listings Template</h1>
        <p>Directions: take the optimized image listing and post anywhere</p>
        <p>Future features: We post on behalf of you across platforms</p>
        <ul>
            <li>
                <Link href="/listings/create">Add Listing</Link>
            </li>
            <li>
                <Link href="/">Home</Link>
            </li>
        </ul>
        
        </div>
    )
}