// array to hold all of our transport buttons
var results_transport_buttons_array;
// array to tell whether the button is good or bad (temporary)
var results_transport_buttons_array_type = [false, true, true, false, false];

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
}

// function to clear the selected buttons
function results_button_pressed() {
    // iterate through the array of buttons 
    for (let i = 0; i < results_transport_buttons_array.length; i++) {
        // set the button at the current iteration to the standard css
        results_transport_buttons_array[i].className = "results_transport_buttons button button_circle";
    }
}

// function to change swap classes around
function results_button_size(element, type) {
    // set the classname of the element to the class plus the type (big or middle)
    element.className += ' results_transport_buttons_' + type;
}

// change the background dependant on the button press
function results_background_change(i) {
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
    // make the google map
    var map = new google.maps.Map(document.getElementById("google-map"), map_options);
}

// side bar
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