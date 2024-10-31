import { json } from '@sveltejs/kit'
import path from "path"
import { writeJson } from '../../lib/utils/index.js'

export const GET = async () => {
    const allFiles = import.meta.glob("../../lib/*.js")

    for (const [filePath, resolver] of Object.entries(allFiles)) {
        const fileData = await resolver()
        const fileName = path.basename(filePath, ".js")
        
        // If the file has an entries_brief export, then the default export is the detailed version
        if (fileData.entries_brief) {
            console.log(fileName, "(multiple entries)")

            // Write the entries_brief to a single json
            writeJson(`./json/en`, fileName, fileData.entries_brief)

            // Write the default export as individual json files
            for (const obj of fileData.default) {
                writeJson(`./json/en/${fileName}`, obj.id, obj)
            }
        }
        else {
            console.log(fileName)
            writeJson(`./json/en`, fileName, fileData.default)
        }
    }

    return json({})
}

