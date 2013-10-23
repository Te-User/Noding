World = new Object();
console.log("Chargement du World...".green);
/* 
	Load World Files.
*/
require('./player.js');
require('./races.js');
/*
	Execute statup function.
*/

World.bLoad = function (sub) {
	switch (sub) {
		case "start":
			this.bLoad("level");
			break;
		case "level":
				console.log("	- Chargement des levels...".italic.green);
				World.Experience = new Object();
				Mysql.set.query("SELECT * FROM `experience`", function(err, results) {
					if(results.length >= 0) {
						for(var i = 0; i < results.length; i++) {
							var realLvl = i + 1;
							World.Experience[realLvl] = {expPlayer: results[i].perso, expMetier: results[i].metier, expDinde: results[i].dinde, expPvp: results[i].pvp};
						}
					} else {
						console.log("	* Il n'y a aucun level...".red);
					}
					World.bLoad("endLoad");
				});
			break;
		case "endLoad":
			Loader.nextStep();
			break;
	}
}
World.bLoad("start");
