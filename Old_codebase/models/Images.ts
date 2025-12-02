import { z } from 'zod'

const BasicImageSchema = z.object({
    page: z.number(),
    per_page: z.number(),
    prev_page: z.string().optional(),
    next_page: z.string().optional(),
    total_results: z.number(),
})

const PhotoSchema = z.object({
    id: z.number(),
    width: z.number(),
    height: z.number(),
    url: z.string(),
    src: z.object({
        large: z.string()
    }),
    alt: z.string(),
    blurredDataUrl: z.string().optional()
})

export const ImagesSchemaWithPhotos = BasicImageSchema.extend({
    photos: z.array(PhotoSchema)
})

export type Photo = z.infer<typeof PhotoSchema>

export type ImagesResults = z.infer<typeof ImagesSchemaWithPhotos>


// Example for above from pexels doc
// {
//     "page": 1,
//     "per_page": 1,
//     "next_page": "https://api.pexels.com/v1/curated/?page=2&per_page=1"
// }

//     "photos": [
//       {
//         "id": 2880507,
//         "width": 4000,
//         "height": 6000,
//         "url": "https://www.pexels.com/photo/woman-in-white-long-sleeved-top-and-skirt-standing-on-field-2880507/",
//         "src": {
//           "large": "https://images.pexels.com/photos/2880507/pexels-photo-2880507.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
//         },
//         "alt": "Brown Rocks During Golden Hour"
//       }
//     ],
