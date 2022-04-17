const md5 = require('md5');
const fs = require('fs');
const path = require('path');
const db = require('./db');
const vk = require('./vk');
const util = require('./util');
const { upload } = vk;

let _conv = [];

let history = [];



let _this = module.exports = {

  getGame: async (peer_id) => {
    let _game = (!_conv[peer_id] ? _this.newGame(peer_id) : _conv[peer_id]);
    let _users = await db.get().collection('users').find({ inGame: { $ne: [] } }).toArray();
    return { game: _conv[peer_id], users: _users };
  },

  realGame: async (peer_id) => {
    var newgamev = false;
    let _game;
    if(_conv[peer_id] == null) newgamev = true;
    

    return { newgamew: newgamev  };
  },
  
  historyGame: async () => {
    return {historygam: history}
  },



  newGame: (peer_id) => {
    let _randNumber = util.random(1, 6);
    let _randString = util.str_rand(14);

    _conv[peer_id] = {
      peer_id: peer_id,
      timer: setTimeout(() => _this.winGame(peer_id), 35000),
      time: Math.floor(new Date() / 1000) + 35,
      hash: {
        hash: _this.getHash(`${_randNumber}|${_randString}`),
        str: _randString,
        number: _randNumber
      }
    }
    console.log(`${_randNumber}|${_randString}`)
    console.log(`[ НоваяХуйня ] [ ${peer_id} ] - ${_randNumber}|${_randString}`);
    console.log(`[ hash ] - ${_conv[peer_id].hash.hash}`);

    return _conv[peer_id];
  },


  winGame: async (peer_id) => {
    
    let _thisGame = await _this.getGame(peer_id);
    let _hash = _thisGame.game.hash;
    if (_thisGame.users.length == 0) {
      console.log(`[ winGame ] [ ${peer_id} ] - конец раунда!`);
      _conv = [];
      return;
    }
    
    let str = `🎲 Выпало число ${_thisGame.game.hash.number}!<br><br>`;
    let _name = { 'even': `чётное`, 'noteven': `нечётное` ,'q': `1`, 'w': `2`, 'e': `3`, 'r': `4`, 't': `5`, 'y': `6`, };

    


    var bulk = db.get().collection('users').initializeUnorderedBulkOp(); let _find = false;
    _thisGame.users.forEach((res, i) => {
      res.inGame.forEach((g, k) => {
        if (g.peer_id == Number(peer_id)) {
          if ( (g.type == `even` && _hash.number % 2 == 0 && _hash.number != 0) || (g.type == `noteven` && _hash.number % 2 != 0 && _hash.number != 0)) {

            str += `✅ [id${res.uid}|${res.name}] - ставка ${util.number_format(g.coins)} на ${_name[g.type]} выиграла! (+${util.number_format(g.coins * 1.8) })<br>`;
            bulk.find({ uid: Number(res.uid) }).update({ $inc: { win: +Number(g.coins * 1.8 - g.coins), winround: +1, balance: +Number(g.coins * 1.8) }, $pull: { inGame: { $in: [g] } } });
          }
          else if (g.type == `q` && _hash.number == 1) {
            str += `✅ [id${res.uid}|${res.name}] - ставка ${util.number_format(g.coins)} на число 1 выиграла! (+${util.number_format(Number(g.coins * 4.6) )})<br>`;
            bulk.find({ uid: Number(res.uid) }).update({ $inc: { win: +Number(g.coins * 4.6 - g.coins), winround: +1, balance: +Number(g.coins * 4.6) }, $pull: { inGame: { $in: [g] } } });
          }
          else if (g.type == `w` && _hash.number == 2) {
            str += `✅ [id${res.uid}|${res.name}] - ставка ${util.number_format(g.coins)} на число 2 выиграла! (+${util.number_format(Number(g.coins * 4.6) )})<br>`;
            bulk.find({ uid: Number(res.uid) }).update({ $inc: { win: +Number(g.coins * 4.6 - g.coins), winround: +1, balance: +Number(g.coins * 4.6) }, $pull: { inGame: { $in: [g] } } });
          }
          else if (g.type == `e` && _hash.number == 3) {
            str += `✅ [id${res.uid}|${res.name}] - ставка ${util.number_format(g.coins)} на число 3 выиграла! (+${util.number_format(Number(g.coins * 4.6) )})<br>`;
            bulk.find({ uid: Number(res.uid) }).update({ $inc: { win: +Number(g.coins * 4.6 - g.coins), winround: +1, balance: +Number(g.coins * 4.6) }, $pull: { inGame: { $in: [g] } } });
          }
          else if (g.type == `r` && _hash.number == 4) {
            str += `✅ [id${res.uid}|${res.name}] - ставка ${util.number_format(g.coins)} на число 4 выиграла! (+${util.number_format(Number(g.coins * 4.6) )})<br>`;
            bulk.find({ uid: Number(res.uid) }).update({ $inc: { win: +Number(g.coins * 4.6 - g.coins), winround: +1, balance: +Number(g.coins * 4.6) }, $pull: { inGame: { $in: [g] } } });
          }
          else if (g.type == `t` && _hash.number == 5) {
            str += `✅ [id${res.uid}|${res.name}] - ставка ${util.number_format(g.coins)} на число 5 выиграла! (+${util.number_format(Number(g.coins * 4.6) )})<br>`;
            bulk.find({ uid: Number(res.uid) }).update({ $inc: { win: +Number(g.coins * 4.6 - g.coins), winround: +1, balance: +Number(g.coins * 4.6) }, $pull: { inGame: { $in: [g] } } });
          }
          else if (g.type == `y` && _hash.number == 6) {
            str += `✅ [id${res.uid}|${res.name}] - ставка ${util.number_format(g.coins)} на число 6 выиграла! (+${util.number_format(Number(g.coins * 4.6) )})<br>`;
            bulk.find({ uid: Number(res.uid) }).update({ $inc: { win: +Number(g.coins * 4.6 - g.coins), winround: +1, balance: +Number(g.coins * 4.6) }, $pull: { inGame: { $in: [g] } } });
          }
          else {
            str += `❌ [id${res.uid}|${res.name}] - ставка ${util.number_format(g.coins)} на ${(g.type == `number` ? `число ${g.number}` : _name[g.type])} проиграла<br>`;
            bulk.find({ uid: Number(res.uid) }).update({ $inc: { loseround: +1 }, $pull: { inGame: { $in: [g] } } });
          }

          _find = true;
        }
      })
    });
    if (!_find) {
      console.log(`[ winGame ] [ ${peer_id} ] - Игра закончилась`);
      _conv = [];
      return;
    }
    bulk.execute();
    str += `
<br> 🔑 Хеш игры: ${_thisGame.game.hash.hash}
🔒 Ключ к хешу: ${_thisGame.game.hash.number}|${_thisGame.game.hash.str}   
    `;
    let penistop = `https://vk.com/app7433551#${_thisGame.game.hash.number}|${_thisGame.game.hash.str}`



    if ((_hash.number == 1 )) {
      vk.get()._vk.api.call("messages.send", {
        peer_id: Number(_thisGame.game.peer_id),
        random_id: util.random(-200000000, 200000000),
        message: str, attachment: 'photo-208942376_457239166'
      ,
      keyboard: JSON.stringify({buttons: [[{action: {type: "open_link", label: "Проверка честности", "link": penistop}}]], inline: true })
      }).catch((err) => { console.log(`Ошибка при отправлке сообщения ${err}`); });
    }

    else if ((_hash.number == 2 )) {
      vk.get()._vk.api.call("messages.send", {
        peer_id: Number(_thisGame.game.peer_id),
        random_id: util.random(-200000000, 200000000),
        message: str, attachment: 'photo-208942376_457239167'
      ,
        keyboard: JSON.stringify({buttons: [[{action: {type: "open_link", label: "Проверка честности", "link": penistop}}]], inline: true })
      }).catch((err) => { console.log(`Ошибка при отправлке сообщения ${err}`); });
    }

    else if ((_hash.number == 3)) {
      vk.get()._vk.api.call("messages.send", {
        peer_id: Number(_thisGame.game.peer_id),
        random_id: util.random(-200000000, 200000000),
        message: str, attachment: 'photo-208942376_457239168'
      ,
        keyboard: JSON.stringify({buttons: [[{action: {type: "open_link", label: "Проверка честности", "link": penistop}}]], inline: true })
      }).catch((err) => { console.log(`Ошибка при отправлке сообщения ${err}`); });
    }

    else if ((_hash.number == 4 )) {
      vk.get()._vk.api.call("messages.send", {
        peer_id: Number(_thisGame.game.peer_id),
        random_id: util.random(-200000000, 200000000),
        message: str, attachment: 'photo-208942376_457239169'
      ,
        keyboard: JSON.stringify({buttons: [[{action: {type: "open_link", label: "Проверка честности", "link": penistop}}]], inline: true })
      }).catch((err) => { console.log(`Ошибка при отправлке сообщения ${err}`); });
    }

    else if ((_hash.number == 5 )) {
      vk.get()._vk.api.call("messages.send", {
        peer_id: Number(_thisGame.game.peer_id),
        random_id: util.random(-200000000, 200000000),
        message: str, attachment: 'photo-208942376_457239170'
      ,
        keyboard: JSON.stringify({buttons: [[{action: {type: "open_link", label: "Проверка честности", "link": penistop}}]], inline: true })
      }).catch((err) => { console.log(`Ошибка при отправлке сообщения ${err}`); });
    }

    else if ((_hash.number == 6 )) {
      vk.get()._vk.api.call("messages.send", {
        peer_id: Number(_thisGame.game.peer_id),
        random_id: util.random(-200000000, 200000000),
        message: str, attachment: 'photo-208942376_457239171'
      ,
        keyboard: JSON.stringify({buttons: [[{action: {type: "open_link", label: "Проверка честности", "link": penistop}}]], inline: true })
      }).catch((err) => { console.log(`Ошибка при отправлке сообщения ${err}`); });
    }


    console.log(`[ winGame ] [ ${peer_id} ] - Игра закончилась`);
    _conv = [];

  },

  setGameRes: (peer_id, number, color) => {
    console.log(`[ setGameRes ]: ${peer_id}`, !peer_id, !number, !_conv[peer_id]);
    if (!peer_id || !number || !color || !_conv[peer_id]) {
      return 0;
    }
    let _backup = { number: _conv[peer_id].hash.number };
    _conv[peer_id].hash.number = number;
    return { old: _backup, new: _conv[peer_id] };
  },

  getHash: (str) => {
    return md5(`${str}`)
  },

  getKeyboard: () => {
    var Keyboard = vk.get().Keyboard;
    return Keyboard.keyboard([
      [
        Keyboard.textButton({ label: '🕹Банк', payload: { command: 'bank' }, color: Keyboard.POSITIVE_COLOR }),
        Keyboard.textButton({ label: '💰Баланс', payload: { command: 'balance' }, color: Keyboard.POSITIVE_COLOR }),
      ],
      [
        Keyboard.textButton({ label: 'Чётное', payload: { command: 'deposit_even' }, color: Keyboard.PRIMARY_COLOR }),
        Keyboard.textButton({ label: 'Нечётное', payload: { command: 'deposit_noteven' }, color: Keyboard.PRIMARY_COLOR }),
      ],
      [
        Keyboard.textButton({ label: '1', payload: { command: 'deposit_q' }, color: Keyboard.SECONDARY_COLOR }),
        Keyboard.textButton({ label: '2', payload: { command: 'deposit_w' }, color: Keyboard.SECONDARY_COLOR }),
        Keyboard.textButton({ label: '3', payload: { command: 'deposit_e' }, color: Keyboard.SECONDARY_COLOR }),
      ],
      [
        Keyboard.textButton({ label: '4', payload: { command: 'deposit_r' }, color: Keyboard.SECONDARY_COLOR }),
        Keyboard.textButton({ label: '5', payload: { command: 'deposit_t' }, color: Keyboard.SECONDARY_COLOR }),
        Keyboard.textButton({ label: '6', payload: { command: 'deposit_y' }, color: Keyboard.SECONDARY_COLOR }),
      ],
    ]);
  },
  getPrivateKeyboard: () => {
    var Keyboard = vk.get().Keyboard;
    return Keyboard.keyboard([
      Keyboard.textButton({ label: '🌱Играть', payload: { command: 'getConversation' }, color: Keyboard.POSITIVE_COLOR }),
      [
        Keyboard.textButton({ label: '🗿Как играть', payload: { command: 'how_play' }, color: Keyboard.PRIMARY_COLOR }),
        Keyboard.textButton({ label: '🍡Топ дня', payload: { command: 'top_players' }, color: Keyboard.NEGATIVE_COLOR }),
      ],

      Keyboard.textButton({ label: '💼Профиль', payload: { command: 'profile' }, color: Keyboard.SECONDARY_COLOR }),
    ]);
  }
}

