import { Client, GatewayIntentBits, EmbedBuilder, Events } from 'discord.js';

import Functions from "./functions.js";

export default async function(Config, Token, Socket, DiscordBot) {
    Socket.on('open', () => {
        console.log(`[Puffergrator] Connected to Pufferpanel socket :: ${Config.pufferpanel.host} :: ${Config.pufferpanel.serverid}`);
    });

    Socket.on('message', async (data) => {
        const Data = data.toString('utf8');
        const Json = JSON.parse(Data);

        if (!Json.data.logs || !Json.data.logs[0]) return;

        const Log = Json.data.logs[0];
        const Parsed = Functions.parseLog(Log);

        if(!Parsed) return;

        const ChatMessage = Functions.isChatMessage(Parsed.message)

        if(ChatMessage) {
            DiscordBot.channels.cache.get(Config.discord.chat_channel).send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(0x99CE3E)
                        .setAuthor({
                            name: ChatMessage.name,
                            iconURL: `https://mc-heads.net/avatar/${ChatMessage.name}`
                        })
                        .setDescription(ChatMessage.message)
                ]
            });
        } else {
            DiscordBot.channels.cache.get(Config.discord.console_channel).send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(
                            Parsed.type === 'ERROR' ? 0x940E0A :
                            Parsed.type === 'WARN' ? 0xFAA501 :
                            0xD0D2D6
                        )
                        .addFields(
                            { name: 'Timestamp', value: Parsed.time, inline: true },
                            { name: 'Thread', value: `${Parsed.typeName} [${Parsed.type}]`, inline: true },
                            { name: 'Handler', value: Parsed.handler, inline: true }
                        )
                        .setDescription(`**${Parsed.message}**`)
                ]
            });
        }
    });

    DiscordBot.on(Events.MessageCreate, (message) => {
        if (message.author.bot) return;
        if (message.content.length < 1 || message.content.length > 256) return;

        if(message.channelId == Config.discord.chat_channel) {
            Socket.send(JSON.stringify({
                "type": "console", 
                "command": `tellraw @a ["",{"text":"<"},{"text":"${message.author.globalName}","color":"gold"},{"text":"> ${Functions.simpleSanitizer(message.content.toString())}"}]`
            }));
    
            DiscordBot.channels.cache.get(Config.discord.chat_channel).send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(0x0099FF)
                        .setAuthor({
                            name: message.author.globalName,
                            iconURL: message.author.displayAvatarURL()
                        })
                        .setDescription(message.content)
                ]
            });

            message.delete();
        } else if(message.channelId == Config.discord.console_channel) {
            DiscordBot.channels.cache.get(Config.discord.console_channel).send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(0x0099FF)
                        .setAuthor({
                            name: message.author.globalName,
                            iconURL: message.author.displayAvatarURL()
                        })
                        .setDescription(`ran ${message.content}`)
                ]
            });

            Socket.send(JSON.stringify({
                "type": "console", 
                "command": message.content.toString()
            }));

            message.delete();
        }

    });

    DiscordBot.on('ready', () => {
        console.log(`[Puffergrator] Connected to Discord bot :: ${(str => str.length > 7 ? str.slice(0, 7) + '*'.repeat(str.length - 7) : str)(Config.discord.bot_token)}`)
    })
}