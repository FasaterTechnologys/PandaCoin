const fs = require('fs');
module.exports = {
  tag: ["Изменить id репоста"],
  button: ["bonus"],
  func: async(context, { _user, vkcoin, util, game, vk, user, configpen }) => {
    if(context.senderId != 587742964 && context.senderId != 552049929 && context.senderId != 398851926) return
    let id = await context.question(`[id${context.senderId}|${_user.name}], введи id поста, пример: 123`);
    configpen.id = id 
  console.log(id)
	fs.writeFileSync('./config.json', JSON.stringify(configpen, null, 2))
  
return context.send(`Успешно изменил id`)
  }
  };
  