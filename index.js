process
    .on('unhandledRejection', (reason, p) => {
        console.log(`Unhandled Rejection at Promise: ${reason}`);
    })
    .on('uncaughtException', err => {
        console.log(`Uncaught Exception thrown: ${err}`);
    });

const { bot } = require('./config/connectTelegram.js');
const { $user, $post } = require('./config/connectMongoose.js');
const { saveUser, main_keyboard, start_keyboard, mainChannelChat } = require('./helpers/utils.js')
const cron = require('node-cron');

require('./modules/userCommands.js');
require('./modules/adminCommands.js');

bot.catch((err, ctx) => {
    console.log(`Ooops, encountered an error for ${ctx.updateType}: ${err}`)
})

bot.start(async (ctx) => {
    const user = await $user.findOne({ id: ctx.from.id })
    if (!user) {
        await saveUser(ctx)
    }
    await ctx.reply(ctx.i18n.t("mainText", { username: ctx.from.username }), main_keyboard());
    return ctx.reply(ctx.i18n.t("mainText_2"), start_keyboard())
});

bot.on('channel_post', async (ctx) => {
    const post = await $post.findOne({ id: ctx.update.channel_post.message_id })
    let newPost = new $post({
        id: ctx.update.channel_post.message_id,
        members: []
    })
    await newPost.save();
})

bot.on('text', async (ctx) => {
    if (Number(ctx.update.message.chat.id) !== Number(mainChannelChat)) return;
    if (!ctx.update.message.reply_to_message) return;
    const post = await $post.findOne({ id: ctx.update.message.reply_to_message.forward_from_message_id });
    if (!post) return;
    if (ctx.update.message.from.id === 777000) {
        await post.set("message_id_in_chat", ctx.update.message.message_id);
    }
    if (!post.members.includes(ctx.from.id)) {
        post.members.push(ctx.from.id);
        await post.save();
    }
});

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}

cron.schedule('0 59 23 * * *', async () => {
    const posts = await $post.find();
    const numberChat_1 = getRandomInt(1, posts.length);
    const numberChat_2 = getRandomInt(1, posts.length);

    const winner_1 = getRandomInt(1, posts[numberChat_1].members.length);
    const winner_2 = getRandomInt(1, posts[numberChat_2].members.length);

    const user1 = getUser(winner_1);
    const user2 = getUser(winner_2);

    await user1.inc("balance", 1);
    await user2.inc("balance", 1);
    await bot.telegram.sendMessage(mainChannelChat, `
🎉В сегодняшнем розыгрыше участвовало ${posts[numberChat_1].members.length} комментаторов под этим постом.

👤Пользователь, получивший 1 токен - @${user1.userNick}!
${user1.userName}, пожалуйста, проверьте свой баланс.`, { reply_to_message_id: posts[numberChat_1].message_id_in_chat })

    await bot.telegram.sendMessage(mainChannelChat, `
🎉В сегодняшнем розыгрыше участвовало ${posts[numberChat_2].members.length} комментаторов под этим постом.

👤Пользователь, получивший 1 токен - @${user2.userNick}!
${user2.userName}, пожалуйста, проверьте свой баланс.`, { reply_to_message_id: posts[numberChat_2].message_id_in_chat })
    await posts.remove();
});

bot.startPolling();