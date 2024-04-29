const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");

function addTask() {
    if (inputBox.value === '') {
        alert("You must write something!");
    } else {
        sound()
        let li = document.createElement("li");
        li.innerHTML = inputBox.value;
        listContainer.appendChild(li);
        let span = document.createElement("span")
        span.innerHTML = "\u00d7";   /* cross icon */
        li.appendChild(span);
    }
    inputBox.value = "";
    saveData();
}
// Event listener for Enter key press in the input field
inputBox.addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
        event.preventDefault(); // Prevent default form submission behavior
        addTask();
    }
});

listContainer.addEventListener("click", function (e) {
    if (e.target.tagName === "LI") {
        e.target.classList.toggle("checked");
        sound();
        saveData();
    }
    else if (e.target.tagName === "SPAN") {
        e.target.parentElement.remove();
        saveData();
        sound();
    }


}, false);

function saveData() {
    localStorage.setItem("data", listContainer.innerHTML);
}
function showTask() {
    listContainer.innerHTML = localStorage.getItem("data");
}
function sound() {
    var snd = new Audio('pingsound.mp3');
    snd.play();
}
showTask();

