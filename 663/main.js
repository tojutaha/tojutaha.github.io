// https://www.youtube.com/watch?v=AIgtuB3569w&ab_channel=Codingflag

let coll = document.getElementsByClassName("collapsible");

for (i = 0; i < coll.length; i++) {
    coll[i].addEventListener("click", function () {
        this.classList.toggle("active");
        var content = this.nextElementSibling;
        if (content.style.maxHeight) {
            content.style.maxHeight = null;
        } else {
            content.style.maxHeight = content.scrollHeight + "px";
        }
    });
}

let poll = {
    question: "What's your favorite programming language?",
    answers: [
        "C",
        "Java",
        "PHP",
        "JavaScript"
    ],
    pollCount: 20,
    answersWeight: [4, 4, 2, 10], // sum = 20
    selectedAnswer: -1,
};

let pollDOM = {
    question: document.querySelector(".poll .question"),
    answers: document.querySelector(".poll .answers"),
};

pollDOM.question.innerText = poll.question;
pollDOM.answers.innerHTML = poll.answers.map(function(answer, i)
{
    return (
        `
        <div class="answer" onclick="markAnswer('${i}')">
        ${answer}
        <span class="percentage-bar"></span>
        <span class="percentage-value"></span>
        </div>
        `
    );
}).join("");

function markAnswer(i)
{
    poll.selectedAnswer = +i;
    try {
        document.querySelector(".poll .answers .answer.selected").classList.remove("selected");
    } catch(msg) {}

    document.querySelectorAll(".poll .answers .answer")[+i].classList.add("selected");
    showResults();
}

function showResults()
{
    let answers = document.querySelectorAll(".poll .answers .answer")   ;
    for (let i = 0; i < answers.length; i++) {
        let percentage = 0;
        if (i == poll.selectedAnswer) {
            percentage = Math.round((poll.answersWeight[i] + 1) * 100 / (poll.pollCount + 1));
        } else {
            percentage = Math.round((poll.answersWeight[i]) * 100 / (poll.pollCount + 1));
        }

        answers[i].querySelector(".percentage-bar").style.width = percentage + "%";
        answers[i].querySelector(".percentage-value").innerText = percentage + "%";
    }
}