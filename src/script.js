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