Server = new Object();
Server.net = require('net');
Server.clients = [];
Server.connecting = 0;

Server.net.createServer(function (socket) {
 
  // Identifier le client.
  socket.name = socket.remoteAddress + ":" + socket.remotePort;
  socket.waitLogin = false;
  socket.isLogged = false;
  socket.vClient = false;
  Server.connecting++;
  Server.clients.push(socket);
  
  console.log("Nouvelle connexion (" + socket.name + ")");
  Data.send("HC" + Settings.CryptKey, socket);

  // Réception de packet.
  socket.on('data', function (data) {
    if(socket.isLogged) {
    	Data.parser(data, socket);
    } else {
    	Logger.auth(data, socket);
    }
  });

  // Déconnexion d'un client.
  socket.on('end', function () {
    Server.clients.splice(Server.clients.indexOf(socket), 1);
    process.title = Settings.AppName + " " + Settings.AppRev + " - " + Server.clients.length + " waiting login."
    console.log("Déconnexion (" + socket.name + ")");
  }); 
}).listen(Settings.port);

console.log("Lancement du serveur REALM avec le port :".green, Settings.port);
process.title = "[REALM] " + Settings.AppName + " " + Settings.AppRev;