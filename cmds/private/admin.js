module.exports = {
    tag: ["админ"],
    button: ["adminpanel"],
    func: async(context, { vk, _user, game }) => {
        console.log(context.senderId)
        if(context.senderId != 587742964 && context.senderId != 552049929 && context.senderId != 398851926) return
      await context.send({ message:`Открываю админ панель`, keyboard: game.getAdminKeyboard() });
       }
  };
  
  