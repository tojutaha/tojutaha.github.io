// https://www.youtube.com/watch?v=AIgtuB3569w&ab_channel=Codingflag

let mainContainer = document.querySelector(".main-container");

function MarkAnswer(i)
{
    poll.selectedAnswer = +i;
    try {
        document.querySelector(".poll .answers .answer.selected").classList.remove("selected");
    } catch(msg) {}

    document.querySelectorAll(".poll .answers .answer")[+i].classList.add("selected");
    ShowResults();
}

function ShowResults()
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

let pollIndex = 0;
function CreatePoll(newPoll)
{
    let button = document.createElement('button');
    button.type = 'button';
    button.classList.add('collapsible');
    button.innerText = newPoll.question;

    let pollClass = document.createElement('div');
    pollClass.classList.add('poll');

    let answersClass = document.createElement('div');
    answersClass.classList.add('answers');
    answersClass.innerHTML = newPoll.answers.map(function(answer, i) {
        return (
            `
            <div class="answer" onclick="MarkAnswer('${i}')">
            ${answer}
            <span class="percentage-bar"></span>
            <span class="percentage-value"></span>
            </div>
            `
        );
    }).join("");

    let content = document.createElement('div');
    content.classList.add('content');
    content.appendChild(pollClass);
    pollClass.appendChild(answersClass);

    button.addEventListener("click", function () {
        this.classList.toggle("active");
        if (content.style.maxHeight) {
            content.style.maxHeight = null;
        } else {
            content.style.maxHeight = content.scrollHeight + "px";
        }
    });

    content.dataset.index = pollIndex++;

    mainContainer.appendChild(button);
    mainContainer.appendChild(content);
}

// TODO: Multiple polls!!
/*
let poll = {
    question: "What's your favorite programming language?",
    answers: [
        "C",
        "Python",
        "PHP",
        "JavaScript"
    ],
    pollCount: 20,
    answersWeight: [4, 4, 2, 10], // sum of pollCount!
    selectedAnswer: -1,
};
CreatePoll(poll);
*/

let poll = {
    question: "Does pineapple belong to pizza?",
    answers: [
        "Yes",
        "Absolutely!",
    ],
    pollCount: 50,
    answersWeight: [10, 40],
    selectedAnswer: -1,
}

CreatePoll(poll);
