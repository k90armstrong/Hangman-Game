function myMap() {
    var coords = getLocation();

}

function getLocation() {
    var latitude = 40.9628845;
    var longitude = -112.0953297;
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(changeLatLong);
    } else {
        var mapProp = {
            center: new google.maps.LatLng(latitude, longitude), // get current location from browser, if can't default to washingtn dc
            zoom: 10,
        };
        var map = new google.maps.Map(document.getElementById("googleMap"), mapProp);
        map.setOptions({
            draggable: false
        });

    }
}

function changeLatLong(position) {
    var mapProp = {
        center: new google.maps.LatLng(position.coords.latitude, position.coords.longitude), // get current location from browser, if can't default to washingtn dc
        zoom: 10,
    };
    var map = new google.maps.Map(document.getElementById("googleMap"), mapProp);
    map.setOptions({
        draggable: false
    });
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

var latitude;
var longitude;
var usernames = ['kim', 'denisrodman'];
var passwords = ['mouserat', 'appletree'];
var game = {
    username: null,
    password: null,
    guesses: [],
    correctGuesses: [],
    remainingTries: 15,
    currentStep: 'username',

    startGame: function () {
        this.password = passwords[Math.floor(Math.random() * passwords.length)];
        this.username = usernames[Math.floor(Math.random() * usernames.length)];
        this.guesses = [];
        this.remainingTries = 15;
        this.currentStep = 'username';
        this.correctGuesses = [];
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
    succesfulAttempt: function (guess) {
        for (var i = 0; i < this.correctGuesses.length; i++) {
            if (guess === this.correctGuesses[i].toLowerCase()) {
                return
            }
        }
        this.correctGuesses.push(guess);
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
    getNewStrng: function () {
        if (this.currentStep === 'username') {
            var strng = this.username
        } else {
            var strng = this.password
        }
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
            document.getElementById('username').innerHTML = strng;
        } else {
            document.getElementById('password').innerHTML = strng;
        }
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