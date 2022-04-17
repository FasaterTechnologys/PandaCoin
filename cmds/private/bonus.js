module.exports = {
tag: ["бонус"],
button: ["msgbonus"],
func: async(context, { _user, util, game, vk, db }) => {
let pe = _user.time

if(Math.round(pe / 60)) return context.send(`
🤑 | До получения бонуса осталось ${Math.round(pe / 60)} минут(ы)
`)
if(_user.win  < 10000)  return context.send(`
Для получения бонуса необходимо выиграть 10.000 PC 
`)

if(_user.contribution  <  5000)  return context.send(`
Для получения бонуса необходимо купить 5.000 PC 
`)


db.get().collection('users').updateOne({ uid: context.senderId}, { $inc: { bonus: 1000 } });
db.get().collection('users').updateOne({ uid: context.senderId}, { $set: { time: 1800 } });
return context.send(`
Получен бонус в размере 1.000 PC
`)
}
};
