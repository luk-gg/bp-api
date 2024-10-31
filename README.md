# Luk.gg API Starter Template
Quickly prototype with SvelteKit/Vite and deploy a REST API via GitHub. Statically outputs JSON files in `/json`.

## Testing
`npm i` and `npm run dev` to start the vite server. Links will be created for JS files created inside of `/src/lib` for convenience.

## Input
Game files go in `/game/client` and `/game/api` or `/game/server` (if applicable). Client files can typically be obtained with Fmodel and [UnrealExporter](https://github.com/whotookzakum/UnrealExporter).

## Output
To output json files, visit `/output` or `npm run output` (assumes port 5173 is open). 

For example, if you have a file `/src/lib/characters.js`, output will generate `/json/en/characters.json` for anything exported as `entries_brief`, as well as individual files for each character as `/json/en/characters/{CHARACTER_ID}.json`.