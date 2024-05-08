/*
KEEP TO UNDERSTAND PREVIOUS CODE
function search() {
    var inputText = document.getElementById("searchInput").value;
    var outputDiv = document.getElementById("results");

    // Check if input is not empty
    if (inputText.trim() !== "") {
        outputDiv.innerHTML = "<p>Your input: " + inputText + "</p>";
      // Clear the input field
      document.getElementById("searchInput").value = "";
    } else {
        outputDiv.innerHTML = "<p>Please enter some text.</p>";
    }
}
*/

/*MAYBE DELETE
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('searchInput');
    form.addEventListener('submit', function(event) {
        event.preventDefault(); 


        const userInput = document.getElementById('searchInput').value;

        
        fetch('/send-message', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message: userInput })
        })
        .then(response => response.json())
        .then(data => {
           
            console.log(data);
            
            const resultsDiv = document.getElementById('results');
            resultsDiv.textContent = data.message;
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });
});
*/