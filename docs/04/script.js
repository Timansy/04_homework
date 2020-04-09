//Initial variables

let quizQuestions = [];//populated at game time
var gamestatus = 0; //0 = ready, 1 = running, 2 = ended;

//High scores area
let highscores = []; //not stored outside of local session
//Nice little addition from Stack Overflow
//could use it to sort over any part of the object
function SortByscore(a, b) {
    var aName = a.score;
    var bName = b.score;
    return ((aName > bName) ? -1 : ((aName < bName) ? 1 : 0));
}
highscores = highscores.sort(SortByscore);

//Variables, though some are not really used or thought out.
var remainingQuestions = 10;
var startingQuestionCount = remainingQuestions;
var currentQuestionNo = 1;
var questionCorrect = 0;
var questionIncorrect = 0;
var secondsPerQuestion = 10;
var penaltySeconds = 0;
var bonusSeconds = 0;
var secondsRemaining = remainingQuestions * secondsPerQuestion;
var mydata;
var selectCategory = "any";
var selectQuantity = "10";
var selectDifficulty = "any";
var questionComplete = true;
var score = 0;
var playerName = "";
var computerButtonClicked = false;

{ //Outside Functions
    function question(category, type, difficulty, question, correct_answer, incorrect_answers1, incorrect_answers2, incorrect_answers) {
        this.category = category;
        this.type = type;
        this.difficulty = difficulty;
        this.question = question;
        this.correct_answer = correct_answer;
        this.incorrect_answers1 = incorrect_answers1;
        this.incorrect_answers2 = incorrect_answers2;
        this.incorrect_answers3 = incorrect_answers3;
    }

    function addQuestion(question) {
        quizQuestions.push(question);
        // console.log(JSON.stringify(question));
        // console.log(typeof (JSON.stringify(question)))
    }
    function retrieveQuestions(url) {
        quizQuestions = [];
        $.ajax({
            url: url,
            type: "GET",
            dataType: "json",
            async: false,
            success: function (questions) {
                //console.log(questions.results[0]);
                $.each(questions.results, function (i, question) {
                    addQuestion(questions.results[i]);
                });
            },
            error: function (error) {
                console.log(error);
            }
        });
    }
}
$(document).ready(function () {

    hsForm = $("#hsform");
    //inside functions
    function setScore() {
        score = (startingQuestionCount - questionIncorrect) * 100 + secondsRemaining;
        $("#scoreField").text(score);
    }

    function listScores() {
        $(".hstable").empty();
        for (var i = 0; i < highscores.length; i++) {
            $(".hstable").append(`<li class="list-group-item" id="hsEntry"><span id=leftcontent>${highscores[i].name}</span><span id=rightcontent>${highscores[i].score}</span></li>`);
        }
    }

    function setTrafficLight() {
        $("#red").text(questionIncorrect);
        $("#yellow").text(remainingQuestions);
        $("#green").text(questionCorrect);
    }

    function setCrosswalk() {
        if (gamestatus === 0) {
            $("#crosswalk").removeClass("fas fa-hand-paper").addClass("fas fa-walking fa-2x");
        } else if (gamestatus === 2)
            $("#crosswalk").removeClass("fas fa-walking fa-2x").addClass("fas fa-hand-paper");
        else {
            $("#crosswalk").removeClass().html("<h4>" + secondsRemaining + "</h4>");
        }
    }

    function toTitleCase(str) {//capitalizes words
        return str.replace(
            /\w\S*/g,
            function (txt) {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            }
        );
    }

    function setfooterValues() {
        $("#seconds_per_question").val(secondsPerQuestion);
        $("#penalty_seconds").val(penaltySeconds);
        $("#bonus_seconds").val(bonusSeconds);
    }

    {//capture changes in footer section
        $("#seconds_per_question").on("change", function () {
            secondsPerQuestion = parseInt($("#seconds_per_question").val());
        });
        $("#penalty_seconds").on("change", function () {
            penaltySeconds = parseInt($("#penalty_seconds").val());
        });
        $("#bonus_seconds").on("change", function () {
            bonusSeconds = parseInt($("#bonus_seconds").val());
        });
    }

    function setqty() {
        selectQuantity = $("#trivia_amount").val();
        startingQuestionCount = parseInt($("#trivia_amount").val());
        remainingQuestions = startingQuestionCount;
        if (gamestatus != 2) {
            remainingQuestions = startingQuestionCount;
            setTrafficLight();
        }
    }

    {//capture changes in custom quiz 
        $("#trivia_category").on("change", function () {
            selectCategory = $("#trivia_category").val();
        });
        $("#trivia_difficulty").on("change", function () {
            selectDifficulty = $("#trivia_difficulty").val();
        });
        $("#trivia_amount").on("change", function () {
            setqty();
        });
    }

    //sets the questions to either the form or a default computer category.
    function buildRemoteURL() {
        var u = `https://opentdb.com/api.php?amount=${selectQuantity}&type=multiple`;

        if (computerButtonClicked) {
            u = u + `&category=18`;
        } else if(selectCategory !== "any") {
            u = u + `&category=${selectCategory}`;
        }

        if (selectDifficulty !== "any") {
            u = u + `&difficulty=${selectDifficulty}`;
        }
        console.log(u);
        return u;
    }

    //a nifty little function that replaces ASCII code with their correspondind characters
    //there are still
    function textCleaner(text) {
        return text
            .replace(/&quot;/g, '\"')
            .replace(/&#039;/g, '\'')
            .replace(/&amp;/g, '\&')
            .replace(/&rdquo;/g, '\"')
            .replace(/&ldquo;/g, '\"')
            ;
    }

    //never ended up using this, but I left it in here nonetheless
    //it may eventually be good to make the click>view answer timing which is not consistent
    function sleep(milliseconds) {
        var start = new Date().getTime();
        for (var i = 0; i < 1e7; i++) {
            if ((new Date().getTime() - start) > milliseconds) {
                break;
            }
        }
    }



    //QUESTION FUNCTIONS
    function postQuestion(i) {
        //check to see i is at the end
        questionComplete = false;
        //questions set-up - START
        $(".gameboard").empty();
        $(".gameboard").html("<div class=\"card-header\">Question # of TOTAL | Difficulty | Category</div><div class=\"card-body\"><h5 class=\"card-title\">Question</h5>          <div class=\"list-group\"><button type=\"button\" class=\"list-group-item list-group-item-action btn\"id = \"a1\" > 1</button><button type=\"button\" class=\"list-group-item list-group-item-action btn \"id=\"a2\">2</button><button type=\"button\"class=\"list-group-item list-group-item-action btn \"id=\"a3\">3</button> <button type=\"button\"class=\"list-group-item list-group-item-action btn\" id=\"a4\">4</button></div><p class=\"card-text\"><br><button type=\"button\" class=\"btn btn-primary btn-xl disabled\" id=\"submit\">Submit!</button></p></div>");
        var mydifficulty = toTitleCase(quizQuestions[i].difficulty);
        var category = quizQuestions[i].category;
        var correct = quizQuestions[i].correct_answer;
        $(".card-header").text(`Question ${currentQuestionNo} of ${startingQuestionCount} | ${mydifficulty} | ${category}`);
        $(".card-title").text(textCleaner(quizQuestions[i].question));
        var solutionEntry = Math.ceil(Math.random() * 4);
        if (solutionEntry === 1) {
            $("#a1").text(textCleaner(correct));
            $("#a2").text(textCleaner(quizQuestions[i].incorrect_answers[0]));
            $("#a3").text(textCleaner(quizQuestions[i].incorrect_answers[1]));
            $("#a4").text(textCleaner(quizQuestions[i].incorrect_answers[2]));
        } else if (solutionEntry === 2) {
            $("#a2").text(textCleaner(correct));
            $("#a1").text(textCleaner(quizQuestions[i].incorrect_answers[0]));
            $("#a3").text(textCleaner(quizQuestions[i].incorrect_answers[1]));
            $("#a4").text(textCleaner(quizQuestions[i].incorrect_answers[2]));
        } else if (solutionEntry === 3) {
            $("#a3").text(textCleaner(correct));
            $("#a2").text(textCleaner(quizQuestions[i].incorrect_answers[0]));
            $("#a1").text(textCleaner(quizQuestions[i].incorrect_answers[1]));
            $("#a4").text(textCleaner(quizQuestions[i].incorrect_answers[2]));
        } if (solutionEntry === 4) {
            $("#a4").text(textCleaner(correct));
            $("#a2").text(textCleaner(quizQuestions[i].incorrect_answers[0]));
            $("#a3").text(textCleaner(quizQuestions[i].incorrect_answers[1]));
            $("#a1").text(textCleaner(quizQuestions[i].incorrect_answers[2]));
        }

        { //sets the active button
            $('.list-group').on('click', '.btn', function () {
                $(this).addClass('active').siblings().removeClass('active');
                $("#submit").removeClass("disabled");
            });
        }

        function correctAnswer() {
            questionCorrect++;
            remainingQuestions--;
            secondsRemaining = secondsRemaining + bonusSeconds;
            setCrosswalk();
            setTrafficLight();
        }
        function incorrectAnswer() {
            questionIncorrect++;
            remainingQuestions--;
            secondsRemaining = secondsRemaining - penaltySeconds;
            setCrosswalk();
            setTrafficLight();
        }

        {   //sets the active button, compares correct answer
            //colors correct answer, calls correct/incorrect anser functions
            $('#submit').on('click', function () {

                if (solutionEntry === 1) {
                    if ($("#a1").hasClass("active")) {
                        correctAnswer();
                        $("#a1").addClass("btn-success");
                    } else {
                        incorrectAnswer();
                        $("#a1").addClass("btn-success active");
                    }
                } else if (solutionEntry === 2) {
                    if ($("#a2").hasClass("active")) {
                        correctAnswer();
                        $("#a2").addClass("btn-success");
                    } else {
                        incorrectAnswer();
                        $("#a2").addClass("btn-success active");
                    }
                } else if (solutionEntry === 3) {
                    if ($("#a3").hasClass("active")) {
                        correctAnswer();
                        $("#a3").addClass("btn-success");
                    } else {
                        incorrectAnswer();
                        $("#a3").addClass("btn-success active");
                    }
                } else if (solutionEntry === 4) {
                    if ($("#a4").hasClass("active")) {
                        correctAnswer();
                        $("#a4").addClass("btn-success");
                    } else {
                        incorrectAnswer();
                        $("#a4").addClass("btn-success active");
                    }
                }
                $(this).addClass("disabled");
                questionComplete = true;
                currentQuestionNo++;
            });
        }
    }

    //Computer Based Quiz
    $("#computerQuiz").on("click", function () {
        if (gamestatus != 1) {
            reset();
            computerButtonClicked = true;
            gameController();
        }
    });

    //User Generated Quiz
    $("#customQuiz").on("click", function () {
        if (gamestatus != 1) {
            reset();
            gameController();
        }
    });


    //PAGE START
    hsForm.hide();
    setfooterValues();
    setCrosswalk();
    setTrafficLight();
    listScores();

    //Called after quizes to set up for next game
    function reset() {

        startingQuestionCount = remainingQuestions;
        currentQuestionNo = 1;
        questionCorrect = 0;
        questionIncorrect = 0;
        secondsRemaining = remainingQuestions * secondsPerQuestion;
        questionComplete = true;
        score = 0;
        playerName = "";
        setqty();
        computerButtonClicked = false;
    }


    //Called on clicks
    function gameController() {
        //call questions
        gamestatus = 1; //game is running
        retrieveQuestions(buildRemoteURL());
        //$(".gameboard").empty();
        var thisGameQuestionCount = startingQuestionCount;
        var thisGameSecondsPerQuestion = secondsPerQuestion;
        secondsRemaining = thisGameQuestionCount * thisGameSecondsPerQuestion;
        //set up interval timer to
        var nIntervId;
        nIntervId = setInterval(function () {
            if (secondsRemaining < 1) {
                gamestatus = 2;
                $(".game").removeClass("active");
                $(".highscores").addClass("active");
                $("#hsform").show();
                questionIncorrect++;
                setScore();
                console.log("got here");
                clearInterval(nIntervId);
                return String("timed_out");
            }
            if (currentQuestionNo <= thisGameQuestionCount) {
                if (questionComplete === true) {
                    postQuestion(currentQuestionNo - 1);

                    $(".game").addClass("active");
                    $(".highscores").removeClass("active");
                } else {
                    setCrosswalk();
                    setTrafficLight();
                    console.log("got here");
                }
            } else {
                gamestatus = 2;
                $(".game").removeClass("active");
                $(".highscores").addClass("active");
                $("#hsform").show();
                setScore();
                console.log("got here");
                clearInterval(nIntervId);
                return String("finished_quiz");
            }
            secondsRemaining--;
            setCrosswalk();
            setTrafficLight();
        }, 1000);

        //after the game end, the HS form triggers the reset

        $(".scoreSubmit").click(function (event) {
            event.stopPropagation();
            playerName = $("#whatsName").val();
            highscores.push({ name: playerName, score: score });
            highscores = highscores.sort(SortByscore);
            listScores();
            $("#hsform").hide();
            clearInterval(nIntervId);
            gamestatus = 0;
            reset();
            $(".scoreSubmit").unbind(eventType);
        });

        //after the game end, the HS form triggers the reset
        $("#whatsName").on("blur", function () {
            event.stopPropagation();
            playerName = $("#whatsName").val();
            highscores.push({ name: playerName, score: score });
            highscores = highscores.sort(SortByscore);
            listScores();
            $("#hsform").hide();
            clearInterval(nIntervId);
            gamestatus = 0;
            reset();
            $("#whatsName").unbind(eventType);
        });
    }

});
