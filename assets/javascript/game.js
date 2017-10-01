function myMap() {
    getLocation();
    var mapProp = {
        center: new google.maps.LatLng(latitude, longitude), // get current location from browser, if can't default to washingtn dc
        zoom: 10,
    };
    var map = new google.maps.Map(document.getElementById("googleMap"), mapProp);
    map.setOptions({
        draggable: false
    });
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(changeLatLong);
    } else {
        latitude = 40.9628845;
        longitude = -112.0953297;
    }
}

function changeLatLong(position) {
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;
}

function mainGame(event) {
    var keyPressed = event.key;
    if (game.inString(keyPressed)) {
        console.log('you guessed right');
    } else {
        console.log('you guessed wrong');
        game.failedAttempt(keyPressed);
    }
    game.checkStatus();
    game.updateBottomStats();
}

var latitude = 40.9628845;
var longitude = -112.0953297;
var usernames = ['kim', 'denisrodman'];
var passwords = ['mouserat', 'appletree'];
var game = {
    username: null,
    password: null,
    guesses: [],
    remainingTries: 15,
    currentStep: 'username',

    startGame: function () {
        this.password = passwords[Math.floor(Math.random() * passwords.length)];
        this.username = usernames[Math.floor(Math.random() * usernames.length)];
        this.guesses = [];
        this.remainingTries = 15;
        this.currentStep = 'username';
    },
    inString: function (guess) {
        if (this.currentStep === 'username') {
            var string = this.username;
        } else {
            var string = this.password;
        }
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
    getLength: function () {
        if (this.currentStep === 'username') {
            return this.username.length;
        }
        return this.password.length;
    },
    updateBottomStats: function () {
        document.getElementById('attempts').innerText = this.remainingTries;
        document.getElementById('guesses').innerHTML = this.guesses.join(' ');
    },
    checkStatus: function () {
        if (this.remainingTries <= 0) {
            console.log('game over');
        }
        // or check if time ran out
    }
}



document.getElementById('main-button').addEventListener('click', function (event) {
    if (this.innerText === 'Start!') {
        console.log('start the game');
        this.innerText = 'Stop Missile'
        document.getElementById('intro').className = "display-none";
        document.getElementById('login').className = "my-center";
        document.getElementById('main-button').style.visibility = 'hidden';
        game.startGame();
        game.updateBottomStats();
        document.getElementById('username').innerText = '_ '.repeat(game.getLength());
        document.addEventListener('keyup', mainGame);
    } else {

        console.log('yea');
    }
});