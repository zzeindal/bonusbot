const { bot } = require('../config/connectTelegram.js');
const { mainChannel, getUser, start_keyboard, main_keyboard, firstStep_keyboard, secondStep_keyboard, balance_keyboard } = require('../helpers/utils.js')
const { Keyboard, Key } = require('telegram-keyboard')

bot.action('back_to_steps', async (ctx) => {
    try {
        await ctx.editMessageText(ctx.i18n.t("mainText_2"), { reply_markup: start_keyboard().reply_markup })
    } catch (err) {
        return ctx.reply(ctx.i18n.t("mainText_2"), start_keyboard());
    }
});

bot.action('firstStep', async (ctx) => {
    try {
        await ctx.editMessageText(ctx.i18n.t("firstStepText"), { parse_mode: "HTML", reply_markup: firstStep_keyboard().reply_markup });
    } catch (err) {
        return ctx.replyWithHTML(ctx.i18n.t("firstStepText"), firstStep_keyboard());
    }
});

bot.action('checkSubscribe', async (ctx) => {
    const user = await getUser(ctx.from.id);
    const keyboard = Keyboard.make([Key.callback("🔙 Назад", 'back_to_steps')]).inline();
    if (user.subscribed) return ctx.answerCbQuery(`Этот способ уже пройден Вами․`, true);
    const result = await bot.telegram.getChatMember(mainChannel, ctx.from.id);
    if (!result.status) {
        try {
            await ctx.editMessageText(ctx.i18n.t("firstStepRejectText"), { parse_mode: "HTML", reply_markup: keyboard.reply_markup });
        } catch (err) {
            return ctx.replyWithHTML(ctx.i18n.t("firstStepRejectText"), keyboard);
        }
    }
    await user.inc("balance", 1);
    await user.set("subscribed", true);
    try {
        await ctx.editMessageText(ctx.i18n.t("firstStepDoneText"), { parse_mode: "HTML", reply_markup: keyboard.reply_markup });
    } catch (err) {
        return ctx.replyWithHTML(ctx.i18n.t("firstStepDoneText"), keyboard);
    }
});

bot.action('secondStep', async (ctx) => {
    try {
        await ctx.editMessageText(ctx.i18n.t("secondStepText"), { parse_mode: "HTML", reply_markup: secondStep_keyboard().reply_markup });
    } catch (err) {
        return ctx.replyWithHTML(ctx.i18n.t("secondStepText"), secondStep_keyboard());
    }
});

bot.hears('💳 Баланс', async (ctx) => {
    const user = await getUser(ctx.from.id);
    const result = await bot.telegram.getChatMember(mainChannel, ctx.from.id);
    if (!result.status) {
        return ctx.replyWithHTML(ctx.i18n.t("balanceErrorText"));
    }
    return ctx.replyWithHTML(ctx.i18n.t("balanceText", { balance: user.balance }), balance_keyboard());
});

bot.action('withdrawal', async (ctx) => {
    const user = await getUser(ctx.from.id);
    if (user.balance < 10) {
        try {
            await ctx.answerCbQuery(ctx.i18n.t("withdrawalError"), true);
        } catch (err) {
            await ctx.reply(ctx.i18n.t("withdrawalError"));
        }
        return;
    }
    return ctx.scene.enter("withdrawalScene")
});