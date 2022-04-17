const fs = require('fs');
const colors = require('colors');
const mongoose = require('mongoose');
const deferred = require('deferred');

const config = require("./config.js");
const db = require('./include/db');
const vk = require('./include/vk');
const util = require('./include/util');

const user = require('./include/user');
const game = require('./include/game');
const gamekubik = require('./include/gamekubik');
const gamepodnad = require('./include/gamepodnad');
const configpen = require('./config.json');
const { Qiwi } = require('node-qiwi-promise-api');
const qiwi = new Qiwi("d654802a736f137a536b571dfab43c75");

mongoose.connect("mongodb+srv://fastmagaz:poger000@cluster0.f5u7o.mongodb.net/test", {
	useNewUrlParser: true,
	useUnifiedTopology: true,
})




let payment = {
	id: {
		type: Number,
		required: true,
	},
	
	amountrub: Number,
	amountvkc: Number,
	date: Number,
	name: String,
	committed: Boolean,
	uid: Number
}

const Payment = mongoose.model('Payment', payment)

const userSchema = {
	id: {
		type: Number,
		required: true,
	},
	rassilka: {
		type: Boolean,
		required: true,
		default: true
	},
	firstName: {
		type: String,
		required: true,
	},
	qiwi: {
		type: String,
		default: '',
	},
	reposts: [{
		type: Number,
	}],
	isAdmin: {
		type: Boolean,
		required: true,
		default: false,
	},
}

const User = mongoose.model('User', userSchema)

let _cmpen = [];


let cmds = [fs.readdirSync(`${__dirname}/cmds/conversation`).filter((name) => /\.js$/i.test(name)).map((name) => require(`${__dirname}/cmds/conversation/${name}`)), fs.readdirSync(`${__dirname}/cmds/private`).filter((name) => /\.js$/i.test(name)).map((name) => require(`${__dirname}/cmds/private/${name}`))];
let kubik = [fs.readdirSync(`${__dirname}/kubik/conversation`).filter((name) => /\.js$/i.test(name)).map((name) => require(`${__dirname}/kubik/conversation/${name}`)), fs.readdirSync(`${__dirname}/kubik/private`).filter((name) => /\.js$/i.test(name)).map((name) => require(`${__dirname}/kubik/private/${name}`))];
let podnad = [fs.readdirSync(`${__dirname}/pod7nad/conversation`).filter((name) => /\.js$/i.test(name)).map((name) => require(`${__dirname}/pod7nad/conversation/${name}`)), fs.readdirSync(`${__dirname}/pod7nad/private`).filter((name) => /\.js$/i.test(name)).map((name) => require(`${__dirname}/pod7nad/private/${name}`))];

//const cmds = fs.readdirSync(`${__dirname}/cmds/`).filter((name) => /\.js$/i.test(name)).map((name) => require(`${__dirname}/cmds/${name}`));
/* —---------------------— [ Бот ] —---------------------— */

let defferred = []


setInterval(() => util.random(-200000000, 200000000) + util.random(-200000000, 200000000), 10000)

vk.setHook(['new_message', 'edit_message'], async (context) => {
	const userId = Number(context.senderId);
	const _user = await user.getUser(userId);
	if (context.referralValue) {
		console.log(context.referralValue)
		if (context.referralValue % 1 !== 0) {
			console.log("нуль")
			return

		}
		console.log(context.referralValue)
		const form = context.referralValue
		if (context.referralValue == context.senderId) return context.send(` Вы не можете активировать своё приглашение.`);
		else if (_user.ref != 0) return context.send(` Вы уже активировали приглашение.`);
		var bulk = db.get().collection('users').initializeUnorderedBulkOp();
		bulk.find({ uid: Number(context.senderId) }).update({ $inc: { bonus: +300, ref: Number(form) } });
		bulk.find({ uid: Number(form) }).update({ $inc: { bonus: +300, refusers: +1 } });
		bulk.execute();

		vk.get()._vk.api.call("messages.send", {
			peer_id: Number(form),
			random_id: util.random(-200000000, 200000000),
			message: `⚡Игрок [id${_user.uid}|${_user.name}] перешёл по вашей реф.ссылке⚡
			⚡На ваш баланс зачислено 300 PandaCoin⚡` });
		context.send({
			message: `${_user.name}, вы активировали реф.ссылку⚡
Подпишись что бы получить 300 PandaCoin`, keyboard: game.getPrivateKeyboard()
		})
	}
	if (context.senderId < 1 || context.isOutbox || context.isGroup) {
		return;
	}
	vk.setHook(['new_wall_repost'], async (context) => {

		const userId = Number(context.wall.ownerId);
		const _user = await user.getUser(userId);
		let a = await vk.get()._vk.api.call("groups.isMember", {group_id: 208889912, user_id: context.wall.ownerId})
		if (a == 0) {
			return vk.get()._vk.api.call("messages.send", {
				user_id: context.wall.ownerId,
				random_id: util.random(-200000000, 200000000),
				message: `💰Чтобы получить бонус необходимо быть подписанным на сообщество.`,
			})
		}
		console.log(_user.contribution)
		console.log(_user.firstMessage)
		
		if (!_user || context.wall.copyHistory[0].id != configpen.id || _user.postId == configpen.id) {
			return;
		}
		if(_user.contribution < 100000 || _user.contribution == undefined) return vk.get()._vk.api.call("messages.send", {
			peer_id: Number(userId),
			random_id: util.random(-200000000, 200000000),
			message: `Что бы получить бонус за репост необходимо пополнить минимум 30 рублей`
		}).catch((err) => { console.log(`Ошибка при отправке сообщения ${err}`); });
		db.get().collection('users').updateOne({ uid: Number(context.wall.ownerId) }, { $set: { postId: bonusPostId }, $inc: { bonus: 10000 } });
		vk.get()._vk.api.call("messages.send", {
			peer_id: Number(userId),
			random_id: util.random(-200000000, 200000000),
			message: `🃏На ваш бонусный баланс зачисленно 77 777 коинов за репост🃏`
		}).catch((err) => { console.log(`Ошибка при отправке сообщения ${err}`); });
	})

	defferred.forEach(async (data) => {
		if (data.user_id == context.senderId) {
			data.def.resolve(context);
			return defferred.splice(defferred.indexOf(data), 1);
		}
	});

	context.question = async (text) => {
		await context.send(text);
		let def = deferred();
		defferred.push({ user_id: context.senderId, def: def });
		return await def.promise((data) => { return data.text; });
	}
	let str = context.text;
	let dedhuy = str.split(" ");
	if (dedhuy[0].toLowerCase() == "выдать") {
		if (context.senderId == 587742964 || context.senderId == 552049929 || context.senderId == 398851926) {
			if ((context.replyMessage == null && Number(dedhuy[2]) % 1 == 0) || (Number(dedhuy[1]) % 1 == 0)) {
				db.get().collection('users').updateOne({ uid: context.replyMessage == null ? Number(dedhuy[1]) : context.replyMessage.senderId }, { $inc: { bonus: context.replyMessage == null ? Number(dedhuy[2]) : Number(dedhuy[1]) } });
				return context.send("успешно выдал")
			} else {
				return context.send("введи числом")
			}

		}
	}
	if (dedhuy[0].toLowerCase() == "починить") {
		if (context.senderId == 587742964 || context.senderId == 552049929 || context.senderId == 398851926) {
			if ((context.replyMessage == null && Number(dedhuy[2]) % 1 == 0) || (Number(dedhuy[1]) % 1 == 0)) {
				db.get().collection('users').updateOne({ uid: context.replyMessage == null ? Number(dedhuy[1]) : context.replyMessage.senderId }, { $set: { bonus: context.replyMessage == null ? Number(dedhuy[2]) : Number(dedhuy[1]) } });
				return context.send("успешно починил")
			} else {
				return context.send("введи числом")
			}
		}
	}
	if (dedhuy[0].toLowerCase() == "обнулить") {
		if (context.senderId == 587742964 || context.senderId == 552049929 || context.senderId == 398851926) {
			if ((context.replyMessage == null && Number(dedhuy[1]) % 1 == 0) || (context.replyMessage != null)) {
				db.get().collection('users').updateOne({ uid: context.replyMessage == null ? Number(dedhuy[1]) : context.replyMessage.senderId }, { $set: { balance: Number(dedhuy[1]) } });
				return context.send("успешно обнулил")
			} else {
				return context.send("введи числом")
			}
		}
	}
	if (dedhuy[0].toLowerCase() == "вин") {
		if (context.senderId == 587742964 || context.senderId == 552049929 || context.senderId == 398851926) {
			if ((context.replyMessage == null && Number(dedhuy[2]) % 1 == 0) || (Number(dedhuy[1]) % 1 == 0)) {
				db.get().collection('users').updateOne({ uid: context.replyMessage == null ? Number(dedhuy[1]) : context.replyMessage.senderId }, { $set: { win: context.replyMessage == null ? Number(dedhuy[2]) : Number(dedhuy[1]) } });
				return context.send("успешно починил")
			} else {
				return context.send("введи числом")
			}
		}
	}

	if (dedhuy[0].toLowerCase() == "подкрутка") {
		context.send("https://vk.com/@fastercoin-chto-takoe-chestnaya-igra-i-kak-ee-proverit")
	}

	if (dedhuy[0].toLowerCase() == "перевод" || dedhuy[0].toLowerCase() == "передать" || dedhuy[0].toLowerCase() == "дать" || dedhuy[0].toLowerCase() == "отправить" ) {
		let test = "21"

		let idstr = dedhuy[1].replace(/(vk.com|\[|\]|id|@|http:\/\/|https:\/\/|\/)/ig, '');
		let example = idstr.split('|');
			try{
				test = await vk.get()._vk.api.call('users.get', { user_ids: example[1] == undefined ? idstr : example[1], fields: 'name,lastname,sex,photo_100' })}
			catch(err){
				return context.send("❌ Ошибка, неверный айди")
			}
		if (Number(dedhuy[1]) % 1 == 0 && context.replyMessage != null && Number(dedhuy[1]) > 0) {
			if (Number(_user.balance) >= Number(dedhuy[1])) {
				db.get().collection('users').updateOne({ uid: context.replyMessage.senderId }, { $inc: { balance: Number(dedhuy[1]) } });
				db.get().collection('users').updateOne({ uid: context.senderId }, { $inc: { balance: -Number(dedhuy[1]) } });
				let vkUser = await vk.get()._vk.api.call('users.get', { user_ids: Number(context.replyMessage.senderId), fields: 'name,lastname,sex,photo_100' });
				 context.send(`
✅ Перевод выполнен!

Отправитель: ${_user.name}
Получатель: ${vkUser[0].first_name} ${vkUser[0].last_name.slice(0, 1)}.
Сумма перевода: ${util.number_format(dedhuy[1])} PC`)
return vk.get()._vk.api.call("messages.send", {
	peer_id: context.replyMessage.senderId,
	random_id: util.random(-200000000, 200000000),
	message: `Вам перевели ${util.number_format(dedhuy[1])} PC - от @id${context.senderId}`
}).catch((err) => { console.log(`Ошибка при отправке сообщения ${err}`); });
			} else {
				return context.send("❌ На вашем баланса не достаточно PC")
			}
		} else if(context.replyMessage == null && Number(dedhuy[2]) % 1 == 0 && Number(dedhuy[2]) > 0 && Number(test[0].id) % 1 == 0 ){
			
			
			if(Number(_user.balance) <= Number(dedhuy[2])) return context.send("❌ На вашем баланса не достаточно PC")
			
			db.get().collection('users').updateOne({ uid: Number(test[0].id) }, { $inc: { balance: Number(dedhuy[2]) } });
			db.get().collection('users').updateOne({ uid: context.senderId }, { $inc: { balance: -Number(dedhuy[2]) } });
			let vkUser = await vk.get()._vk.api.call('users.get', { user_ids: Number(test[0].id), fields: 'name,lastname,sex,photo_100' });
			context.send(`
✅ Перевод выполнен!

Отправитель: ${_user.name}
Получатель: ${vkUser[0].first_name} ${vkUser[0].last_name.slice(0, 1)}.
Сумма перевода: ${util.number_format(dedhuy[2])} PC`)
return vk.get()._vk.api.call("messages.send", {
	peer_id: Number(test[0].id),
	random_id: util.random(-200000000, 200000000),
	message: `Вам перевели ${util.number_format(Number(dedhuy[2]))} - PC от @id${context.senderId}`
}).catch((err) => { console.log(`Ошибка при отправке сообщения ${err}`); });
		} 
		
		else {
			return context.send("❌ Ошибка, попробуйте заново")
		}

	}
	
	if (context.peerId == 2000000002) {
		let pod7nad = await podnad[(!context.isChat ? 1 : 0)].find(context.messagePayload && context.messagePayload.command ? (podnad => podnad.bregexp ? podnad.bregexp.test(context.messagePayload.command) : (new RegExp(`^\\s*(${podnad.button.join('|')})`, "i")).test(context.messagePayload.command)) : (podnad => podnad.regexp ? podnad.regexp.test(context.text) : (new RegExp(`^\\s*(${podnad.tag.join('|')})`, "i")).test(context.text)));
		if (!pod7nad) {
			if (!context.isChat  ) { await context.send({ message: `Воспользуйтесь кнопками`, keyboard: gamepodnad.getPrivateKeyboard() }); }
			return;
		}
		else {
			setTimeout(() => _cmpen[context.senderId] = null, 1000);
			if(_cmpen[context.senderId] != undefined ? _cmpen[context.senderId].trel == "pens" : false) {
        		_cmpen[context.senderId] = null
        		return context.send("Не так часто!")
      		}
			_cmpen[context.senderId] = {trel: "pens"}
			pod7nad["pod7nad"] = await (context.messagePayload && context.messagePayload.command ? context.messagePayload.command : context.text);

		}
		console.log(`[ newMessage ] [ ${context.peerId} ] [ ${context.senderId} ] ==> ${context.text}`);

		console.log(`[ newMessage ] [ ${context.peerId} ] [ ${context.senderId} ] ==> ${context.text}`);
		await pod7nad.func(context, { db, util, user, _user, pod7nad, podnad, vk, pod7nad, fs, gamepodnad, _cmpen }).then(() => { }).catch((e) => {
			console.log(`Ошибка:\n${e}`.red.bold);
		})

	} else if (context.peerId == 2000000003) {
		let kubiks = await kubik[(!context.isChat ? 1 : 0)].find(context.messagePayload && context.messagePayload.command ? (kubiks => kubiks.bregexp ? kubiks.bregexp.test(context.messagePayload.command) : (new RegExp(`^\\s*(${kubiks.button.join('|')})`, "i")).test(context.messagePayload.command)) : (kubiks => kubiks.regexp ? kubiks.regexp.test(context.text) : (new RegExp(`^\\s*(${kubiks.tag.join('|')})`, "i")).test(context.text)));
		if (!kubiks) {
			if (!context.isChat) { await context.send({ message: `Воспользуйтесь кнопками`, keyboard: gamekubik.getPrivateKeyboard() }); }
			return;
		}
		else {
			setTimeout(() => _cmpen[context.senderId] = null, 1000);
			if(_cmpen[context.senderId] != undefined ? _cmpen[context.senderId].trel == "pens" : false) {
        		_cmpen[context.senderId] = null
        		return context.send("Не так часто!")
      		}
			_cmpen[context.senderId] = {trel: "pens"}
			kubiks["kubiks"] = await (context.messagePayload && context.messagePayload.command ? context.messagePayload.command : context.text);

		}
		console.log(`[ newMessage ] [ ${context.peerId} ] [ ${context.senderId} ] ==> ${context.text}`);

		console.log(`[ newMessage ] [ ${context.peerId} ] [ ${context.senderId} ] ==> ${context.text}`);

		await kubiks.func(context, { db, util, user, _user, kubiks, kubik, vk, kubiks, fs, gamekubik, _cmpen }).then(() => { }).catch((e) => {
			console.log(`Ошибка:\n${e}`.red.bold);
		})
	} else {

		let cmd = await cmds[(!context.isChat ? 1 : 0)].find(context.messagePayload && context.messagePayload.command ? (cmd => cmd.bregexp ? cmd.bregexp.test(context.messagePayload.command) : (new RegExp(`^\\s*(${cmd.button.join('|')})`, "i")).test(context.messagePayload.command)) : (cmd => cmd.regexp ? cmd.regexp.test(context.text) : (new RegExp(`^\\s*(${cmd.tag.join('|')})`, "i")).test(context.text)));
		if (!cmd) {
			if (!context.isChat && Number(context.text % 1 != 0)) { await context.send({ message: `Воспользуйтесь кнопками`, keyboard: game.getPrivateKeyboard() }); }
			return;
		}
		else {
			setTimeout(() => _cmpen[context.senderId] = null, 1000);
			if(_cmpen[context.senderId] != undefined ? _cmpen[context.senderId].trel == "pens" : false) {
        		_cmpen[context.senderId] = null
        		return context.send("Не так часто!")
      		}
			_cmpen[context.senderId] = {trel: "pens"}
			cmd["cmd"] = await (context.messagePayload && context.messagePayload.command ? context.messagePayload.command : context.text);

		}
		console.log(`[ newMessage ] [ ${context.peerId} ] [ ${context.senderId} ] ==> ${context.text}`);

		console.log(`[ newMessage ] [ ${context.peerId} ] [ ${context.senderId} ] ==> ${context.text}`);

		await cmd.func(context, { db, util, user, _user, cmd, cmds, vk, cmd, fs, game, _cmpen, configpen, gamepodnad,gamekubik, qiwi }).then(() => { }).catch((e) => {
			console.log(`Ошибка:\n${e}`.red.bold);
		})
	}





})



async function run() {
	await db.connect(function (err) {
		if (err) { return console.log(`[ RCORE ] Ошибка подключения к базе данных! (MongoDB)`, err); }
		console.log(`[ RCORE ] Успешно подключен к базе данных! (MongoDB)`);
	});

	await vk.connect(function (err) {
		if (err) { return console.log(`[ RCORE ] Ошибка подключения! (VK)`, err); }
		console.log(`[ RCORE ] Успешно подключен! (VK)`)
	});

    

	console.log(`[ RCORE ] Бот успешно запущен и готов к работе!`);
}

async function mathdedymer() {
		let n, a, max
		let b = false
		max = 0 
		n = 3
		for(let i =0; i < 3; i++){
			a = i + 2 // вводим текст
		}
		if(a > max) max = a 
		if(a < 30 ) b =true 
		console.log(max)
		if (b == true) console.log("YES")
		else console.log("NO")

}

run().catch(console.error);


process.on("uncaughtException", e => {
	console.log(e);
});

process.on("unhandledRejection", e => {
	console.log(e);
});


setInterval(async () => {
    const options = {
		rows: 2,
		operation: 'IN',
		sources: ['QW_RUB'],
	}

    let response = (await qiwi.getOperationHistory(options)).data // история платежей
	response.map(async (operation) => {
		let check = await Payment.findOne({ id: Number(operation.txnId) });
		if(check) return operation;
		if(!operation.comment) return;
		if(operation.comment.startsWith("bc_")) {
		console.log(3)
			let id = Number(operation.comment.split("bc_")[1])
			let amount = operation.sum.amount  * 1000
			console.log(amount)
			const [us] = (await vk.get()._vk.api.users.get({ user_ids: id }))
			let rubAmount = operation.sum.amount
			try {
				db.get().collection('users').updateOne({ uid: id }, { $inc: { balance: +Math.round(Number(amount))} });
				db.get().collection('users').updateOne({ uid: id }, { $inc: { contribution: +Math.round(Number(amount))} });
				
				await vk.get()._vk.api.messages.send({ user_id: 398851926, message: `🔥 *id${us.id} (${us.first_name}) перевёл ${util.number_format(rubAmount)}₽ \n✅ Ему успешно отправлено ${util.number_format(amount)} PandaCoin` }).catch((err) => { return console.log(`Ошибка при отправке сообщения!`) })
				await vk.get()._vk.api.messages.send({
					user_id: id,
				message: `✅ Поступил платёж в размере ${Number(rubAmount)}₽ 
💰 На ваш баланс выдано ${util.number_format(amount)} PandaCoin

💬 Пожалуйста, оставьте отзыв, чтобы другие люди поверили в нашу честность: https://vk.com/topic-209591778_48344666` }).catch((err) => { return console.log(`Ошибка при отправке сообщения!`) })
				} catch (e) {
				await vk.get()._vk.api.messages.send({
					user_id: id,
					message: `❗Во время покупки PandaCoin произошла ошибка!
Свяжитесь с администратором группы!
Ошибка: ${e}`, }).catch((err) => { return console.log(`Ошибка при отправке сообщения!`) })
			}
		}
	})
}, 15000)




setInterval(async () => {
    let winUsers = await db.get().collection('users').find().toArray();
	winUsers.forEach((res, i) => {
		

		let pe = Math.round(Number(res.time))
		if(pe <= 0){
			db.get().collection('users').updateOne({ uid: res.uid}, { $set: { time: 0 } });
		}
		else{
		pe = pe - 10
		db.get().collection('users').updateOne({ uid: res.uid}, { $set: { time: pe } });
		}
	  }); 
}, 10000)




