import { readdir } from 'fs/promises';
import { join, dirname } from 'path';
import { pathToFileURL } from 'url';

export default {
    isChatMessage(string) {
        if (string.startsWith("[Server]")) {
            return { 
                name: "Server", 
                message: string.slice(8).trim()
            };
        }
    
        const match = string.match(/^<([^>]+)> (.+)$/);
        if (!match) return null;
    
        return {
            name: match[1],
            message: match[2]
        };
    },
    parseLog(string) {
        const regex = /^\[(?<time>\d{2}:\d{2}:\d{2})\] \[(?<typeName>[^\]]+)\/(?<type>[^\]]+)\] \[(?<handler>[^\]]+)\]: (?<message>.*)$/;
        const match = string.replace(/\x1B\[[0-9;]*m/g, '').trim().match(regex);
    
        if (!match) return null;
    
        return {
            time: match.groups.time,
            typeName: match.groups.typeName,
            type: match.groups.type,
            handler: match.groups.handler,
            message: match.groups.message
        };
    },
    simpleSanitizer(str) {
        return str.replace(/\\/g, '\\\\')
                  .replace(/"/g, '\\"')
                  .replace(/\n/g, '\\n')
                  .replace(/\r/g, '\\r')
                  .replace(/\t/g, '\\t');
    },
}