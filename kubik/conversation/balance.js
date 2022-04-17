module.exports = {
  tag: ["баланс"],
  button: ["balance"],
  func: async(context, { _user, util, gamekubik }) => {
    let str = `
    [id${context.senderId}|${_user.name}], ваш баланс: ${util.number_format(_user.balance)} PC!`
  if(_user.bonus != 0){str += `\nБонусный баланс: ${util.number_format(_user.bonus)} PC!`}
  str += `\nВыиграно: ${util.number_format(_user.win)} PC`
    await context.send({ message: str, keyboard: gamekubik.getKeyboard() });
  }
};
