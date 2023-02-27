// Create a map variable
var map;

// Create a search box variable
var searchBox;

// Function to initialize the map
function initMap() {
  // Get the HTML element that will hold the map
  const mapElement = document.getElementById("map");

  // Create a new map object centered on the user's location
  map = new google.maps.Map(mapElement, {
    center: { lat: -34.397, lng: 150.644 },
    zoom: 15,
  });

  // Create a search box object and link it to the search box HTML element
  searchBox = new google.maps.places.SearchBox(
    document.getElementById("search-box")
  );

  // Listen for changes in the search box and update the map accordingly
  searchBox.addListener("places_changed", () => {
    const places = searchBox.getPlaces();

    // If no places were found, return early
    if (places.length == 0) {
      return;
    }

    // Get the user's location from the first place in the search results
    const userLocation = {
      lat: places[0].geometry.location.lat(),
      lng: places[0].geometry.location.lng(),
    };

    // Create a new marker for the user's location and add it to the map
    const userMarker = new google.maps.Marker({
      position: userLocation,
      map: map,
      title: "Your Location",
    });

    // Find the nearest hospitals to the user's location using the Places API
    const service = new google.maps.places.PlacesService(map);
    service.nearbySearch(
      {
        location: userLocation,
        radius: 5000, // Search within a 5 km radius
        type: ["hospital"], // Only search for hospitals
      },
      (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          // Create a new marker for each hospital and add it to the map
          results.forEach((result) => {
            const hospitalMarker = new google.maps.Marker({
              position: result.geometry.location,
              map: map,
              title: result.name,
            });
          });
        }
      }
    );

    // Center the map on the user's location
    map.setCenter(userLocation);
  });
}
