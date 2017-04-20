// array to hold our two input boxes
var welcome_input_boxes_arraya,
  // global tracker for determining which box to add the selected location to
  welcome_which_map,
  // global tracker for the marker
  welcome_marker = null,
  // array to hold all of our location selection boxes
  welcome_input_boxes_array = [],
  // array to hold all of our transport buttons
  results_transport_buttons_array,
  // array for the locations that were selected
  results_location_array = [];

// function to set the options then draw the map
function welcome_build_map() {
  // set the configuration of the google map
  var map_options = {
    // set the cneter latitude and longitude
    center: new google.maps.LatLng(57.149717, -2.094278),
    // set the default zoom level
    zoom: 10
  };
  // set up the geocoder that will turn coords into locations
  var geocoder = new google.maps.Geocoder,
    // set the info window object that will be attached to the marker
    welcome_info_window = new google.maps.InfoWindow,
    // instantiate a directions service
    directionsService = new google.maps.DirectionsService,
    // set the renderer for the directions
    directionsDisplay = new google.maps.DirectionsRenderer({
      map: map
    }),
    // make the google map
    map = new google.maps.Map(
      document.getElementById("google_map"), map_options);
  // add an event listener to the map to get the location
  google.maps.event.addListener(map, 'click', function(event) {
    // if there is a marker there, remove it
    if (welcome_marker) welcome_marker.setMap(null);
    // call the function the handle the location
    welcome_geocode_location(geocoder, map, welcome_info_window, event.latLng);
  });
}

// function to get work out the location and handle creating the info window
function welcome_geocode_location(
  geocoder, map, welcome_info_window, location) {
  // call the geocode api
  geocoder.geocode({
    'location': location
  }, function(results, status) {
    // make our marker
    welcome_marker = new google.maps.Marker({
      // set the position to the location clicked
      position: location,
      // set the map to our map
      map: map
    });
    // if the geocoding returns successfully
    if (status === 'OK') {
      // set the contents of our info window to the address
      welcome_info_window.setContent(
        // add some text and two buttons for choosing
        "<h5>" + location + "</h5><b2><h2>" +
        results[0].formatted_address +
        "</h2><p>is this the correct place?<p><br>\
                <button class='button welcome_info_button'\
                id='yes'>yes</button>\
                <button class='button welcome_info_button'\
                id='no'>no</button>");
      // open info window on marker
      //(this has to be here otherwise we cant access the buttons)
      welcome_info_window.open(map, welcome_marker);
      // create an array of the two buttons on the info window we just made
      var welcome_info_buttons = document.getElementsByClassName(
        'welcome_info_button');
      // iterate through the array
      for (let i = 0; i < welcome_info_buttons.length; i++) {
        // add an event listener to each
        welcome_info_buttons[i].addEventListener('click', function() {
          // if id of button is 'yes' call function to set the location
          if (welcome_info_buttons[i].id === 'yes')
            welcome_info_button_press(
              welcome_info_buttons[i],
              welcome_marker,
              welcome_info_window,
              results[1].formatted_address
            );
          // then remove the marker
          welcome_marker.setMap(null);
        });
      }
      // if the status return as over query limit then tell the user
    } else if (status === 'OVER_QUERY_LIMIT')
      welcome_info_window.setContent(
        '<h2>slow down!</h2><h4>too many requests</h4>');
    // else if it returns as no results found then tell the user
    else if (status === 'ZERO_RESULTS')
      welcome_info_window.setContent(
        '<h3>sorry no results found!</h3><h1>:(</h1>');
    // if there is something else returned panic
    else welcome_info_window.setContent(
      '<h3>something has gone terribly wrong</h3>');
    // ensure the info window is opened
    welcome_info_window.open(map, welcome_marker);
  });
}

// function to set the contents of input boxes and hide map when we finished
function welcome_info_button_press(btn, welcome_marker, info, loc) {
  // if the map was opened from the start box
  if (welcome_which_map == 'start') {
    // set the value of the input box to the location reverse geocode
    welcome_input_boxes_arraya[0].value = loc;
    // else if the map was opened from the destination box
  } else {
    // set the value of the input box to the location reverse geocode
    welcome_input_boxes_arraya[1].value = loc;
  }
  // 'close' the map
  document.getElementById("google_map").style.zIndex = '-2';
}

// function to make the input boxes to integrate with places api
function welcome_load() {
  // fill our array of input boxes
  welcome_input_boxes_arraya =
    document.getElementsByClassName('welcome_box_input_box');
  // iterate through the array of input boxes
  for (let i = 0; i < welcome_input_boxes_arraya.length; i++)
    // at each add the autocomplete api with the cities constraint
    welcome_input_boxes_array[i] = new google.maps.places.Autocomplete(
      welcome_input_boxes_arraya[i], {
        types: ['(cities)'],
        placeIdOnly: true
      });
  welcome_build_map();
}

// function to get the inputs from the buttons
function welcome_inputs_selected() {
  new google.maps.DistanceMatrixService().getDistanceMatrix({
    origins: [{
      'placeId': welcome_input_boxes_array[0].getPlace().place_id
    }],
    destinations: [{
      'placeId': welcome_input_boxes_array[1].getPlace().place_id
    }],
    travelMode: 'DRIVING'
  }, callback);
}

// function to dispaly the map on button press
function welcome_show_map(who) {
  // set our global variable to the button presseer
  welcome_which_map = who;
  // show our map (this is a temporary way of doing this i promise)
  document.getElementById("google_map").style.zIndex = '100';
}

// function to handle callback from distance api
function callback(response, status) {
  if (status == 'OK') {
    var results = response.rows[0].elements;
    for (var j = 0; j < results.length; j++) {
      if (results[j].status == 'ZERO_RESULTS')
        alert('Sorry we can only handle land routes at this time');
      else {
        document.getElementById('distance').innerHTML = results[j].distance.text;
        document.getElementById('duration').innerHTML = results[j].duration.text;
        document.getElementById('from').innerHTML = response.originAddresses[0];
        document.getElementById('to').innerHTML = response.destinationAddresses[j];
        document.getElementById("welcome_results_pane").style.zIndex = '100';
      }
    }
  }
}

// *** functions pertaining to the results page

// generate the array of buttons and add click events to each of them
function results_generate_array() {
  // populate the array with the button elements from the page
  results_transport_buttons_array = document.getElementsByClassName(
    "results_transport_buttons");
  // iterate through the array we just filled
  for (let i = 0; i < results_transport_buttons_array.length; i++) {
    // Add a listener for our transport buttons
    results_transport_buttons_array[i].addEventListener("click", function() {
      // reset the css of all the buttons
      results_button_pressed();
      // set the button that was clicked to the big style
      results_button_size(this, 'big');
      // if the button right of button clicked exists then set to middle size
      if (i + 1 < results_transport_buttons_array.length)
        results_button_size(results_transport_buttons_array[i + 1], 'middle');
      // if the button left of button clicked exists then set to middle size
      if (~(i - 1))
        results_button_size(results_transport_buttons_array[i - 1], 'middle');
      // change the background
      results_background_change(i);
    });
  }
  // select the centre button (temp)
  results_transport_buttons_array[2].click();
}

// function to clear the selected buttons
function results_button_pressed() {
  // iterate through the array of buttons
  for (let i = 0; i < results_transport_buttons_array.length; i++) {
    // set the button at the current iteration to the standard css
    results_transport_buttons_array[i].className =
      "results_transport_buttons button button_circle";
  }
}

// function to set the class
function results_button_size(element, type) {
  // set the classname of the element to the class plus the type (big / middle)
  element.className += ' results_transport_buttons_' + type;
}

// change the background dependant on the button press
function results_background_change(i) {
  // array to tell whether the button is good or bad (temporary)
  var results_transport_buttons_array_type = [false, true, true, false, false];
  // if the button is good at i
  if (results_transport_buttons_array_type[i]) {
    // set the background
    document.body.style.backgroundImage =
      "url('resources/img/backgroundGood.png')";
    // set the fallback background incase the image fails
    document.body.style.backgroundColor = "#053201";
  } else {
    // set the background
    document.body.style.backgroundImage =
      "url('resources/img/backgroundBad.png')";
    // set the fallback background incase the image fails
    document.body.style.backgroundColor = "#484848";
  }
}

// function to 'open' the sidebar
function openNav() {
  // set the sidebars width to 250px, making it appear
  document.getElementById("results_bar").style.width = "250px";
}

//function to 'close' the sidebar
function closeNav() {
  // set the sidebars width to 0, make it slide away
  document.getElementById("results_bar").style.width = "0";
}
