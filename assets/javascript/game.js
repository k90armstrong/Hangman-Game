function myMap() {
    var coords = getUserLocation();
}

function getUserLocation() {
    var latitude = 40.9628845;
    var longitude = -112.0953297;
    var latLng = {
        lat: latitude,
        lng: longitude
    };
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(changeLatLong);
    } else {
        var mapProp = {
            center: new google.maps.LatLng(latitude, longitude), // get current location from browser, if can't default to washingtn dc
            zoom: 10,
            disableDefaultUI: true
        };
        map = new google.maps.Map(document.getElementById("googleMap"), mapProp);
    }
    marker = new google.maps.Marker({
        position: latLng,
        map: map,
        title: 'Target'
    });
}

function changeLatLong(position) {
    var latLng = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
    };
    var mapProp = {
        center: {
            lat: latLng.lat - .1,
            lng: latLng.lng
        }, //new google.maps.LatLng(position.coords.latitude, position.coords.longitude), // get current location from browser, if can't default to washingtn dc
        zoom: 10,
        disableDefaultUI: true,
        draggable: false
    };
    map = new google.maps.Map(document.getElementById("googleMap"), mapProp);
    marker = new google.maps.Marker({
        position: latLng,
        map: map,
        title: 'Target!'
    });
    var overlay = new google.maps.OverlayView();
    overlay.draw = function () {};
    overlay.setMap(map);
    // targetPX = overlay.getProjection().fromLatLngToCntainerPixel(latLng);
    // console.log(targetPX);
}

function changeLocation(latLng) {
    map.setCenter({
        lat: latLng.lat - .1,
        lng: latLng.lng
    })
    marker.setPosition(latLng);
}






function mainGame(event) {
    var keyPressed = event.key;
    if (game.inString(keyPressed)) {
        console.log('you guessed right');
        game.succesfulAttempt(keyPressed);
        var newString = game.getNewStrng();
        game.updateString(newString);
    } else {
        console.log('you guessed wrong');
        game.failedAttempt(keyPressed);
    }
    game.checkStatus();
    game.updateBottomStats();
}

function changeScreenToWin() {
    loginDiv.className = 'my-center display-none';
    document.getElementById('entire-password').className = 'display-none';
    messageP.innerHTML = 'You just saved the world from going into another world war! Congrats!';
    messageP.className = '';
    mainButton.style.visibility = 'hidden';
}

function startNewGame() {
    messageP.innerHTML = 'Oh no! It looks like they are launching an attack on ' + game.location.name + '! Hurry press start to stop the missile!';
    mainButton.style.visibility = 'visible';
    mainButton.innerHTML = 'Start!'
}

var latitude;
var longitude;
var targetPX;
var map;
var marker;
var gif = document.getElementById('gif');
var usernameSpan = document.getElementById('username');
var passwordSpan = document.getElementById('password');
var messageP = document.getElementById('intro');
var mainButton = document.getElementById('main-button');
var loginDiv = document.getElementById('login');
var usernames = ['kim', 'denisrodman'];
var passwords = ['mouserat', 'appletree'];
var locations = [{
        name: 'the White House',
        latLng: {
            lat: 38.897957,
            lng: -77.036560
        }
    },
    {
        name: 'the Statue of Liberty',
        latLng: {
            lat: 40.689247,
            lng: -74.044502
        }
    },
    {
        name: 'the Pentagon',
        latLng: {
            lat: 38.8719,
            lng: -77.0563
        }
    },
    {
        name: 'the Empire State Building',
        latLng: {
            lat: 40.748817,
            lng: -73.985428
        }
    }, {
        name: 'Disneyland',
        latLng: {
            lat: 33.8121,
            lng: -117.9190
        }
    }, {
        name: 'Mount Rushmore',
        latLng: {
            lat: 43.8791,
            lng: -103.4591
        }
    }
];
var missileElement = document.getElementById('missile');
var missile = {
    moveMissileIntreval: null,

    startMissile: function (totalTime, finalX, finalY) {
        var rect = missileElement.getBoundingClientRect();
        // missile.className = missile.className + ' missile-end';
        // missile.style.position = "relative";
        var startX = rect.top;
        var startY = rect.right;
        console.log('startx: ' + startX);
        console.log('starty: ' + startY);

        var deltaX = finalX - startX;
        var deltaY = finalY - startY;
        var totalDistance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        console.log(totalDistance);
        var fps = 10;
        var changePerMoveX = deltaX / (totalTime * fps);
        var changePerMoveY = deltaY / (totalTime * fps);
        console.log('change per x ' + changePerMoveX);


        this.moveMissileIntreval = setInterval(function () {
            console.log('Moving missile');
            console.log(missileElement.style.top);
            var oldTop = missileElement.style.top.replace('px', '');
            var oldLeft = missileElement.style.left.replace('px', '');
            if (oldTop === '') {
                oldTop = '0';
            }
            if (oldLeft === '') {
                oldLeft = '0';
            }
            var newTop = parseFloat(oldTop) + changePerMoveY;
            var newLeft = parseFloat(oldLeft) + changePerMoveX;
            missileElement.style.top = newTop + 'px';
            missileElement.style.left = newLeft + 'px';
            console.log('oldtop ' + oldTop);
        }, 100);

    },
    resetMissile: function () {
        clearInterval(this.moveMissileIntreval);
        missileElement.style.top = 0 + 'px';
        missileElement.style.left = 0 + 'px';
    }

}

var game = {
    username: null,
    password: null,
    guesses: [],
    correctGuesses: [],
    remainingTries: 15,
    currentStep: 'username',
    location: null,

    startGame: function () {
        this.password = passwords[Math.floor(Math.random() * passwords.length)];
        this.username = usernames[Math.floor(Math.random() * usernames.length)];
        this.guesses = [];
        this.remainingTries = 15;
        this.currentStep = 'username';
        this.correctGuesses = [];
    },
    inString: function (guess) {
        var string = this.getCurrentWordBeingGuessed();
        // check to see if the guess is in the string
        for (var i = 0; i < string.length; i++) {
            if (guess === string[i]) {
                return true
            }
        }
        return false
    },
    failedAttempt: function (guess) {
        for (var i = 0; i < this.guesses.length; i++) {
            if (guess === this.guesses[i].toLowerCase()) {
                return
            }
        }
        this.guesses.push(guess.toUpperCase());
        this.remainingTries -= 1;
    },
    succesfulAttempt: function (guess) {
        for (var i = 0; i < this.correctGuesses.length; i++) {
            if (guess === this.correctGuesses[i].toLowerCase()) {
                return
            }
        }
        this.correctGuesses.push(guess);
    },
    getLength: function () {
        return this.getCurrentWordBeingGuessed().length;
    },
    updateBottomStats: function () {
        document.getElementById('attempts').innerHTML = this.remainingTries;
        document.getElementById('guesses').innerHTML = this.guesses.join(' ');
    },
    getNewStrng: function () {
        var strng = this.getCurrentWordBeingGuessed();
        var outputStrng = strng.split('');
        for (var i = 0; i < strng.length; i++) {
            var remove = true;
            for (var j = 0; j < this.correctGuesses.length; j++) {
                if (strng[i] === this.correctGuesses[j]) {
                    remove = false;
                }
            }
            if (remove) {
                outputStrng[i] = '_';
            }
        }
        return outputStrng.join(' ')
    },
    updateString: function (strng) {
        if (this.currentStep === 'username') {
            usernameSpan.innerHTML = strng;
        } else {
            passwordSpan.innerHTML = strng;
        }
    },
    checkStatus: function () {
        if (this.remainingTries <= 0) {
            console.log('game over');
        }
        var currentWord = this.getCurrentWordBeingGuessed();
        if (this.allGuessed()) {
            console.log('all the way guessed');
            if (this.currentStep === 'username') {
                this.currentStep = 'password';
                this.correctGuesses = [];
                this.guesses = [];
                this.remainingTries = 15;
                passwordSpan.innerText = '_ '.repeat(game.getLength());
                document.getElementById('entire-password').className = "";
                game.updateBottomStats();
            } else {
                document.getElementById('main-button').style.visibility = 'visible';
                document.getElementById('main-button').innerHTML = "Abort!";
            }
        } else if (this.remainingTries === 0) {
            gif.className = "lose-gif";
        }
        // or check if time ran out
    },
    allGuessed: function () {
        var currentWord = this.getCurrentWordBeingGuessed();
        for (var i = 0; i < currentWord.length; i++) {
            if (this.correctGuesses.indexOf(currentWord[i]) === -1) {
                return false
            }
        }
        return true
    },
    getCurrentWordBeingGuessed: function () {
        if (this.currentStep === 'username') {
            return this.username
        } else {
            return this.password
        }
    },
    changeLocation: function () {
        this.location = locations[Math.floor(Math.random() * locations.length)];
        changeLocation(this.location.latLng);
    }
}


mainButton.addEventListener('click', function (event) {
    if (this.innerText === 'Start!') {
        console.log('start the game');
        this.innerText = 'Abort!';
        messageP.className = "display-none";
        loginDiv.className = "my-center"; // making this visible
        mainButton.style.visibility = 'hidden';
        game.startGame();
        missile.startMissile(5000, 8000, 9000);
        game.updateBottomStats();
        usernameSpan.innerText = '_ '.repeat(game.getLength());
        document.addEventListener('keyup', mainGame);
    } else if (this.innerText === 'Abort!') {
        // user won
        console.log('user won!');
        // show user win screen and then play again after 3 seconds...
        changeScreenToWin();
        missile.resetMissile();
        game.changeLocation();
        setTimeout(startNewGame, 3000);
    }
});