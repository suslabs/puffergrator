import { promises as fs } from 'fs';

export default async function(config) {
    try {
        const data = await fs.readFile(config, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`[Puffergrator] Failed to load config. (${config})`)
    }
}