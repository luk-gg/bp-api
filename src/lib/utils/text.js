import categories from "./categories.json"
import { SUPPORTED_VERSIONS, LANG_CODES } from "./constants"

// TODO: Add bptranslatefiles submodule to get translated EN text. The repo includes code for automating updating in the "automate" branch and uses the following hierarchy: manual translation (override) > machine translation > original JA text.

const langs = {}
const allTextFiles = import.meta.glob("../../../game/api/**/texts/*.json", { import: "default" })

// Create { "bno": { "ja_JP": {}, "en_US": {} }, ... } 
for (const { publisher, locales } of SUPPORTED_VERSIONS) {
    langs[publisher] = {};
    for (const locale of locales) {
        const langCode = LANG_CODES[locale]; // "en" → "en_US"
        const textFile = await allTextFiles[`../../../game/api/${publisher}/texts/${langCode}.json`]();
        langs[publisher][langCode] = textFile.reduce((result, { name, texts }) => {
            result[name] = texts.reduce((acc, { id, text }) => {
                acc[id] = text;
                return acc;
            }, {});
            return result;
        }, {});
    }
}

export function getText(ns, id, lang, publisher) {
    publisher ??= SUPPORTED_VERSIONS[0].publisher
    lang ??= SUPPORTED_VERSIONS[0].locales[0]
    const langCode = LANG_CODES[lang]
    return langs[publisher][langCode][ns][id]
}

export function getCategory(ns, id, lang) {
    lang ??= SUPPORTED_VERSIONS[0].locales[0]
    const langCode = LANG_CODES[lang]
    return categories[langCode][ns][id] || categories[langCode][ns].default
}


function getLangs(publisher, lang) {
    if (publisher && lang) return langs[publisher][lang] // bno, en_US
    return langs
}

export default getLangs