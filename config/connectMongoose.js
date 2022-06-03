const mongo = require('mongoose');

const userSchema = new mongo.Schema({
    uid: Number,
    id: Number,
    userName: String,
    userNick: String,
    balance: Number,
    subscribed: Boolean
});

const postSchema = new mongo.Schema({
    id: Number,
    message_id_in_chat: Number,
    members: Array
});

const $user = mongo.model("Users", userSchema);
const $post = mongo.model("Posts", postSchema);

console.log(`[${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}] [MONGOOSE] > Устанавливаем подключение...`)
mongo.connect('mongodb://localhost:27017/bot-bonus', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => { console.log(`[${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}] [MONGOOSE] > Подключение установлено.`) }).catch(err => console.log(err));

$user.prototype.set = function(field, value) {
    this[field] = value;
    return this.save();
}
$user.prototype.inc = function(field, value) {
    this[field] += value;
    return this.save();
}
$user.prototype.dec = function(field, value) {
    this[field] -= value;
    return this.save();
}

$post.prototype.set = function(field, value) {
    this[field] = value;
    return this.save();
}
$post.prototype.inc = function(field, value) {
    this[field] += value;
    return this.save();
}
$post.prototype.dec = function(field, value) {
    this[field] -= value;
    return this.save();
}

module.exports = {
	$user,
    $post
};