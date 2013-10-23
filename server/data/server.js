Server = new Object();
Server.net = require('net');
Server.clients = [];
Server.connecting = 0;

Server.net.createServer(function (socket) {
 
  // Identifier le client.
  socket.name = socket.remoteAddress + ":" + socket.remotePort;
  Server.connecting++;
  Server.clients.push(socket);
  
  
  console.log("Entrer en jeu (" + socket.name + ")");
  Data.send("HG", socket);

  process.title = Settings.AppName + " " + Settings.AppRev + " - " + Server.clients.length + " players online."

  // Réception de packet.
  socket.on('data', function (data) {
    	data = '' + data;
      if(data.split("\n\0").length >> 1) {
        for(var i = 0; i < data.split("\n\0").length; i++) {
          Data.parser(data.split("\n\0")[i].toString(), socket);
        }
      } else {
        Data.parser(data, socket);
      }
  });

  // Déconnexion d'un client.
  socket.on('end', function () {
    Server.clients.splice(Server.clients.indexOf(socket), 1);
    process.title = Settings.AppName + " " + Settings.AppRev + " - " + Server.clients.length + " players online."
    console.log("Déconnexion (" + socket.name + ")");
  }); 
}).listen(Settings.port);

console.log("Lancement du serveur GAME " + Settings.port + " ... \n");
process.title = "[GAME] " + Settings.AppName + " " + Settings.AppRev;