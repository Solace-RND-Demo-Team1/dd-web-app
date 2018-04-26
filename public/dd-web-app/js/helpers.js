function updatePlayers(playersArray) {
    
    let newPlayers = JSON.parse(playersArray);
    players.splice(0);
    newPlayers.forEach(function(value) {
        players.push(value);
    });
    console.log(players.length);
}

function processEvent(truckData) {
    let steering = truckData.instance.frontPosition.x / 50.0;
    let accel = truckData.instance.frontPosition.y / 50.0;
    let truck = 1;
    positionData = {
        truckNum: truck,
        steering: steering,
        accel: accel,
        brake: 0,
        bump: 0
    }
    
}

function eventLoop() {
    setTimeout(function () {
        solPubSub.publish(JSON.stringify(positionData), 'dd/t/active/1');
        eventLoop();
    }, 100);    
}
