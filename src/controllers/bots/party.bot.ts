const Telegraf = require('telegraf')
const Extra = require('telegraf/extra')
import TelegrafInlineMenu from 'telegraf-inline-menu';

const uuidv1 = require('uuid/v1');
import { MethodConfig, Method, Verbs } from '@methodus/server';
import { Sheet } from '../../db/sheet';
import { Config } from '../../config';
import { Markup } from 'telegraf';
import { ChangeStream } from 'mongodb';


@MethodConfig('PartyBot')
export class PartyBot {
    async init() {
        const botDb = new Sheet(Config.sheets.data);
        const ActionsMenu = new TelegrafInlineMenu(async (ctx) => {
            return `Party order for ${ctx.from.username}`;
        });

        const products = await botDb.query(1);
        const options = products.data.map((product: any) => {
            return product.name;
        });

        ActionsMenu.setCommand('start');
        ActionsMenu.simpleButton(async (ctx) => {
            const userOrder: any = await botDb.query(2, (row) => { return row['username'] === ctx.from.username });
            if (userOrder.data.length > 0) {
                (ctx as any).actionMarker = 'edit';
                return `Update order (${userOrder.data.length}) items in basket`;
            } else {
                (ctx as any).actionMarker = 'new';
                return `New order`;
            }
        }, 'start_process', {
            doFunc: async (ctx) => {

                const orders: any = await botDb.query(2);
                const userOrder = orders.data.filter((row) => { return row['username'] === ctx.from.username });

                const orderDict = {};
                userOrder.forEach((item) => {
                    orderDict[item.name] = item.amount;
                })

                let html = `0 items.`
                if (userOrder.length > 0) {

                    html = `
                    ${userOrder.map((order) => {
                        return `<a>${order.name}: ${order.amount}</a>\n`

                    }).join("")}
                `
                } else {
                    html = `
                        ${products.data.map((product) => {
                        return `<a>${product.name}: 0</a>`

                    }).join("\n")}
                    `
                }

                function chunk(array, length) {
                    var chunkarr = [],
                        i = 0,
                        n = array.length;
                    while (i < n) {
                        chunkarr.push(array.slice(i, i += length));
                    }
                    return chunkarr;
                }

                const menues = chunk(options.map((opt) => {
                    return { text: `${opt} ${(orderDict[opt]) ? orderDict[opt] : ''}`, callback_data: opt }
                }), 3);

                // options.map((opt) => {
                //     return { text: `${opt} ${(orderDict[opt]) ? orderDict[opt] : ''}`, callback_data: opt }
                // })


                return ctx.replyWithHTML(html, {
                    reply_markup: {
                        inline_keyboard: menues
                    }
                });

            }
        })

        ActionsMenu.simpleButton(async (ctx) => {
            return `View the full order`;
        }, 'view_basket', {
            doFunc: async (ctx) => {

                const orders: any = await botDb.query(2);
                const userOrder = orders.data.filter((row) => { return row['username'] === ctx.from.username });

                const orderDict = {};
                userOrder.forEach((item) => {
                    orderDict[item.name] = item.amount;
                });

                let html = `0 items.`
                if (userOrder.length > 0) {

                    html = `
                    ${userOrder.map((order) => {
                        return `<a>${order.name}: ${order.amount}</a>\n`

                    }).join("")}
                `
                } else {
                    html = `
                        ${products.data.map((product) => {
                        return `<a>${product.name}: 0</a>`

                    }).join("\n")}
                    `
                }

                function chunk(array, length) {
                    var chunkarr = [],
                        i = 0,
                        n = array.length;
                    while (i < n) {
                        chunkarr.push(array.slice(i, i += length));
                    }
                    return chunkarr;
                }

                const menues = chunk(options.map((opt) => {
                    return { text: `${opt} ${(orderDict[opt]) ? orderDict[opt] : ''}`, callback_data: opt }
                }), 3);

                // options.map((opt) => {
                //     return { text: `${opt} ${(orderDict[opt]) ? orderDict[opt] : ''}`, callback_data: opt }
                // })


                return ctx.replyWithHTML(html, {
                    reply_markup: {
                        inline_keyboard: menues
                    }
                });

            }
        })

        // const menu = new TelegrafInlineMenu(async (ctx) => {
        //     // find user order
        //     const userOrder: any = await botDb.query(2, (row) => { return row['username'] === ctx.from.username });
        //     if (userOrder.data.length > 0) {
        //         return `Update order for ${ctx.from.username}!`;
        //     } else {
        //         return `new order for ${ctx.from.username}!`;
        //     }


        // });



        //menu.setCommand('start')




        // menu.select('menuOptions', options, {
        //     setFunc: async (ctx: any, key: string) => {
        //         await botDb.insert(2, { name: key, amount: '1', username: ctx.from.username });

        //     }, textFunc: (ctx, key) => {
        //         return key;

        //     }
        // });





        const bot = new Telegraf(process.env.TELEGRAM_API_KEY);
        //  bot.use(menu.replyMenuMiddleware());
        //bot.command('start', ActionsMenu.replyMenuMiddleware())
        // bot.use(ActionsMenu.replyMenuMiddleware());
        bot.use(ActionsMenu.init())



        products.data.map((product: any) => {

            bot.action(product.name, async (ctx) => {
                {
                    const productOrder: any = await botDb.query(2, (row) => { return row['name'] === product.name && row['username'] === ctx.from.username });
                    const singleProduct = productOrder.data[0];


                    if (singleProduct) {
                        singleProduct.amount = (Number(singleProduct.amount) + 1).toString();
                        await botDb.update(singleProduct, 2);

                    } else {
                        await botDb.insert(2, { name: product.name, amount: '1', username: ctx.from.username });

                    }


                    const userStatus: any = await botDb.query(2, (row) => { return row['username'] === ctx.from.username });
                    const html = `
                    ${userStatus.data.map((order) => {
                        return `<a>${order.name}: ${order.amount}</a>\n`
                    }).join("")}
                    `

                    ctx.answerCbQuery('Order received');
                    return ctx.replyWithHTML(html);

                }
            });

            // bot.hears(product.name, ctx => ctx.reply('Yay!'))
        });




        // const replyMiddleware = productMenu.replyMenuMiddleware()

        // bot.use((ctx, next) => {
        //     return next(ctx).then(() => {
        //         console.log('Response time ms');
        //     });
        // });

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




                }
            } catch (error) {
                console.error(error);
            }







        })




        bot.startPolling();
    }
    constructor() {
        this.init();

    }

    @Method(Verbs.Get, '/status')
    public async status() {
        return true;
    }
}