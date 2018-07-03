const Telegraf = require('telegraf')
import { DB } from '../db';
import { searchYouTube } from '../plugins/youtube';
const uuidv1 = require('uuid/v1');

 

const youtube = require('../plugins/youtube');
export class Bot {
    constructor() {
        const bot = new Telegraf(process.env.TELEGRAM_API_KEY);
        bot.start((ctx) => ctx.reply('Welcome!'));
        bot.use((ctx, next) => {
            return next(ctx).then(() => {
                console.log('Response time ms');
            });
        });


        bot.help((ctx) => ctx.reply('Send me a sticker'))
        bot.on('sticker', (ctx) => ctx.reply('👍'));

        bot.on('text', async (ctx: any) => {
            let commandArray = ctx.message.text.split(' ');

            switch (commandArray[0]) {
                case '/youtube':
                    const results = await searchYouTube(commandArray[1]);
                    return ctx.replyWithMediaGroup(results);


            }



            // const username = ctx.message.from.username;

            // const client = await DB();
            // const res = await client.query('SELECT * from public."Users" WHERE "UserName"=$1 ORDER BY "ID" ASC', [username]);

            // if (res.rows.length === 0) {
            //     await client.query('INSERT INTO public."Users"("UserName") VALUES($1)', [username]);
            //     return ctx.reply(res)
            // }


        })
        // bot.command('youtube',async (ctx) => {

        // )


        bot.hears('hi', (ctx) => ctx.reply('Hey there'))
        bot.hears(/buy/i, (ctx) => ctx.reply('Buy-buy'))

        bot.startPolling()
    }
}