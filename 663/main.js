// https://www.youtube.com/watch?v=AIgtuB3569w&ab_channel=Codingflag

let mainContainer = document.querySelector(".main-container");

function PollObject(poll, content) {
    this.poll = poll;
    this.content = content;
}

const polls = [];
let pollIndex = 0;

function MarkAnswer(selectedIndex, pollIndex)
{
    polls[pollIndex].poll.selectedAnswer = +selectedIndex;
    try {
        polls[pollIndex].content.querySelector(".poll .answers .answer.selected").classList.remove("selected");
    } catch(msg) {}

    polls[pollIndex].content.querySelectorAll(".poll .answers .answer")[+selectedIndex].classList.add("selected");
    ShowResults(pollIndex);
}

function ShowResults(pollIndex)
{
    let answers = polls[pollIndex].content.querySelectorAll(".poll .answers .answer");
    for (let i = 0; i < answers.length; i++) {
        let percentage = 0;
        if (i == polls[pollIndex].poll.selectedAnswer) {
            percentage = Math.round((polls[pollIndex].poll.answersWeight[i] + 1) * 100 / (polls[pollIndex].poll.pollCount + 1));
        } else {
            percentage = Math.round((polls[pollIndex].poll.answersWeight[i]) * 100 / (polls[pollIndex].poll.pollCount + 1));
        }

        answers[i].querySelector(".percentage-bar").style.width = percentage + "%";
        answers[i].querySelector(".percentage-value").innerText = percentage + "%";
    }
}

function DeletePoll(pollIndex)
{
    // TODO:
}

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
            <div class="answer" onclick="MarkAnswer('${i}', '${pollIndex}')">
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

    mainContainer.appendChild(button);
    mainContainer.appendChild(content);

    polls[pollIndex] = new PollObject(newPoll, content);

    pollIndex++;
}

CreatePoll({
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
});

CreatePoll({
    question: "Does pineapple belong to pizza?",
    answers: [
        "Yes",
        "Absolutely!",
    ],
    pollCount: 50,
    answersWeight: [10, 40],
    selectedAnswer: -1,
});

CreatePoll({
    question: "What's your favorite color?",
    answers: [
        "Red",
        "Green",
        "Blue",
    ],
    pollCount: 100,
    answersWeight: [25, 50, 25],
    selectedAnswer: -1,
});

