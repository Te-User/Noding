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
    
  }
}