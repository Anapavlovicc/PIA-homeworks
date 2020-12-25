var counter = -1;
var numberOfCorrectAnswers = 0;
var user = "";
var myData;
var downloadTimer;
var timeout;
var timeLeft = 19;

function start() {
    counter++;
    document.getElementById("container").style.visibility = 'hidden';
    loadJsonFile();
}

function loadJsonFile() {
    $(document).ready(function() {    
        $.getJSON('pitanja.json', function(data) {
            myData = data;
        });
    });
}

function closeStartModal() {
    var modalClass = "modal hide fade";
    document.getElementById("startModal").classList = modalClass;
    document.getElementById("container").style.visibility = 'visible';
}

function saveAndStart() {
    user = document.getElementById("name").value;
    if (user === "") {
        return;
    }
    closeStartModal();
    loadQuestion();
    document.getElementById("score").innerHTML = "Rezultat: " + numberOfCorrectAnswers + "/" + counter;
}

function loadQuestion() {
    document.getElementById("serialNumber").innerHTML = "Pitanje broj: " + myData[counter].redniBroj;

    var isInput = myData[counter].odgovorSeUnosi;

    document.getElementById("question").innerHTML = myData[counter].pitanje;

    if (isInput) {
        document.getElementById("inputField").style.visibility = 'visible';
        document.getElementById("radioButtons").style.visibility = 'hidden';

        document.getElementById("answer").value = "";
    } else {
        document.getElementById("inputField").style.visibility = 'hidden';
        document.getElementById("radioButtons").style.visibility = 'visible';

        var answers = (myData[counter].odgovori).split(", ");
        var radioButtons = "";

        answers.forEach(answer => {
            answer = answer.trim();
            var answerString = "'" + answer + "'";
            radioButton = '<div onclick="checkSelected(' + answerString + ')"><input type="radio" value=' + answer + '>' +
            '   ' + answer + '   ' + '</div><br>';
            radioButtons += radioButton;
        });
        document.getElementById("radioButtons").innerHTML = radioButtons;
    }

    startTimer();
}

function endTimer() {
    timeLeft = 20;
    clearTimeout(timeout);
    clearInterval(downloadTimer);
    document.getElementById("countDown").innerHTML = timeLeft;
}

function startTimer() {
    timeout = setTimeout(() => {
        if (counter % 2) {
            check();
        } else {
            checkSelected("");
        }
    }, 20000);

    timeLeft = 19;
    downloadTimer = setInterval(function(){
      if(timeLeft <= 0){
        clearInterval(downloadTimer);
      }
      document.getElementById("countDown").innerHTML = timeLeft;
      timeLeft -= 1;
    }, 1000);
}

function checkSelected(answer) {
    var correctAnswer = myData[counter].odgovor;
    if (correctAnswer === answer) {
        numberOfCorrectAnswers++;
        document.getElementById("body").style.backgroundColor = 'palegreen';
        document.getElementById("score").innerHTML = "Rezultat: " + numberOfCorrectAnswers + "/" + counter;
        setTimeout(() => {
            nextQuestion();
        }, 1000);
    } else {
        document.getElementById("body").style.backgroundColor = 'lightsalmon';
        document.getElementById("score").innerHTML = "Rezultat: " + numberOfCorrectAnswers + "/" + counter;
        setTimeout(() => {
            nextQuestion();
        }, 1000);
    }
}

function check() {
    var correctAnswer = myData[counter].odgovor;
    var answer = document.getElementById("answer").value;
    if (correctAnswer === answer) {
        numberOfCorrectAnswers++;
        document.getElementById("body").style.backgroundColor = 'palegreen';
        document.getElementById("score").innerHTML = "Rezultat: " + numberOfCorrectAnswers + "/" + counter;
        setTimeout(() => {
            nextQuestion();
        }, 1000);
    } else {
        document.getElementById("body").style.backgroundColor = 'lightsalmon';
        document.getElementById("score").innerHTML = "Rezultat: " + numberOfCorrectAnswers + "/" + counter;
        setTimeout(() => {
            nextQuestion();
        }, 1000);
    }
}

function nextQuestion() {
    endTimer();

    counter++;
    if (counter > 9) {
        openEndModal();
        return;
    }
    document.getElementById("body").style.backgroundColor = 'white';
    document.getElementById("score").innerHTML = "Rezultat: " + numberOfCorrectAnswers + "/" + counter;
    loadQuestion();
}

function giveUp() {
    endTimer();
    openEndModal();
}

function openEndModal() {
    var modalClass = "modal show";
    document.getElementById("container").style.visibility = 'hidden';
    document.getElementById("radioButtons").style.visibility = 'hidden';
    document.getElementById("body").style.backgroundColor = 'lightgoldenrodyellow';
    document.getElementById("inputField").style.visibility = 'hidden';

    document.getElementById("endModal").classList = modalClass;
    document.getElementById("modal-title").innerHTML = user + ', hvala što ste popunili kviz!';
    document.getElementById("modal-body").innerHTML = '<h4>Vaš rezultat je: ' + numberOfCorrectAnswers + "/" + 10 + "</h4>";
}
