//Needed for the Mystery Word game:

//1. Store the word the user is trying to guess in a session.
//2. show the number of letters in the word like so: _ _ _ _ _ _
//3. Using form the user gets one guess and the form most be validated for one quess (inform of more than one letter entered).
//4. Inform the user if their guess appears in the word. Store users guesses in session.
//5. Display partially guessed word.
//6. User gets 8 guesses.
//7. User loses a guess if they guess wrong. But doesn't lose a guess if they repeat a word.
//7a. Inform the user if they already guessed the letter.
//8. The game ends when the full word is guessed.
//8a. The game also ends if they run out of the guesses.
//9. Ask the player if they wish to play again. If so, the game starts again.

//Pseudocode
//Pick a random word
//For the word hasn't been guessed {
//show user their current progress
// give the user the option to guess }

//If the guess is not a single letter {
          //inform player to select one letter}

//If select letter is correct {
          // provide an update. user doesn't lose a turn}

//If select letter is incorrect {
        //user has one less guess}

//if user guesses the word {
      //update the user's progress}


const fs = require("fs");
const express = require('express');
const mustache = require('mustache-express');
const bodyparser = require('body-parser');
const session = require('express-session');
const words = fs.readFileSync("/usr/share/dict/words", "utf-8").toLowerCase().split("\n");
const app = express();
app.engine('mustache', mustache());
app.set('view engine', 'mustache');
app.set ('views', './views');
app.use(bodyparser.urlencoded({extended: false}));
app.use(express.static(__dirname + '/public'));
app.use(session({
  secret: 'descreet',
  resave: false,
  saveUninitialized: true
}))



let youhavewon = 0;

app.get('/outOfLetters', function (request, response) {
  let guessing_word = request.session.LetterRandom;

  request.session.destroy();

  response.render('outOfLetters', {


    One_Less_Letter: guessing_word
  });
});


app.get('/victory', function (request, response) {
  let word = request.session.LetterRandom;

  request.session.destroy();

  response.render('victory', {


    One_Less_Letter: guessing_word
  });
});



app.post('/index/:x', function (request, response) {
  request.params.x

  let lettersLetters = false;

  for (let i = 0; i < request.session.LetterRandom.length; i++) {
    if (request.params.x === request.session.LetterRandom[i].letter) {
      request.session.LetterRandom[i].Answer = true;
      lettersLetters = true;
      youhavewon ++;
    }
  }

  if (!lettersLetters) {
    request.session.User_Gets -= 1;
  }

  if (request.session.User_Gets === 0) {
    return response.redirect('/outOfLetters');
  }

  if (youhavewon === request.session.LetterRandom.length) {
    return response.redirect('/victory');
  }

  request.session.Repeat.push(request.params.x);
  response.redirect('/index');
});

app.post('/outOfLetters', function (request, response) {
  response.redirect('/index');
});

app.post('/victory', function (request, response) {
  response.redirect('/index');
});

//Choosing A Random Word and create the answer array
  function Choosing_Word() {
  const Choosed_Word = words[Math.floor(Math.random() * words.length) | 0];
  return Choosed_Word;
}


function Mission_Word_Impossible (request) {
  const word_of = []; // this is where the answer is
  for (let i = 0; i < request.session.LetterRandom.length; i++){
    word_of.push(request.session.LetterRandom.charAt(i))
  };
  return word_of;
}

function Letters_Make_Words(request) {
  const under_score = []; // this starts out as blanks
  for (let i =0; i < request.session.MakeWords.length; i++){
    under_score.push("_");
  };
  return under_score;
}

app.get('/', function(request, respond){
  if(request.session.LetterRandom === undefined) {
    request.session.LetterRandom = Choosing_Word();
    request.session.MakeWords = Mission_Word_Impossible(request);
    request.session.Letters_Make_Words = Letters_Make_Words(request);
    request.session.User_Gets = 8;
    request.session.Repeat = [ ];
  }

  // renders the mustache page to html format
  respond.render('index', {
    One_Less_Letter: {
      Hint: request.session.Letters_Make_Words,
    }
  });
});

app.post ('/', function(request, respond){
  // check the word by looping over every letter
  let Make_The_Selection = request.body.JustALetter; //Go to the body of my index for the name of my input type text
  let Excellent = false;
  let MoreLettersToo = false;
  let The_End = false;

  for (let i = 0; i < request.session.Repeat.length; i++){
  if (request.session.Repeat[i] === Make_The_Selection){
    MoreLettersToo = true;
  }
}
console.log(MoreLettersToo);

for (let i = 0; i < request.session.LetterRandom.length; i++){
    if (request.session.MakeWords[i] === Make_The_Selection){
      request.session.Letters_Make_Words[i] = (Make_The_Selection);
      Excellent = true;
    }
  };

  if (Excellent === false) {
    request.session.User_Gets--;
  }

  if (MoreLettersToo === false){
  request.session.Repeat.unshift(Make_The_Selection);
};

if (request.session.User_Gets === 0) {
  The_End = true;
  request.session.Letters_Make_Words = [];
}

respond.render('index', {
  One_Less_Letter: {
    Assist: request.session.Letters_Make_Words,
    Correct_Guesses_Made: request.session.Repeat,
    Guesses_Left: request.session.User_Gets,
    LettersToo: MoreLettersToo,
    Answer: request.session.LetterRandom,
    The_End: The_End
  }
})
});

//Attempting to make a win and loss page. No errors reflected in terminal but not working in browser.




app.listen(3003, function () {
  console.log('Did you code today')
});
