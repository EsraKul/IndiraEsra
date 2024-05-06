
function searchPlaces(event) {
    // Prevent the default form submission behavior
    event.preventDefault();

    // Get the input value
    var inputValue = document.getElementById("searchInput").value;
    
    // Display the input value within the results div
    document.getElementById("results").innerText = inputValue;
}
