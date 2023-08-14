// https://www.youtube.com/watch?v=AIgtuB3569w&ab_channel=Codingflag

const userRadioButton = document.getElementById('userRadioButton');
const adminRadioButton = document.getElementById('adminRadioButton');
const createPollButton = document.getElementById('createPollButton');
const deletePollButton = document.getElementById('deletePollButton');
let adminPanel = document.querySelector(".adminPanel");
let pollContainer = document.querySelector(".poll-container");

userRadioButton.addEventListener('click', HandleRadioButtonClick);
adminRadioButton.addEventListener('click', HandleRadioButtonClick);
createPollButton.addEventListener('click', CreatePoll);
deletePollButton.addEventListener('click', DeletePoll);

function HandleRadioButtonClick(event)
{
    userRadioButton.checked = false;
    adminRadioButton.checked = false;
    event.target.checked = true;

    const visibility = adminRadioButton.checked ? 'inline' : 'none';
    console.log(visibility);
    adminPanel.style.display = visibility;
}

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

function InsertNewPoll(newPoll)
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

    pollContainer.appendChild(button);
    pollContainer.appendChild(content);

    polls[pollIndex] = new PollObject(newPoll, content);

    pollIndex++;
}

InsertNewPoll({
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

InsertNewPoll({
    question: "Does pineapple belong to pizza?",
    answers: [
        "Yes",
        "Absolutely!",
    ],
    pollCount: 50,
    answersWeight: [10, 40],
    selectedAnswer: -1,
});

InsertNewPoll({
    question: "What's your favorite color?",
    answers: [
        "Red",
        "Green",
        "Blue",
    ],
    pollCount: 5,
    answersWeight: [2, 1, 2],
    selectedAnswer: -1,
});

function CreatePoll()
{
    console.log("TODO: CreatePoll");
}

function DeletePoll()
{
    console.log("TODO: DeletePoll");
}

