const { $user } = require('../config/connectMongoose.js');
const { Keyboard, Key } = require('telegram-keyboard')

const mainChannel = process.env.mainChannel;
const mainChannelChat = process.env.mainChannelChat;
const adminChat = process.env.adminChat;

function main_keyboard(ctx) {
    const keyboard = Keyboard.make(["💳 Баланс"]).reply();
    return keyboard;
}

function start_keyboard() {
    const keyboard = Keyboard.make([Key.callback('💡 Способ №1', 'firstStep'), Key.callback('💡 Способ №2', 'secondStep')]).inline();
    return keyboard;
}

function firstStep_keyboard() {
    const keyboard = Keyboard.make([Key.callback('🔍 Проверить подписку', 'checkSubscribe'), Key.callback('🔙 Назад', 'back_to_steps')]).inline();
    return keyboard;
}

function secondStep_keyboard() {
    const keyboard = Keyboard.make([Key.callback('🔙 Назад', 'back_to_steps')]).inline();
    return keyboard;
}

function balance_keyboard() {
    const keyboard = Keyboard.make([Key.callback("💸 Вывести", 'withdrawal')]).inline();
    return keyboard;
}

function cancel_keyboard() {
    const keyboard = Keyboard.make(["🔙 Назад"]).reply();
    return keyboard;
}

async function saveUser(ctx) {
    const count = await $user.countDocuments();
    let user = new $user({
        uid: count,
        id: ctx.from.id,
        userName: `${ctx.from.first_name}`,
        userNick: `${ctx.from.username !== undefined ? ctx.from.username : 'Без никнейма'}`,
        balance: 0,
        subscribed: false
    })
    await user.save();
}

async function getUser(id) {
	const user = await $user.findOne({ id: id });
	return user;
}

module.exports = {
    mainChannel,
    mainChannelChat,
    adminChat,
    main_keyboard,
    start_keyboard,
    firstStep_keyboard,
    secondStep_keyboard,
    balance_keyboard,
    cancel_keyboard,
    saveUser,
    getUser
}