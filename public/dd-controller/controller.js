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
}
function enteredGameLobby() {
  console.log("Entering Game Lobby");
  solPubSub.subscribe('dd/t/join');
  solPubSub.subscribe('dd/t/lobby/req');
}
function gameStarted(numStartingPlayers) {
  window.alert("Game Started with " + numStartingPlayers + " players!");
}
function playerSubstituted(playerId, colour) {
  window.alert("Player " + playerId + " substitued / Player Colour: " + colour);
}
function playerKilled(playerId) {
  window.alert("Player : " + playerId + " killed !");
}
