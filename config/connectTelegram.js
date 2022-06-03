require('dotenv/config');

const { Stage, BaseScene, Telegraf } = require('telegraf')
const TelegrafI18n = require('telegraf-i18n')
const LocalSession = require('telegraf-session-local')
const path = require('path')

const bot = new Telegraf(process.env.telegram_token);

const i18n = new TelegrafI18n({
    directory: path.resolve(__dirname, 'locales'),
    defaultLanguage: 'ru',
    sessionName: 'session',
    useSession: true,
    templateData: {
        pluralize: TelegrafI18n.pluralize,
        uppercase: (value) => value.toUpperCase()
    }
});

const {
    withdrawalScene,
    withdrawalScene2
} = require('../scenes/withdrawalScene.js')

const stage = new Stage([
    withdrawalScene,
    withdrawalScene2
]);

bot.use((new LocalSession({ database: 'session.json' })).middleware())
bot.use(i18n.middleware());
bot.use(stage.middleware());

module.exports = {
    bot,
    i18n
}