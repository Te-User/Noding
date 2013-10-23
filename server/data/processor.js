Data = new Object();

Data.send = function (packet, socket) {
  packet = '' + packet + '\0';
  socket.write(packet);
  console.log("SEND: " + packet);
}

Data.parser = function (packet, socket) {
  packet = '' + packet;
  console.log("RECV: " + packet);
  switch(packet.charAt(0))
  {
  	case "A":
  		switch(packet.charAt(1)) {
  			case "T":
  				World.Player.getAccountOnConnect(packet.substr(2), socket);
  				break;
  			case "V":
  				// this.aks.Account.onRegionalVersion
  				Data.send("AV0", socket);
  				break;
  			case "g":
  				// this.api.config.language
  				break;
  			case "i":
  				// this.api.datacenter.Basics.aks_identity
  				break;
  			case "L":
  				// dofus.aks.Account.getCharacters
  				World.Player.sendCharacters(socket);
  				break;
        case "A":
          World.Player.newCharacter(packet.substr(2), socket);
          break;
  		}
  		break; 
  }
}