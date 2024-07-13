import Websocket from "ws";
import { Client, GatewayIntentBits, EmbedBuilder, Events } from 'discord.js';

export default async function(Config) {
    const Discord = new Client({
        intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] 
    });

    Discord.login(Config.discord.bot_token);

    return Discord;
}