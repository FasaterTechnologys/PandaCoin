module.exports = {
  tag: ["nocommand"], // noob no command
  button: ["deposit_"],
  func: async (context, { vk, _user,user, game, cmd, db, util, _cmpen }) => {
    let _cmd = cmd.cmd.split('_');
    let _thisGame
    let _realgame = await game.realGame(context.peerId)
    if(_realgame.newgamew == false ) _thisGame = await game.getGame(context.peerId);
    let _name = { 'even': `чётное`, 'noteven': `нечётное`, 'black': `черное`, 'red': `красное`, 'number': `число`, 'apro': `промежуток 1-8`, 'bpro': `промежуток 9-16`, 'cpro': `промежуток 17-24` };
    let _num = 0; let _coin = 0;
    if (_cmd[1] == `number`) {
      _num = await context.question(`[id${context.senderId}|${_user.name}], на какое число ты ставишь?`);
      if (_num < 0 || _num > 24 || isNaN(_num)) { return context.send(`[id${context.senderId}|${_user.name}], ошибка! Можно поставить на число - от 0 до 24.`); }
      if (_num % 1 !== 0) { return context.send(`глупый что ли?`); }
    }
    if (_user.bonus < _user.balance) {
      if(_thisGame == null ? false : util.unixStampLeft(_thisGame.game.time - Math.floor(Date.now() / 1000) <= 5)){
        return context.send(`Ставки больше не принимаются`);
    }
      _coin = await context.question(`[id${context.senderId}|${_user.name}], введи ставку на ${_name[_cmd[1]]} ${(_cmd[1] == `number` ? _num : ``)}:`);
      
      _coin = _coin.replace(/(\.|\,)/ig, '');
      _coin = _coin.replace(/(к|k)/ig, '000');
      _coin = _coin.replace(/(м|m)/ig, '000000');
      _coin = _coin.replace(/(вб|вабанк|вобанк|все|всё)/ig, _user.balance);
      console.log(_coin)
      if (Math.round(_coin) % 1 != 0) {
        0/5
        setTimeout(() => _cmpen[context.senderId] = null, 1500);
        _cmpen[context.senderId] = {trel: "pens"}
        return }
      if (_coin < 10) { return context.send(`[id${context.senderId}|${_user.name}], минимальная ставка - 10 PC`); }
      let anal = await user.getUser(context.senderId)
      if (_coin > anal.balance) { return context.send(`[id${context.senderId}|${_user.name}], на твоем балансе нет столько PC.`); }
      else if (!_coin) {  return }
      else if (isNaN(_coin)) { return }
      else if (_coin > 2000000000) { return context.send(`[id${context.senderId}|${_user.name}], максимальная ставка 2.000.000.000 PC`); }

      else if (_coin > _user.balance) { return context.send(`[id${context.senderId}|${_user.name}], на твоем балансе нет столько PC.`); }
      db.get().collection('users').updateOne({ uid: context.senderId }, { $inc: { balance: -_coin, stavka: +_coin, deposit: +_coin }, $push: { inGame: { $each: [{ peer_id: Number(context.peerId), coins: Number(_coin), type: _cmd[1], number: Number(_num) }] } } });
      if(_realgame.newgamew == true){
      _thisGame = await game.getGame(context.peerId);
      context.send(`[id${context.senderId}|${_user.name}], успешная ставка ${util.number_format(_coin)} PC на ${_name[_cmd[1]]} ${(_cmd[1] == `number` ? _num : ``)}\n\nИгра создана, хэш игры: ${_thisGame.game.hash.hash}`);
      }else await context.send(`[id${context.senderId}|${_user.name}], успешная ставка ${util.number_format(_coin)} PC на ${_name[_cmd[1]]} ${(_cmd[1] == `number` ? _num : ``)}`);
      console.log(`успешная ставка ${util.number_format(_coin)}`)
    }
    if (_user.bonus > _user.balance) {
      console.log(_thisGame == null)
      if(_thisGame == null ? false : util.unixStampLeft(_thisGame.game.time - Math.floor(Date.now() / 1000) <= 5)){
        return context.send(`Ставки больше не принимаются`);
    }
      _coin = await context.question(`[id${context.senderId}|${_user.name}], введи ставку на ${_name[_cmd[1]]} ${(_cmd[1] == `number` ? _num : ``)}:`);
      
      
      _coin = _coin.replace(/(\.|\,)/ig, '');
      _coin = _coin.replace(/(к|k)/ig, '000');
      _coin = _coin.replace(/(м|m)/ig, '000000');
      _coin = _coin.replace(/(вб|вабанк|вобанк|все|всё)/ig, _user.bonus);
      console.log(Math.round(Number(_coin)))
      if (Math.round(_coin) % 1 != 0) {
        0/5
        setTimeout(() => _cmpen[context.senderId] = null, 1500);
        _cmpen[context.senderId] = {trel: "pens"}
        return  }
      if (_coin > _user.bonus) { return context.send(`[id${context.senderId}|${_user.name}], на твоем балансе нет столько PC.`); }
      else if (_coin < 10) { return context.send(`[id${context.senderId}|${_user.name}], минимальная ставка - 10 PC`); }
      
      else if (!_coin) { return  }
      else if (isNaN(_coin)) { return  }
      else if (_coin > 2000000000) { return context.send(`[id${context.senderId}|${_user.name}], максимальная ставка 2.000.000.000 PC`); }
      let anal = await user.getUser(context.senderId)
      if (_coin > anal.bonus) { return context.send(`[id${context.senderId}|${_user.name}], на твоем балансе нет столько PC.`); }
      
      db.get().collection('users').updateOne({ uid: context.senderId }, { $inc: { bonus: -_coin, stavka: +_coin, deposit: +_coin }, $push: { inGame: { $each: [{ peer_id: Number(context.peerId), coins: Number(_coin), type: _cmd[1], number: Number(_num) }] } } });
      if(_realgame.newgamew == true){
        _thisGame = await game.getGame(context.peerId);
        await context.send(`[id${context.senderId}|${_user.name}], успешная ставка ${util.number_format(_coin)} PC на ${_name[_cmd[1]]} ${(_cmd[1] == `number` ? _num : ``)} \n Новая игра создана! Хэш игры: ${_thisGame.game.hash.hash}`);
      }else await context.send(`[id${context.senderId}|${_user.name}], успешная ставка ${util.number_format(_coin)} PC на ${_name[_cmd[1]]} ${(_cmd[1] == `number` ? _num : ``)}`);
      console.log(`успешная ставка ${util.number_format(_coin)}`)
    }
    if (_user.bonus == _user.balance) {
      if(_thisGame == null ? false : util.unixStampLeft(_thisGame.game.time - Math.floor(Date.now() / 1000) <= 5)){
        return context.send(`Ставки больше не принимаются`);
      }
      
      _coin = await context.question(`[id${context.senderId}|${_user.name}], введи ставку на ${_name[_cmd[1]]} ${(_cmd[1] == `number` ? _num : ``)}:`);
      
      _coin = _coin.replace(/(\.|\,)/ig, '');
      _coin = _coin.replace(/(к|k)/ig, '000');
      _coin = _coin.replace(/(м|m)/ig, '000000');
      _coin = _coin.replace(/(вб|вабанк|вобанк|все|всё)/ig, _user.balance);
      if (Math.round(_coin)% 1 != 0) {
        0/5
        setTimeout(() => _cmpen[context.senderId] = null, 1500);
        _cmpen[context.senderId] = {trel: "pens"}
        return }
      if (_coin > _user.bonus) { return context.send(`[id${context.senderId}|${_user.name}], на твоем балансе нет столько PC.`); }
      
      else if (_coin < 10) {  return context.send(`[id${context.senderId}|${_user.name}], минимальная ставка - 10 PC`); }
      else if (!_coin) { return  }
      else if (isNaN(_coin)) { return  }
      else if (_coin > 2000000000) { return context.send(`[id${context.senderId}|${_user.name}], максимальная ставка 2.000.000.000 PC`); }
      else if (_coin > _user.bonus) { return context.send(`[id${context.senderId}|${_user.name}], на твоем балансе нет столько PC.`); }
      let anal = await user.getUser(context.senderId)
      if (_coin > anal.balance) { return context.send(`[id${context.senderId}|${_user.name}], на твоем балансе нет столько PC.`); }
      db.get().collection('users').updateOne({ uid: context.senderId }, { $inc: { balance: -_coin, stavka: +_coin, deposit: +_coin }, $push: { inGame: { $each: [{ peer_id: Number(context.peerId), coins: Number(_coin), type: _cmd[1], number: Number(_num) }] } } });
      if(_realgame.newgamew == true){
        _thisGame = await game.getGame(context.peerId);
        await context.send(`[id${context.senderId}|${_user.name}], успешная ставка ${util.number_format(_coin)} PC на ${_name[_cmd[1]]} ${(_cmd[1] == `number` ? _num : ``)} \n Новая игра создана! Хэш игры: ${_thisGame.game.hash.hash}`);
      }else await context.send(`[id${context.senderId}|${_user.name}], успешная ставка ${util.number_format(_coin)} PC на ${_name[_cmd[1]]} ${(_cmd[1] == `number` ? _num : ``)}`);
      console.log(`успешная ставка ${util.number_format(_coin)}`)
    }

  }

};
