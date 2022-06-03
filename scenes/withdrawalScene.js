const { BaseScene } = require('telegraf')
const { Keyboard, Key } = require('telegram-keyboard')
const { getUser, adminChat, main_keyboard, cancel_keyboard } = require('../helpers/utils.js');

const withdrawalScene = new BaseScene('withdrawalScene');
withdrawalScene.enter((ctx) => {
    ctx.replyWithHTML(ctx.i18n.t("withdrawalScene1"), cancel_keyboard);
})

withdrawalScene.on('text', async (ctx) => {
	const user = getUser(ctx);
	if(!Number(ctx.message.text)) return ctx.replyWithHTML(ctx.i18n.t("noNumberBalance"));
	if(user.balance < Number(ctx.message.text)) return ctx.replyWithHTML(ctx.i18n.t("notEnoughBalance"));
	ctx.session.amount = Number(ctx.message.text);
	return ctx.scene.enter("withdrawalScene2")
});

const withdrawalScene2 = new BaseScene('withdrawalScene2');
withdrawalScene2.enter((ctx) => {
    ctx.replyWithHTML(ctx.i18n.t("withdrawalScene2"), cancel_keyboard);
})

withdrawalScene2.on('text', async (ctx) => {
	const keyboard = Keyboard.make([
		Key.callback('Одобрить', `done ${ctx.session.amount} ${ctx.from.id}`),
		Key.callback('Отклонить', `decline ${ctx.session.amount} ${ctx.from.id}`)
	], { columns: 1 }).inline();
	
	await bot.telegram.sendMessage(adminChat, ctx.i18n.t("withdrawalAdminChat", { username: ctx.from.username, amount: ctx.session.amount, address: ctx.message.text }))
	ctx.replyWithHTML(ctx.i18n.t("withdrawalFinish"), main_keyboard());
	return ctx.scene.leave();
});

module.exports = {
	withdrawalScene,
	withdrawalScene2
}