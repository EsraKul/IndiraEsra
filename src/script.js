var map;
var infowindow;

//This function initializes maps, and starts with Stockholm as default. 
function initializeMap(){
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 59.3293, lng: 18.0686}, 
        zoom: 10
    });

    infowindow = new google.maps.InfoWindow();
}

function toggleContainer() {
    var container = document.querySelector('.container');
    if (container.style.display === 'none') {
        container.style.display = 'block'; // Show the container
    } else {
        container.style.display = 'none'; // Hide the container
    }
}
//Search function that makes the searches in Stockholm specifically and shows a sidepanel with suggestions. 
function search() {
    var inputText = document.getElementById("searchInput").value;
    var outputList = document.getElementById("resultsList");
    var sidePanel = document.querySelector(".sidePanel");
    var mapDiv = document.getElementById("mapDiv");

    var request = {
        query: inputText + ' in Stockholm',
        fields: ['name', 'geometry', 'photos', 'rating'] 
    };

    var service = new google.maps.places.PlacesService(map);
    service.textSearch(request, function(results, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            outputList.innerHTML = ""; 
            for (var i = 0; i < results.length; i++) { //marker creation for the specific attraction.
                createMarker(results[i]);
                addResultToList(results[i]);
            }
            sidePanel.classList.add("show");
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

    google.maps.event.addListener(marker, 'click', function() {
        infowindow.setContent(place.name);
        infowindow.open(map, this);
    });
}


//Adds to a sidepanel, where rating and photo is incldued. 
function addResultToList(place) {
    var outputList = document.getElementById("resultsList");
    var listItem = document.createElement("li");

    var placeInfo = document.createElement("div");
    var placeName = document.createElement("span");
    placeName.textContent = place.name;
    placeInfo.appendChild(placeName);

    if (place.photos && place.photos.length > 0) {
        var placePhoto = document.createElement("img");
        placePhoto.src = place.photos[0].getUrl({ maxWidth: 50, maxHeight: 50 });
        placeInfo.appendChild(placePhoto);
    }

    if (place.rating) {
        var placeRating = document.createElement("span");
        placeRating.textContent = "Rating: " + place.rating;
        placeInfo.appendChild(placeRating);
    }

    listItem.appendChild(placeInfo);

    listItem.onclick = function() {
        map.setCenter(place.geometry.location);
        map.setZoom(15);
        infowindow.setContent(place.name);
        infowindow.open(map, this);
    };
    outputList.appendChild(listItem);
}
