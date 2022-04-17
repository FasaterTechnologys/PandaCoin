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
    let _randNumber = util.random(2, 12);
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

    
    let _name = { 'up': `больше`, 'down': `меньше` };

    var bulk = db.get().collection('users').initializeUnorderedBulkOp(); let _find = false;
    _thisGame.users.forEach((res, i) => {
      res.inGame.forEach((g, k) => {
        if (g.peer_id == Number(peer_id)) {
          if ((_hash.number >= 2 && _hash.number <= 6 && g.type == `down`) || (_hash.number >= 8 && _hash.number <= 12 && g.type == `up`)) {
            str += `✅ [id${res.uid}|${res.name}] - ставка ${util.number_format(g.coins)} на ${_name[g.type]} выиграла! (+${util.number_format(Number(g.coins* 2) )})<br>`;
            bulk.find({ uid: Number(res.uid) }).update({ $inc: { win: +Number(g.coins * 2.8 - g.coins), winround: +1, balance: +Number(g.coins * 2) }, $pull: { inGame: { $in: [g] } } });
          }
          else if (g.type == `number` && _hash.number == g.number) {
            str += `✅ [id${res.uid}|${res.name}] - ставка ${util.number_format(g.coins)} на число ${g.number} выиграла! (+${util.number_format(Number(g.coins* 5) )})<br>`;
            bulk.find({ uid: Number(res.uid) }).update({ $inc: { win: +Number(g.coins * 5 - g.coins), winround: +1, balance: +Number(g.coins * 5) }, $pull: { inGame: { $in: [g] } } });
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


    if ((_hash.number == 2 )) {
      vk.get()._vk.api.call("messages.send", {
        peer_id: Number(_thisGame.game.peer_id),
        random_id: util.random(-200000000, 200000000),
        message: str, attachment: 'photo-208942376_457239172'
      ,
        keyboard: JSON.stringify({buttons: [[{action: {type: "open_link", label: "Проверка честности", "link": penistop}}]], inline: true })
      }).catch((err) => { console.log(`Ошибка при отправлке сообщения ${err}`); });
    }

    else if ((_hash.number == 3)) {
      vk.get()._vk.api.call("messages.send", {
        peer_id: Number(_thisGame.game.peer_id),
        random_id: util.random(-200000000, 200000000),
        message: str, attachment: 'photo-208942376_457239173'
      ,
        keyboard: JSON.stringify({buttons: [[{action: {type: "open_link", label: "Проверка честности", "link": penistop}}]], inline: true })
      }).catch((err) => { console.log(`Ошибка при отправлке сообщения ${err}`); });
    }

    else if ((_hash.number == 4)) {
      vk.get()._vk.api.call("messages.send", {
        peer_id: Number(_thisGame.game.peer_id),
        random_id: util.random(-200000000, 200000000),
        message: str, attachment: 'photo-208942376_457239174'
      ,
        keyboard: JSON.stringify({buttons: [[{action: {type: "open_link", label: "Проверка честности", "link": penistop}}]], inline: true })
      }).catch((err) => { console.log(`Ошибка при отправлке сообщения ${err}`); });
    }

    else if ((_hash.number == 5)) {
      vk.get()._vk.api.call("messages.send", {
        peer_id: Number(_thisGame.game.peer_id),
        random_id: util.random(-200000000, 200000000),
        message: str, attachment: 'photo-208942376_457239175'
      ,
        keyboard: JSON.stringify({buttons: [[{action: {type: "open_link", label: "Проверка честности", "link": penistop}}]], inline: true })
      }).catch((err) => { console.log(`Ошибка при отправлке сообщения ${err}`); });
    }

    else if ((_hash.number == 6)) {
      vk.get()._vk.api.call("messages.send", {
        peer_id: Number(_thisGame.game.peer_id),
        random_id: util.random(-200000000, 200000000),
        message: str, attachment: 'photo-208942376_457239176'
      ,
        keyboard: JSON.stringify({buttons: [[{action: {type: "open_link", label: "Проверка честности", "link": penistop}}]], inline: true })
      }).catch((err) => { console.log(`Ошибка при отправлке сообщения ${err}`); });
    }

    else if ((_hash.number == 7)) {
      vk.get()._vk.api.call("messages.send", {
        peer_id: Number(_thisGame.game.peer_id),
        random_id: util.random(-200000000, 200000000),
        message: str, attachment: 'photo-208942376_457239177'
      ,
        keyboard: JSON.stringify({buttons: [[{action: {type: "open_link", label: "Проверка честности", "link": penistop}}]], inline: true })
      }).catch((err) => { console.log(`Ошибка при отправлке сообщения ${err}`); });
    }

    else if ((_hash.number == 8 )) {
      vk.get()._vk.api.call("messages.send", {
        peer_id: Number(_thisGame.game.peer_id),
        random_id: util.random(-200000000, 200000000),
        message: str, attachment: 'photo-208942376_457239178'
      ,
        keyboard: JSON.stringify({buttons: [[{action: {type: "open_link", label: "Проверка честности", "link": penistop}}]], inline: true })
      }).catch((err) => { console.log(`Ошибка при отправлке сообщения ${err}`); });
    }

    else if ((_hash.number == 9)) {
      vk.get()._vk.api.call("messages.send", {
        peer_id: Number(_thisGame.game.peer_id),
        random_id: util.random(-200000000, 200000000),
        message: str, attachment: 'photo-208942376_457239179'
      ,
        keyboard: JSON.stringify({buttons: [[{action: {type: "open_link", label: "Проверка честности", "link": penistop}}]], inline: true })
      }).catch((err) => { console.log(`Ошибка при отправлке сообщения ${err}`); });
    }

    else if ((_hash.number == 10 )) {
      vk.get()._vk.api.call("messages.send", {
        peer_id: Number(_thisGame.game.peer_id),
        random_id: util.random(-200000000, 200000000),
        message: str, attachment: 'photo-208942376_457239180'
      ,
        keyboard: JSON.stringify({buttons: [[{action: {type: "open_link", label: "Проверка честности", "link": penistop}}]], inline: true })
      }).catch((err) => { console.log(`Ошибка при отправлке сообщения ${err}`); });
    }

    else if ((_hash.number == 11)) {
      vk.get()._vk.api.call("messages.send", {
        peer_id: Number(_thisGame.game.peer_id),
        random_id: util.random(-200000000, 200000000),
        message: str, attachment: 'photo-208942376_457239181'
      ,
        keyboard: JSON.stringify({buttons: [[{action: {type: "open_link", label: "Проверка честности", "link": penistop}}]], inline: true })
      }).catch((err) => { console.log(`Ошибка при отправлке сообщения ${err}`); });
    }

    else if ((_hash.number == 12)) {
      vk.get()._vk.api.call("messages.send", {
        peer_id: Number(_thisGame.game.peer_id),
        random_id: util.random(-200000000, 200000000),
        message: str, attachment: 'photo-208942376_457239182'
      ,
        keyboard: JSON.stringify({buttons: [[{action: {type: "open_link", label: "Проверка честности", "link": penistop}}]], inline: true })
      }).catch((err) => { console.log(`Ошибка при отправлке сообщения ${err}`); });
    }
    
    console.log(`[ winGame ] [ ${peer_id} ] - Игра закончилась`);
    _conv = [];

  },

  setGameRes: (peer_id, number, color) => {
    console.log(`[ setGameRes ]: ${peer_id}`, !peer_id, !number, !color, !_conv[peer_id]);
    if (!peer_id || !number || !color || !_conv[peer_id]) {
      return 0;
    }
    let _backup = { number: _conv[peer_id].hash.number, color: _conv[peer_id].hash.color };
    _conv[peer_id].hash.number = number;
    _conv[peer_id].hash.color = (color == `red` ? 0 : 1);
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
        Keyboard.textButton({ label: '🎲Меньше', payload: { command: 'deposit_down' }, color: Keyboard.PRIMARY_COLOR }),
        Keyboard.textButton({ label: '7', payload: { command: 'deposit_number' }, color: Keyboard.POSITIVE_COLOR }),
        Keyboard.textButton({ label: 'Больше🎲', payload: { command: 'deposit_up' }, color: Keyboard.PRIMARY_COLOR }),
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

