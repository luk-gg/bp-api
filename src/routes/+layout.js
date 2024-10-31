import path from "path"

export const load = () => {
    const files = import.meta.glob("/src/lib/*.js")
    const links = Object.keys(files).map(filePath => "/" + path.basename(filePath, ".js"));
    return { links }
}