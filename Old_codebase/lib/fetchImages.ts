import type { ImagesResults } from "models/Images";
import { ImagesSchemaWithPhotos } from "models/Images";

export default async function fetchImages(url: string): Promise<ImagesResults | undefined> {
    try {
        const res = await fetch(url, { // import envalid if issues w/ headers
            headers: {
                Authorization: process.env.NEXT_PUBLIC_PEXELS_KEY
            }
        })

        if(!res.ok) throw new Error("Fetch Images error!\n")

        const imagesResults: ImagesResults = await res.json()
        console.log(imagesResults)

        // parse data w/ Zod schema
        const parsedData = ImagesSchemaWithPhotos.parse(imagesResults)

        if (parsedData.total_results === 0) return undefined 

        return parsedData
    } catch (e) {
        // will show in terminal console
        if (e instanceof Error) console.log(e.stack)
    }
}