import ITEMS from "../../game/api/bno/items.json";
import { getText, getAssets, getSources, getCategory, getRewardItemBrief } from "./utils";
import CRAFT from "../../game/api/bno/craft.json"
import RECEPI from "../../game/api/bno/imagine/recepi.json"
import IMAGINE from "../../game/api/bno/imagine.json"
import WEAPONS from "../../game/api/bno/weapons.json"
import ITEM_BOX from "../../game/api/bno/item_box.json"

// TODO available in (map/dungeon) available_in

function processItem(item, lang) {
    const name = getText("item_text", item.name, lang)
    const desc = getText("item_text", item.desc, lang)
    const source = getText("item_text", item.obtaining_route_detail_id, lang)
    const effect = getText("item_text", item.item_effect_desc_text, lang)
    const category = getCategory("Item", item.category, lang)
    const assets = getAssets("item", item.id)
    const usedInRecipe = getRecipesContainingItem(item, lang)
    const sources = getSources(item, lang, [3])
    const boxContents = getItemBoxContents(item, lang)

    return {
        text: {
            name,
            desc,
            category,
            source,
            effect,
        },
        assets,
        usedInRecipe,
        sources,
        boxContents,
        resolveType: "Item",
        ...item,
    }
}

function getRecipesContainingItem(item, lang) {
    const imagineRecipes = RECEPI.reduce((acc, curr) => {
        if (curr.materials.some(mat => mat.item_id === item.id && mat.item_type === item.type)) {
            const imagine = IMAGINE.find(imag => imag.id === curr.imagin_id)
            const { icon } = getAssets("imagine", imagine.id)
            acc.push({
                id: imagine.id,
                type: "imagine",
                text: {
                    name: getText("master_imagine_text", imagine.imagine_name, lang)
                },
                assets: {
                    icon
                }
            })
        }
        return acc
    }, [])

    const craftRecipes = CRAFT.reduce((acc, curr) => {
        if (curr.materials.some(mat => mat.item_id === item.id && mat.item_type === item.type)) {
            switch (curr.out_item_type) {
                case 1:
                    const item = ITEMS.find(i => i.id === curr.out_item_id)
                    acc.push({
                        id: item.id,
                        type: "item",
                        text: {
                            name: getText("item_text", item.name, lang)
                        },
                        assets: {
                            icon: getAssets("item", item.id).icon
                        }
                    })
                    break
                case 2:
                    const weapon = WEAPONS.find(i => i.id === curr.out_item_id)
                    acc.push({
                        id: weapon.id,
                        type: "weapon",
                        text: {
                            name: getText("weapon_text", weapon.name, lang)
                        },
                        assets: {
                            icon: getAssets("weapon", weapon.id).icon
                        }
                    })
                    break
            }
        }
        return acc
    }, [])

    return [...imagineRecipes, ...craftRecipes]
}

function getItemBoxContents(item, lang) {
    return ITEM_BOX
        .filter(itemBox => itemBox.id === item.id)
        .map(itemBox => {
            const item_box_contents = itemBox.item_box_contents.map(content => ({
                ...getRewardItemBrief(content.item_type, content.item_type_id, lang),
                ...content
            }))
            return {
                ...itemBox,
                item_box_contents
            }
        })
}

export function getEntry(id, lang) {
    return processItem(ITEMS.find(item => item.id == id), lang)
}

export const getSummaries = (lang) => ITEMS.map(item => {
    const { icon, iconL } = getAssets("item", item.id)
    return {
        href: `/db/items/${item.id}`,
        name: getText("item_text", item.name, lang),
        jpName: getText("item_text", item.name, "ja_JP"),
        icon,
        iconL,
        category: "Item",
        type: item.category,
        level: item.item_level,
        rank: item.adventurer_rank,
        class: item.limit_class,
        // TODO: element from consumable effect?
        // TODO: price?
    }
})

const items = (lang) => ITEMS.map(item => processItem(item, lang))

export default items;