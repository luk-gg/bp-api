// TODO: Rewrite without import.meta.glob
export async function getFile(path, publisher = "bno") {
    if (!path) return
    if (path.charAt(0) !== "/") path = `/${path}`
    const files = import.meta.glob('../../../game/(api|client)/**/*.json', { import: "default" })
    const fileResolver = files[`../../../game/${path.includes("Content") ? "client" : "api"}/${publisher}${path}`]
    if (!fileResolver) return
    return await fileResolver()
}