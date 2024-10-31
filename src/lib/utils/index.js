import fs from "fs"

export { getText, getCategory } from "./text"
export { getFile } from "./file"
export { getAssets } from "./assets"
export { getSources } from "./sources"
export { getAbilities, getEquipmentStats, getLimitBreakStats } from "./stats"
export { getRewardItemBrief, getReward } from "./rewards"

export const fetchDTs = async (clientFiles) => {
    const iterableItemFiles = Object.entries(clientFiles)

    const data = await Promise.all(
        iterableItemFiles.map(async ([path, resolver]) => {
            const data = await resolver()
            return data.default
        })
    )

    return data.flat().filter(dataObj => dataObj.Type !== "BlueprintGeneratedClass")
}

// Uses linear interpolation to incrementally add missing values to an UnrealEngine array of [{ Time, Value }] objects and return them as [{ x, y }]
export function RCIM_Linear(arr) {
    return arr.reduce((acc, curr, index) => {
        let { Time: x0, Value: y0 } = curr
        const { Time: x1, Value: y1 } = arr[index + 1] || {}

        // Push the current value from the original array
        acc.push({ x: x0, y: y0 })

        // Fill in missing values from the current Time to the next Time
        let missingX = x0
        while (x1 > missingX + 1) {
            missingX++
            const missingY = y0 + (y1 - y0) * ((missingX - x0) / (x1 - x0))
            acc.push({ x: missingX, y: missingY })
        }

        return acc
    }, [])
}

export function imgPath(path) {
    if (!path) return
    return path.replace("/Game", "/Content").split(".")[0] + ".png"
}

// Shrinks each entries[] object to only have the necessary keys for displaying in a list, i.e. name and icon.
export function getBriefArr(arr) {
    return arr.map(data => getBriefData(data))
}

export function getBriefData(fullData) {
    const { id, name, icon } = fullData || {}
    return { id, name, icon }
}

// Ensure case-insensitivity as svelte's routing (or the browser?) transforms links like /Characters/UCR001 to /characters/ucr001. 
export function writeJson(dir, fileName, data) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(`${dir}/${fileName.toLowerCase()}.json`, JSON.stringify(data))
}