module.exports = {
  tag: ["nocommand"], // noob no command
  button: ["deposit_"],
  func: async (context, { vk, _user, gamekubik, kubiks, db, util }) => {
    let _cmd = kubiks.kubiks.split('_');
    let _realgame = await gamekubik.realGame(context.peerId)
    let _thisGame;
    if(_realgame.newgamew == false ) _thisGame = await gamekubik.getGame(context.peerId);

    let _name = { 'even': `чётное`, 'noteven': `нечётное`, 'q': `1`, 'w': `2`, 'e': `3`, 'r': `4`, 't': `5`, 'y': `6`, };
    let _num = 0; let _coin = 0;
    if (_user.bonus < _user.balance) {
      if(_thisGame == null ? false : util.unixStampLeft(_thisGame.game.time - Math.floor(Date.now() / 1000) <= 5)){
        return context.send(`Ставки больше не принимаются`);
      }


      _coin = await context.question(`[id${context.senderId}|${_user.name}], введи ставку на ${_name[_cmd[1]]} ${(_cmd[1] == `number` ? _num : ``)}:`);
      _coin = _coin.replace(/(\.|\,)/ig, '');
      _coin = _coin.replace(/(к|k)/ig, '000');
      _coin = _coin.replace(/(м|m)/ig, '000000');
      _coin = _coin.replace(/(вб|вабанк|вобанк|все|всё)/ig, _user.balance);
      if (_coin < 10) { return context.send(`[id${context.senderId}|${_user.name}], минимальная ставка - 10 PC`); }
      if (_coin > _user.balance) { return context.send(`[id${context.senderId}|${_user.name}], на твоем балансе нет столько PC.`); }
      else if (!_coin) { return; }
      else if (isNaN(_coin)) { return; }
      else if (_coin > 2000000000) { return context.send(`[id${context.senderId}|${_user.name}], максимальная ставка 2.000.000.000 PC`); }

      else if (_coin > _user.balance) { return context.send(`[id${context.senderId}|${_user.name}], на твоем балансе нет столько PC.`); }
      if(_realgame.newgamew == false ){
      let legeng = false
      _thisGame.users.forEach((res, i) => {
        res.inGame.forEach((g, k) => {
          if (g.peer_id == Number(context.peerId)) {
            if(g.type != _cmd[1] && res.name == _user.name && _cmd[1] != `q` && _cmd[1] != `w`&& _cmd[1] != `e`&& _cmd[1] != `r`&& _cmd[1] != `t`&& _cmd[1] != `y`) return legeng = true
          }
        })
      });
      if (legeng == true ) return context.send(`[id${context.senderId}|${_user.name}], ты уже сделал ставку`)
    }
      db.get().collection('users').updateOne({ uid: context.senderId }, { $inc: { balance: -_coin, stavka: +_coin, deposit: +_coin }, $push: { inGame: { $each: [{ peer_id: Number(context.peerId), coins: Number(_coin), type: _cmd[1], number: Number(_num) }] } } });
      if (_realgame.newgamew == true) {
        _thisGame = await gamekubik.getGame(context.peerId);
        await context.send(`[id${context.senderId}|${_user.name}], успешная ставка ${util.number_format(_coin)} PC на ${_name[_cmd[1]]} ${(_cmd[1] == `number` ? _num : ``)}\n\nИгра создана, хэш игры: ${_thisGame.game.hash.hash}`);

      } else await context.send(`[id${context.senderId}|${_user.name}], успешная ставка ${util.number_format(_coin)} PC на ${_name[_cmd[1]]} ${(_cmd[1] == `number` ? _num : ``)}`);
    }
    if (_user.bonus > _user.balance) {
      if(_thisGame == null ? false : util.unixStampLeft(_thisGame.game.time - Math.floor(Date.now() / 1000) <= 5)){
        return context.send(`Ставки больше не принимаются`);
      }
      _coin = await context.question(`[id${context.senderId}|${_user.name}], введи ставку на ${_name[_cmd[1]]} ${(_cmd[1] == `number` ? _num : ``)}:`);
      _coin = _coin.replace(/(\.|\,)/ig, '');
      _coin = _coin.replace(/(к|k)/ig, '000');
      _coin = _coin.replace(/(м|m)/ig, '000000');
      _coin = _coin.replace(/(вб|вабанк|вобанк|все|всё)/ig, _user.bonus);
      if (_coin > _user.bonus) { return context.send(`[id${context.senderId}|${_user.name}], на твоем балансе нет столько PC.`); }
      else if (_coin < 10) { return context.send(`[id${context.senderId}|${_user.name}], минимальная ставка - 10 PC`); }
      else if (!_coin) { return; }
      else if (isNaN(_coin)) { return; }
      else if (_coin > 2000000000) { return context.send(`[id${context.senderId}|${_user.name}], максимальная ставка 2.000.000.000 PC`); }
      else if (_coin > _user.bonus) { return context.send(`[id${context.senderId}|${_user.name}], на твоем балансе нет столько PC.`); }
      
      if(_realgame.newgamew == false ){
        let legeng = false
        _thisGame.users.forEach((res, i) => {
          res.inGame.forEach((g, k) => {
            if (g.peer_id == Number(context.peerId)) {
              if(g.type != _cmd[1] && res.name == _user.name && _cmd[1] != `q` && _cmd[1] != `w`&& _cmd[1] != `e`&& _cmd[1] != `r`&& _cmd[1] != `t`&& _cmd[1] != `y`) return legeng = true
            }
          })
        });
        if (legeng == true ) return context.send(`[id${context.senderId}|${_user.name}], ты уже сделал ставку`)
      }
      db.get().collection('users').updateOne({ uid: context.senderId }, { $inc: { bonus: -_coin, stavka: +_coin, deposit: +_coin }, $push: { inGame: { $each: [{ peer_id: Number(context.peerId), coins: Number(_coin), type: _cmd[1], number: Number(_num) }] } } });
      if (_realgame.newgamew == true) {
        _thisGame = await gamekubik.getGame(context.peerId);
        await context.send(`[id${context.senderId}|${_user.name}], успешная ставка ${util.number_format(_coin)} PC на ${_name[_cmd[1]]} ${(_cmd[1] == `number` ? _num : ``)} \n Новая игра создана! Хэш игры: ${_thisGame.game.hash.hash}`);
      } else await context.send(`[id${context.senderId}|${_user.name}], успешная ставка ${util.number_format(_coin)} PC на ${_name[_cmd[1]]} ${(_cmd[1] == `number` ? _num : ``)}`);
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
      if (_coin > _user.bonus) { return context.send(`[id${context.senderId}|${_user.name}], на твоем балансе нет столько PC.`); }
      else if (_coin < 10) { return context.send(`[id${context.senderId}|${_user.name}], минимальная ставка - 10 PC`); }
      else if (!_coin) { return; }
      else if (isNaN(_coin)) { return; }
      else if (_coin > 2000000000) { return context.send(`[id${context.senderId}|${_user.name}], максимальная ставка 2.000.000.000 PC`); }
      else if (_coin > _user.bonus) { return context.send(`[id${context.senderId}|${_user.name}], на твоем балансе нет столько PC.`); }
      
      if(_realgame.newgamew == false ){
        let legeng = false
        _thisGame.users.forEach((res, i) => {
          res.inGame.forEach((g, k) => {
            if (g.peer_id == Number(context.peerId)) {
              if(g.type != _cmd[1] && res.name == _user.name && _cmd[1] != `q` && _cmd[1] != `w`&& _cmd[1] != `e`&& _cmd[1] != `r`&& _cmd[1] != `t`&& _cmd[1] != `y`) return legeng = true
            }
          })
        });
        if (legeng == true ) return context.send(`[id${context.senderId}|${_user.name}], ты уже сделал ставку`)
      }
      db.get().collection('users').updateOne({ uid: context.senderId }, { $inc: { bonus: -_coin, stavka: +_coin, deposit: +_coin }, $push: { inGame: { $each: [{ peer_id: Number(context.peerId), coins: Number(_coin), type: _cmd[1], number: Number(_num) }] } } });
      if (_realgame.newgamew == true) {
        _thisGame = await gamekubik.getGame(context.peerId);
        await context.send(`[id${context.senderId}|${_user.name}], успешная ставка ${util.number_format(_coin)} PC на ${_name[_cmd[1]]} ${(_cmd[1] == `number` ? _num : ``)} \n Новая игра создана! Хэш игры: ${_thisGame.game.hash.hash}`);
      } else await context.send(`[id${context.senderId}|${_user.name}], успешная ставка ${util.number_format(_coin)} PC на ${_name[_cmd[1]]} ${(_cmd[1] == `number` ? _num : ``)}`);
    }

  }

};
