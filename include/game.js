const md5 = require('md5');
const fs = require('fs');
const path = require('path');
const db = require('./db');
const vk = require('./vk');
const util = require('./util');
const { upload } = vk;

let _conv = [];

let history = [];

let _gey = [];



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
  reterConv: async (id) => {
  
    return { pena: _gey[id]  };
  },
  cupConv: async (id, mass) => {
    
    _gey[id] = {check: mass}
    return { pena: _gey[id]  };
  },
  nullConv: async (id, mass) => {
    _gey[id] = null
    console.log("очистка")
    return { pena: true  };
  },
  
  historyGame: async () => {
    return {historygam: history}
  },



  newGame: (peer_id) => {
    let _randNumber = util.random(0, 24);
    let _randColor = util.random(0, 1);
    let _randString = util.str_rand(14);

    _conv[peer_id] = {
      peer_id: peer_id,
      timer: setTimeout(() => _this.winGame(peer_id), 35000),
      time: Math.floor(new Date() / 1000) + 35,
      hash: {
        hash: _this.getHash(`${_randNumber}|${(_randNumber == 0 ? `green` : (_randColor ? `black` : `red`))}|${_randString}`),
        str: _randString,
        color: _randNumber == 0 ? 3 :  _randColor,
        number: _randNumber
      }
    }
    console.log(`${_randNumber}|${(_randNumber == 0 ? `green` : (_randColor ? `black` : `red`))}|${_randString}`)
    console.log(`[ НоваяХуйня ] [ ${peer_id} ] - ${_randNumber}|${(_randNumber == 0 ? `green` : (_randColor ? `black` : `red`))}|${_randString}`);
    console.log(`[ hash ] - ${_conv[peer_id].hash.hash}`);

    return _conv[peer_id];
  },


  winGame: async (peer_id) => {
    
    let _thisGame = await _this.getGame(peer_id);
    let _hash = _thisGame.game.hash;
    if (_thisGame.users.length == 0) {
      console.log(`[ winGame ] [ ${peer_id} ] - конец раунда!`);
      _conv[peer_id] = null
      return;
    }
    const cont = await vk.get()._vk.api.call("messages.getConversationMembers", {
			peer_id: peer_id,
			random_id: util.random(-200000000, 200000000) });
    
    let str = `🎰 Выпало число ${_thisGame.game.hash.number}, ${(_thisGame.game.hash.number == 0 ? `зеленое` : (_thisGame.game.hash.color ? `чёрное` : `красное`))}!<br><br>`;
    let _name = { 'red': `красное`, 'black': `чёрное`, 'even': `чётное`, 'noteven': `нечётное`, 'apro': `промежуток 1-8`, 'bpro': `промежуток 9-16`, 'cpro': `промежуток 17-24` };

    


    var bulk = db.get().collection('users').initializeUnorderedBulkOp(); let _find = false;
    _thisGame.users.forEach((res, i) => {
      res.inGame.forEach((g, k) => {
        if (g.peer_id == Number(peer_id)) {
          if ((g.type == `black` && _hash.color == 1 && _hash.color < 2) || (g.type == `red` && _hash.color == 0 && _hash.color < 1) || (g.type == `even` && _hash.number % 2 == 0 && _hash.number != 0) || (g.type == `noteven` && _hash.number % 2 != 0 && _hash.number != 0)) {

            str += `✅ [id${res.uid}|${res.name}] - ставка ${util.number_format(g.coins)} на ${_name[g.type]} выиграла! (+${util.number_format(g.coins* 1.9) })<br>`;
            bulk.find({ uid: Number(res.uid) }).update({ $inc: { win: +Number(g.coins * 1.9 - g.coins), winround: +1, balance: +Number(g.coins * 1.9) }, $pull: { inGame: { $in: [g] } } });
            if(Number(cont.items[0].member_id != Number(res.uid)))bulk.find({ uid: Number(cont.items[0].member_id) }).update({ $inc: { bonus: +Number((g.coins * 1.9) * 3 / 100) } });
          }
          else if (g.type == `number` && _hash.number == g.number) {
            str += `✅ [id${res.uid}|${res.name}] - ставка ${util.number_format(g.coins)} на число ${g.number} выиграла! (+${util.number_format(Number(g.coins* 15) )})<br>`;
            bulk.find({ uid: Number(res.uid) }).update({ $inc: { win: +Number(g.coins * 8 - g.coins), winround: +1, balance: +Number(g.coins * 15) }, $pull: { inGame: { $in: [g] } } });
            if(Number(cont.items[0].member_id != Number(res.uid)))bulk.find({ uid: Number(cont.items[0].member_id) }).update({ $inc: { bonus: +Number((g.coins * 15) * 3 / 100) } });
          }
          else if ((_hash.number >= 17 && _hash.number <= 24 && g.type == `cpro`) || (_hash.number >= 1 && _hash.number <= 8 && g.type == `apro`) || (_hash.number >= 9 && _hash.number <= 16 && g.type == `bpro`)) {
            str += `✅ [id${res.uid}|${res.name}] - ставка ${util.number_format(g.coins)} на ${_name[g.type]} выиграла! (+${util.number_format(Number(g.coins* 2.8) )})<br>`;
            bulk.find({ uid: Number(res.uid) }).update({ $inc: { win: +Number(g.coins * 2.8 - g.coins), winround: +1, balance: +Number(g.coins * 2.8) }, $pull: { inGame: { $in: [g] } } });
            if(Number(cont.items[0].member_id != Number(res.uid)))bulk.find({ uid: Number(cont.items[0].member_id) }).update({ $inc: { bonus: +Number((g.coins * 2.8) * 3 / 100) } });
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
      _conv[peer_id] = null
      return;
    }
    bulk.execute();
    str += `
<br> 🔑 Хеш игры: ${_thisGame.game.hash.hash}
🔒 Ключ к хешу: ${_thisGame.game.hash.number}|${_thisGame.game.hash.number == 0 ? `green` : (_thisGame.game.hash.color ? `black` : `red`)}|${_thisGame.game.hash.str}   
    `;
    let penistop = `https://vk.com/app7433551#${_thisGame.game.hash.number}|${_thisGame.game.hash.number == 0 ? `green` : (_thisGame.game.hash.color ? `black` : `red`)}|${_thisGame.game.hash.str}`
    if ((_hash.number == 0)) {
      vk.get()._vk.api.call("messages.send", {
        peer_id: Number(_thisGame.game.peer_id),
        random_id: util.random(-200000000, 200000000),
        message: str, attachment: 'photo-208942376_457239163',
        keyboard: JSON.stringify({buttons: [[{action: {type: "open_link", label: "Проверка честности", "link": penistop}}]], inline: true })
      }).catch((err) => { console.log(`Ошибка при отправлке сообщения ${err}`); });
    }




    else if ((_hash.number == 1 && _hash.color == 1)) {
      vk.get()._vk.api.call("messages.send", {
        peer_id: Number(_thisGame.game.peer_id),
        random_id: util.random(-200000000, 200000000),
        message: str, attachment: 'photo-208942376_457239116'
      ,
      keyboard: JSON.stringify({buttons: [[{action: {type: "open_link", label: "Проверка честности", "link": penistop}}]], inline: true })
      }).catch((err) => { console.log(`Ошибка при отправлке сообщения ${err}`); });
    }

    else if ((_hash.number == 2 && _hash.color == 1)) {
      vk.get()._vk.api.call("messages.send", {
        peer_id: Number(_thisGame.game.peer_id),
        random_id: util.random(-200000000, 200000000),
        message: str, attachment: 'photo-208942376_457239117'
      ,
        keyboard: JSON.stringify({buttons: [[{action: {type: "open_link", label: "Проверка честности", "link": penistop}}]], inline: true })
      }).catch((err) => { console.log(`Ошибка при отправлке сообщения ${err}`); });
    }

    else if ((_hash.number == 3 && _hash.color == 1)) {
      vk.get()._vk.api.call("messages.send", {
        peer_id: Number(_thisGame.game.peer_id),
        random_id: util.random(-200000000, 200000000),
        message: str, attachment: 'photo-208942376_457239118'
      ,
        keyboard: JSON.stringify({buttons: [[{action: {type: "open_link", label: "Проверка честности", "link": penistop}}]], inline: true })
      }).catch((err) => { console.log(`Ошибка при отправлке сообщения ${err}`); });
    }

    else if ((_hash.number == 4 && _hash.color == 1)) {
      vk.get()._vk.api.call("messages.send", {
        peer_id: Number(_thisGame.game.peer_id),
        random_id: util.random(-200000000, 200000000),
        message: str, attachment: 'photo-208942376_457239119'
      ,
        keyboard: JSON.stringify({buttons: [[{action: {type: "open_link", label: "Проверка честности", "link": penistop}}]], inline: true })
      }).catch((err) => { console.log(`Ошибка при отправлке сообщения ${err}`); });
    }

    else if ((_hash.number == 5 && _hash.color == 1)) {
      vk.get()._vk.api.call("messages.send", {
        peer_id: Number(_thisGame.game.peer_id),
        random_id: util.random(-200000000, 200000000),
        message: str, attachment: 'photo-208942376_457239120'
      ,
        keyboard: JSON.stringify({buttons: [[{action: {type: "open_link", label: "Проверка честности", "link": penistop}}]], inline: true })
      }).catch((err) => { console.log(`Ошибка при отправлке сообщения ${err}`); });
    }

    else if ((_hash.number == 6 && _hash.color == 1)) {
      vk.get()._vk.api.call("messages.send", {
        peer_id: Number(_thisGame.game.peer_id),
        random_id: util.random(-200000000, 200000000),
        message: str, attachment: 'photo-208942376_457239121'
      ,
        keyboard: JSON.stringify({buttons: [[{action: {type: "open_link", label: "Проверка честности", "link": penistop}}]], inline: true })
      }).catch((err) => { console.log(`Ошибка при отправлке сообщения ${err}`); });
    }

    else if ((_hash.number == 7 && _hash.color == 1)) {
      vk.get()._vk.api.call("messages.send", {
        peer_id: Number(_thisGame.game.peer_id),
        random_id: util.random(-200000000, 200000000),
        message: str, attachment: 'photo-208942376_457239122'
      ,
        keyboard: JSON.stringify({buttons: [[{action: {type: "open_link", label: "Проверка честности", "link": penistop}}]], inline: true })
      }).catch((err) => { console.log(`Ошибка при отправлке сообщения ${err}`); });
    }

    else if ((_hash.number == 8 && _hash.color == 1)) {
      vk.get()._vk.api.call("messages.send", {
        peer_id: Number(_thisGame.game.peer_id),
        random_id: util.random(-200000000, 200000000),
        message: str, attachment: 'photo-208942376_457239123'
      ,
        keyboard: JSON.stringify({buttons: [[{action: {type: "open_link", label: "Проверка честности", "link": penistop}}]], inline: true })
      }).catch((err) => { console.log(`Ошибка при отправлке сообщения ${err}`); });
    }

    else if ((_hash.number == 9 && _hash.color == 1)) {
      vk.get()._vk.api.call("messages.send", {
        peer_id: Number(_thisGame.game.peer_id),
        random_id: util.random(-200000000, 200000000),
        message: str, attachment: 'photo-208942376_457239124'
      ,
        keyboard: JSON.stringify({buttons: [[{action: {type: "open_link", label: "Проверка честности", "link": penistop}}]], inline: true })
      }).catch((err) => { console.log(`Ошибка при отправлке сообщения ${err}`); });
    }

    else if ((_hash.number == 10 && _hash.color == 1)) {
      vk.get()._vk.api.call("messages.send", {
        peer_id: Number(_thisGame.game.peer_id),
        random_id: util.random(-200000000, 200000000),
        message: str, attachment: 'photo-208942376_457239125'
      ,
        keyboard: JSON.stringify({buttons: [[{action: {type: "open_link", label: "Проверка честности", "link": penistop}}]], inline: true })
      }).catch((err) => { console.log(`Ошибка при отправлке сообщения ${err}`); });
    }

    else if ((_hash.number == 11 && _hash.color == 1)) {
      vk.get()._vk.api.call("messages.send", {
        peer_id: Number(_thisGame.game.peer_id),
        random_id: util.random(-200000000, 200000000),
        message: str, attachment: 'photo-208942376_457239126'
      ,
        keyboard: JSON.stringify({buttons: [[{action: {type: "open_link", label: "Проверка честности", "link": penistop}}]], inline: true })
      }).catch((err) => { console.log(`Ошибка при отправлке сообщения ${err}`); });
    }

    else if ((_hash.number == 12 && _hash.color == 1)) {
      vk.get()._vk.api.call("messages.send", {
        peer_id: Number(_thisGame.game.peer_id),
        random_id: util.random(-200000000, 200000000),
        message: str, attachment: 'photo-208942376_457239127'
      ,
        keyboard: JSON.stringify({buttons: [[{action: {type: "open_link", label: "Проверка честности", "link": penistop}}]], inline: true })
      }).catch((err) => { console.log(`Ошибка при отправлке сообщения ${err}`); });
    }

    else if ((_hash.number == 13 && _hash.color == 1)) {
      vk.get()._vk.api.call("messages.send", {
        peer_id: Number(_thisGame.game.peer_id),
        random_id: util.random(-200000000, 200000000),
        message: str, attachment: 'photo-208942376_457239128'
      ,
        keyboard: JSON.stringify({buttons: [[{action: {type: "open_link", label: "Проверка честности", "link": penistop}}]], inline: true })
      }).catch((err) => { console.log(`Ошибка при отправлке сообщения ${err}`); });
    }

    else if ((_hash.number == 14 && _hash.color == 1)) {
      vk.get()._vk.api.call("messages.send", {
        peer_id: Number(_thisGame.game.peer_id),
        random_id: util.random(-200000000, 200000000),
        message: str, attachment: 'photo-208942376_457239129'
      ,
        keyboard: JSON.stringify({buttons: [[{action: {type: "open_link", label: "Проверка честности", "link": penistop}}]], inline: true })
      }).catch((err) => { console.log(`Ошибка при отправлке сообщения ${err}`); });
    }

    else if ((_hash.number == 15 && _hash.color == 1)) {
      vk.get()._vk.api.call("messages.send", {
        peer_id: Number(_thisGame.game.peer_id),
        random_id: util.random(-200000000, 200000000),
        message: str, attachment: 'photo-208942376_457239130'
      ,
        keyboard: JSON.stringify({buttons: [[{action: {type: "open_link", label: "Проверка честности", "link": penistop}}]], inline: true })
      }).catch((err) => { console.log(`Ошибка при отправлке сообщения ${err}`); });
    }

    else if ((_hash.number == 16 && _hash.color == 1)) {
      vk.get()._vk.api.call("messages.send", {
        peer_id: Number(_thisGame.game.peer_id),
        random_id: util.random(-200000000, 200000000),
        message: str, attachment: 'photo-208942376_457239131'
      ,
        keyboard: JSON.stringify({buttons: [[{action: {type: "open_link", label: "Проверка честности", "link": penistop}}]], inline: true })
      }).catch((err) => { console.log(`Ошибка при отправлке сообщения ${err}`); });
    }

    else if ((_hash.number == 17 && _hash.color == 1)) {
      vk.get()._vk.api.call("messages.send", {
        peer_id: Number(_thisGame.game.peer_id),
        random_id: util.random(-200000000, 200000000),
        message: str, attachment: 'photo-208942376_457239132'
      ,
        keyboard: JSON.stringify({buttons: [[{action: {type: "open_link", label: "Проверка честности", "link": penistop}}]], inline: true })
      }).catch((err) => { console.log(`Ошибка при отправлке сообщения ${err}`); });
    }

    else if ((_hash.number == 18 && _hash.color == 1)) {
      vk.get()._vk.api.call("messages.send", {
        peer_id: Number(_thisGame.game.peer_id),
        random_id: util.random(-200000000, 200000000),
        message: str, attachment: 'photo-208942376_457239133'
      ,
        keyboard: JSON.stringify({buttons: [[{action: {type: "open_link", label: "Проверка честности", "link": penistop}}]], inline: true })
      }).catch((err) => { console.log(`Ошибка при отправлке сообщения ${err}`); });
    }

    else if ((_hash.number == 19 && _hash.color == 1)) {
      vk.get()._vk.api.call("messages.send", {
        peer_id: Number(_thisGame.game.peer_id),
        random_id: util.random(-200000000, 200000000),
        message: str, attachment: 'photo-208942376_457239134'
      ,
        keyboard: JSON.stringify({buttons: [[{action: {type: "open_link", label: "Проверка честности", "link": penistop}}]], inline: true })
      }).catch((err) => { console.log(`Ошибка при отправлке сообщения ${err}`); });
    }

    else if ((_hash.number == 20 && _hash.color == 1)) {
      vk.get()._vk.api.call("messages.send", {
        peer_id: Number(_thisGame.game.peer_id),
        random_id: util.random(-200000000, 200000000),
        message: str, attachment: 'photo-208942376_457239135'
      ,
        keyboard: JSON.stringify({buttons: [[{action: {type: "open_link", label: "Проверка честности", "link": penistop}}]], inline: true })
      }).catch((err) => { console.log(`Ошибка при отправлке сообщения ${err}`); });
    }

    else if ((_hash.number == 21 && _hash.color == 1)) {
      vk.get()._vk.api.call("messages.send", {
        peer_id: Number(_thisGame.game.peer_id),
        random_id: util.random(-200000000, 200000000),
        message: str, attachment: 'photo-208942376_457239164'
      ,
        keyboard: JSON.stringify({buttons: [[{action: {type: "open_link", label: "Проверка честности", "link": penistop}}]], inline: true })
      }).catch((err) => { console.log(`Ошибка при отправлке сообщения ${err}`); });
    }

    else if ((_hash.number == 22 && _hash.color == 1)) {
      vk.get()._vk.api.call("messages.send", {
        peer_id: Number(_thisGame.game.peer_id),
        random_id: util.random(-200000000, 200000000),
        message: str, attachment: 'photo-208942376_457239136'
      ,
        keyboard: JSON.stringify({buttons: [[{action: {type: "open_link", label: "Проверка честности", "link": penistop}}]], inline: true })
      }).catch((err) => { console.log(`Ошибка при отправлке сообщения ${err}`); });
    }

    else if ((_hash.number == 23 && _hash.color == 1)) {
      vk.get()._vk.api.call("messages.send", {
        peer_id: Number(_thisGame.game.peer_id),
        random_id: util.random(-200000000, 200000000),
        message: str, attachment: 'photo-208942376_457239137'
      ,
        keyboard: JSON.stringify({buttons: [[{action: {type: "open_link", label: "Проверка честности", "link": penistop}}]], inline: true })
      }).catch((err) => { console.log(`Ошибка при отправлке сообщения ${err}`); });
    }

    else if ((_hash.number == 24 && _hash.color == 1)) {
      vk.get()._vk.api.call("messages.send", {
        peer_id: Number(_thisGame.game.peer_id),
        random_id: util.random(-200000000, 200000000),
        message: str, attachment: 'photo-208942376_457239138'
      ,
        keyboard: JSON.stringify({buttons: [[{action: {type: "open_link", label: "Проверка честности", "link": penistop}}]], inline: true })
      }).catch((err) => { console.log(`Ошибка при отправлке сообщения ${err}`); });
    }

    else if ((_hash.number == 1 && _hash.color == 0)) {
      vk.get()._vk.api.call("messages.send", {
        peer_id: Number(_thisGame.game.peer_id),
        random_id: util.random(-200000000, 200000000),
        message: str, attachment: 'photo-208942376_457239139'
      ,
        keyboard: JSON.stringify({buttons: [[{action: {type: "open_link", label: "Проверка честности", "link": penistop}}]], inline: true })
      }).catch((err) => { console.log(`Ошибка при отправлке сообщения ${err}`); });
    }

    else if ((_hash.number == 2 && _hash.color == 0)) {
      vk.get()._vk.api.call("messages.send", {
        peer_id: Number(_thisGame.game.peer_id),
        random_id: util.random(-200000000, 200000000),
        message: str, attachment: 'photo-208942376_457239140'
      ,
        keyboard: JSON.stringify({buttons: [[{action: {type: "open_link", label: "Проверка честности", "link": penistop}}]], inline: true })
      }).catch((err) => { console.log(`Ошибка при отправлке сообщения ${err}`); });
    }

    else if ((_hash.number == 3 && _hash.color == 0)) {
      vk.get()._vk.api.call("messages.send", {
        peer_id: Number(_thisGame.game.peer_id),
        random_id: util.random(-200000000, 200000000),
        message: str, attachment: 'photo-208942376_457239141'
      ,
        keyboard: JSON.stringify({buttons: [[{action: {type: "open_link", label: "Проверка честности", "link": penistop}}]], inline: true })
      }).catch((err) => { console.log(`Ошибка при отправлке сообщения ${err}`); });
    }

    else if ((_hash.number == 4 && _hash.color == 0)) {
      vk.get()._vk.api.call("messages.send", {
        peer_id: Number(_thisGame.game.peer_id),
        random_id: util.random(-200000000, 200000000),
        message: str, attachment: 'photo-208942376_457239142'
      ,
        keyboard: JSON.stringify({buttons: [[{action: {type: "open_link", label: "Проверка честности", "link": penistop}}]], inline: true })
      }).catch((err) => { console.log(`Ошибка при отправлке сообщения ${err}`); });
    }

    else if ((_hash.number == 5 && _hash.color == 0)) {
      vk.get()._vk.api.call("messages.send", {
        peer_id: Number(_thisGame.game.peer_id),
        random_id: util.random(-200000000, 200000000),
        message: str, attachment: 'photo-208942376_457239143'
      ,
        keyboard: JSON.stringify({buttons: [[{action: {type: "open_link", label: "Проверка честности", "link": penistop}}]], inline: true })
      }).catch((err) => { console.log(`Ошибка при отправлке сообщения ${err}`); });
    }

    else if ((_hash.number == 6 && _hash.color == 0)) {
      vk.get()._vk.api.call("messages.send", {
        peer_id: Number(_thisGame.game.peer_id),
        random_id: util.random(-200000000, 200000000),
        message: str, attachment: 'photo-208942376_457239144'
      ,
        keyboard: JSON.stringify({buttons: [[{action: {type: "open_link", label: "Проверка честности", "link": penistop}}]], inline: true })
      }).catch((err) => { console.log(`Ошибка при отправлке сообщения ${err}`); });
    }

    else if ((_hash.number == 7 && _hash.color == 0)) {
      vk.get()._vk.api.call("messages.send", {
        peer_id: Number(_thisGame.game.peer_id),
        random_id: util.random(-200000000, 200000000),
        message: str, attachment: 'photo-208942376_457239145'
      ,
        keyboard: JSON.stringify({buttons: [[{action: {type: "open_link", label: "Проверка честности", "link": penistop}}]], inline: true })
      }).catch((err) => { console.log(`Ошибка при отправлке сообщения ${err}`); });
    }

    else if ((_hash.number == 8 && _hash.color == 0)) {
      vk.get()._vk.api.call("messages.send", {
        peer_id: Number(_thisGame.game.peer_id),
        random_id: util.random(-200000000, 200000000),
        message: str, attachment: 'photo-208942376_457239165'
      ,
        keyboard: JSON.stringify({buttons: [[{action: {type: "open_link", label: "Проверка честности", "link": penistop}}]], inline: true })
      }).catch((err) => { console.log(`Ошибка при отправлке сообщения ${err}`); });
    }

    else if ((_hash.number == 9 && _hash.color == 0)) {
      vk.get()._vk.api.call("messages.send", {
        peer_id: Number(_thisGame.game.peer_id),
        random_id: util.random(-200000000, 200000000),
        message: str, attachment: 'photo-208942376_457239147'
      ,
        keyboard: JSON.stringify({buttons: [[{action: {type: "open_link", label: "Проверка честности", "link": penistop}}]], inline: true })
      }).catch((err) => { console.log(`Ошибка при отправлке сообщения ${err}`); });
    }

    else if ((_hash.number == 10 && _hash.color == 0)) {
      vk.get()._vk.api.call("messages.send", {
        peer_id: Number(_thisGame.game.peer_id),
        random_id: util.random(-200000000, 200000000),
        message: str, attachment: 'photo-208942376_457239148'
      ,
        keyboard: JSON.stringify({buttons: [[{action: {type: "open_link", label: "Проверка честности", "link": penistop}}]], inline: true })
      }).catch((err) => { console.log(`Ошибка при отправлке сообщения ${err}`); });
    }

    else if ((_hash.number == 11 && _hash.color == 0)) {
      vk.get()._vk.api.call("messages.send", {
        peer_id: Number(_thisGame.game.peer_id),
        random_id: util.random(-200000000, 200000000),
        message: str, attachment: 'photo-208942376_457239149'
      ,
        keyboard: JSON.stringify({buttons: [[{action: {type: "open_link", label: "Проверка честности", "link": penistop}}]], inline: true })
      }).catch((err) => { console.log(`Ошибка при отправлке сообщения ${err}`); });
    }

    else if ((_hash.number == 12 && _hash.color == 0)) {
      vk.get()._vk.api.call("messages.send", {
        peer_id: Number(_thisGame.game.peer_id),
        random_id: util.random(-200000000, 200000000),
        message: str, attachment: 'photo-208942376_457239150'
      ,
        keyboard: JSON.stringify({buttons: [[{action: {type: "open_link", label: "Проверка честности", "link": penistop}}]], inline: true })
      }).catch((err) => { console.log(`Ошибка при отправлке сообщения ${err}`); });
    }

    else if ((_hash.number == 13 && _hash.color == 0)) {
      vk.get()._vk.api.call("messages.send", {
        peer_id: Number(_thisGame.game.peer_id),
        random_id: util.random(-200000000, 200000000),
        message: str, attachment: 'photo-208942376_457239151'
      ,
        keyboard: JSON.stringify({buttons: [[{action: {type: "open_link", label: "Проверка честности", "link": penistop}}]], inline: true })
      }).catch((err) => { console.log(`Ошибка при отправлке сообщения ${err}`); });
    }

    else if ((_hash.number == 14 && _hash.color == 0)) {
      vk.get()._vk.api.call("messages.send", {
        peer_id: Number(_thisGame.game.peer_id),
        random_id: util.random(-200000000, 200000000),
        message: str, attachment: 'photo-208942376_457239152'
      ,
        keyboard: JSON.stringify({buttons: [[{action: {type: "open_link", label: "Проверка честности", "link": penistop}}]], inline: true })
      }).catch((err) => { console.log(`Ошибка при отправлке сообщения ${err}`); });
    }

    else if ((_hash.number == 15 && _hash.color == 0)) {
      vk.get()._vk.api.call("messages.send", {
        peer_id: Number(_thisGame.game.peer_id),
        random_id: util.random(-200000000, 200000000),
        message: str, attachment: 'photo-208942376_457239153'
      ,
        keyboard: JSON.stringify({buttons: [[{action: {type: "open_link", label: "Проверка честности", "link": penistop}}]], inline: true })
      }).catch((err) => { console.log(`Ошибка при отправлке сообщения ${err}`); });
    }

    else if ((_hash.number == 16 && _hash.color == 0)) {
      vk.get()._vk.api.call("messages.send", {
        peer_id: Number(_thisGame.game.peer_id),
        random_id: util.random(-200000000, 200000000),
        message: str, attachment: 'photo-208942376_457239154'
      ,
        keyboard: JSON.stringify({buttons: [[{action: {type: "open_link", label: "Проверка честности", "link": penistop}}]], inline: true })
      }).catch((err) => { console.log(`Ошибка при отправлке сообщения ${err}`); });
    }

    else if ((_hash.number == 17 && _hash.color == 0)) {
      vk.get()._vk.api.call("messages.send", {
        peer_id: Number(_thisGame.game.peer_id),
        random_id: util.random(-200000000, 200000000),
        message: str, attachment: 'photo-208942376_457239155'
      ,
        keyboard: JSON.stringify({buttons: [[{action: {type: "open_link", label: "Проверка честности", "link": penistop}}]], inline: true })
      }).catch((err) => { console.log(`Ошибка при отправлке сообщения ${err}`); });
    }

    else if ((_hash.number == 18 && _hash.color == 0)) {
      vk.get()._vk.api.call("messages.send", {
        peer_id: Number(_thisGame.game.peer_id),
        random_id: util.random(-200000000, 200000000),
        message: str, attachment: 'photo-208942376_457239156'
      ,
        keyboard: JSON.stringify({buttons: [[{action: {type: "open_link", label: "Проверка честности", "link": penistop}}]], inline: true })
      }).catch((err) => { console.log(`Ошибка при отправлке сообщения ${err}`); });
    }

    else if ((_hash.number == 19 && _hash.color == 0)) {
      vk.get()._vk.api.call("messages.send", {
        peer_id: Number(_thisGame.game.peer_id),
        random_id: util.random(-200000000, 200000000),
        message: str, attachment: 'photo-208942376_457239157'
      ,
        keyboard: JSON.stringify({buttons: [[{action: {type: "open_link", label: "Проверка честности", "link": penistop}}]], inline: true })
      }).catch((err) => { console.log(`Ошибка при отправлке сообщения ${err}`); });
    }

    else if ((_hash.number == 20 && _hash.color == 0)) {
      vk.get()._vk.api.call("messages.send", {
        peer_id: Number(_thisGame.game.peer_id),
        random_id: util.random(-200000000, 200000000),
        message: str, attachment: 'photo-208942376_457239158'
      ,
        keyboard: JSON.stringify({buttons: [[{action: {type: "open_link", label: "Проверка честности", "link": penistop}}]], inline: true })
      }).catch((err) => { console.log(`Ошибка при отправлке сообщения ${err}`); });
    }

    else if ((_hash.number == 21 && _hash.color == 0)) {
      vk.get()._vk.api.call("messages.send", {
        peer_id: Number(_thisGame.game.peer_id),
        random_id: util.random(-200000000, 200000000),
        message: str, attachment: 'photo-208942376_457239159'
      ,
        keyboard: JSON.stringify({buttons: [[{action: {type: "open_link", label: "Проверка честности", "link": penistop}}]], inline: true })
      }).catch((err) => { console.log(`Ошибка при отправлке сообщения ${err}`); });
    }

    else if ((_hash.number == 22 && _hash.color == 0)) {
      vk.get()._vk.api.call("messages.send", {
        peer_id: Number(_thisGame.game.peer_id),
        random_id: util.random(-200000000, 200000000),
        message: str, attachment: 'photo-208942376_457239160'
      ,
        keyboard: JSON.stringify({buttons: [[{action: {type: "open_link", label: "Проверка честности", "link": penistop}}]], inline: true })
      }).catch((err) => { console.log(`Ошибка при отправлке сообщения ${err}`); });
    }

    else if ((_hash.number == 23 && _hash.color == 0)) {
      vk.get()._vk.api.call("messages.send", {
        peer_id: Number(_thisGame.game.peer_id),
        random_id: util.random(-200000000, 200000000),
        message: str, attachment: 'photo-208942376_457239161'
      ,
        keyboard: JSON.stringify({buttons: [[{action: {type: "open_link", label: "Проверка честности", "link": penistop}}]], inline: true })
      }).catch((err) => { console.log(`Ошибка при отправлке сообщения ${err}`); });
    }

    else if ((_hash.number == 24 && _hash.color == 0)) {
      vk.get()._vk.api.call("messages.send", {
        peer_id: Number(_thisGame.game.peer_id),
        random_id: util.random(-200000000, 200000000),
        message: str, attachment: 'photo-208942376_457239162'
      ,
        keyboard: JSON.stringify({buttons: [[{action: {type: "open_link", label: "Проверка честности", "link": penistop}}]], inline: true })
      }).catch((err) => { console.log(`Ошибка при отправлке сообщения ${err}`); });
    }

    console.log(`[ winGame ] [ ${peer_id} ] - Игра закончилась`);
    _conv[peer_id] = null

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
        Keyboard.textButton({ label: 'Чётное', payload: { command: 'deposit_even' }, color: Keyboard.SECONDARY_COLOR }),
        Keyboard.textButton({ label: 'Нечётное', payload: { command: 'deposit_noteven' }, color: Keyboard.SECONDARY_COLOR }),
      ],
      [
        Keyboard.textButton({ label: '1-8', payload: { command: 'deposit_apro' }, color: Keyboard.SECONDARY_COLOR }),
        Keyboard.textButton({ label: '9-16', payload: { command: 'deposit_bpro' }, color: Keyboard.SECONDARY_COLOR }),
        Keyboard.textButton({ label: '17-24', payload: { command: 'deposit_cpro' }, color: Keyboard.SECONDARY_COLOR }),
      ],
      [
        Keyboard.textButton({ label: 'Красное', payload: { command: 'deposit_red' }, color: Keyboard.SECONDARY_COLOR }),
        Keyboard.textButton({ label: 'На число', payload: { command: 'deposit_number' }, color: Keyboard.NEGATIVE_COLOR }),
        Keyboard.textButton({ label: 'Черное', payload: { command: 'deposit_black' }, color: Keyboard.SECONDARY_COLOR }),
      ],
    ]);
  },
  getPrivateKeyboard: () => {
    var Keyboard = vk.get().Keyboard;
    return Keyboard.keyboard([
      Keyboard.textButton({ label: '🌱Играть', payload: { command: 'getConversation' }, color: Keyboard.POSITIVE_COLOR }),
        [
          Keyboard.textButton({ label: '🗿Как играть', payload: { command: 'how_play' }, color: Keyboard.PRIMARY_COLOR }), 
          Keyboard.textButton({ label: '🍡Топ дня', payload: { command: 'top_players' }, color: Keyboard.PRIMARY_COLOR }),
        ],
      [
        Keyboard.textButton({ label: 'Магазин PC', payload: { command: 'balanceplus' }, color: Keyboard.PRIMARY_COLOR }),
        Keyboard.textButton({ label: 'Перевести другу', payload: { command: 'perevod' }, color: Keyboard.PRIMARY_COLOR }),
        
      ],
      Keyboard.textButton({ label: 'Бонус', payload: { command: 'msgbonus' }, color: Keyboard.SECONDARY_COLOR }),
      Keyboard.textButton({ label: 'Вывод', payload: { command: 'output' }, color: Keyboard.NEGATIVE_COLOR }),
      Keyboard.textButton({ label: '💼Профиль', payload: { command: 'profile' }, color: Keyboard.NEGATIVE_COLOR }),
    ]);
  },
  getAdminKeyboard: () => {
    var Keyboard = vk.get().Keyboard;
    return Keyboard.keyboard([
      Keyboard.textButton({ label: 'Изменить id репоста', payload: { command: 'bonus' }, color: Keyboard.POSITIVE_COLOR }),
      [
        Keyboard.textButton({ label: 'Посмотреть профиль ГЮ', payload: { command: 'profgame' }, color: Keyboard.PRIMARY_COLOR }),
        Keyboard.textButton({ label: 'Посмотреть ставки', payload: { command: 'stavki' }, color: Keyboard.NEGATIVE_COLOR }),
      ],
      Keyboard.textButton({ label: 'Раздать топ', payload: { command: 'admintop' }, color: Keyboard.NEGATIVE_COLOR }),
      Keyboard.textButton({ label: 'Назад', payload: { command: 'penis' }, color: Keyboard.SECONDARY_COLOR }),
    ]);
  },
  getBuyKeyboard: () => {
    var Keyboard = vk.get().Keyboard;
    return Keyboard.keyboard([
      Keyboard.textButton({ label: 'Курс', payload: { command: 'kurs' }, color: Keyboard.SECONDARY_COLOR }),
      [
        Keyboard.textButton({ label: 'Купить', payload: { command: 'buycoins' }, color: Keyboard.SECONDARY_COLOR }),
      ],

      Keyboard.textButton({ label: 'Назад', payload: { command: 'penis' }, color: Keyboard.SECONDARY_COLOR }),
    ]);
  }
}

