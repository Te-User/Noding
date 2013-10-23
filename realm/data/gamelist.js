GameList = new Object();
GameList.servers = 1;
GameList.status = 0;

// 0 = Offline
// 1 = Online
// 2 = Save
console.log("Récupération du status du serveur Game...");

GameList.updateStatus = function() {
	Mysql.set.query("SELECT * FROM `servers` WHERE `id` = '" + GameList.servers + "'", function(err, results) {
		if (err) throw err;
		if(results.length != 0) {
			GameList.status = parseInt(results[0].status);	
			if((GameList.status == 0) || (GameList.status == 1) || (GameList.status == 2)) {
				Loader.nextStep();
			} else {
				console.log("Le status du serveur n'existe pas :".red, GameList.status);
			}
		} else {
			console.log("Il n'y a aucun serveur de disponible.".red);
		}
	});
}
GameList.updateStatus();
/* MULTI SERVER 
GameList.servers = new Object();

Mysql.set.query("SELECT * FROM `servers`", function(err, results) {
	if (err) throw err;
	if(results.length != 0) {
		for(var i = 0; i<results.length; i++) {
			GameList.servers[results[i].id] = {id: results[i].id, name: results[i].name};
		}
		GameList.servers.how = results.length;
		console.log(GameList.servers.how + " serveur(s) chargé(s).");
		Loader.nextStep();
	} else {
		console.log("Il n'y a aucun serveur a charger...");
	}
});
*/