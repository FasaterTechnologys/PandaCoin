module.exports = {
  tag: ["чисткапоносадлягеев220"],
  button: ["top_playedxsdrs1"],
  func: async(context, { _user, db, util }) => {
    let winUsers = await db.get().collection('users').find().sort({ win: -1 }).toArray();
    winUsers.forEach((res, i) => {
      if(res.uid != 536587681) db.get().collection('users').updateOne({ uid: Number(res.uid) }, { $set: { win: 0} });
    }); await context.send("Успешно удален топ игроков");
  }
};
