var infoButtons = "<br><p>is this the correct place?<p><br>\
                    <button class='button welcome_info_button' id='yes'>yes</button>\
                    <button class='button welcome_info_button' id='no'>no</button>"
var welcome_markers;
var welcome_start_chosen = false;
// array to hold all of our location selection boxes
var welcome_input_boxes_array = [null],
// array to hold all of our transport buttons
    results_transport_buttons_array,
// array for the place_id's that were selected
    results_place_ids_array = [null],
    results_start;
var welcome_input_boxes_arraya;

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
    var geocoder = new google.maps.Geocoder;
    var infowindow = new google.maps.InfoWindow;
    // make the google map
    var map = new google.maps.Map(document.getElementById("google_map"), map_options);
    google.maps.event.addListener(map, 'click', function(event) {
        geocodeLatLng(geocoder, map, infowindow, event.latLng);
    });
}

function geocodeLatLng(geocoder, map, infowindow, location) {
  var latlng = {lat: location.lat(), lng: location.lng()};
  geocoder.geocode({'location': latlng}, function(results, status) {
    if (status === 'OK') {
      if (results[1]) {
        var marker = new google.maps.Marker({
          position: latlng,
          map: map
        });
        infowindow.setContent(results[1].formatted_address+infoButtons);
        infowindow.open(map, marker);
        var btns = document.getElementsByClassName('welcome_info_button');
        for ( let i = 0 ; i < btns.length ; i++){
            btns[i].addEventListener('click', function(){
                    welcome_info_button_press(btns[i], marker, infowindow, results[1].formatted_address);
            })
        }
      } else {
        window.alert('No results found');
      }
    } else {
      window.alert('Geocoder failed due to: ' + status);
    }

  });
}

function welcome_info_button_press(btn, marker, info, loc){
    if ( btn.id == 'yes'){
        welcome_input_boxes_arraya[0].value = '' + loc;
        results_start = loc;
        document.getElementById("google_map").style.zIndex = '-2';
    } else {
        info = null;
        marker = null;
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

// function to set the input boxes to integrate with places api
function welcome_load() {
    welcome_input_boxes_arraya = document.getElementsByClassName('welcome_box_input_box');
        var options = {types: ['(cities)']};

    for (let i = 0; i < welcome_input_boxes_arraya.length; i++)
        welcome_input_boxes_array[i] = new google.maps.places.Autocomplete(welcome_input_boxes_arraya[i], options);
}

// function to get the inputs from the buttons
function welcome_inputs_selected() {
    for ( let i = 0 ; i < welcome_input_boxes_array.length ; i++ ){
        results_place_ids_array[i] = welcome_input_boxes_array[i].getPlace();
    }
}

// function to dispaly the map on button press
function welcome_show_map() {
    document.getElementById("google_map").style.zIndex = '100';
}