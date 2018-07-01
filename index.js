const Telegraf = require('telegraf')

const bot = new Telegraf('618379959:AAHiLcORFAi88G31_EH4r0Al-AyLejJFB68')

bot.start((ctx) => ctx.reply('Welcome!'))
bot.help((ctx) => ctx.reply('Send me a sticker'))
bot.on('sticker', (ctx) => ctx.reply('👍'));

bot.on('text', ({ replyWithLocation }, next) => {
    if (Math.random() > 0.2) {
      return next()
    }
    return Promise.all([
      replyWithLocation((Math.random() * 180) - 90, (Math.random() * 180) - 90),
      next()
    ])
  })


  
bot.hears('hi', (ctx) => ctx.reply('Hey there'))
bot.hears(/buy/i, (ctx) => ctx.reply('Buy-buy'))

bot.startPolling()