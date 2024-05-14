var map;
var infowindow;
var selectedPlaces = [];

//This function initializes maps, and starts with Stockholm as default. 
function initializeMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 59.3293, lng: 18.0686 },
        zoom: 10
    });

    infowindow = new google.maps.InfoWindow();
}


function toggleContainer() {
    var container = document.querySelector('.container');
    if (container) {
        container.remove(); // Remove the container from the DOM
    } else {
        // Container has already been removed, ignore
    }
}

//Search function that makes the searches in Stockholm specifically and shows a sidepanel with suggestions. 
function search() {
    toggleContainer();
    var inputText = document.getElementById("searchInput").value;
    var outputList = document.getElementById("resultsList");
    var sidePanel = document.querySelector(".sidePanel");
    var selectedPanel = document.querySelector(".selectedPanel");
    var mapDiv = document.getElementById("mapDiv");

    var request = {
        query: inputText + ' in Stockholm',
        fields: ['name', 'geometry', 'photos', 'rating']
    };

    var service = new google.maps.places.PlacesService(map);
    service.textSearch(request, function (results, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            outputList.innerHTML = "";
            for (var i = 0; i < results.length; i++) { //marker creation for the specific attraction.
                createMarker(results[i]);
                addResultToList(results[i]);
            }
            sidePanel.classList.add("show");
            selectedPanel.classList.add("show");
            mapDiv.style.display = "block";
            document.getElementById("searchInput").value = "";

        } else {
            alert('No attractions found.');
        }
    });
}


//function for creating markers. 
function createMarker(place) {
    var marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location
    });

    google.maps.event.addListener(marker, 'click', function () {
        infowindow.setContent(place.name);
        infowindow.open(map, this);
    });
}

function isSelected(place) {
    return selectedPlaces.some(function (selectedPlace) {
        return selectedPlace.name === place.name;
    });
}

//Adds to a sidepanel, where rating and photo is included. 
function addResultToList(place) {
    var outputList = document.getElementById("resultsList");
    var listItem = document.createElement("li");

    var placeInfo = document.createElement("div");
    placeInfo.style.textAlign = "center"; // Center align the content

    var placeName = document.createElement("span");
    placeName.textContent = place.name;
    placeInfo.appendChild(placeName);

    if (place.photos && place.photos.length > 0) {
        var placePhoto = document.createElement("img");
        placePhoto.src = place.photos[0].getUrl({ maxWidth: 175, maxHeight: 175 }); // Increase the size of the image
        placePhoto.style.display = "block"; // Make the image a block element for centering
        placePhoto.style.margin = "20px auto 10px"; // Change margin to add space between title and picture
        placeInfo.appendChild(placePhoto);
    }

    if (place.rating) {
        var placeRating = document.createElement("span");
        placeRating.textContent = "Rating: " + place.rating;
        placeInfo.appendChild(placeRating);
    }

    listItem.appendChild(placeInfo);

    listItem.onclick = function () {
        map.setCenter(place.geometry.location);
        map.setZoom(15);
        infowindow.setContent(place.name);
        infowindow.open(map, this);
    };

    // Add the "Add" button centered below the picture
    if (!isSelected(place)) { // Check if the place is not already selected
        var addButton = document.createElement("button");
        addButton.textContent = "Add";
        addButton.style.display = "block"; // Make the button a block element for centering
        addButton.style.margin = "10px auto"; // Center the button
        addButton.onclick = function () {
            removeButton(this); // Pass the button element to the removeButton function
            addSelectedPlace(place);
        };
        listItem.appendChild(addButton);
    }

    outputList.appendChild(listItem);
}



function removeButton(button) {
    button.remove(); // Remove the button from the DOM
}

function addSelectedPlace(place) {
    selectedPlaces.push(place);
    renderSelectedList();
}

function renderSelectedList() {
    var selectedList = document.getElementById("selectedList");
    selectedList.innerHTML = "";
    selectedPlaces.forEach(function (place) {
        var listItem = document.createElement("li");
        listItem.classList.add("selectedListItem");

        var placeName = document.createElement("span");
        placeName.textContent = place.name;

        listItem.appendChild(placeName);
        selectedList.appendChild(listItem);
    });
}

//creates a route with the travelmode walking. 
function Createroute() {
    console.log("Button clicked!");
    if (selectedPlaces.length < 2) {
        alert('Select a minimum of two places!');
        return;
    }

    var waypoints = [];
    selectedPlaces.forEach(function (place) {
        waypoints.push({
            location: place.geometry.location,
            stopover: true
        });
    });

    var request = {
        origin: waypoints.shift().location,
        destination: waypoints.pop().location,
        waypoints: waypoints,
        optimizeWaypoints: true,
        travelMode: 'WALKING'
    };

    var directionsService = new google.maps.DirectionsService();
    var directionsRenderer = new google.maps.DirectionsRenderer({
        map: map,
        preserveViewport: true
    });

    directionsService.route(request, function (response, status) {
        if (status === 'OK') {
            directionsRenderer.setDirections(response);
        } else {
            alert('Route Failed ' + status);
        }
    });
}
