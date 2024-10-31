import Head from 'next/head';
import '@styles/home.css'
import '@styles/contact.css'
import '@styles/globals.css'
import { useState, useEffect } from 'react'
import { supabase } from '../utils/supabase'

function Page() {
  const [vehicles, setVehicles] = useState([])

  useEffect(() => {
    async function getVehicles() {
      const { data: vehicles } = await supabase
        .from('vehicles')
        .select()
        .eq('is_sellable', true)

      if (vehicles && vehicles.length > 0) {
        setVehicles(vehicles)
      }
    }

    getVehicles()
  }, [])

  return (
    <div>
      {vehicles.map((vehicle, index) => (
        <li key={index}>{vehicle.tag_number}</li>
      ))}
    </div>
  )
}

export default Page









// function Application({ Component, pageProps }) {
//   return (
//   <>
//     <Head>
//         <link href="https://fonts.googleapis.com/css2?family=Dela+Gothic+One&display=swap" rel="stylesheet" />
//     </Head>
//     <Component {...pageProps} />
//   </>)
// }

// export default Application
