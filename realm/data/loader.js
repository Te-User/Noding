Loader = new Object();
Loader.step = 0;
process.stdout.write('\033[2J\033[0;0H');
console.log("Chargement du serveur sous Noding...".green);

Loader.nextStep = function() {
	this.step++;
	switch(this.step) {
		default:
			break;
		case 1:
			require('./gamelist.js');
			break;
		case 2:
			require('./server.js');
			break;
	}
}

Loader.nextStep();