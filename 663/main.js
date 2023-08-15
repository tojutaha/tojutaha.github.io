// https://www.youtube.com/watch?v=AIgtuB3569w&ab_channel=Codingflag

const userRadioButton = document.getElementById('userRadioButton');
const adminRadioButton = document.getElementById('adminRadioButton');
const createPollButton = document.getElementById('createPollButton');
const deletePollButton = document.getElementById('deletePollButton');

const CreatePrompt = document.querySelector('.create-prompt');
const DeletePrompt = document.querySelector('.delete-prompt');
const closeCreatePromptButton = document.getElementById('prompt-create-close');
const closeDeletePromptButton = document.getElementById('prompt-delete-close');

let adminPanel = document.querySelector(".adminPanel");

let pollContainer = document.querySelector(".poll-container");

userRadioButton.addEventListener('click', HandleRadioButtonClick);
adminRadioButton.addEventListener('click', HandleRadioButtonClick);
createPollButton.addEventListener('click', CreatePoll);
deletePollButton.addEventListener('click', DeletePoll);
closeCreatePromptButton.addEventListener('click', CloseCreatePrompt);
closeDeletePromptButton.addEventListener('click', CloseDeletePrompt);

function HandleRadioButtonClick(event)
{
    userRadioButton.checked = false;
    adminRadioButton.checked = false;
    event.target.checked = true;

    const visibility = adminRadioButton.checked ? 'inline' : 'none';
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

function RefreshPage()
{
    // Remove old polls from page
    while (pollContainer.firstChild) {
        pollContainer.removeChild(pollContainer.firstChild);
    }

    const tmp = Array.from(polls);
    polls.length = 0;

    console.log(polls);
    console.log(tmp);

    // Add remaining polls from array
    tmp.forEach((poll) => {
        InsertNewPoll(poll.poll);
    });
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
    CreatePrompt.style.display = 'block';
}

function HandleDelete(content, index)
{
    let prompt = content.querySelectorAll(".prompt-container")[index];
    while (prompt.firstChild) {
        prompt.removeChild(prompt.firstChild);
    }

    polls.splice(index, 1);
    RefreshPage();
    DeletePoll();

    if (polls.length <= 0) {
        CloseDeletePrompt();
    }
}

function DeletePoll()
{
    if (polls.length <= 0 ) {
        return; // Nothing to do.
    }

    // Clear old content
    let content = document.querySelector(".delete-prompt-content");
    while (content.firstChild) {
        content.removeChild(content.firstChild);
    }

    // Construct elements
    polls.forEach((poll, index) => {
        let container = document.createElement("div");
        container.classList.add("prompt-container");
        let question = document.createElement("p");
        question.innerText = poll.poll.question;
        let button = document.createElement("button");
        button.textContent = "X";
        container.appendChild(button);
        container.appendChild(question);
        content.appendChild(container);
        
        // TODO: Bug, index doesnt get zeroed for whatever reason!
        console.log(index);
        button.addEventListener("click", () => {
            HandleDelete(content, index);
        });
    });

    DeletePrompt.style.display = 'block';
}

function CloseCreatePrompt()
{
    CreatePrompt.style.display = 'none';
}

function CloseDeletePrompt()
{
    DeletePrompt.style.display = 'none';
}
