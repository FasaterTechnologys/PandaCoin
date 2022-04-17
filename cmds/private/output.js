module.exports = {
    tag: ["вывод"],
    button: ["output"],
    func: async(context, { vk, _user, game, db, qiwi, util }) => {
      let { authInfo: { personId: phone } } = await qiwi.getAccountInfo()
      const qiwiBalance = (await qiwi.getBalance()).accounts[0].balance.amount
      const qiw = await context.question(`введи свой киви в формате: 7953*******`); // sum.text
      
      let amaont =Number(_user.balance)
      if(amaont % 1 != 0) return context.send('Сумма введена не правильно!')
      if(amaont / 1000 < 1) {
        return context.send(`❗Минимальная сумма перевода 1₽`)
      }
      if (qiwiBalance < (amaont / 1000 )) {
        return context.send(`😕 К сожалению, у нас недостаточно RUB для выплаты такой суммы, пожалуйста, дождитесь пополнения резерва.`)
      }
      const options = {
        amount: Number(_user.balance) / 1000,
        comment: "Спасибо за игру в PandaCoin!",
        account: `+${qiw}`,
      }
      try {
        await qiwi.toWallet(options)
        db.get().collection('users').updateOne({ uid: context.senderId}, { $set: { balance: 0 } });
        await vk.get()._vk.api.messages.send({
          user_id: context.senderId,
          message: `          
    ✅ Вы вывели ${util.number_format(amaont)} PC 
    💰 На ваш счёт переведено ${util.number_format(Number(_user.balance) / 1000)}₽ 
    
    💬 Пожалуйста, оставьте отзыв, чтобы другие люди поверили в нашу честность`,
    }).catch((err) => { return console.log(`Ошибка при отправке сообщения!`) })
    let [us] = await vk.get()._vk.api.users.get({user_id: Number(context.senderId)})
    await vk.get()._vk.api.messages.send({
    user_id: 398851926,
    message: `💸 *id${us.id} (${us.first_name}) успешно вывел ${util.number_format(amaont / 1000)} рублей 
    ✅ Ему успешно отправлено ${util.number_format(amaont / 1000 )}₽`,
    }).catch((err) => { return console.log(`Ошибка при отправке сообщения!`) })
        } catch (e) {
        await vk.get()._vk.api.messages.send({
          user_id: context.senderId,
          message: `❗Во время отправки платежа произошла ошибка!
    Свяжитесь с администратором группы!
          Ошибка: ${e}`,
        }).catch((err) => { return console.log(`Ошибка при отправке сообщения!`) })
      }
    
       }
  };
  