function moveCar(carNum, s, a, footbreak, bump) {
    var params = [];
    params[0] = parseFloat(s);
    params[1] = parseFloat(a);
    params[2] = parseFloat(footbreak);
    params[3] = parseFloat(bump);

    var dataStruct =
      + params[0] + ","
      + params[1] + ","
      + params[2] + ","
      + params[3];
    console.log('Vehicle-' + carNum, 'MoveVehicle', dataStruct);

    gameInstance.SendMessage('Vehicle-' + carNum, 'MoveVehicle', dataStruct);
  }

function displayMessage(text) {
  gameInstance.SendMessage('GameLevel', 'DisplayBillboardText', text); 
}
// Handle Events Reported by Unity Game
function killPlayer(playerId) {
  window.alert("Player : " + playerId + " killed !");
}
function gameOptionsConfigured(maxPlayers) {
  console.log("Game Options: Max Players = " + maxPlayers);
  maxStartingPlayers = maxPlayers;
}
function enteredGameLobby() {
  console.log("Entering Game Lobby");
  displayMessage(players.length + ' players in lobby');
  
}
function gameStarted(numStartingPlayers) {
  console.log('Game started with: ' + numStartingPlayers);
  var playerToActivate;
  var numStartingPlayers = maxStartingPlayers;

  if (players.length < maxStartingPlayers) {
    numStartingPlayers = players.length;
  }
  console.log("Game Started with " + numStartingPlayers + " players!");

  for (i=0; i < numStartingPlayers; i++) {
    let params = [];
    params[0] = i.toString();
    // Player Gamer Tag
    params[1] = players[0].name;
    // Player Score
    params[2] = "0";
    
    var dataStruct = 
      + params[0] + "," 
      + params[1] + "," 
      + params[2];

    activePlayers.push(dataStruct);
    gameInstance.SendMessage('GameLevel', 'SubstitutePlayer', dataStruct);
  }
}
function playerSubstituted(playerId, colour) {
  let gamerTag = activePlayers[playerId].split(',');
  solPubSub.publish(playerId + '||' + gamerTag[1] , 'dd/t/lobby/' + gamerTag[1]);
  players.splice(0, 1);
  solPubSub.publish(JSON.stringify(players), 'dd/t/lobby');
}
function playerKilled(playerId) {
  console.log("Player : " + playerId + " killed !");
  let killedPlayer = activePlayers[playerId].split(',');
    solPubSub.publish('**KILLED**', 'dd/t/lobby/' + killedPlayer[1]);
  // only sub a new lobby player if there is one
  if (players.length > 0) {
    let params = [];
    params[0] = playerId.toString();
    // Player Gamer Tag
    params[1] = players[0].name;
    // Player Score
    params[2] = "0";
    
    var dataStruct = 
      + params[0] + "," 
      + params[1] + "," 
      + params[2];

    activePlayers[playerId] = dataStruct;
    gameInstance.SendMessage('GameLevel', 'SubstitutePlayer', dataStruct);
  }
}
