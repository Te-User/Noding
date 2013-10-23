World.Player = new Object();
console.log("	- Chargement des fonctions Player...".italic.green);

World.Player.getAccountOnConnect = function (user, socket) {
	user = user.split("\n")[0].toString();
	Mysql.set.query("SELECT * FROM `accounts` WHERE `account` = '" + user + "'", function(err, results) {
		if (err) throw err;
		if(results.length != 0) {
			socket.Account = results[0]; // Enregistre les informations du compte.
			Data.send("ATK0", socket);
		} else {
			Data.send("AlEp", socket);
		}
	});
}

World.Player.sendCharacters = function(socket) {
	Mysql.set.query("SELECT * FROM `personnages` WHERE `account` = '"+socket.Account.guid+"' AND `server_id` = '"+Settings.ServerID+"'", function(err, results) {
		if (err) throw err;
		socket.Players = new Object();
		socket.Players.Character = new Array();
		var packet = "ALK31536000000|" + results.length;
		if(results.length != 0) {
			for(var i = 0; i < results.length; i++){
				var player = results[i];
				socket.Players.Character.push(results[i]);
				packet += "|" + player.guid + ";" + player.name + ";"  + player.level + ";" + player.gfx + ";";
				packet += player.color1 + ";" + player.color2 + ";"  + player.color3 + ";" + player.objets + ";";
				packet += player.isMerchant + ";" + player.server_id + ";"  + player.isDead+ ";" 
				packet += player.deathCount+ ";" + player.level;
			}
		} 
		socket.Players.ListPacket = packet;
		Data.send(packet, socket);
	});
}

World.Player.newCharacter = function (data, socket) {
	var IP = data.split("|");
	
	newPlayer = new Object();
	newPlayer.server_id = Settings.ServerID;
	newPlayer.name 		= IP[0];
	newPlayer.class 	= IP[1];
	newPlayer.level		= Settings.StartLevel;
	newPlayer.kamas 	= Settings.StartKamas;
	newPlayer.sexe 		= IP[2];
	newPlayer.color1 	= IP[3];
	newPlayer.color2	= IP[4];
	newPlayer.color3 	= IP[5];
	newPlayer.zaaps		= Settings.StartZaap;
	newPlayer.xp		= World.Experience[newPlayer.level].expPerso;
	newPlayer.account 	= socket.Account.guid;
	newPlayer.gfx 		= parseInt(newPlayer.class * 10) + 1;
	newPlayer.map		= Settings.StartMap;
	newPlayer.cell		= Settings.StartCell;
	newPlayer.spells	= Races.getSpellList(newPlayer.class);

	Mysql.set.query("SELECT * FROM `personnages` WHERE `account` = '"+newPlayer.server_id+"' AND `server_id` = '"+Settings.ServerID+"'", function(err, results) {
		if (err) throw err;
		if(results[0].length == 0) {
			Mysql.set.query("INSERT INTO `personnages` (`server_id`, `name`, `sexe`, `class`, `color1`, `color2`, `color3`, `kamas`, `level`, `xp`, `size`, `gfx`, `account`, `map`, `cell`, `spells`, `zaaps`) VALUES ('"+newPlayer.server_id+"', '"+newPlayer.name+"', '"+newPlayer.sexe+"', '"+newPlayer.class+"', '"+newPlayer.color1+"', '"+newPlayer.color2+"', '"+newPlayer.color3+"', '"+newPlayer.kamas+"', '"+newPlayer.level+"', '"+newPlayer.xp+"', '"+100+"', '"+newPlayer.gfx+"', '"+newPlayer.account+"', '"+newPlayer.map+"', '"+newPlayer.cell+"', '"+newPlayer.spells+"', '"+newPlayer.zaaps+"')", function(err, results) {				if (err) throw err;
			});
		} else {
			Data.send("AAA", socket);
		}
	});
}