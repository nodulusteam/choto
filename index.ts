require('newrelic');
import { ServerConfiguration, PluginConfiguration, ClientConfiguration, ConfiguredServer, MethodType, ServerType } from '@methodus/server';
import { Bot } from './controllers/';
 


@ServerConfiguration(ServerType.Express, { port: process.env.PORT || 6200 })
@PluginConfiguration('@methodus/describe')
//@ClientConfiguration(Api, MethodType.Local, ServerType.Express)
@ClientConfiguration(new Bot(), MethodType.Local, ServerType.Express)
class SetupServer extends ConfiguredServer {

}

new SetupServer();


