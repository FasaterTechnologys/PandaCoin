module.exports = {
tag: ["notag"],
button: ["perevod"],
func: async(context, { _user, util, game, vk }) => {
return context.send(`
Что бы перевести другу PC напиши 
перевод (ссылка) сумма
Пример:
перевод @durov 100
перевод 1 100
перевод id1 100
перевод vk.com/durov

`)
}
};
