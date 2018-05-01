function updatePlayers(playersArray) {
    
    let newPlayers = JSON.parse(playersArray);
    players.splice(0);
    newPlayers.forEach(function(value) {
        players.push(value);
    });
    console.log(players.length);
}

function processEvent(truck, truckData) {
    let steering = truckData.instance.frontPosition.x / 50.0;
    let accel = (truckData.instance.frontPosition.y / 50.0) * -1;
    oldData = positionData;

    if ((Math.round(parseFloat(oldData.steering)*100)/100) == (Math.round(parseFloat(steering)*100)/100) || 
        (Math.round(parseFloat(oldData.accel)*100)/100) == (Math.round(parseFloat(accel)*100)/100)) {
            positionData = {
                truckNum: truck,
                steering: 0,
                accel: 0,
                brake: 0,
                bump: 0
        }
    } else {
        positionData = {
            truckNum: truck,
            steering: steering,
            accel: accel,
            brake: 0,
            bump: 0
        }
    } 
}

function eventLoop() {
    globalEventLoop = setTimeout(function () {
        solPubSub.publish(JSON.stringify(positionData), 'dd/t/active/' + whichTruck);
        eventLoop();
    }, 100);    
}

function stopTruck() {
    clearTimeout(globalEventLoop);
    positionData = {
        truckNum: whichTruck,
        steering: 0,
        accel: 0,
        brake: 0,
        bump: 0
    }
    solPubSub.publish(JSON.stringify(positionData), 'dd/t/active/' + whichTruck);
}

function jumpTruck() {
    clearTimeout(globalEventLoop);
    positionData = {
        truckNum: whichTruck,
        steering: 0,
        accel: 0,
        brake: 0,
        bump: "1"
    }
    solPubSub.publish(JSON.stringify(positionData), 'dd/t/active/' + whichTruck);
}

function makePlayerActive(topicAndColor) {
    console.log(topicAndColor);
    var params = topicAndColor.split('||');
    // index 0 is the vehicle id for the assigned vehicle
    // index 1 is the colour assigned
    window.location.href = 'gamepadd.html?t=' + params[0] + '&c=' + params[1];
}

function makePlayerInactive(topic) {
    solPubSub.disconnect();
    document.location.href = 'gameover.html';
}