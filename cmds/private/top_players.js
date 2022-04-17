module.exports = {
  tag: ["Топ дня • [ 👑 ]"],
  button: ["top_players"],
  func: async(context, { _user, db, util, vk }) => {
    let winUsers = await db.get().collection('users').find().sort({ win: -1 }).toArray();
    let topText = `${_user.name}, Топ игроков: <br><br>`;
    let topid = 0;
    winUsers.forEach((res, i) => {

      if(Number(res.uid) == Number(_user.uid)){
        topid = i
      }
      if(i < 9) {
      if(i == 0) topText += `&#${49 + Number(i) };&#8419; [id${res.uid}|${res.name}] - ${util.number_format(res.win)} | (приз: 70.000 PC)<br>`;
      else if(i == 1) topText += `&#${49 + Number(i) };&#8419; [id${res.uid}|${res.name}] - ${util.number_format(res.win)} | (приз: 35.000 PC)<br>`;
      else if(i == 2) topText += `&#${49 + Number(i) };&#8419; [id${res.uid}|${res.name}] - ${util.number_format(res.win)} | (приз: 20.000 PC)<br>`;
      else topText += `&#${49 + Number(i) };&#8419; [id${res.uid}|${res.name}] - ${util.number_format(res.win)}<br>`;
      }
    }); 
    return context.send(topText + `--------------\n\n${topid + 1} ${_user.name} - Выиграл: ${_user.win} PC`);
  }
};
