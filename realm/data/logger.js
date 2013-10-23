Logger = new Object();
Logger.auth = function (value, socket) {
	value = '' + value;
	console.log("[AUTH] RECV: " + value);
	
	if(!socket.vClient) {
		if(value.indexOf(Settings.GameVersion) != -1) {
			socket.vClient = true;
		} else if(value.split(".").length == 3) {
			Data.send("AlEv" + Settings.GameVersion, socket);
		}
	} else {
		if(value.indexOf("#") != -1)  { // Si c'est une demande de connexion.
			this.waitAccount(value, socket);
			socket.waitLogin = true;
			socket.waitPacket = value;
		} else {
			this.basicParse(value, socket);
		}
	}
}

Logger.basicParse = function (value, socket) {
	switch(value.charAt(0)) {
		case "A":
			switch(value.charAt(1)) {
				case "f":
					if(!socket.waitLogin) {
						Data.send("AlEn", socket);
					}
					break;
				case "x":
					Logger.sendServer(socket);
					break;
				case "X":
					Logger.selectServer(socket);
					break;

			}
			break;
	}
}
Logger.waitAccount = function(value, socket) {
	var decData = value.split("#");
	var user = decData[0].toString();
	var pass = decData[1].toString();
	socket.info_login = [user, pass];
	socket.logstate++;
	this.loginUser(user, pass, socket);
}


Logger.loginUser = function(user, pass, socket) {
	user = user.split("\n")[0].toString();
	pass = "1" + pass.split("\n")[0].toString().substr(3);

	Mysql.set.query("SELECT * FROM `accounts` WHERE `account` = '" + user + "'", function(err, results) {
		if (err) throw err;
		if(results.length != 0) {
			if(Logger.cryptPassword(results[0].pass, Settings.CryptKey) == pass) {
				socket.user = results[0].account;
				if(results[0].banned == "1") {
					Console.add(socket, "Le compte est banni.");
					Data.send("AlEb", socket);
				} else if (results[0].logged == "0") {
					socket.Account = results[0]; // Enregistre les informations du compte.
					Logger.validateConnexion(socket); // Envoie les packets de connexion.
					Console.add(socket, "Connexion en cours...");
				} else if (results[0].logged == "1") {
					Data.send("AlEc", socket);
					Console.add(socket, "Le compte est déjà connecté.");
				}
			} else {
				Data.send("AlEf", socket); // Mot de passe incorrect.
				socket.logstate = 0;
			}
		} else {
			Data.send("AlEf", socket);
			socket.logstate = 0;
		}
	});
}

Logger.cryptPassword = function (pwd, key) {
    hash = new Array("a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "-", "_");
    var _loc4 = "1";
    var _loc5 = 0;  
    while (++_loc5, _loc5 < pwd.length)
    {
        var _loc6 = pwd.charCodeAt(_loc5);
        var _loc7 = key.charCodeAt(_loc5);
        var _loc8 = Math.floor(_loc6 / 16);
        var _loc9 = _loc6 % 16;
        _loc4 += (hash[(_loc8 + _loc7 % hash.length) % hash.length]);
		_loc4 += (hash[(_loc9 + _loc7 % hash.length) % hash.length]);
    }
    return (_loc4);
};

Logger.sendServer = function(socket) {
	GameList.updateStatus();

	// this.aks.Account.onHosts
	Data.send("AH1;"+GameList.status+";1", socket)

	Mysql.set.query("SELECT * FROM `personnages` WHERE `account` = '"+socket.Account.guid+"' AND `server_id` = '"+GameList.servers+"'", function(err, results) {
		if (err) throw err;
		var packet = "AxK31536000000";
		if(results.length != 0) {
			Console.add(socket, results.length + " accounts loaded sur le serveur " + GameList.servers);
			packet += "|" + GameList.servers + "," + results.length;
		} 
		Data.send(packet, socket);
	});
}

Logger.validateConnexion = function(socket) {
	GameList.updateStatus();

	// this.aks.Account.onDofusPseudo
	Data.send("Ad" + socket.Account.account, socket);

	// this.aks.Account.onCommunity
	Data.send("Ac" + Settings.Community, socket);
	
	// this.aks.Account.onServersList
	Logger.sendServer(socket);

	// this.aks.Account.onLogin
	Data.send("AlK" + socket.Account.level, socket);

	// this.aks.Account.onSecretQuestion
	Data.send("AQ" + socket.Account.question, socket);
	//socket.isLogged = true;
	//Server.connecting--;
}

Logger.selectServer = function(socket) {
	// this.aks.Account.onSelectServer
	Data.send("AYK" + Settings.ip + ":" + 4455 + ";" + socket.Account.account, socket);
}