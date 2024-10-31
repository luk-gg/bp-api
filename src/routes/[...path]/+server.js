import { json } from '@sveltejs/kit'
import { SUPPORTED_VERSIONS } from '../../lib/utils/constants.js';

// DEV CODE
export const GET = async ({ params, url }) => {
    const lang = url.searchParams.get("lang") ?? SUPPORTED_VERSIONS[0].locales[0]
    const publisher = url.searchParams.get("publisher") ?? SUPPORTED_VERSIONS[0].publisher
    const [first, second] = params.path.split("/")
    const id = second && parseInt(second)

    if (id) {
        const file = await import(`../../lib/${first}.js`)
        const entry = await file.getEntry(id, lang)
        return json(entry)
    }

    else if (second) {
        const file = await import(`../../lib/${first}/${second}.js`)
        return json(await file.default(lang))
    }

    const file = await import(`../../lib/${first}.js`)
    return json(await file.default(lang))
}