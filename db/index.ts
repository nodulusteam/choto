import { Config } from '../config';


require('pg').defaults.ssl = Config.db.ssl;

const { Client } = require('pg')


console.log('configuration:', Config);
let activeClient = null;

export async function DB() {


    if (!activeClient) {
        const connectionObj = (Config.db.url) ? Config.db.url : Config.db;
        const client = new Client(connectionObj);
        await client.connect()
        activeClient = client;

    }
    return activeClient;



}