// MAP FUCNTION HERE
function myMap() {
    var mapProp = {
        zoom: 10,
        disableDefaultUI: true
    };
    map = new google.maps.Map(document.getElementById("googleMap"), mapProp);
    var latLng = getUserLocation();

    google.maps.event.addListener(map, 'projection_changed', function () {

        overlay = new google.maps.OverlayView();
        overlay.draw = function () {};
        console.log('i amcreating the overlay', overlay);
        overlay.setMap(map);
    });
}

function getUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            var latLng = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            changeLocation(latLng);
        });
    } else {
        // if user doesnt allow for the location info just start with the first index in the location array
        var loc = locations[game.locationIndex];
        var latLng = loc.latLng;
        game.locationIndex += 1;
        game.username = loc.user;
        game.password = loc.password;
        changeLocation(latLng);
    }
}

function changeLocation(latLng) {
    map.setCenter({
        lat: latLng.lat - .1,
        lng: latLng.lng
    })
    var glatLang = new google.maps.LatLng(latLng.lat, latLng.lng);
    targetLocation = overlay.getProjection().fromLatLngToContainerPixel(glatLang);
    // console.log(test);
    target.className = "fa fa-bullseye target";
    target.style.top = targetLocation.y + 'px';
    target.style.left = targetLocation.x + 'px';
    missile.changeAngle(targetLocation.x, targetLocation.y);
}


// MAIN GAME HERE CALLBACK FOR KEYUP EVENT
function mainGame(event) {
    var keyPressed = event.key;
    if (game.inString(keyPressed)) {
        game.succesfulAttempt(keyPressed);
        var newString = game.getNewStrng();
        game.updateString(newString);
    } else {
        game.failedAttempt(keyPressed);
    }
    game.checkStatus();
    game.updateBottomStats();
}

// functions to change the DOM based on a win or a loss
function changeScreenToWin() {
    loginDiv.className = 'my-center display-none';
    document.getElementById('entire-password').className = 'display-none';
    messageP.innerHTML = 'You just saved the world from going into another world war! Congrats!';
    messageP.className = '';
    mainButton.style.visibility = 'hidden';
}

function changeScreenToLose() {
    gif.className = "lose-gif";
    loginDiv.className = 'my-center display-none';
    document.getElementById('entire-password').className = 'display-none';
    messageP.innerHTML = 'Few that was close! It looks like the missile didn\'t make it very far!';
    messageP.className = '';
    mainButton.style.visibility = 'hidden';
}

function startNewGame() {
    messageP.innerHTML = 'Oh no! It looks like they are launching an attack on ' + game.location.name + '! Hurry press start to stop the missile!';
    mainButton.style.visibility = 'visible';
    mainButton.innerHTML = 'Start!'
}

// function to get the position of an element
function getBottom(element) {
    var rect = element.getBoundingClientRect();
    return rect.bottom

}

// function to shuffle an array 
function shuffle(array) {
    var currentIndex = array.length,
        temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

// Declare Variables Below Here
var latitude;
var longitude;
var targetPX;
var map;
var overlay;
var targetLocation;
var computerElement = document.getElementById('computer');
console.log('here is the bottom' + getBottom(computerElement));
var bottom = getBottom(computerElement);
var inner = document.getElementById('inner');
// inner.style.top = bottom + 'px';
var gif = document.getElementById('gif');
var target = document.getElementById('target');
var usernameSpan = document.getElementById('username');
var passwordSpan = document.getElementById('password');
var messageP = document.getElementById('intro');
var mainButton = document.getElementById('main-button');
var loginDiv = document.getElementById('login');
var locations = [{
        name: 'the White House',
        user: 'mickeymouse',
        password: 'waltdisney',
        latLng: {
            lat: 38.897957,
            lng: -77.036560
        }
    },
    {
        name: 'the Statue of Liberty',
        user: 'mickeymouse',
        password: 'waltdisney',
        latLng: {
            lat: 40.689247,
            lng: -74.044502
        }
    },
    {
        name: 'the Pentagon',
        user: 'mickeymouse',
        password: 'waltdisney',
        latLng: {
            lat: 38.8719,
            lng: -77.0563
        }
    },
    {
        name: 'the Empire State Building',
        user: 'mickeymouse',
        password: 'waltdisney',
        latLng: {
            lat: 40.748817,
            lng: -73.985428
        }
    }, {
        name: 'Disneyland',
        user: 'mickeymouse',
        password: 'waltdisney',
        latLng: {
            lat: 33.8121,
            lng: -117.9190
        }
    }, {
        name: 'Mount Rushmore',
        user: 'mickeymouse',
        password: 'waltdisney',
        latLng: {
            lat: 43.8791,
            lng: -103.4591
        }
    }
];

locations = shuffle(locations);

// missile object and the html element
var missileElement = document.getElementById('missile');
var missile = {
    moveMissileIntreval: null,

    changeAngle: function (finalX, finalY) {
        startX = 0;
        startY = 0;

        var deltaX = finalX - startX;
        var deltaY = finalY - startY;
        var angle = (Math.atan(deltaY / deltaX));
        console.log('ang', angle);
        angle += 0.785398; // 45 degrees to radians 0.785398
        missileElement.style.transform = 'rotate(' + angle + 'rad)';
        missileElement.className = 'fa fa-rocket missile';
    },

    startMissile: function (totalTime, finalX, finalY) {
        startX = 0;
        startY = 0;

        var deltaX = finalX - startX;
        var deltaY = finalY - startY;
        var totalDistance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        var fps = 10;
        var changePerMoveX = deltaX / (totalTime * fps);
        var changePerMoveY = (deltaY / (totalTime * fps));
        var thisMissile = this;

        this.moveMissileIntreval = setInterval(function () {
            var oldTop = missileElement.style.top.replace('px', '');
            var oldLeft = missileElement.style.left.replace('px', '');
            if (oldTop === '') {
                oldTop = startX;
            }
            if (oldLeft === '') {
                oldLeft = startY;
            }
            var newTop = parseFloat(oldTop) + changePerMoveY;
            var newLeft = parseFloat(oldLeft) + changePerMoveX;
            missileElement.style.top = newTop + 'px';
            missileElement.style.left = newLeft + 'px';
            if (newTop >= finalY && newLeft >= finalX) {
                // game over !!!!
                clearInterval(thisMissile.moveMissileIntreval);
                game.checkStatus(true);
            }
        }, 10);

    },
    resetMissile: function () {
        clearInterval(this.moveMissileIntreval);
        missileElement.style.top = 0 + 'px';
        missileElement.style.left = 0 + 'px';
    }

}

// game object
var game = {
    username: 'kim',
    password: 'northkorearules',
    guesses: [],
    correctGuesses: [],
    remainingTries: 15,
    currentStep: 'username',
    location: null,
    locationIndex: 0,

    startGame: function () {
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
    checkStatus: function (missileHit) {
        if (this.remainingTries <= 0 | missileHit) {
            // check if missile hit target TODO
            changeScreenToLose();
            missile.resetMissile();
            game.changeLocation();
            setTimeout(startNewGame, 6000);
            return
        }
        var currentWord = this.getCurrentWordBeingGuessed();
        if (this.allGuessed()) {
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
        }
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
        this.location = locations[this.locationIndex];
        this.username = this.location.user;
        this.password = this.location.password;
        this.locationIndex += 1;
        if (this.locationIndex === locations.length) {
            this.locationIndex = 0;
            locations = shuffle(locations);
        }
        changeLocation(this.location.latLng);
    }
}

// addind click event listener for the main button
mainButton.addEventListener('click', function (event) {
    if (this.innerText === 'Start!') {
        this.innerText = 'Abort!';
        messageP.className = "display-none";
        loginDiv.className = "my-center"; // making this visible
        mainButton.style.visibility = 'hidden';
        game.startGame();
        missile.startMissile(500, targetLocation.x, targetLocation.y);
        game.updateBottomStats();
        usernameSpan.innerText = '_ '.repeat(game.getLength());
        document.addEventListener('keyup', mainGame);
        gif.className = "lose-gif display-none";
    } else if (this.innerText === 'Abort!') {
        // user won
        // show user win screen and then play again after 3 seconds...
        changeScreenToWin();
        missile.resetMissile();
        game.changeLocation();
        setTimeout(startNewGame, 3000);
    }
});