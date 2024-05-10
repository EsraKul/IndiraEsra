
//VARIABLES
var map;
var infowindow;

//This function initializes maps, and starts with Stockholm as default. 
function initializeMap(){
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 59.3293, lng: 18.0686}, 
        zoom: 12
    });

    infowindow = new google.maps.InfoWindow();
}

//Search function that makes the searches in Stockholm specifically. 
function search() {
    var inputText = document.getElementById("searchInput").value; 
    var outputDiv = document.getElementById("results");
    var request = {
        query: inputText + ' in Stockholm',
        fields: ['name', 'geometry']
    };

    var service = new google.maps.places.PlacesService(map);
    service.textSearch(request, function(results, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            for (var i = 0; i < results.length; i++) { //marker creation for the specific attraction. 
                createMarker(results[i]); 
            }
            outputDiv.innerHTML = "<p>Your input: " + inputText + "</p>";
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
