module.exports = {
  tag: ["[ 🔍 ] • Поиск беседы • [ 🔍 ]"],
  button: ["getConversation"],
  func: async (context, { vk, _user, game, util }) => {
    let _conv = [`)`];
    vk.get()._vk.api.call("messages.send", {
      peer_id: Number(_user.uid),
      random_id: util.random(-200000000, 200000000),
      message: "игровые беседы :", 
    keyboard: JSON.stringify({buttons: [[{action: {type: "open_link", label: "Wheel", "link": "https://vk.me/join/AJQ1d8xfuB72/_FKVBLkmmoH"}, }, {action: {type: "open_link", label: "Под 7 над", "link": "https://vk.me/join/AJQ1dwJrph4dqu8UVrFEZn74"},}, ], [{action: {type: "open_link", label: "Кубик", "link": "https://vk.me/join/AJQ1dzICrR67yEJxoqB7k3aX"},}]], inline: true })
    }).catch((err) => { console.log(`Ошибка при отправлке сообщения ${err}`); });
  }
};
