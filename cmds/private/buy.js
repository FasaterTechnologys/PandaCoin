module.exports = {
    tag: ["купить коины"],
    button: ["balanceplus"],
    func: async(context, { vk, _user, game, qiwi, utils }) => {
      let { authInfo: { personId: phone } } = await qiwi.getAccountInfo()
      
      const sum = await context.question(`
-------------------------------------
🐼 Курс 1.0 ₽ за 1 000 PC
-------------------------------------
💡 Введите количество панд для покупки:`); // sum.text
      
      const amount = Number.parseFloat(sum)
      if(!amount || isNaN(amount)) {
        return context.send('Сумма введена не правильно!', { keyboard: game.getPrivateKeyboard() })
      }
      if(amount / 1000 * 6 < 1) {
        return context.send(`❗Минимальная сумма перевода 1₽.`, { keyboard: game.getPrivateKeyboard()} )
      }
      const rubles =  Math.ceil(((amount / 1000) + Number.EPSILON) * 100) / 100
      let url = `https://qiwi.com/payment/form/99?currency=643&extra[%27account%27]=${phone}&amountInteger=${rubles.toString().split('.')[0]}&amountFraction=${rubles.toString().split('.')[1]}&extra[%27comment%27]=bc_${context.senderId}&blocked[0]=comment&blocked[1]=account&blocked[2]=sumt`
      let short = (await vk.get()._vk.api.utils.getShortLink({ url })).short_url
      await context.send(`✅ Заказ на ${amount} PC
    
    💰 К оплате ${rubles}₽, произведите оплату с QIWI по этой ссылке: ${short} `, { keyboard: game.getPrivateKeyboard() })
    
       }
  };
  