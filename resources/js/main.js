// variable to keep track of the last button turned on
var button_pressed_id = "headerBtnWalk";

// function to set the options then draw the map
function build_map(){
    // set the configuration of the google map
    var map_options = {
        // set the cneter latitude and longitude
        center: new google.maps.LatLng(57.149717,-2.094278),
        // set the default zoom level
        zoom: 10,
        // set the type of map
        mapTypeId: google.maps.MapTypeId.TERRAIN};
    // make the google map
    var map = new google.maps.Map(document.getElementById("google-map"), map_options);
}

// function to process the styling of the header buttons
function button_press_event(button_pressed){
    // set our currently selected buttons style to 'off'
    button_pressed_id.className = 'headerBtn' + 'Off';
    // set the currently selected buttton tracker to the one we just pressed
    button_pressed_id = document.getElementById(button_pressed);
    // change the css of the button we just pressed to 'on'
    button_pressed_id.className = 'headerBtn' + 'On';
}
