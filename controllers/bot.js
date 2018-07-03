"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Telegraf = require('telegraf');
const youtube_1 = require("../plugins/youtube");
const uuidv1 = require('uuid/v1');
const youtube = require('../plugins/youtube');
class Bot {
    constructor() {
        const bot = new Telegraf(process.env.TELEGRAM_API_KEY);
        bot.start((ctx) => ctx.reply('Welcome!'));
        bot.use((ctx, next) => {
            return next(ctx).then(() => {
                console.log('Response time ms');
            });
        });
        bot.help((ctx) => ctx.reply('Send me a sticker'));
        bot.on('sticker', (ctx) => ctx.reply('👍'));
        bot.on('text', (ctx) => __awaiter(this, void 0, void 0, function* () {
            let command = ctx.message.text.split(' ', 1)[0];
            const args = ctx.message.text.replace(command, '');
            switch (command) {
                case '/youtube':
                    const results = yield youtube_1.searchYouTube(args);
                    return ctx.replyWithMediaGroup(results);
            }
            // const username = ctx.message.from.username;
            // const client = await DB();
            // const res = await client.query('SELECT * from public."Users" WHERE "UserName"=$1 ORDER BY "ID" ASC', [username]);
            // if (res.rows.length === 0) {
            //     await client.query('INSERT INTO public."Users"("UserName") VALUES($1)', [username]);
            //     return ctx.reply(res)
            // }
        }));
        // bot.command('youtube',async (ctx) => {
        // )
        bot.hears('hi', (ctx) => ctx.reply('Hey there'));
        bot.hears(/buy/i, (ctx) => ctx.reply('Buy-buy'));
        bot.startPolling();
    }
}
exports.Bot = Bot;
//# sourceMappingURL=bot.js.map