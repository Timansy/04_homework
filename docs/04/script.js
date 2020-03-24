var url = "https://opentdb.com/api.php?amount=10";

var request = new XMLHttpRequest()

request.open('GET','https://opentdb.com/api.php?amount=10', true);

request.onload = function(){
    var data = JSON.parse(this.response);

    console.log(JSON.stringify(data));
    console.log(data);

    console.log(data.results.length);
    console.log(data.results[0].category);
    console.log(data.results[0].type);
    console.log(data.results[0].difficulty);
    console.log(data.results[0].question);
    console.log(data.results[0].correct_answer);
    console.log(data.results[0].incorrect_answers[0]);
    console.log(data.results[0].incorrect_answers[1]);
    console.log(data.results[0].incorrect_answers[2]);


}

request.send();