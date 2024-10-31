import { json } from '@sveltejs/kit'

export const GET = async ({ params }) => {
    if (params.file === "favicon.ico") return json({})
    const { default: file } = await import(`../../lib/${params.file}.js`)
    return json(file("en"))
}