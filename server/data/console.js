Console = new Object();
Console.add = function (socket, text) {
	var d = new Date();
	console.log(d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds() + " ["+socket.user+"] " + text);
}