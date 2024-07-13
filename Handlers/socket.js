import Websocket from "ws";
import { Client, GatewayIntentBits, EmbedBuilder, Events } from 'discord.js';

export default async function(Config, Token, DiscordBot) {
    const Socket = new Websocket(`ws://${Config.pufferpanel.host}/proxy/daemon/socket/${Config.pufferpanel.serverid}`, {
        headers: {
            "Connection": "keep-alive, Upgrade",
            "Cookie": `puffer_auth=${Token}`,
            "Pragma": "no-cache",
            "Cache-Control": "no-cache"
        }
    });

    return Socket;
}