


import {
    ServerConfiguration, PluginConfiguration,
    ConfiguredServer, ServerType, ClientConfiguration,
    RouterConfiguration,
    BuiltInServers,
    MethodType,
} from '@methodus/server';
import { AdsController } from './controllers/ads';
import { PartyBot } from './controllers/bots/party.bot';


@ServerConfiguration(BuiltInServers.Express, { port: process.env.PORT || 6299 })
@PluginConfiguration('@methodus/describe')
@ClientConfiguration(PartyBot, MethodType.Local, ServerType.Express)
@RouterConfiguration(AdsController, BuiltInServers.Express)
class SetupServer extends ConfiguredServer {
    constructor() {
        super(SetupServer);
    }
}



new SetupServer();


