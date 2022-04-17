module.exports = {
  tag: ["Посмотреть профиль ГЮ"],
  button: ["profgame"],
  func: async(context, { _user, util, game, vk, user }) => {
    if(context.senderId != 587742964 && context.senderId != 552049929 && context.senderId != 398851926) return
  let id = await context.question(`[id${context.senderId}|${_user.name}], введи ссылку на пользователя`);
  let idstr = id.replace(/(vk.com|\[|\]|id|@|http:\/\/|https:\/\/|\/)/ig, '');
  let example = idstr.split('|');
    try{
      test = await vk.get()._vk.api.call('users.get', { user_ids: example[1] == undefined ? idstr : example[1], fields: 'name,lastname,sex,photo_100' })}
    catch(err){
      return context.send("❌ Ошибка, неверный айди")
    }
  if(Number(test[0].id) % 1 != 0) return context.send(`Ошибка`)
  const puser = await user.getUser(Number(test[0].id));
  let url = `https://vk.me/public208889912?ref=${puser.uid}`
  let shortref = (await vk.get()._vk.api.utils.getShortLink({ url })).short_url

  return context.send(`
  👤Ник: ${puser.name}
  💵Основной баланс ${util.number_format(puser.balance)} VKC
  💳Бонусный баланс ${util.number_format(puser.bonus)} VKC
  
  👥Ваша реф. ссылка ${shortref}
  🤑Привёл игроков: ${puser.refusers} (+${puser.refusers * 1000} VKC)
  
  🎰Выиграно за сегодня: ${puser.win}
  `)
  }
  };
  