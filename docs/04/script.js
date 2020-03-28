let quizQuestions = [];
var remainingQuestions = 10;
var startingQuestionCount = remainingQuestions;
var currentQuestionNo = 0;
var questionCorrect = 0;
var questionIncorrect = 0;
var gamestatus = 1; //0 = ready, 1 = running, 2 = ended;
var secondsPerQuestion = 10;
var penaltySeconds = 3;
var bonusSeconds = 0;
var secondsRemaining = remainingQuestions * secondsPerQuestion;
var mydata;
var selectCategory = "any";
var selectQuantity = "10";
var selectDifficulty = "any";


function question(category, type, difficulty, question, correct_answer, incorrect_answers1, incorrect_answers2, incorrect_answers3) {
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

$.ajax({
    url: "https://opentdb.com/api.php?amount=10&type=multiple",
    type: "GET",
    dataType: "json",
    async : false,
    success: function (questions) {
        console.log(questions.results[0]);
        $.each(questions.results, function (i, question) {
            addQuestion(questions.results[i]);
        });
    },
    error: function (error) {
        console.log(error);
    }
});

$(document).ready(function () {

    function setTrafficLight() {
        $("#red").text(questionIncorrect);
        $("#yellow").text(remainingQuestions);
        $("#green").text(questionCorrect);
    };

    function setCrosswalk() {
        if (gamestatus === 0) {
            $("#crosswalk").removeClass("fas fa-hand-paper").addClass("fas fa-walking fa-2x");
        } else if (gamestatus === 2)
            $("#crosswalk").removeClass("fas fa-walking fa-2x").addClass("fas fa-hand-paper");
        else {
            $("#crosswalk").removeClass().html("<h4>" + secondsRemaining + "</h4>");
        }
    }
    
    function toTitleCase(str) {
        return str.replace(
            /\w\S*/g,
            function(txt) {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            }
        );
    }

    //footer functions
    function setfooterValues() {
        $("#seconds_per_question").val(secondsPerQuestion);
        $("#penalty_seconds").val(penaltySeconds);
        $("#bonus_seconds").val(bonusSeconds);
    }

    $("#seconds_per_question").on("change", function () {
        secondsPerQuestion = parseInt($("#seconds_per_question").val());
    });
    $("#penalty_seconds").on("change", function () {
        penaltySeconds = parseInt($("#penalty_seconds").val());
    });
    $("#bonus_seconds").on("change", function () {
        bonusSeconds = parseInt($("#bonus_seconds").val());
    });


    $("#trivia_category").on("change", function () {
        selectCategory = $("#trivia_category").val();
    });
    $("#trivia_difficulty").on("change", function () {
        selectDifficulty = $("#trivia_difficulty").val();
    });
    $("#trivia_amount").on("change", function () {
        selectQuantity = $("#trivia_amount").val();
    });



    function textCleaner(text){
        return text
        .replace(/&quot;/g, '\"')
        .replace(/&#039;/g, '\'')
        .replace(/&amp;/g, '\&')
        .replace(/&rdquo;/g, '\"')
        .replace(/&ldquo;/g, '\"')
        ;
    }



    function postQuestion(i){
        var difficulty = toTitleCase(quizQuestions[i].difficulty);
        var category = quizQuestions[i].category;
        var correct = quizQuestions[i].correct_answer;
        $(".card-header").text(`Question ${currentQuestionNo} of ${startingQuestionCount} | ${difficulty} | ${category}`);
        $(".card-title").text(textCleaner(quizQuestions[i].question));
        var solutionEntry = Math.ceil(Math.random()*4);
        if(solutionEntry === 1) {
            $("#a1").text(textCleaner(correct));
            $("#a2").text(textCleaner(quizQuestions[i].incorrect_answers[0]));
            $("#a3").text(textCleaner(quizQuestions[i].incorrect_answers[1]));
            $("#a4").text(textCleaner(quizQuestions[i].incorrect_answers[2]));
        } else if(solutionEntry === 2) {
            $("#a2").text(textCleaner(correct));
            $("#a1").text(textCleaner(quizQuestions[i].incorrect_answers[0]));
            $("#a3").text(textCleaner(quizQuestions[i].incorrect_answers[1]));
            $("#a4").text(textCleaner(quizQuestions[i].incorrect_answers[2]));
        } else if(solutionEntry === 3) {
            $("#a3").text(textCleaner(correct));
            $("#a2").text(textCleaner(quizQuestions[i].incorrect_answers[0]));
            $("#a1").text(textCleaner(quizQuestions[i].incorrect_answers[1]));
            $("#a4").text(textCleaner(quizQuestions[i].incorrect_answers[2]));
        } if(solutionEntry === 4) {
            $("#a4").text(textCleaner(correct));
            $("#a2").text(textCleaner(quizQuestions[i].incorrect_answers[0]));
            $("#a3").text(textCleaner(quizQuestions[i].incorrect_answers[1]));
            $("#a1").text(textCleaner(quizQuestions[i].incorrect_answers[2]));
        }
        return solutionEntry;
    }

    $('.list-group').on('click', '.btn', function() {
        $(this).addClass('active').siblings().removeClass('active');
        $("#submit").removeClass("disabled");
      });

    setfooterValues();
    setCrosswalk();
    setTrafficLight();
    postQuestion(0);
});
