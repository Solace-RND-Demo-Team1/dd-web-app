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

// Handle Events Reported by Unity Game
function killPlayer(playerId) {
  window.alert("Player : " + playerId + " killed !");
}
function gameOptionsConfigured(maxPlayers) {
  window.alert("Game Options: Max Players = " + maxPlayers);
}
function enteredGameLobby() {
  window.alert("Entering Game Lobby");
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
