module.exports = {
    tag: ["тест"],
    button: ["penis"],
    func: async(context, { vk, _user, game, qiwi, utils }) => {
      let n, a, max
		let b = false
		max = 0 
		n =  await context.question(`Веди число машин`)
		for(let i =0; i < 3; i++){
			a = await context.question(`Веди скорость ${i + 1} машины`) // вводим текст
		}
		if(Number(a) > max) max = a 
		if(Number(a) < 30 ) b =true 
		console.log(max)
		if (b == true) console.log("YES")
		else console.log("NO")
    
       }
  };
  