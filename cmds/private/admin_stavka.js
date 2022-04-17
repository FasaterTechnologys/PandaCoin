module.exports = {
  tag: ["Посмотреть ставки"],
  button: ["stavki"],
  func: async(context, { _user, vkcoin, util, game, gamepodnad , gamekubik, vk, user }) => {
    if(context.senderId != 587742964 && context.senderId != 552049929 && context.senderId != 398851926) return
    thuskub = await gamekubik.getGame(2000000002);
    thusgame = await game.getGame(2000000001);
    thuspodnad = await gamepodnad.getGame(2000000003);

  return context.send(`
  Wheel: ${thusgame.game.hash.number}, ${(thusgame.game.hash.number == 0 ? `зеленое` : (thusgame.game.hash.color ? `чёрное` : `красное`))}!<br><br>
  Кубик ${thuskub.game.hash.number}!<br><br>
  Под 7 Над ${thuspodnad.game.hash.number}!<br><br>`)
  }
  };
  