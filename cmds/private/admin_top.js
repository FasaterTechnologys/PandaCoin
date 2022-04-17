module.exports = {
  tag: ["раздать топ"],
  button: ["admintop"],
  func: async(context, { _user, util, game,db, vk, user }) => {
    if(context.senderId != 587742964 && context.senderId != 552049929 && context.senderId != 398851926) return
context.send("Выдаю топ")
let winUsers = await db.get().collection('users').find().sort({ win: -1 }).limit(3).toArray();
winUsers.forEach((res, i) => {

  if(i == 0) {
    context.send(`Выдан топ ${res.name} : id ${res.uid}  за первое место: 70000`)
    db.get().collection('users').updateOne({ uid: res.uid}, { $inc: { bonus: 70000 } });
  }
  if(i == 1) {
    context.send(`Выдан топ ${res.name} : id ${res.uid} за второе место: 35000`)
    db.get().collection('users').updateOne({ uid: res.uid}, { $inc: { bonus: 35000 } });
  }
  if(i == 2) {
    context.send(`Выдан топ ${res.name} : id ${res.uid} за третье место: 20000`)
    db.get().collection('users').updateOne({ uid: res.uid}, { $inc: { bonus: 20000 } });
  }

}); 
  context.send(`
  успешно был выдан топ игроков
  `)
  winUsers = await db.get().collection('users').find().toArray();
  winUsers.forEach((res, i) => {
    if(res.uid != 536587681) db.get().collection('users').updateOne({ uid: Number(res.uid) }, { $set: { win: 0} });
  }); await context.send("Успешно очистен топ игроков");
  }
  };
  