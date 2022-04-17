module.exports = {
  tag: ["банк"],
  button: ["bank"],
  func: async(context, { vk, _user, gamekubik, util }) => {
    let _realgame = await gamekubik.realGame(context.peerId)
    if(_realgame.newgamew == true){
      return context.send({message: "Игра начнётся после первой ставки", keyboard: gamekubik.getKeyboard() })
    }

    let _thisGame = await gamekubik.getGame(context.peerId);
    
    if(!_thisGame.users) {
      return context.send({ message: `
[id${context.senderId}|${_user.name}], информация о текущей игре
Банк: 0 PC

Ставки:
😲Не кто не поставил!😲

⌛До конца раунда: ${util.unixStampLeft(_thisGame.game.time - Math.floor(Date.now() / 1000))}⌛
      `, keyboard: gamekubik.getKeyboard() });
    }

    let coins = 0;
    let str = { even: [], noteven: [], q: [], w: [], e: [], r: [], t: [], y: [], };
    _thisGame.users.forEach((res, i) => {
      res.inGame.forEach((g, k) => {
        if(g.peer_id == Number(context.peerId)) {
            str[g.type].push(`${res.name} - ${util.number_format(g.coins)} PC`);
          coins = Number(coins) + Number(g.coins);
        }
      })
    });
	


    await context.send({ message: `
🏦 Общий баланс банка ${util.number_format(coins)} PC!


${ ( str.even.length != 0 ? `• Ставки на чётное:<br>${str.even.join('<br>')}` : `` ) }

${ ( str.noteven.length != 0 ? `• Ставки на нечётное:<br>${str.noteven.join('<br>')}` : `` ) }

${ ( str.q.length != 0 ? `• Ставки на 1:<br>${str.q.join('<br>')}` : `` ) }

${ ( str.w.length != 0 ? `• Ставки на 2:<br>${str.w.join('<br>')}` : `` ) }

${ ( str.e.length != 0 ? `• Ставки на 3:<br>${str.e.join('<br>')}` : `` ) }

${ ( str.r.length != 0 ? `• Ставки на 4:<br>${str.r.join('<br>')}` : `` ) }

${ ( str.t.length != 0 ? `• Ставки на 5:<br>${str.t.join('<br>')}` : `` ) }

${ ( str.y.length != 0 ? `• Ставки на 6:<br>${str.y.join('<br>')}` : `` ) }





🕧  До конца раунда: ${util.unixStampLeft(_thisGame.game.time - Math.floor(Date.now() / 1000))}
🏐  Хеш раунда: ${_thisGame.game.hash.hash}
    `, keyboard: gamekubik.getKeyboard() });
  }
};
