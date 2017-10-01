function myMap() {
    var mapProp = {
        center: new google.maps.LatLng(40.9628845, -112.0953297), // get current location from browser, if can't default to washingtn dc
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
    } else {
        console.log('you guessed wrong');
        game.failedAttempt(keyPressed);
    }
    game.checkStatus();
    game.updateBottomStats();
}

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
        for (var i = 0; i < this.guesses; i++) {
            if (guess === this.guesses[i]) {
                return
            }
        }
        this.guesses.push(guess);
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
        document.getElementById('guesses').innerHTML = this.guesses;
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