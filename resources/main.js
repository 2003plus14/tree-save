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

// generate the array of buttons and add click events to each of them
function generate_array() {
    // populate the array with the button elements from the page
    results_transport_buttons_array = document.getElementsByClassName("results_transport_buttons");
    // iterate through the array we just made
    for (let i = 0; i < results_transport_buttons_array.length; i++) {
        // Add a listener for our transport buttons
        results_transport_buttons_array[i].addEventListener("click", function () {
            // reset the css of all the buttons
            results_button_pressed();
            // set the button that was clicked to the big style
            results_button_size(this, 'big');
            // if the button to the right of the button clicked exists then set it to the middle size
            if (i + 1 < results_transport_buttons_array.length) results_button_size(results_transport_buttons_array[i + 1], 'middle');
            // if the button to the left of the button clicked exists then set it to the middle sizes
            if (~(i - 1)) results_button_size(results_transport_buttons_array[i - 1], 'middle');
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
        results_transport_buttons_array[i].className = "results_transport_buttons button button_circle";
    }
}

// function to set the class
function results_button_size(element, type) {
    // set the classname of the element to the class plus the type (big or middle)
    element.className += ' results_transport_buttons_' + type;
}

// change the background dependant on the button press
function results_background_change(i) {
    // array to tell whether the button is good or bad (temporary)
    var results_transport_buttons_array_type = [false, true, true, false, false];
    // if the button is good at i
    if (results_transport_buttons_array_type[i]) {
        // set the background
        document.body.style.backgroundImage = "url('resources/img/backgroundGood.png')";
        // set the fallback background incase the image fails
        document.body.style.backgroundColor = "#053201";
    } else {
        // set the background
        document.body.style.backgroundImage = "url('resources/img/backgroundBad.png')";
        // set the fallback background incase the image fails
        document.body.style.backgroundColor = "#484848";
    }
}

// function to set the options then draw the map
function build_map() {
    // set the configuration of the google map
    var map_options = {
        // set the cneter latitude and longitude
        center: new google.maps.LatLng(57.149717, -2.094278),
        // set the default zoom level
        zoom: 10,
        // set the type of map
        mapTypeId: google.maps.MapTypeId.TERRAIN
    };
    // set up the geocoder that will turn coords into locations
    var geocoder = new google.maps.Geocoder,
        // set the info window object that will be attached to the marker
        welcome_info_window = new google.maps.InfoWindow,
        // make the google map
        map = new google.maps.Map(document.getElementById("google_map"), map_options);
    // add an event listener to the map to get the location
    google.maps.event.addListener(map, 'click', function (event) {
        // if there is a marker there, remove it
        if (welcome_marker) welcome_marker.setMap(null);
        // call the function the handle the location
        welcome_geocode_location(geocoder, map, welcome_info_window, event.latLng);
    });
}

// function to get work out the location and handle creating the info window
function welcome_geocode_location(geocoder, map, welcome_info_window, location) {
    // call the geocode api
    geocoder.geocode({ 'location': location }, function (results, status) {
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
            welcome_info_window.setContent(results[0].formatted_address +
                // add some text and two buttons for choosing
                "<br><p>is this the correct place?<p><br>\
                <button class='button welcome_info_button' id='yes'>yes</button>\
                <button class='button welcome_info_button' id='no'>no</button>");
            // open the info window on the marker this has to be here otherwise we cant access the buttons
            welcome_info_window.open(map, welcome_marker);
            // create an array of the two buttons on the info window we just made
            var welcome_info_buttons = document.getElementsByClassName('welcome_info_button');
            // iterate through the array
            for (let i = 0; i < welcome_info_buttons.length; i++) {
                // add an event listener to each
                welcome_info_buttons[i].addEventListener('click', function () {
                    // the if the id of the button is 'yes' then call the function to handle setting the location
                    if (welcome_info_buttons[i].id === 'yes') welcome_info_button_press(welcome_info_buttons[i], welcome_marker, welcome_info_window, results[1].formatted_address);
                    // then remove the marker
                    welcome_marker.setMap(null);
                });
            }
            // if the status return as over query limit then tell the user
        } else if (status === 'OVER_QUERY_LIMIT') welcome_info_window.setContent('<h2>slow down!</h2><h4>too many requests</h4>');
        // else if it returns as no results found then tell the user
        else if (status === 'ZERO_RESULTS') welcome_info_window.setContent('<h3>sorry no results found!</h3><h1>:(</h1>');
        // if there is something else returned panic
        else welcome_info_window.setContent('<h3>something has gone terribly wrong</h3>');
        // ensure the info window is opened
        welcome_info_window.open(map, welcome_marker);
    });
}

// function to set the contents of the input boxes and hide our map when we finished
function welcome_info_button_press(btn, welcome_marker, info, loc) {
    // if the map was opened from the start box
    if (welcome_which_map == 'start') {
        // set the value of the input box to the location returned by the reverse geocode
        welcome_input_boxes_arraya[0].value = loc;
        // set the same information into our array for accessing later
        results_location_array[0] = loc;
        // else if the map was opened from the destination box
    } else {
        // set the value of the input box to the location returned by the reverse geocode
        welcome_input_boxes_arraya[1].value = '' + loc;
        // set the same information into our array for accessing later
        results_location_array[1] = loc;
    }
    // close the map
    document.getElementById("google_map").style.zIndex = '-2';
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

// function to make the input boxes to integrate with places api
function welcome_load() {
    // fill our array of input boxes
    welcome_input_boxes_arraya = document.getElementsByClassName('welcome_box_input_box');
    // iterate through the array of input boxes
    for (let i = 0; i < welcome_input_boxes_arraya.length; i++)
        // at each add the autocomplete api with the cities constraint 
        welcome_input_boxes_array[i] = new google.maps.places.Autocomplete(welcome_input_boxes_arraya[i], { types: ['(cities)'], placeIdOnly: true });
}

// function to get the inputs from the buttons
function welcome_inputs_selected() {
    // iterate through our array of buttons we made earlier
    for (let i = 0; i < welcome_input_boxes_array.length; i++) {
        // if the contents of the array has not already been filled from the map
        if (results_location_array[i])
            // then add the location from the input box
            results_location_array[i] = welcome_input_boxes_array[i].getPlace();
    }
    hi();
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
    console.log(response);
    console.log(status);
    if (status == 'OK') {
        var origins = response.originAddresses;
        var destinations = response.destinationAddresses;

        for (var i = 0; i < origins.length; i++) {
            var results = response.rows[i].elements;
            for (var j = 0; j < results.length; j++) {
                var element = results[j];
                var distance = element.distance.text;
                var duration = element.duration.text;
                var from = origins[i];
                var to = destinations[j];
                alert(from + "\n" + to + "\n" + distance + "\n" + duration + "\n" + status);
            }
        }
    }
}

function hi() {
    var service = new google.maps.DistanceMatrixService();
    console.log(welcome_input_boxes_array[0].getPlace().place_id);
    service.getDistanceMatrix(
        {
            origins: [{'placeId': welcome_input_boxes_array[0].getPlace().place_id}],
            destinations: [{'placeId': welcome_input_boxes_array[1].getPlace().place_id}],
            travelMode: 'DRIVING'
        }, callback);
}