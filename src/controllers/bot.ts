const Telegraf = require('telegraf')
const Extra = require('telegraf/extra')
import   TelegrafInlineMenu from 'telegraf-inline-menu';

import { searchYouTube } from '../plugins/youtube';
const uuidv1 = require('uuid/v1');
import { Videos } from '../plugins/pornhub';
import { RedTube } from '../plugins/redtube';
import { MethodConfig, Method, Verbs } from '@methodus/server';
import { Config } from '../config';
import { Sheet } from '../db/sheet';


const youtube = require('../plugins/youtube');
let chat = null;
@MethodConfig('Bot')
export class Bot {
    constructor() {

        const menu = new TelegrafInlineMenu(ctx => `Hey ${ctx.from.first_name}!`)
        menu.setCommand('start')

        menu.simpleButton('I am excited!', 'a', {
            doFunc: ctx => ctx.reply('As am I!')
        })



        const bot = new Telegraf(process.env.TELEGRAM_API_KEY);
        bot.use(menu.init())
        bot.start((ctx) => {
            chat = ctx;
            return ctx.replyWithHTML('Yes?')
        });
        bot.use((ctx, next) => {
            return next(ctx).then(() => {


                chat = ctx;
                console.log('Response time ms');
            });
        });

        bot.help((ctx) => ctx.reply('Send me a sticker'))
        bot.on('sticker', (ctx) => ctx.reply('👍'));
        bot.on('text', async (ctx: any) => {
            try {
                let command = ctx.message.text.split(' ', 1)[0];
                const args = ctx.message.text.replace(command, '');
                switch (command) {
                    // case '/weed':
                    //     {


                    //         return ctx.replyWithPhoto({ source: 'image.png' }, Extra.caption(`*${ad.name}**`).markdown());
                    //     }
                    case '/list':
                        const html = `
Available commands:
/red <i>keyword</i>
/youtube <i>keyword</i>`
                        return ctx.replyWithHTML(html);

                    case '/youtube':
                        {
                            const results: any = await searchYouTube(args);
                            let html = ``
                            results.forEach((element) => {
                                console.log(element);
                                html += `<a href="${element.url}">${element.caption}</a>`;
                            });

                            return ctx.replyWithHTML(html);
                        }
                    case '/red':
                        {
                            try {
                                const videoRequest = new RedTube();
                                const results: any = await videoRequest.search(args);
                                return ctx.replyWithHTML(videoRequest.format(results));
                            } catch (error) {

                            }
                        }

                }
            } catch (error) {
                console.error(error);
            }







        })
        // bot.command('youtube',async (ctx) => {

        // )


        bot.hears('hi', (ctx) => ctx.reply('Hey there'))
        bot.hears(/buy/i, (ctx) => ctx.reply('Buy-buy'))

        bot.startPolling();


        (async () => {
            const adsDb = new Sheet(Config.sheets.data);
            try {
                const result: any = await adsDb.query(0, ``, 1, 1000);
                const ad: any = result.data[0].data;
                console.log(ad);

                return ad;
            } catch (error) {
                debugger;
            }

        })().then((ad) => {
            // setInterval(() => {
            //     if (chat && ad) {
            //         let base64Image = ad.image.split(';base64,').pop();
            //         fs.writeFileSync('image.png', base64Image, { encoding: 'base64' });
            //         return chat.replyWithPhoto({ source: 'image.png' }, Extra.caption(`${ad.text}`).markdown());
            //     }
            // }, 15 * 1000)
        })


    }

    @Method(Verbs.Get, '/status')
    public async status() {
        return true;
    }
}