const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");

function addTask() {
    if (inputBox.value === '') {
        alert("You must write something!");
    } else {function searchPlaces() {
        const input = document.getElementById("searchInput").value;
        const placesList = document.getElementById("placesList");
    
        // Clear previous search results
        placesList.innerHTML = "";
    
        // Fetch data from the API
        fetch(`https://api.example.com/places?q=${input}`)
            .then(response => response.json())
            .then(data => {
                // Display the list of places
                const ul = document.createElement("ul");
                data.forEach(place => {
                    const li = document.createElement("li");
                    li.textContent = place.name;
                    ul.appendChild(li);
                });
                placesList.appendChild(ul);
            })
            .catch(error => {
                console.error("Error fetching data:", error);
            });
    }
    
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

function hideCategory(button) {
    button.style.display = "none"; // Hide the clicked button
    const category = button.textContent; // Get the category label

    // You can use the category information to fetch data from the API
    fetch(`https://api.example.com/places?category=${category}`)
        .then(response => response.json())
        .then(data => {
            // Handle the fetched data as needed
            console.log(data);
        })
        .catch(error => {
            console.error("Error fetching data:", error);
        });
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

