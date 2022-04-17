module.exports = {
tag: ["профиль"],
button: ["profile"],
func: async(context, { _user, util, game, vk }) => {
let minuce = _user.win-_user.lose
let plusminuce = _user.lose-_user.win
let url = `https://vk.me/public208889912?ref=${_user.uid}`

let shortref = (await vk.get()._vk.api.utils.getShortLink({ url })).short_url
return context.send(`
👤Ник: ${_user.name}
💵Основной баланс ${util.number_format(_user.balance)} PC
💳Бонусный баланс ${util.number_format(_user.bonus)} PC

👥Ваша реф. ссылка ${shortref}
🤑Привёл игроков: ${_user.refusers} (+${_user.refusers * 300} PC)

🎰Выиграно за сегодня: ${_user.win}
`)
}
};
