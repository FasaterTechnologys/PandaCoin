const db = require('./db');
const vk = require('./vk');

module.exports = {
  getUser: async(uid) => {
    if (uid < 0) return
    let _user = await db.get().collection('users').findOne({ uid: Number(uid) });
    if(_user != null) return _user;
    
    let vkUser = await vk.get()._vk.api.call('users.get', { user_ids: Number(uid), fields: 'name,lastname,sex,photo_100' });
    if(!vkUser || !vkUser[0]) { return false; }

    let userInfo = {
      uid: Number(uid),
      name: `${vkUser[0].first_name} ${vkUser[0].last_name.slice(0,1)}.` ,
      right: 0,
      inGame: [],
      balance: 0,
      deposit: 0,
      win: 0,
      time: 1800,
      contribution: 0,
      output: 0,
      lose: 0,
      stop: 0,
      winround: 0,
      loseround: 0,
      bonus: 0,
      stavka: 0,
      ref: 0,
      refusers: 0,
      firstMessage: Math.floor(new Date() / 1000)
    }; db.get().collection('users').insertOne(userInfo);
    return userInfo;
  },

  isUser: async(uid) => {
    return (await db.get().collection('users').findOne({ uid: Number(uid) }) == null ? false : true);
  },
}
