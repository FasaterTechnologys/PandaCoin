module.exports = {
  tag: ["банк"],
  button: ["bank"],
  func: async(context, { vk, _user, gamepodnad, util }) => {
    let _realgame = await gamepodnad.realGame(context.peerId)
    if(_realgame.newgamew == true){
      return context.send({message: "Игра начнётся после первой ставки", keyboard: gamepodnad.getKeyboard() })
    }

    let _thisGame = await gamepodnad.getGame(context.peerId);
    
    if(!_thisGame.users) {
      return context.send({ message: `
[id${context.senderId}|${_user.name}], информация о текущей игре
Банк: 0 PC

Ставки:
😲Не кто не поставил!😲

⌛До конца раунда: ${util.unixStampLeft(_thisGame.game.time - Math.floor(Date.now() / 1000))}⌛
      `, keyboard: gamepodnad.getKeyboard() });
    }

    let coins = 0;
    let str = { up: [], down: [], number: [[], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], []] };
    _thisGame.users.forEach((res, i) => {
      res.inGame.forEach((g, k) => {
        if(g.peer_id == Number(context.peerId)) {
          if(g.type == `number`) {
            str.number[g.number].push(`${res.name} - ${util.number_format(g.coins)} PC`);
          } else {
            str[g.type].push(`${res.name} - ${util.number_format(g.coins)} PC`);
          }
          coins = Number(coins) + Number(g.coins);
        }
      })
    });
	

    let getNumber = (number) => {
      let gg = ``;
      number.forEach((res, i) => {
        if(res.length != 0) {
            gg += `Ставки на ${i}<br>${res.join('<br>')}<br><br>`;
        }
      }); return `${gg}`;
    }

    await context.send({ message: `
🏦 Общий баланс банка ${util.number_format(coins)} PC!

${ ( str.up.length != 0 ? ` Ставки на больше:<br>${str.up.join('<br>')}` : `` ) }

${ ( str.down.length != 0 ? ` Ставки на меньше:<br>${str.down.join('<br>')}` : `` ) }

${ getNumber(str.number) }


🕧  До конца раунда: ${util.unixStampLeft(_thisGame.game.time - Math.floor(Date.now() / 1000))}
🏐  Хеш раунда: ${_thisGame.game.hash.hash}
    `, keyboard: gamepodnad.getKeyboard() });
  }
};
