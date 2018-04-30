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
  var playerToActivate;
  var numStartingPlayers = maxStartingPlayers;

  if (players.length < maxStartingPlayers) {
    numStartingPlayers = players.length;
  }
  console.log("Game Started with " + numStartingPlayers + " players!");

  for (i=0; i < numStartingPlayers; i++) {
    console.log(players);
    let params = [];
    console.log('activating player: ' + players[0].name);
    params[0] = i;
    // Player Gamer Tag
    params[1] = players[0].name;
    // Player Score
    params[2] = "0";
    
    var dataStruct = 
      + params[0] + "," 
      + params[1] + "," 
      + params[2];

    gameInstance.SendMessage('GameLevel', 'SubstitutePlayer', dataStruct);
  }
}
function gameStarted(numStartingPlayers) {
  console.log('Game started with: ' + numStartingPlayers);
}
function playerSubstituted(playerId, colour) {
  console.log("Player " + playerId + " substitued / Player Colour: " + colour);
  solPubSub.publish('dd/t/active/' + i + '||' + colour , 'dd/t/lobby/' + playerId);
  players.splice(0, 1);
  solPubSub.publish(JSON.stringify(players), 'dd/t/lobby');
}
function playerKilled(playerId) {
  window.alert("Player : " + playerId + " killed !");
}
