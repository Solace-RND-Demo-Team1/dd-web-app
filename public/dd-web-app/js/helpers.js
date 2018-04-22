function updatePlayers(playersArray) {
    
    let newPlayers = JSON.parse(playersArray);
    players.splice(0);
    newPlayers.forEach(function(value) {
        players.push(value);
    });
    console.log(players.length);
}
