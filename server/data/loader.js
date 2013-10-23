Loader = new Object();
Loader.step = 0;
console.log("Chargement du serveur GAME...".green);

Loader.nextStep = function() {
	this.step++;
	switch(this.step) {
		default:
			break;
		case 1:
			require('../world/init.js');
			break;
		case 2:
			require('./server.js');
			break;
	}
}

Loader.nextStep();