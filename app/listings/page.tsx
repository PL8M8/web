import Link from 'next/link'
import { supabase } from '@/utils/supabase/client'

export default async function Page() {
    const { data: cars } = await supabase.from('vehicles').select()
    return (
        <div>
        <h1>My Current Listings Template</h1>
        <p>Directions: take the optimized image listing and post anywhere. Future features: We post on behalf of you across platforms</p>
        <ul>
            {cars?.map(car => (
                <Link key={car.id} href={`/listings/${car.id}`}>
                    <li>{`${car.year} ${car.make} ${car.model} (${car.condition}) - $${car.listing_price}`}
                        <ul>
                            <li>tag: {car.tag_number}</li>
                            <li>mileage: {car.mileage}</li>
                        </ul>
                    </li>
                </Link>
            ))}
        </ul>
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