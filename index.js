import ConfigLoader from "./Handlers/config.js"
import Authenticator from "./Handlers/authenticator.js"
import DiscordBot from "./Handlers/discord.js"
import PufferSocket from "./Handlers/socket.js"
import HookEvents from "./Handlers/hookevents.js"

class Puffergrator {
    constructor(config) {
        this.configFile = config;
        this.main();
    }

    async main() {
        this.Config = await ConfigLoader(this.configFile);
        this.Token = await Authenticator(this.Config);
        this.Discord = await DiscordBot(this.Config);
        this.Socket = await PufferSocket(this.Config, this.Token, this.Discord);

        await HookEvents(this.Config, this.Token, this.Socket, this.Discord);

        return [this.Config, this.Token, this.Discord, this.Socket];
    }
}

const Session = new Puffergrator("./config.json")
