module.exports = {
  tag: ["банк"],
  button: ["bank"],
  func: async(context, { vk, _user, game, util }) => {
    let _realgame = await game.realGame(context.peerId)
    if(_realgame.newgamew == true){
      return context.send({message: "Игра начнётся после первой ставки", keyboard: game.getKeyboard() })
    }

    let _thisGame = await game.getGame(context.peerId);
    
    if(!_thisGame.users) {
      return context.send({ message: `
[id${context.senderId}|${_user.name}], информация о текущей игре
Банк: 0 PC

Ставки:
😲Не кто не поставил!😲

⌛До конца раунда: ${util.unixStampLeft(_thisGame.game.time - Math.floor(Date.now() / 1000))}⌛
      `, keyboard: game.getKeyboard() });
    }

    let coins = 0;
    let str = { red: [], black: [], even: [], noteven: [], apro: [], bpro: [], cpro: [], number: [[], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], []] };
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
            gg += `🎰Ставки на ${i}<br>${res.join('<br>')}<br><br>`;
        }
      }); return `${gg}`;
    }

    await context.send({ message: `
🏦 Общий баланс банка ${util.number_format(coins)} PC!

${ ( str.red.length != 0 ? ` Ставки на красное:<br>${str.red.join('<br>')}` : `` ) }

${ ( str.black.length != 0 ? ` Ставки на чёрное:<br>${str.black.join('<br>')}` : `` ) }

${ ( str.even.length != 0 ? ` Ставки на чётное:<br>${str.even.join('<br>')}` : `` ) }

${ ( str.noteven.length != 0 ? ` Ставки на нечётное:<br>${str.noteven.join('<br>')}` : `` ) }

${ ( str.apro != 0 ? ` Ставки на промежуток 1-8 :<br>${str.apro.join('<br>')}` : `` ) }

${ ( str.bpro != 0 ? ` Ставки на промежуток 9-16:<br>${str.bpro.join('<br>')}` : `` ) }

${ ( str.cpro != 0 ? ` Ставки на промежуток 17-24:<br>${str.cpro.join('<br>')}` : `` ) }

${ getNumber(str.number) }

🕧  До конца раунда: ${util.unixStampLeft(_thisGame.game.time - Math.floor(Date.now() / 1000))}
🏐  Хеш раунда: ${_thisGame.game.hash.hash}
    `, keyboard: game.getKeyboard() });
  }
};
