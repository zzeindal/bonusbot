const { bot } = require('../config/connectTelegram.js');
const { getUser } = require('../helpers/utils.js')

bot.hears(/up (\d+)\s(\d+)/, async(ctx) => {
	const user = getUser(ctx.match[2]);
	if(!user) return ctx.replyWithMarkdown(`Пользователя *не существует․*`);
	await user.inc("balance", Number(ctx.match[1]));
	await bot.telegram.sendMessage(user.id, `
💰Администратор начислил Вам ${ctx.match[1]} токенов!
Общее количество токенов: ${user.balance}

📌Проявляйте активность на канале и получайте токены за комментарии!
`)
	return ctx.reply(`Успешно․`)
})

bot.hears(/done (\d+)\s(\d+)/, async(ctx) => {
	await bot.telegram.sendMessage(ctx.match[2], `
✅ Заявка на вывод обработана администратором!
⏳ Средства скоро будут перечислены.

Количество выводимых токенов: ${ctx.match[1]}
`)
	return ctx.reply(`Успешно․`)
});


bot.hears(/decline (\d+)\s(\d+)/, async(ctx) => {
	await bot.telegram.sendMessage(ctx.match[2], `❌ Заявка на вывод  ${ctx.match[1]} токенов отказана администратором!`)
	return ctx.reply(`Успешно․`)
});
